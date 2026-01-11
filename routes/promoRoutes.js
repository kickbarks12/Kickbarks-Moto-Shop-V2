const express = require("express");
const Promo = require("../models/Promo");

const router = express.Router();

// Validate promo code
router.post("/validate", async (req, res) => {
  const promo = await Promo.findOne({
    code: req.body.code,
    active: true,
    expiresAt: { $gte: new Date() }
  });

  if (!promo) return res.status(400).json({ message: "Invalid promo code" });

  res.json({ discountPercent: promo.discountPercent });
});

// Create promo code (admin)
router.post("/create", async (req, res) => {
  const promo = await Promo.create(req.body);
  res.json(promo);
});

module.exports = router;
