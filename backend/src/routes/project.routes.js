
const express = require("express");
const router = express.Router();

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const { protectAdmin } = require("../middleware/auth.middleware");

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin-protected routes
router.post("/", protectAdmin, createProject);
router.patch("/:id", protectAdmin, updateProject);
router.delete("/:id", protectAdmin, deleteProject);

module.exports = router;
