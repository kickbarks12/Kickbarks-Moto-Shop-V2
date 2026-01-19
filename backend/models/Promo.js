const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    maxUses: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ================= METHODS =================
promoSchema.methods.isValid = function (orderTotal = 0) {
  if (!this.active) return false;
  if (this.expiresAt < new Date()) return false;
  if (this.maxUses > 0 && this.usedCount >= this.maxUses) return false;
  if (orderTotal < this.minOrderAmount) return false;
  return true;
};

module.exports = mongoose.model("Promo", promoSchema);
