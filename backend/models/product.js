const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    stock: { type: Number, required: true }
  },
  { timestamps: true }
);

// 👇 THIS IS THE FINAL FIX
module.exports = mongoose.model("Product", productSchema, "products");
