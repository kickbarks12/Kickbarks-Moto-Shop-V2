const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "kickbarks_shop",
      autoIndex: true,
    });

    console.log(`✅ MongoDB connected`);
    console.log(`📦 Host: ${conn.connection.host}`);
    console.log(`🗂 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
