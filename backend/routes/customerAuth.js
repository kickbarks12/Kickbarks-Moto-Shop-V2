const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const customerAuth = require("../middleware/customerAuth");

const router = express.Router();

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, birthday, email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return res.status(400).json({ message: "Email or phone already used" });
    }

    await Customer.create({
      name,
      birthday,
      email,
      phone,
      password, // bcrypt auto-hashes
      vouchers: ["WELCOME10"],
    });

    res.status(201).json({ message: "Account created" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const customer = await Customer.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select("+password");

    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: customer._id },
      process.env.CUSTOMER_JWT_SECRET,
      { expiresIn: "7d" }
    );

    customer.password = undefined;

    res.json({
      token,
      customer,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= SAVE CART (PROTECTED) ================= */
router.post("/cart", customerAuth, async (req, res) => {
  const { cart } = req.body;

  await Customer.findByIdAndUpdate(req.customerId, { cart });

  res.json({ ok: true });
});

/* ================= UPDATE PROFILE (PROTECTED) ================= */
router.put("/profile/:id", customerAuth, async (req, res) => {
  if (req.customerId !== req.params.id) {
    return res.sendStatus(403);
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.customerId,
    req.body,
    { new: true }
  );

  res.json(updatedCustomer);
});

module.exports = router;
