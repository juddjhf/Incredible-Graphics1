
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    clientPhone: {
      type: String,
      trim: true,
      default: "",
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    projectTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    projectDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    deadline: {
      type: Date,
      default: null,
    },

    referenceLinks: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["not-required", "pending", "paid", "failed", "refunded"],
      default: "not-required",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
