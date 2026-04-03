// components/article/ArticleHero.jsx
import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, Eye, Clock, Share2, Bookmark } from "lucide-react";

const ArticleHero = ({ article, categoryLabels, formatDate }) => {
  const categoryColors = {
    news: "from-blue-400 to-blue-500",
    tutorial: "from-green-400 to-green-500",
    "product-review": "from-purple-400 to-purple-500",
    "company-update": "from-orange-400 to-orange-500",
    "tech-tips": "from-pink-400 to-pink-500",
  };

  const color =
    categoryColors[article.category] || "from-purple-400 to-blue-400";

  return (
    <section className="relative pt-32 pb-16 overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Category Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-6"
        >
          <span
            className={`bg-gradient-to-r ${color} text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg`}
          >
            {categoryLabels[article.category] || article.category}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl"
        >
          <span className="bg-gradient-to-r from-white via-gray-200 to-white text-transparent bg-clip-text">
            {article.title}
          </span>
        </motion.h1>

        {/* Meta Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-6 text-gray-400"
        >
          <div className="flex items-center gap-2">
            <User size={16} className="text-purple-400" />
            <span>
              By{" "}
              <span className="text-white font-medium">
                {article.author?.name || "Admin"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>

          {article.views > 0 && (
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-green-400" />
              <span>{article.views} views</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-orange-400" />
            <span>
              {Math.ceil(article.content?.split(/\s+/).length / 200) || 3} min
              read
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Share2 size={16} />
            Share
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Bookmark size={16} />
            Save
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticleHero;
