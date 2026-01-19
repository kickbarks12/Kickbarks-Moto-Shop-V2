const jwt = require("jsonwebtoken");

module.exports = function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No admin token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};
