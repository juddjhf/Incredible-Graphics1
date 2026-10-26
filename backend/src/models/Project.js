
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Logo Design",
        "Branding",
        "Social Media Design",
        "YouTube Thumbnail",
        "Poster Design",
        "UI/UX Design",
        "Other",
      ],
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    projectUrl: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
