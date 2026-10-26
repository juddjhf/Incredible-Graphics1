
const express = require("express");
const router = express.Router();

const {
  getReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
} = require("../controllers/reel.controller");

const {
  protectAdmin,
} = require("../middleware/auth.middleware");

// Public routes
router.get("/", getReels);
router.get("/:id", getReelById);

// Admin-protected routes
router.post("/", protectAdmin, createReel);
router.patch("/:id", protectAdmin, updateReel);
router.delete("/:id", protectAdmin, deleteReel);

module.exports = router;
