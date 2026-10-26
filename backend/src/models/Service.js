
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
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
        "Video Editing",
        "Reels Editing",
        "UI/UX Design",
        "Other",
      ],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryDays: {
      type: Number,
      required: true,
      min: 1,
    },

    features: {
      type: [String],
      default: [],
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
