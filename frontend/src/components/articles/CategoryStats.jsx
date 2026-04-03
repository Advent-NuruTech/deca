// components/articles/CategoryStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Newspaper,
  BookOpen,
  Star,
  TrendingUp,
  Zap,
  Sparkles,
} from "lucide-react";

const CategoryStats = ({ articles }) => {
  const categories = [
    {
      name: "News",
      icon: Newspaper,
      color: "from-blue-400 to-blue-500",
      count: articles.filter((a) => a.category === "news").length,
    },
    {
      name: "Tutorials",
      icon: BookOpen,
      color: "from-green-400 to-green-500",
      count: articles.filter((a) => a.category === "tutorial").length,
    },
    {
      name: "Reviews",
      icon: Star,
      color: "from-purple-400 to-purple-500",
      count: articles.filter((a) => a.category === "product-review").length,
    },
    {
      name: "Updates",
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      count: articles.filter((a) => a.category === "company-update").length,
    },
    {
      name: "Tips",
      icon: Zap,
      color: "from-pink-400 to-pink-500",
      count: articles.filter((a) => a.category === "tech-tips").length,
    },
  ].filter((cat) => cat.count > 0);

  if (categories.length === 0) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3 }}
            className="relative group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${cat.color} rounded-lg opacity-0 group-hover:opacity-20 transition-opacity`}
            />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${cat.color} p-1.5`}
                >
                  <cat.icon className="w-full h-full text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{cat.name}</p>
                  <p className="text-lg font-bold text-white">{cat.count}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryStats;
