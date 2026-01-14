require("dotenv").config();  

const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Debug: confirm DB name
mongoose.connection.once("open", () => {
  console.log("📦 Mongoose DB name:", mongoose.connection.name);
});

// Middleware
app.use(cors());
app.use(express.json());

const multer = require("multer");

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  res.json({
    imageUrl: `/uploads/${req.file.filename}`
  });
});


// API routes
// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/promo", require("./routes/promoRoutes"));

// Serve frontend static files (MUST BE LAST)
app.use(express.static(path.join(__dirname, "../frontend")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use("/api/customers", require("./routes/customerAuth"));

