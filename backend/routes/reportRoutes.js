const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const adminAuth = require("../middleware/adminAuth");

// ================= SUMMARY =================
router.get("/summary", adminAuth, async (req, res) => {
  const orders = await Order.find();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const today = new Date().toISOString().split("T")[0];
  const todayRevenue = orders
    .filter(o => o.createdAt.toISOString().startsWith(today))
    .reduce((sum, o) => sum + o.total, 0);

  res.json({ totalOrders, totalRevenue, todayRevenue });
});

// ================= STATUS BREAKDOWN =================
router.get("/status", adminAuth, async (req, res) => {
  const orders = await Order.find();

  const statusCount = {};
  orders.forEach(o => {
    statusCount[o.status] = (statusCount[o.status] || 0) + 1;
  });

  res.json(statusCount);
});

// ================= TOP PRODUCTS =================
router.get("/top-products", adminAuth, async (req, res) => {
  const orders = await Order.find();

  const productSales = {};

  orders.forEach(o => {
    o.items.forEach(i => {
      productSales[i.name] =
        (productSales[i.name] || 0) + i.quantity;
    });
  });

  const top = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  res.json(top);
});

module.exports = router;
