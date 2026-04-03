// components/articles/ArticlesGrid.jsx
import React from "react";
import { motion } from "framer-motion";
import { Newspaper, Frown } from "lucide-react";
import ArticleCard from "./ArticleCard";

const ArticlesGrid = ({ articles, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-gray-400">Loading amazing articles...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Newspaper size={60} className="text-gray-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">
          No articles found
        </h3>
        <p className="text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <ArticleCard key={article._id} article={article} index={index} />
      ))}
    </div>
  );
};

export default ArticlesGrid;
