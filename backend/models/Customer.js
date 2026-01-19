const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: {
      type: String,
      trim: true,
      default: "",
    },

    birthday: {
      type: Date,
    },

    // 📧 Contact Info
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // 🔐 Auth
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password by default
    },

    // 🛒 Cart Snapshot
    cart: [
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

    // 🎟 Voucher Codes
    vouchers: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],

    // 🏠 Address
    address: {
      type: String,
      trim: true,
    },

    // 📌 Status
    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// // ================= INDEXES =================
// customerSchema.index({ email: 1 });
// customerSchema.index({ phone: 1 });

// ================= METHODS =================
customerSchema.methods.clearCart = function () {
  this.cart = [];
  return this.save();
};

module.exports = mongoose.model("Customer", customerSchema);
