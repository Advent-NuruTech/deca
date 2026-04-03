import { v2 as cloudinaryV2 } from "cloudinary";
import { Readable } from "stream";
import cloudinary, { deleteImage } from "../config/cloudinary.js";

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (
  buffer,
  originalname,
  mimetype,
  folder = "sami-ministry",
) => {
  const isImage = mimetype.startsWith("image/");
  const resourceType = isImage ? "image" : "raw";
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        public_id: `${Date.now()}_${originalname.replace(/\.[^/.]+$/, "")}`, // optional
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

// Check Cloudinary config once
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
export const uploadSingleImage = async (req, res) => {
  if (!hasCloudinaryConfig) {
    return res.status(500).json({
      message: "Cloudinary is not configured. Please set credentials in .env",
    });
  }

  console.log("Upload request received:", {
    hasFile: !!req.file,
    contentType: req.headers["content-type"],
    contentLength: req.headers["content-length"],
  });

  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded. Please select an image file." });
  }

  try {
    console.log("Uploading to Cloudinary:", {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    console.log("File uploaded successfully:", {
      public_id: result.public_id,
      url: result.secure_url,
    });

    res.json({
      message: "File uploaded successfully",
      filename: result.public_id,
      path: result.secure_url,
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    if (error.http_code === 401) {
      return res.status(500).json({
        message: "Cloudinary authentication failed. Check API credentials.",
      });
    }
    res.status(400).json({
      message: error.message || "Upload failed",
      error: error.http_code || "UNKNOWN",
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
export const uploadMultipleImages = async (req, res) => {
  if (!hasCloudinaryConfig) {
    return res.status(500).json({
      message: "Cloudinary is not configured. Please set credentials in .env",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, file.originalname, file.mimetype),
    );
    const results = await Promise.all(uploadPromises);

    const files = results.map((result) => ({
      filename: result.public_id,
      path: result.secure_url,
      url: result.secure_url,
      public_id: result.public_id,
      secure_url: result.secure_url,
    }));

    res.json({ message: "Files uploaded successfully", files });
  } catch (error) {
    console.error("Multiple upload error:", error);
    res.status(400).json({
      message: error.message || "Upload failed",
      error: error.http_code || "UNKNOWN",
    });
  }
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteImageHandler = async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);
    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully", result });
    } else {
      res.status(404).json({ message: "Image not found", result });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};
