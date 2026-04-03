import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "starlink",
        "networking",
        "laptop",
        "accesspoint",
        "cctv",
        "router",
        "phone",
        "software",
      ],
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    images: [
      {
        type: String,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
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
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, status: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
