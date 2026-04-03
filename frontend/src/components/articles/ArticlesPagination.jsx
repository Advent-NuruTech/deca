// components/articles/ArticlesPagination.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ArticlesPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
          currentPage === 1
            ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
            : "bg-gray-800/50 text-white hover:bg-purple-500/20 border border-white/10 hover:border-purple-500"
        }`}
      >
        <ChevronLeft size={18} />
      </motion.button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="w-10 h-10 flex items-center justify-center text-gray-500">
              ...
            </span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/50 text-gray-400 hover:text-white border border-white/10 hover:border-purple-500"
              }`}
            >
              {page}
            </motion.button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
          currentPage === totalPages
            ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
            : "bg-gray-800/50 text-white hover:bg-purple-500/20 border border-white/10 hover:border-purple-500"
        }`}
      >
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
};

export default ArticlesPagination;
