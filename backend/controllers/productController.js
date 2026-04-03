import slugify from "slugify";
import Product from "../models/Product.js";

// @desc    Get all products (public, with filtering & pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
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

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (search) query.$text = { $search: search };

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
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product (admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
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
      seoDescription: seoDescription || description?.substring(0, 160),
      seoKeywords: seoKeywords || [],
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
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
};

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
