import mongoose from "mongoose";

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
      enum: ["faith", "recipe", "agriculture", "homeschooling", "study"],
      default: "faith",
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    // NEW FIELDS for study materials
    isDownloadable: {
      type: Boolean,
      default: false,
    },
    fileUrl: {
      type: String, // URL to PDF, DOC, etc. (stored on Cloudinary or local)
    },
  },
  {
    timestamps: true,
  },
);

// Index for search (keep as is)
articleSchema.index({ title: "text", content: "text" });
articleSchema.index({ category: 1, published: 1 });

const Article = mongoose.model("Article", articleSchema);

export default Article;
