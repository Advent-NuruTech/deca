// components/admin/ArticleModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  Tag,
  Globe,
  Settings,
  Eye,
} from "lucide-react";
import { getImageUrl } from "../../utils/constants";
import api from "../../services/api";
import toast from "react-hot-toast";

const ArticleModal = ({ isOpen, onClose, article, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    category: article?.category || "news",
    tags: article?.tags?.join(", ") || "",
    published: article?.published || false,
    seoTitle: article?.seoTitle || "",
    seoDescription: article?.seoDescription || "",
    seoKeywords: article?.seoKeywords?.join(", ") || "",
    featuredImage: article?.featuredImage || "",
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      const response = await api.post("/upload", uploadFormData);
      setFormData({
        ...formData,
        featuredImage:
          response.data.path || response.data.url || response.data.secure_url,
      });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const articleData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      seoKeywords: formData.seoKeywords
        ? formData.seoKeywords.split(",").map((k) => k.trim())
        : [],
    };
    onSubmit(articleData);
  };

  const tabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "settings", label: "Settings", icon: Settings },
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
              <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-4xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                      {article ? "Edit Article" : "Create New Article"}
                    </span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPreviewMode(!previewMode)}
                      className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                      title={previewMode ? "Edit Mode" : "Preview Mode"}
                    >
                      <Eye size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Tabs (only show in edit mode) */}
                {!previewMode && (
                  <div className="flex border-b border-white/10">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "text-purple-400 border-b-2 border-purple-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}

                {previewMode ? (
                  /* Preview Mode */
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="prose prose-invert max-w-none">
                      <h1 className="text-3xl font-bold text-white mb-4">
                        {formData.title}
                      </h1>
                      {formData.featuredImage && (
                        <img
                          src={getImageUrl(formData.featuredImage)}
                          alt={formData.title}
                          className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                      )}
                      <div
                        className="text-gray-300 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                      {/* Content Tab */}
                      {activeTab === "content" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              required
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="Enter article title"
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
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="news" className="bg-gray-800">
                                News
                              </option>
                              <option value="tutorial" className="bg-gray-800">
                                Tutorial
                              </option>
                              <option
                                value="product-review"
                                className="bg-gray-800"
                              >
                                Product Review
                              </option>
                              <option
                                value="company-update"
                                className="bg-gray-800"
                              >
                                Company Update
                              </option>
                              <option value="tech-tips" className="bg-gray-800">
                                Tech Tips
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Excerpt *
                            </label>
                            <textarea
                              name="excerpt"
                              value={formData.excerpt}
                              onChange={handleChange}
                              required
                              rows="3"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="Short description of the article"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Content * (HTML supported)
                            </label>
                            <textarea
                              name="content"
                              value={formData.content}
                              onChange={handleChange}
                              required
                              rows="10"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="<p>Your article content here...</p>"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              HTML tags supported: &lt;p&gt;, &lt;h2&gt;,
                              &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;,
                              &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt;
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              name="tags"
                              value={formData.tags}
                              onChange={handleChange}
                              placeholder="technology, tutorial, guide"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                              Featured Image
                            </label>
                            <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors">
                              <input
                                type="file"
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
                                <Upload size={24} className="text-gray-400" />
                                <span className="text-sm text-gray-400">
                                  {uploading
                                    ? "Uploading..."
                                    : "Click to upload featured image"}
                                </span>
                              </label>
                            </div>
                            {formData.featuredImage && (
                              <div className="mt-2 relative">
                                <img
                                  src={getImageUrl(formData.featuredImage)}
                                  alt="Featured"
                                  className="h-32 w-auto object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* SEO Tab */}
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
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="SEO optimized title"
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
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="Meta description for search engines"
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
                              placeholder="keyword1, keyword2, keyword3"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Comma-separated keywords for search engines
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Settings Tab */}
                      {activeTab === "settings" && (
                        <div className="space-y-4">
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-sm text-yellow-400">
                              ⚠️ Publishing settings affect article visibility
                            </p>
                          </div>

                          <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="published"
                                checked={formData.published}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500/50"
                              />
                              <span className="text-sm text-gray-300">
                                Publish immediately
                              </span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              If unchecked, article will be saved as draft
                            </p>
                          </div>

                          {article && (
                            <div className="pt-4 border-t border-white/10">
                              <h3 className="text-sm font-medium text-gray-400 mb-3">
                                Article Info
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Slug:</span>
                                  <span className="text-gray-300">
                                    {article.slug}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Created:
                                  </span>
                                  <span className="text-gray-300">
                                    {new Date(
                                      article.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Views:</span>
                                  <span className="text-gray-300">
                                    {article.views || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-4 p-6 border-t border-white/10">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        {article ? "Update Article" : "Create Article"}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ArticleModal;
