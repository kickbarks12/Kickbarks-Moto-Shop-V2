const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🆔 Order Reference
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 👤 Customer ID
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    // 👤 Customer snapshot (for invoices & history)
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },

    // 🛒 Items
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String },
      },
    ],

    // 💰 Amounts
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🎟 Voucher snapshot
    voucher: {
      code: String,
      type: String,
      value: Number,
    },

    // ⚡ Flash Sale
    flashSale: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 🚚 Delivery status
    status: {
      type: String,
      enum: [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded"
],

      default: "Pending",
      index: true,
    },

    // 📦 Tracking info
    trackingNumber: {
      type: String,
    },

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ================= INDEXES =================
orderSchema.index({ createdAt: -1 });

// ================= MIDDLEWARE =================
orderSchema.pre("save", function (next) {
  if (this.status === "Shipped" && !this.shippedAt) {
    this.shippedAt = new Date();
  }

  if (this.status === "Delivered" && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);
