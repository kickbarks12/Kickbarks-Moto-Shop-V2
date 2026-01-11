const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateInvoice(order) {
  const invoicesDir = path.join(__dirname, "../invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const fileName = `invoice-${order.reference}.pdf`;
  const filePath = path.join(invoicesDir, fileName);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Kickbarks Moto Shop", { align: "center" });
  doc.moveDown();
  doc.text(`Invoice #: ${order.reference}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);

  doc.moveDown();
  doc.text(order.customer.name);
  doc.text(order.customer.email);
  doc.text(order.customer.phone);
  doc.text(order.customer.address);

  doc.moveDown();
  order.items.forEach(item => {
    doc.text(`${item.name} x${item.quantity} - ₱${item.price * item.quantity}`);
  });

  doc.moveDown();
  doc.text(`TOTAL: ₱${order.total}`);

  doc.end();

  return filePath;
};
