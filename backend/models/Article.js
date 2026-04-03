import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    category: {
      type: String,
      enum: ['news', 'tutorial', 'product-review', 'company-update', 'tech-tips'],
      default: 'news',
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    seoKeywords: [
      {
        type: String,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ category: 1, published: 1 });

const Article = mongoose.model('Article', articleSchema);

export default Article;
