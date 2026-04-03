// components/article/ArticleContent.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ArticleContent = ({ content, tags }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      {/* Article Content - Fixed with white text */}
      <div
        className="prose prose-lg max-w-none prose-invert"
        style={{
          color: "#ffffff", // Force white text
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: content,
            // Optional: If content has inline styles, you can strip them
            // .replace(/style="[^"]*"/g, '')
            // .replace(/color:[^;"]*;?/g, '')
          }}
          style={{
            color: "#ffffff", // Force white text for the content
          }}
        />
      </div>

      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30 hover:border-purple-500 transition-colors cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <Link to="/articles">
          <motion.div
            whileHover={{ x: -5 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Articles
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ArticleContent;
