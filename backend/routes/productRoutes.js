const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// ================= GET ALL PRODUCTS =================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ================= CREATE PRODUCT (ADMIN) =================
const adminAuth = require("../middleware/adminAuth");

router.post("/", adminAuth, async (req, res) => {

  try {
    const {
      name,
      price,
      category,
      description,
      image,
      stock,
      brand,
    } = req.body;

    if (!name || price == null || !category) {
      return res
        .status(400)
        .json({ message: "Name, price, and category are required" });
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
      image,
      stock: stock ?? 0,
      brand,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(400).json({ message: err.message });
  }
});

// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// ================= UPDATE PRODUCT =================
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update product error:", err);
    res.status(400).json({ message: "Failed to update product" });
  }
});

module.exports = router;
