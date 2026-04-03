import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import cloudinary, { deleteImage } from "../config/cloudinary.js";
import { v2 as cloudinaryV2 } from "cloudinary";
import { Readable } from "stream";
const router = express.Router();

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Check if Cloudinary is configured
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (!hasCloudinaryConfig) {
  router.post("/", protect, admin, (req, res) => {
    return res.status(500).json({
      message:
        "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
    });
  });

  router.post("/multiple", protect, admin, (req, res) => {
    return res.status(500).json({
      message:
        "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
    });
  });
} else {
  // Helper function to upload buffer to Cloudinary
  const uploadToCloudinary = (buffer, folder = "fancytech-South Sudan") => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinaryV2.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      // Convert buffer to stream
      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    });
  };

  // @route   POST /api/upload
  // @desc    Upload single image to Cloudinary
  // @access  Private/Admin
  router.post(
    "/",
    protect,
    admin,
    uploadMemory.single("image"),
    async (req, res) => {
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

        // Upload directly to Cloudinary using the SDK
        const result = await uploadToCloudinary(req.file.buffer);

        console.log("File uploaded successfully to Cloudinary:", {
          public_id: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
        });

        res.json({
          message: "File uploaded successfully",
          filename: result.public_id,
          path: result.secure_url, // Cloudinary URL
          url: result.secure_url, // Cloudinary URL
          public_id: result.public_id, // Cloudinary public_id
          secure_url: result.secure_url, // Cloudinary secure URL
        });
      } catch (error) {
        console.error("Error uploading to Cloudinary:", {
          message: error.message,
          http_code: error.http_code,
          name: error.name,
        });

        if (error.http_code === 401) {
          return res.status(500).json({
            message:
              "Cloudinary authentication failed. Please check your API credentials.",
          });
        }

        res.status(400).json({
          message: error.message || "Upload failed",
          error: error.http_code || "UNKNOWN",
        });
      }
    },
  );

  // @route   POST /api/upload/multiple
  // @desc    Upload multiple images to Cloudinary
  // @access  Private/Admin
  router.post(
    "/multiple",
    protect,
    admin,
    uploadMemory.array("images", 10),
    async (req, res) => {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer),
        );
        const results = await Promise.all(uploadPromises);

        const files = results.map((result) => ({
          filename: result.public_id,
          path: result.secure_url,
          url: result.secure_url,
          public_id: result.public_id,
          secure_url: result.secure_url,
        }));

        res.json({
          message: "Files uploaded successfully",
          files,
        });
      } catch (error) {
        console.error("Error uploading multiple files to Cloudinary:", error);
        res.status(400).json({
          message: error.message || "Upload failed",
          error: error.http_code || "UNKNOWN",
        });
      }
    },
  );
}

// @route   DELETE /api/upload/:publicId
// @desc    Delete image from Cloudinary
// @access  Private/Admin
router.delete("/:publicId", protect, admin, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully", result });
    } else {
      res.status(404).json({ message: "Image not found", result });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
});

export default router;
