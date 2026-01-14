const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
name: { type: String },
birthday: { type: String },


  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },

  password: { type: String, required: true },

  cart: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  vouchers: [String],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Customer", customerSchema);
