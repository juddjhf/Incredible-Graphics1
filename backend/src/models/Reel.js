
const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    videoPublicId: {
      type: String,
      default: "",
    },

    thumbnail: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    platform: {
      type: String,
      enum: ["Instagram", "YouTube", "Facebook", "Other"],
      default: "Instagram",
    },

    category: {
      type: String,
      enum: [
        "Reels Editing",
        "Video Editing",
        "Motion Graphics",
        "Promotional Video",
        "Other",
      ],
      default: "Reels Editing",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Reel = mongoose.model("Reel", reelSchema);

module.exports = Reel;
