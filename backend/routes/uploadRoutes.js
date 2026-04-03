import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImageHandler,
} from "../controllers/uploadController.js";

const router = express.Router();

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|ppt|pptx|txt/;
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Only images and documents (PDF, DOC, DOCX, PPT, PPTX) are allowed!",
        ),
      );
    }
  },
});

// Routes
router.post(
  "/",
  protect,
  admin,
  uploadMemory.single("image"),
  uploadSingleImage,
);
router.post(
  "/multiple",
  protect,
  admin,
  uploadMemory.array("images", 10),
  uploadMultipleImages,
);
router.delete("/:publicId", protect, admin, deleteImageHandler);

export default router;
