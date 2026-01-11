const ExcelJS = require("exceljs");

const express = require("express");
const Order = require("../models/order.js");


const router = express.Router();

// 📊 SUMMARY
router.get("/summary", async (req, res) => {
  const orders = await Order.find();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  res.json({ totalOrders, totalRevenue });
});

// 📅 DAILY SALES
router.get("/daily", async (req, res) => {
  const orders = await Order.find();

  const daily = {};

  orders.forEach(o => {
    const date = o.createdAt.toISOString().split("T")[0];
    daily[date] = (daily[date] || 0) + o.total;
  });

  res.json(daily);
});

// 🏆 TOP PRODUCTS
router.get("/top-products", async (req, res) => {
  const orders = await Order.find();

  const productSales = {};

  orders.forEach(o => {
    o.items.forEach(i => {
      productSales[i.name] = (productSales[i.name] || 0) + i.quantity;
    });
  });

  const sorted = Object.entries(productSales)
    .sort((a,b) => b[1] - a[1])
    .slice(0,5);

  res.json(sorted);
});

// 📤 EXPORT TO EXCEL
router.get("/export", async (req, res) => {
  const orders = await Order.find();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sales");

  sheet.columns = [
    { header: "Order Date", key: "date", width: 20 },
    { header: "Product", key: "product", width: 30 },
    { header: "Quantity", key: "qty", width: 10 },
    { header: "Price", key: "price", width: 15 },
    { header: "Total", key: "total", width: 15 }
  ];

  orders.forEach(order => {
    order.items.forEach(item => {
      sheet.addRow({
        date: order.createdAt.toISOString().split("T")[0],
        product: item.name,
        qty: item.quantity,
        price: item.price,
        total: order.total
      });
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sales-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});


module.exports = router;

