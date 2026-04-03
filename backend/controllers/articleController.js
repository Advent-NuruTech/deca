import slugify from "slugify";
import Article from "../models/Article.js";

// @desc    Get all published articles (with filtering)
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 10,
      sort = "-publishedAt",
    } = req.query;

    const query = { published: true };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const articles = await Article.find(query)
      .populate("author", "name email")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-content");

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
};

// @desc    Get all articles (admin, including drafts)
// @route   GET /api/articles/admin/all
// @access  Private/Admin
export const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email")
      .sort("-createdAt");
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single article by slug
// @route   GET /api/articles/:slug
// @access  Public
export const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      published: true,
    }).populate("author", "name email");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin
export const createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      category,
      tags,
      seoTitle,
      seoDescription,
      seoKeywords,
      published,
      isDownloadable,
      fileUrl,
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const article = await Article.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category: category || "faith",
      tags: tags || [],
      author: req.user._id,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt?.substring(0, 160),
      seoKeywords: seoKeywords || [],
      published: published || false,
      publishedAt: published ? new Date() : null,
      isDownloadable: isDownloadable || false,
      fileUrl: fileUrl || "",
    });

    const populatedArticle = await Article.findById(article._id).populate(
      "author",
      "name email",
    );
    res.status(201).json(populatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
export const updateArticle = async (req, res) => {
  try {
    const { title, published } = req.body;
    let updateData = { ...req.body };

    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }
    if (published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const article = await Article.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "name email");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
