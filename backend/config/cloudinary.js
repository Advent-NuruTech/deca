import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
// Check if Cloudinary credentials are provided
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    "⚠️  Cloudinary credentials not found. Image uploads will fail. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.",
  );
}

// Configure storage for Cloudinary
// Use minimal params to avoid signature issues
const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: "fancytech-South Sudan", // Folder name in Cloudinary
        // Don't include allowed_formats or transformation here - they cause signature issues
        // File validation is handled by multer fileFilter instead
      },
    })
  : null;

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Configure multer with Cloudinary storage
export const upload = hasCloudinaryConfig
  ? multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter,
    })
  : null;

// Helper function to delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    // Extract public_id from URL if full URL is provided
    let public_id = publicId;
    if (publicId.includes("/")) {
      // If it's a URL, extract the public_id
      const parts = publicId.split("/");
      const filename = parts[parts.length - 1];
      public_id = `fancytech-South Sudan/${filename.split(".")[0]}`;
    }

    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

export default cloudinary;
