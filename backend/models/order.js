const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🆔 Order Reference Number
    reference: {
      type: String,
      unique: true
    },

    // 👤 Customer
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String
    },

    // 🛒 Items
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],

    // 💰 Amounts
    subtotal: Number,
    discount: Number,
    shipping: Number,
    total: {
      type: Number,
      required: true
    },

    // 🚚 Delivery status
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Delivered"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
