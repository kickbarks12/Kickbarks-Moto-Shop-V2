const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, birthday, email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ message: "Email, phone and password are required" });
    }

    const exists = await Customer.findOne({
      $or: [{ email }, { phone }]
    });

    if (exists) {
      return res.status(400).json({ message: "Email or phone already used" });
    }

    await Customer.create({
  name: name.trim(),
  birthday,
  email,
  phone,
  password,
  vouchers: ["WELCOME10"]
});


    res.json({ message: "Account created" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const customer = await Customer.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      password
    }).lean();

    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= SAVE CART ================= */
router.post("/cart", async (req, res) => {
  const { customerId, cart } = req.body;
  await Customer.findByIdAndUpdate(customerId, { cart });
  res.json({ ok: true });
});


// Update profile
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, birthday, phone } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, birthday, phone },
      { new: true }
    );

    res.json(customer);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});


module.exports = router;
