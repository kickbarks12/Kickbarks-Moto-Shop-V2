const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discountPercent: { type: Number },
  active: { type: Boolean, default: true },
  expiresAt: Date
});

module.exports = mongoose.model("Promo", promoSchema);
