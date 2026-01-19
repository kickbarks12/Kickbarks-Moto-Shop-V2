const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= VERIFY TRANSPORT =================
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email service error:", err);
  } else {
    console.log("📧 Email service ready");
  }
});

module.exports = transporter;
