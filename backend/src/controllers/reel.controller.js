
const mongoose = require("mongoose");
const Reel = require("../models/Reel");

// GET all active reels
const getReels = async (req, res) => {
  try {
    const reels = await Reel.find({
      isActive: true,
    }).sort({ featured: -1, displayOrder: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reels.length,
      reels,
    });
  } catch (error) {
    console.error("Get reels error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reels",
    });
  }
};

// GET single active reel
const getReelById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reel ID",
      });
    }

    const reel = await Reel.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    return res.status(200).json({
      success: true,
      reel,
    });
  } catch (error) {
    console.error("Get reel error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reel",
    });
  }
};

// CREATE reel (admin only)
const createReel = async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      videoPublicId,
      thumbnail,
      platform,
      category,
      featured,
      isActive,
      displayOrder,
    } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and video URL are required",
      });
    }

    const reel = await Reel.create({
      title,
      description,
      videoUrl,
      videoPublicId,
      thumbnail,
      platform,
      category,
      featured,
      isActive,
      displayOrder,
    });

    return res.status(201).json({
      success: true,
      message: "Reel created successfully",
      reel,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create reel error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create reel",
    });
  }
};

// UPDATE reel (admin only)
const updateReel = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reel ID",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "videoUrl",
      "videoPublicId",
      "thumbnail",
      "platform",
      "category",
      "featured",
      "isActive",
      "displayOrder",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reel updated successfully",
      reel,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update reel error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update reel",
    });
  }
};

// DELETE reel (admin only)
const deleteReel = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reel ID",
      });
    }

    const reel = await Reel.findByIdAndDelete(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reel deleted successfully",
    });
  } catch (error) {
    console.error("Delete reel error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete reel",
    });
  }
};

module.exports = {
  getReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
};
