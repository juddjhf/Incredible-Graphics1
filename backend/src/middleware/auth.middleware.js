
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    let token;

    // Authorization header se token lena
    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login as admin.",
      });
    }

    // JWT token verify karna
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Database mein admin verify karna
    const admin = await Admin.findById(decoded.id).select(
      "-password"
    );

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    // Admin ki details request mein attach karna
    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { protectAdmin };
