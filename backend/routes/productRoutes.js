import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
