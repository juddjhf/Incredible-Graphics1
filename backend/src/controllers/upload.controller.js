
const cloudinary = require("../config/cloudinary");

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please select a file.",
    });
  }

  const isVideo = req.file.mimetype.startsWith("video/");

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "graphic-portfolio",
      resource_type: isVideo ? "video" : "image",
    },
    (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "File upload failed.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
      });
    }
  );

  uploadStream.end(req.file.buffer);
};

module.exports = { uploadFile };
