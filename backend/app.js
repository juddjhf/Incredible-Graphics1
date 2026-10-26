
const express = require("express");
const cors = require("cors");

const {
  notFound,
  errorHandler,
} = require("./src/middleware/error.middleware");

const app = express();

// Global middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Incredible Graphics API is running",
  });
});

// API routes
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/projects", require("./src/routes/project.routes"));
app.use("/api/services", require("./src/routes/service.routes"));
app.use("/api/reels", require("./src/routes/reel.routes"));
app.use("/api/contact", require("./src/routes/contact.routes"));
app.use("/api/orders", require("./src/routes/order.routes"));
app.use("/api/upload", require("./src/routes/upload.routes"));

// Error handling (always after routes)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
