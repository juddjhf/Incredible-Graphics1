
const express = require("express");
const router = express.Router();

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

const {
  protectAdmin,
} = require("../middleware/auth.middleware");

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin-protected routes
router.post("/", protectAdmin, createService);
router.patch("/:id", protectAdmin, updateService);
router.delete("/:id", protectAdmin, deleteService);

module.exports = router;
