
const mongoose = require("mongoose");
const Service = require("../models/Service");

// GET all active services
const getServices = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
    }).sort({ featured: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

// GET single active service
const getServiceById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
};

// CREATE service (admin only)
const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      deliveryDays,
      features,
      image,
      isActive,
      featured,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      price === undefined ||
      deliveryDays === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required service fields",
      });
    }

    const service = await Service.create({
      title,
      description,
      category,
      price,
      deliveryDays,
      features,
      image,
      isActive,
      featured,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create service error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
};

// UPDATE service (admin only)
const updateService = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "price",
      "deliveryDays",
      "features",
      "image",
      "isActive",
      "featured",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update service error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
};

// DELETE service (admin only)
const deleteService = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
