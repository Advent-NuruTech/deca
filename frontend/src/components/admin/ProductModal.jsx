// components/admin/ProductModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  Package,
  DollarSign,
  FileText,
  Settings,
} from "lucide-react";
import { getImageUrl } from "../../utils/constants";
import api from "../../services/api";
import toast from "react-hot-toast";

const ProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    features: product?.features || "",
    category: product?.category || "seeds", // changed default
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    inStock: product?.inStock !== false,
    stockQuantity: product?.stockQuantity || "",
    brand: product?.brand || "",
    model: product?.model || "",
    featured: product?.featured || false,
    status: product?.status || "active",
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
    seoKeywords: product?.seoKeywords?.join(", ") || "",
    images: product?.images || [],
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: product?.name || "",
        description: product?.description || "",
        features: product?.features || "",
        category: product?.category || "seeds",
        price: product?.price || "",
        originalPrice: product?.originalPrice || "",
        inStock: product?.inStock !== false,
        stockQuantity: product?.stockQuantity || "",
        brand: product?.brand || "",
        model: product?.model || "",
        featured: product?.featured || false,
        status: product?.status || "active",
        seoTitle: product?.seoTitle || "",
        seoDescription: product?.seoDescription || "",
        seoKeywords: product?.seoKeywords?.join(", ") || "",
        images: product?.images || [],
      });
      setActiveTab("basic");
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await api.post("/upload", formData);
        return response.data;
      });
      const responses = await Promise.all(uploadPromises);
      const imagePaths = responses
        .map(
          (res) =>
            res.path ||
            res.url ||
            res.secure_url ||
            res.data?.path ||
            res.data?.url,
        )
        .filter(Boolean);
      if (imagePaths.length === 0) throw new Error("No image URLs returned");
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imagePaths],
      }));
      toast.success(`${imagePaths.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Product name is required");
      setActiveTab("basic");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Product description is required");
      setActiveTab("basic");
      return;
    }
    if (!formData.features?.trim()) {
      toast.error("Product features are required");
      setActiveTab("basic");
      return;
    }
    if (!formData.price || formData.price === "") {
      toast.error("Product price is required");
      setActiveTab("pricing");
      return;
    }
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price");
      setActiveTab("pricing");
      return;
    }

    const productData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      features: formData.features.trim(),
      price: priceValue,
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      stockQuantity: formData.stockQuantity
        ? parseInt(formData.stockQuantity) || 0
        : 0,
      seoKeywords: formData.seoKeywords
        ? formData.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [],
    };
    onSubmit(productData);
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing & Stock", icon: DollarSign },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "seo", label: "SEO", icon: FileText },
    { id: "advanced", label: "Advanced", icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center">
              <div className="bg-white/95  rounded-2xl border border-gray-200 w-full max-w-4xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                      {product ? "Edit Product" : "Add New Product"}
                    </span>
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "text-purple-400 border-b-2 border-purple-400"
                          : "text-gray-400 hover:text-gray-900"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Basic Info Tab */}
                    {activeTab === "basic" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter product name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                          >
                            <option value="seeds" className="bg-white">
                              Organic Seeds
                            </option>
                            <option value="produce" className="bg-white">
                              Fresh Produce
                            </option>
                            <option value="other" className="bg-white">
                              Other Products
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Description *
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter product description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Key Features *
                          </label>
                          <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter product features (comma-separated or bullet points)"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Brand (optional)
                            </label>
                            <input
                              type="text"
                              name="brand"
                              value={formData.brand}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="e.g., Organic Farms"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Variety / Model (optional)
                            </label>
                            <input
                              type="text"
                              name="model"
                              value={formData.model}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="e.g., Heirloom Tomato"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pricing Tab */}
                    {activeTab === "pricing" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Price ($) *
                            </label>
                            <input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              required
                              step="0.01"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Original Price ($)
                            </label>
                            <input
                              type="number"
                              name="originalPrice"
                              value={formData.originalPrice}
                              onChange={handleChange}
                              step="0.01"
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Stock Quantity
                            </label>
                            <input
                              type="number"
                              name="stockQuantity"
                              value={formData.stockQuantity}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center space-x-4 pt-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="inStock"
                                checked={formData.inStock}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-200 bg-gray-50 text-purple-500 focus:ring-purple-500/50"
                              />
                              <span className="text-sm text-gray-600">
                                In Stock
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-200 bg-gray-50 text-purple-500 focus:ring-purple-500/50"
                              />
                              <span className="text-sm text-gray-600">
                                Featured
                              </span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Status
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                          >
                            <option value="active" className="bg-white">
                              Active
                            </option>
                            <option value="inactive" className="bg-white">
                              Inactive
                            </option>
                            <option value="draft" className="bg-white">
                              Draft
                            </option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Media Tab (unchanged) */}
                    {activeTab === "media" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Product Images
                          </label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer flex flex-col items-center gap-2"
                            >
                              <Upload size={32} className="text-gray-400" />
                              <span className="text-sm text-gray-400">
                                Click to upload or drag and drop
                              </span>
                              <span className="text-xs text-gray-400">
                                PNG, JPG, GIF up to 10MB
                              </span>
                            </label>
                          </div>
                          {uploading && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </div>
                          )}
                        </div>
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-4">
                            {formData.images.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={getImageUrl(img)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-gray-900 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SEO Tab (unchanged) */}
                    {activeTab === "seo" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            SEO Title
                          </label>
                          <input
                            type="text"
                            name="seoTitle"
                            value={formData.seoTitle}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter SEO title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            SEO Description
                          </label>
                          <textarea
                            name="seoDescription"
                            value={formData.seoDescription}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter SEO description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            SEO Keywords
                          </label>
                          <input
                            type="text"
                            name="seoKeywords"
                            value={formData.seoKeywords}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="keyword1, keyword2, keyword3"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Comma-separated keywords
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Advanced Tab (unchanged) */}
                    {activeTab === "advanced" && (
                      <div className="space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <p className="text-sm text-yellow-400">
                            ⚠️ Advanced settings are for experienced users only.
                            Incorrect configurations may affect product display.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Product Slug
                          </label>
                          <input
                            type="text"
                            value={product?.slug || ""}
                            disabled
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                            placeholder="Auto-generated from name"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Slug is auto-generated from product name
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Product ID
                          </label>
                          <input
                            type="text"
                            value={product?._id || "Will be generated"}
                            disabled
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-white/10 hover:text-gray-900 transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      {product ? "Update Product" : "Create Product"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
