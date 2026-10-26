
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const { uploadFile } = require("../controllers/upload.controller");
const { protectAdmin } = require("../middleware/auth.middleware");

router.post("/", protectAdmin, upload.single("file"), uploadFile);

module.exports = router;
