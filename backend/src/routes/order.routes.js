
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const {
  protectAdmin,
} = require("../middleware/auth.middleware");

// Public route: client order request bhejega
router.post("/", createOrder);

// Admin-protected routes
router.get("/", protectAdmin, getOrders);
router.patch("/:id/status", protectAdmin, updateOrderStatus);

module.exports = router;
