import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getArticles,
  getAllArticlesAdmin,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);

// Admin routes
router.get("/admin/all", protect, admin, getAllArticlesAdmin);
router.post("/", protect, admin, createArticle);
router.put("/:id", protect, admin, updateArticle);
router.delete("/:id", protect, admin, deleteArticle);

export default router;
