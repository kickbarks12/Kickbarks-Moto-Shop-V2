const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

// ================= GET USER VOUCHERS =================
// Get all unused vouchers for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const vouchers = await Voucher.find({
      userId,
      isUsed: false,
    }).sort({ createdAt: -1 });

    res.json(vouchers);
  } catch (err) {
    console.error("Fetch vouchers error:", err);
    res.status(500).json({ message: "Failed to load vouchers" });
  }
});

// ================= APPLY VOUCHER =================
router.post("/apply", async (req, res) => {
  try {
    const { voucherId } = req.body;

    if (!voucherId) {
      return res.status(400).json({ message: "Voucher ID is required" });
    }

    const voucher = await Voucher.findById(voucherId);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    if (voucher.isUsed) {
      return res.status(400).json({ message: "Voucher already used" });
    }

    voucher.isUsed = true;
    voucher.usedAt = new Date();

    await voucher.save();

    res.json(voucher);
  } catch (err) {
    console.error("Apply voucher error:", err);
    res.status(500).json({ message: "Failed to apply voucher" });
  }
});

module.exports = router;
