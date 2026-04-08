// src/components/articles/ArticleCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Clock, Eye } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const ArticleCard = ({ article, index }) => {
  // Updated category labels for RemSam Homestead
  const categoryLabels = {
    faith: "Faith Blog",
    recipe: "Recipe",
    agriculture: "Agriculture",
    homeschooling: "Homeschooling",
    study: "Study Material",
  };

  // Light, ministry‑appropriate gradient colors
  const categoryColors = {
    faith: "from-emerald-500 to-teal-500",
    recipe: "from-amber-500 to-orange-500",
    agriculture: "from-green-500 to-emerald-500",
    homeschooling: "from-blue-500 to-indigo-500",
    study: "from-purple-500 to-pink-500",
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime || 3;
  };

  const color =
    categoryColors[article.category] || "from-emerald-500 to-teal-500";
  const label = categoryLabels[article.category] || article.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative h-full"
    >
      {/* Animated gradient border on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
      />

      <Link
        to={`/articles/${article.slug}`}
        className="relative block h-full bg-white rounded-xl overflow-hidden border border-gray-200 group-hover:border-transparent transition-all duration-500 shadow-sm hover:shadow-xl"
      >
        {/* Image Container */}
        {article.featuredImage && (
          <div className="relative h-56 overflow-hidden">
            <motion.img
              src={getImageUrl(article.featuredImage)}
              alt={article.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Light gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />

            {/* Category Badge */}
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              className={`absolute top-4 left-4 bg-gradient-to-r ${color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}
            >
              {label}
            </motion.div>

            {/* Read Time Badge */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Clock size={12} />
              <span>{getReadTime(article.content)} min read</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3
            className={`text-xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${color} transition-all duration-300 line-clamp-2`}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{article.author?.name || "Admin"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ x: 5 }}
            className={`mt-4 text-sm font-semibold bg-gradient-to-r ${color} text-transparent bg-clip-text inline-flex items-center gap-1`}
          >
            Read Article →
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
