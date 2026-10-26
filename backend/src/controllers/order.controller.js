
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Service = require("../models/Service");

// POST: Create order request (public)
const createOrder = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      service,
      projectTitle,
      projectDescription,
      budget,
      deadline,
      referenceLinks,
    } = req.body;

    // Validate required fields
    if (
      !clientName?.trim() ||
      !clientEmail?.trim() ||
      !service ||
      !projectTitle?.trim() ||
      !projectDescription?.trim() ||
      budget === undefined ||
      budget === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(clientEmail.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate service ID
    if (!mongoose.isValidObjectId(service)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    // Validate budget
    const parsedBudget = Number(budget);

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid non-negative number",
      });
    }

    // Ensure selected service exists and is active
    const selectedService = await Service.findOne({
      _id: service,
      isActive: true,
    });

    if (!selectedService) {
      return res.status(404).json({
        success: false,
        message: "Selected service is unavailable",
      });
    }

    // Validate optional deadline
    let parsedDeadline;

    if (deadline) {
      parsedDeadline = new Date(deadline);

      if (
        Number.isNaN(parsedDeadline.getTime()) ||
        parsedDeadline <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Deadline must be a valid future date",
        });
      }
    }

    // Validate reference links
    if (
      referenceLinks !== undefined &&
      (!Array.isArray(referenceLinks) ||
        referenceLinks.length > 10 ||
        !referenceLinks.every(
          (link) =>
            typeof link === "string" &&
            link.length <= 2048 &&
            /^https?:\/\/\S+$/i.test(link)
        ))
    ) {
      return res.status(400).json({
        success: false,
        message: "Reference links must be valid HTTP(S) URLs",
      });
    }

    const orderData = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone?.trim() || "",
      service: selectedService._id,
      projectTitle: projectTitle.trim(),
      projectDescription: projectDescription.trim(),
      budget: parsedBudget,
      referenceLinks: referenceLinks || [],
    };

    if (parsedDeadline) {
      orderData.deadline = parsedDeadline;
    }

    const order = await Order.create(orderData);

    return res.status(201).json({
      success: true,
      message: "Project request submitted successfully",
      order: {
        id: order._id,
        projectTitle: order.projectTitle,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit project request",
    });
  }
};

// GET: All orders (admin only)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("service", "title category price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project requests",
    });
  }
};

// PATCH: Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
