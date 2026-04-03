// components/articles/ArticleCard.jsx (Enhanced version)
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Tag, Clock, Eye } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const ArticleCard = ({ article, index }) => {
  const categoryLabels = {
    news: "News",
    tutorial: "Tutorial",
    "product-review": "Product Review",
    "company-update": "Company Update",
    "tech-tips": "Tech Tips",
  };

  const categoryColors = {
    news: "from-blue-400 to-blue-500",
    tutorial: "from-green-400 to-green-500",
    "product-review": "from-purple-400 to-purple-500",
    "company-update": "from-orange-400 to-orange-500",
    "tech-tips": "from-pink-400 to-pink-500",
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
    return readTime || 3; // Default to 3 minutes if no content
  };

  const color =
    categoryColors[article.category] || "from-purple-400 to-blue-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative h-full"
    >
      {/* Animated border */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
      />

      <Link
        to={`/articles/${article.slug}`}
        className="relative block h-full bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 group-hover:border-transparent transition-all duration-500"
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

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

            {/* Category Badge */}
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              className={`absolute top-4 left-4 bg-gradient-to-r ${color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
            >
              {categoryLabels[article.category] || article.category}
            </motion.div>

            {/* Read Time */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Clock size={12} />
              <span>{getReadTime(article.content)} min read</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3
            className={`text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${color} transition-all duration-300 line-clamp-2`}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
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
                  className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full border border-white/10"
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
