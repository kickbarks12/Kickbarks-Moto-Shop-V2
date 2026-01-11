const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const mailer = require("../config/email");
const generateInvoice = require("../utils/invoiceGenerator");


// Generate order reference
function generateReference() {
  return "KB-" + Date.now().toString().slice(-6);
}

// CREATE ORDER (Checkout)
router.post("/", async (req, res) => {
  try {
    const { customer, items, subtotal, discount, shipping, total } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return res.status(400).json({ message: "Customer info is required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      reference: generateReference(),
      customer,
      items,
      subtotal,
      discount,
      shipping,
      total
    });

const invoicePath = generateInvoice(order);



    
  mailer.sendMail(
  {
    to: customer.email,
    subject: "Kickbarks Invoice & Order Confirmation",
    html: `
      <h2>Thank you for your order</h2>
      <p><strong>Reference:</strong> ${order.reference}</p>
      <p><strong>Total:</strong> ₱${order.total}</p>
      <p>Your invoice is attached.</p>
    `,
    attachments: [
      {
        filename: `invoice-${order.reference}.pdf`,
        path: invoicePath
      }
    ]
  },
  (err) => {
    if (err) console.error("Email failed:", err.message);
  }
);



    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// GET all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});



// GET all orders (Admin)
router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const filePath = generateInvoice(order);
    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});




// UPDATE order status (Admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
});



// DELETE order (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
});

module.exports = router;
