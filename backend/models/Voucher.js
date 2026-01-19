const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    discountType: {
      type: String,
      enum: ["fixed", "percent"],
      required: true,
    },

    value: {
      type: Number,
      required: true,
      min: 0,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },

    usedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ================= PRE-SAVE =================
voucherSchema.pre("save", function (next) {
  if (this.isUsed && !this.usedAt) {
    this.usedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Voucher", voucherSchema);
