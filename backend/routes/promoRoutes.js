const express = require("express");
const Promo = require("../models/Promo");

const router = express.Router();

// ================= VALIDATE PROMO CODE =================
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Promo code is required" });
    }

    const promo = await Promo.findOne({
      code: code.toUpperCase(),
      active: true,
      expiresAt: { $gte: new Date() },
    });

    if (!promo) {
      return res.status(400).json({ message: "Invalid or expired promo code" });
    }

    res.json({
      code: promo.code,
      discountPercent: promo.discountPercent || 0,
      freeShipping: promo.freeShipping || false,
    });
  } catch (err) {
    console.error("Promo validation error:", err);
    res.status(500).json({ message: "Failed to validate promo code" });
  }
});

// ================= CREATE PROMO (ADMIN) =================
router.post("/create", async (req, res) => {
  try {
    const promo = await Promo.create(req.body);
    res.json(promo);
  } catch (err) {
    console.error("Promo creation error:", err);
    res.status(500).json({ message: "Failed to create promo code" });
  }
});

module.exports = router;
