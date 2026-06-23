import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  FileText,
  Tag,
  Globe,
  Settings,
  Eye,
  Download,
  Link as LinkIcon,
} from "lucide-react";
import { getImageUrl } from "../../utils/constants";
import api from "../../services/api";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ArticleModal = ({ isOpen, onClose, article, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "faith",
    tags: "",
    published: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    featuredImage: "",
    isDownloadable: false,
    fileUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState(false);

  // Populate formData when article changes (editing)
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
        excerpt: article.excerpt || "",
        category: article.category || "faith",
        tags: article.tags?.join(", ") || "",
        published: article.published || false,
        seoTitle: article.seoTitle || "",
        seoDescription: article.seoDescription || "",
        seoKeywords: article.seoKeywords?.join(", ") || "",
        featuredImage: article.featuredImage || "",
        isDownloadable: article.isDownloadable || false,
        fileUrl: article.fileUrl || "",
      });
    } else {
      // Reset for new article
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "faith",
        tags: "",
        published: false,
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        featuredImage: "",
        isDownloadable: false,
        fileUrl: "",
      });
    }
  }, [article]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Image upload (for featured image)
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

  // Document upload (for downloadable files)
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      const response = await api.post("/upload", uploadFormData);
      const fileUrl = response.data.secure_url || response.data.url;
      setFormData((prev) => ({
        ...prev,
        fileUrl: fileUrl,
      }));
      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Form submission
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

  // ================== TOOLBAR CONFIGURATION ==================
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  // ================== RENDER ==================
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
              <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-4xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
                      {article ? "Edit Article" : "Create New Article"}
                    </span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPreviewMode(!previewMode)}
                      className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                      title={previewMode ? "Edit Mode" : "Preview Mode"}
                    >
                      <Eye size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Tabs */}
                {!previewMode && (
                  <div className="flex border-b border-gray-200">
                    {[
                      { id: "content", label: "Content", icon: FileText },
                      { id: "seo", label: "SEO", icon: Globe },
                      { id: "settings", label: "Settings", icon: Settings },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "text-emerald-600 border-b-2 border-emerald-600"
                            : "text-gray-500 hover:text-gray-800"
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
                    <div className="prose prose-slate max-w-none">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
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
                        className="text-gray-700 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                      {formData.isDownloadable && formData.fileUrl && (
                        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <a
                            href={formData.fileUrl}
                            download
                            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
                          >
                            <Download size={20} />
                            Download Study Material
                          </a>
                        </div>
                      )}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              required
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                              placeholder="Enter article title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              required
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            >
                              <option value="faith">Faith Blogs</option>
                              <option value="recipe">Recipes</option>
                              <option value="agriculture">
                                Agriculture Tips
                              </option>
                              <option value="homeschooling">
                                Homeschooling
                              </option>
                              <option value="study">Study Materials</option>
                            </select>
                          </div>

                          {/* Rich Text Editor */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content *
                            </label>
                            <ReactQuill
                              theme="snow"
                              value={formData.content}
                              onChange={(value) =>
                                setFormData({ ...formData, content: value })
                              }
                              modules={modules}
                              formats={formats}
                              className="bg-white rounded-lg"
                              placeholder="Write your article content here..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Use the toolbar to format text, add headings,
                              lists, and links.
                            </p>
                          </div>

                          {/* Downloadable Section */}
                          <div className="border-t border-gray-200 pt-4">
                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                              <input
                                type="checkbox"
                                name="isDownloadable"
                                checked={formData.isDownloadable}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="text-sm text-gray-700">
                                This is a downloadable resource (e.g., PDF, DOC,
                                PPT)
                              </span>
                            </label>

                            {formData.isDownloadable && (
                              <div className="ml-6 space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Document (PDF, DOC, DOCX, PPT, PPTX)
                                  </label>
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                                      onChange={handleDocumentUpload}
                                      disabled={uploading}
                                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    />
                                    {uploading && (
                                      <div className="text-emerald-600 text-sm animate-pulse">
                                        Uploading...
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Upload to Cloudinary (supports PDF, Word,
                                    PowerPoint)
                                  </p>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Or enter File URL directly
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <LinkIcon
                                      size={16}
                                      className="text-gray-400"
                                    />
                                    <input
                                      type="url"
                                      name="fileUrl"
                                      value={formData.fileUrl}
                                      onChange={handleChange}
                                      placeholder="https://res.cloudinary.com/..."
                                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Paste a direct link to PDF, DOC, etc.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Excerpt *
                            </label>
                            <textarea
                              name="excerpt"
                              value={formData.excerpt}
                              onChange={handleChange}
                              required
                              rows="3"
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="Short description of the article"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tags (comma-separated)
                            </label>
                            <input
                              type="text"
                              name="tags"
                              value={formData.tags}
                              onChange={handleChange}
                              placeholder="faith, bible, prayer"
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Featured Image
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-400 transition-colors">
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
                                <span className="text-sm text-gray-500">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              SEO Title
                            </label>
                            <input
                              type="text"
                              name="seoTitle"
                              value={formData.seoTitle}
                              onChange={handleChange}
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="SEO optimized title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              SEO Description
                            </label>
                            <textarea
                              name="seoDescription"
                              value={formData.seoDescription}
                              onChange={handleChange}
                              rows="3"
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="Meta description for search engines"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              SEO Keywords
                            </label>
                            <input
                              type="text"
                              name="seoKeywords"
                              value={formData.seoKeywords}
                              onChange={handleChange}
                              placeholder="keyword1, keyword2, keyword3"
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-700">
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
                                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="text-sm text-gray-700">
                                Publish immediately
                              </span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              If unchecked, article will be saved as draft
                            </p>
                          </div>
                          {article && (
                            <div className="pt-4 border-t border-gray-200">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Article Info
                              </h3>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Slug:</span>
                                  <span>{article.slug}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Created:
                                  </span>
                                  <span>
                                    {new Date(
                                      article.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Views:</span>
                                  <span>{article.views || 0}</span>
                                </div>
                              </div>
                            </div>
                          )}
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
                        className="px-6 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm"
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
