const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const router = express.Router();

console.log("✅ customerAuth routes loaded");

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: customer._id },
      process.env.CUSTOMER_JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

module.exports = router;
