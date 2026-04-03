import express from 'express';
import slugify from 'slugify';
import Article from '../models/Article.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/articles
// @desc    Get all published articles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 10,
      sort = '-publishedAt',
    } = req.query;

    const query = { published: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const articles = await Article.find(query)
      .populate('author', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content');

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/articles/admin
// @desc    Get all articles (including drafts) for admin
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email')
      .sort('-createdAt');

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/articles/:slug
// @desc    Get single article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug,
      published: true 
    }).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/articles
// @desc    Create new article
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags, seoTitle, seoDescription, seoKeywords, published } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const article = await Article.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags: tags || [],
      author: req.user._id,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt.substring(0, 160),
      seoKeywords: seoKeywords || [],
      published: published || false,
      publishedAt: published ? new Date() : null,
    });

    const populatedArticle = await Article.findById(article._id).populate('author', 'name email');

    res.status(201).json(populatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/articles/:id
// @desc    Update article
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, published } = req.body;
    let updateData = { ...req.body };

    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    if (published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/articles/:id
// @desc    Delete article
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
