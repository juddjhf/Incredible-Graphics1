
const Project = require("../models/Project");

// GET all published projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      status: "published",
    }).sort({ featured: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// GET single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: "published",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// CREATE project (admin only)
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image,
      projectUrl,
      tags,
      featured,
      status,
    } = req.body;

    if (!title || !description || !category || !image?.url) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category and image URL are required",
      });
    }

    const project = await Project.create({
      title,
      description,
      category,
      image,
      projectUrl,
      tags,
      featured,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// UPDATE project (admin only)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID or project data",
      });
    }

    console.error("Update project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// DELETE project (admin only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    console.error("Delete project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
