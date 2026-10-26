
const express = require("express");
const router = express.Router();

const {
  loginAdmin,
} = require("../controllers/admin.controller");

// Admin login
router.post("/login", loginAdmin);

module.exports = router;
