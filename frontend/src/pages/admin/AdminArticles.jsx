// pages/admin/AdminArticles.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../store/slices/articleSlice";
import toast from "react-hot-toast";
import SEO from "../../components/SEO";
import ArticleStats from "../../components/admin/ArticleStats";
import ArticleTable from "../../components/admin/ArticleTable";
import ArticleModal from "../../components/admin/ArticleModal";
import { Plus, Sparkles, AlertCircle } from "lucide-react";

const AdminArticles = () => {
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.articles);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await dispatch(deleteArticle(id)).unwrap();
        toast.success("Article deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete article");
      }
    }
  };

  const handleSubmit = async (articleData) => {
    try {
      setSubmitting(true);
      if (editingArticle) {
        await dispatch(
          updateArticle({ id: editingArticle._id, articleData }),
        ).unwrap();
        toast.success("Article updated successfully");
      } else {
        await dispatch(createArticle(articleData)).unwrap();
        toast.success("Article created successfully");
      }
      setShowModal(false);
      setEditingArticle(null);
      await dispatch(fetchAllArticles());
    } catch (error) {
      toast.error(error || "Failed to save article");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArticle(null);
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchAllArticles())}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 px-6 py-3 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Article Management"
        description="Manage articles for Sami Ministry – faith blogs, recipes, agriculture, homeschooling, study materials."
      />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Article Management
                </span>
              </h1>
              <p className="text-gray-400">
                Create, edit, and manage faith‑based content, recipes,
                agriculture tips, homeschooling resources, and study materials.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity }}
                className="hidden md:block"
              >
                <Sparkles size={32} className="text-purple-400/30" />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingArticle(null);
                  setShowModal(true);
                }}
                disabled={submitting}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <Plus size={20} />
                Add New Article
              </motion.button>
            </div>
          </motion.div>

          {!loading && articles && articles.length > 0 && (
            <ArticleStats articles={articles} />
          )}

          <ArticleTable
            articles={articles || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          <ArticleModal
            isOpen={showModal}
            onClose={handleCloseModal}
            article={editingArticle}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
          />
        </div>
      </div>
    </>
  );
};

export default AdminArticles;
