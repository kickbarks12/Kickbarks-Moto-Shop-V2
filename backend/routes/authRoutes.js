const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashed
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "User already exists" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ message: "Invalid email" });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});



router.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    res.sendStatus(200);
  } catch {
    res.sendStatus(401);
  }
});


module.exports = router;
