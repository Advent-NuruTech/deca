import express from "express";
import slugify from "slugify";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (public)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      page = 1,
      limit = 12,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "active" };

    if (category) {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-specifications");

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug
// @access  Public
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      features,
      category,
      price,
      originalPrice,
      images,
      inStock,
      stockQuantity,
      specifications,
      brand,
      model,
      featured,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const product = await Product.create({
      name,
      slug,
      description,
      features,
      category,
      price,
      originalPrice,
      images: images || [],
      inStock,
      stockQuantity,
      specifications: specifications || {},
      brand,
      model,
      featured: featured || false,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description.substring(0, 160),
      seoKeywords: seoKeywords || [],
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    let updateData = { ...req.body };

    if (name) {
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
