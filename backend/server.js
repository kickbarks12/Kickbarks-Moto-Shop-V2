// ================= ENV =================
require("dotenv").config();

// ================= CORE =================
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

// ================= APP =================
const app = express();
const PORT = process.env.PORT || 3000;

// ================= DATABASE =================
const connectDB = require("./config/db");
connectDB();

mongoose.connection.once("open", () => {
  console.log("📦 Connected to MongoDB:", mongoose.connection.name);
});

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= STATIC UPLOADS =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= FILE UPLOAD (MULTER) =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

// ================= ROUTES =================
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerAuth"));
app.use("/api/vouchers", require("./routes/voucherRoutes"));
app.use("/api/promo", require("./routes/promoRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// ================= FRONTEND =================
// MUST be after API routes
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
