const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");
const mailer = require("../config/email");
const generateInvoice = require("../utils/invoiceGenerator");

const customerAuth = require("../middleware/customerAuth");
const adminAuth = require("../middleware/adminAuth"); // ✅ FIXED

// ================= HELPERS =================
function generateReference() {
  return `KB-${Date.now().toString().slice(-6)}`;
}

// ================= CREATE ORDER (CUSTOMER) =================
router.post("/", customerAuth, async (req, res) => {
  try {
    const customerId = req.customerId;
    const { customer, items, discount = 0 } = req.body;

    if (!customer || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const SHIPPING_FEE = 150;
    let subtotal = 0;
    const finalItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();

      subtotal += product.price * item.quantity;

      finalItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    const total = subtotal + SHIPPING_FEE - discount;

    const order = await Order.create({
      reference: generateReference(),
      customerId,
      customer,
      items: finalItems,
      subtotal,
      discount,
      shipping: SHIPPING_FEE,
      total,
      status: "Pending",
    });

    const invoicePath = generateInvoice(order);

    await mailer.sendMail({
      to: customer.email,
      subject: "Kickbarks Order Confirmation",
      html: `
        <h3>Thank you for your order!</h3>
        <p>Order Reference: <strong>${order.reference}</strong></p>
        <p>Total Amount: <strong>₱${order.total.toFixed(2)}</strong></p>
      `,
      attachments: [
        {
          filename: `invoice-${order.reference}.pdf`,
          path: invoicePath,
        },
      ],
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Checkout failed" });
  }
});

// ================= CUSTOMER: MY ORDERS =================
router.get("/my", customerAuth, async (req, res) => {
  const orders = await Order.find({ customerId: req.customerId })
    .sort({ createdAt: -1 });

  res.json(orders);
});

// ================= ADMIN: ALL ORDERS =================
router.get("/", adminAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// ================= CUSTOMER: CANCEL ORDER =================
router.put("/:id/cancel", customerAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.sendStatus(404);
  if (order.customerId.toString() !== req.customerId) {
    return res.sendStatus(403);
  }

  if (!["Pending", "Confirmed"].includes(order.status)) {
    return res
      .status(400)
      .json({ message: "Order can no longer be cancelled" });
  }

  order.status = "Cancelled";
  await order.save();

  // 🔄 RESTOCK PRODUCTS
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
    });
  }

  res.json({ message: "Order cancelled" });
});

// ================= ADMIN: REFUND ORDER =================
router.put("/:id/refund", adminAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.sendStatus(404);

  if (order.status === "Delivered") {
    return res
      .status(400)
      .json({ message: "Delivered orders cannot be refunded automatically" });
  }

  order.status = "Refunded";
  await order.save();

  res.json({ message: "Order refunded" });
});

module.exports = router;
