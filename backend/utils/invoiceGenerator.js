const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generate invoice PDF for an order
 * @param {Object} order
 * @returns {string} filePath
 */
module.exports = function generateInvoice(order) {
  const invoicesDir = path.join(__dirname, "../invoices");

  // Ensure invoices directory exists
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const fileName = `invoice-${order.reference}.pdf`;
  const filePath = path.join(invoicesDir, fileName);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(filePath));

  // ================= HEADER =================
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("Kickbarks Moto Shop", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Motorcycle Parts & Accessories", { align: "center" })
    .moveDown(2);

  // ================= INVOICE META =================
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Invoice #: ${order.reference}`)
    .font("Helvetica")
    .text(`Date: ${formatDate(order.createdAt)}`)
    .moveDown();

  // ================= CUSTOMER =================
  doc
    .font("Helvetica-Bold")
    .text("Bill To:")
    .font("Helvetica")
    .text(order.customer.name)
    .text(order.customer.email)
    .text(order.customer.phone)
    .text(order.customer.address)
    .moveDown();

  // ================= ITEMS =================
  doc.font("Helvetica-Bold").text("Order Items:");
  doc.moveDown(0.5);
  doc.font("Helvetica");

  order.items.forEach((item) => {
    const lineTotal = item.price * item.quantity;

    doc.text(
      `${item.name}  x${item.quantity}`,
      { continued: true }
    );
    doc.text(`₱${lineTotal.toFixed(2)}`, { align: "right" });
  });

  doc.moveDown();

  // ================= TOTAL =================
  doc
    .font("Helvetica-Bold")
    .text(`TOTAL: ₱${order.total.toFixed(2)}`, {
      align: "right",
    });

  // ================= FOOTER =================
  doc.moveDown(2);
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("gray")
    .text(
      "Thank you for shopping with Kickbarks Moto Shop!",
      { align: "center" }
    );

  doc.end();

  return filePath;
};

// ================= HELPERS =================
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
