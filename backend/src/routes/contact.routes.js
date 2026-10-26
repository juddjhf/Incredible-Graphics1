
const express = require("express");
const router = express.Router();

const {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contact.controller");

const { protectAdmin } = require("../middleware/auth.middleware");

// Public contact form
router.post("/", createContact);

// Admin-only routes
router.get("/", protectAdmin, getContacts);
router.patch("/:id", protectAdmin, updateContactStatus);
router.delete("/:id", protectAdmin, deleteContact);

module.exports = router;
