// src/components/admin/ArticleStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Globe,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";

const ArticleStats = ({ articles }) => {
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;

  const stats = [
    {
      title: "Total Articles",
      value: articles.length,
      icon: FileText,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-gray-800",
      delay: 0.1,
    },
    {
      title: "Published",
      value: publishedCount,
      icon: Globe,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-gray-800",
      delay: 0.2,
    },
    {
      title: "Drafts",
      value: draftCount,
      icon: Clock,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-gray-800",
      delay: 0.3,
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-gray-800",
      delay: 0.4,
    },
    {
      title: "Categories",
      value: [...new Set(articles.map((a) => a.category))].length,
      icon: TrendingUp,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      textColor: "text-gray-800",
      delay: 0.5,
    },
    {
      title: "This Month",
      value: articles.filter((a) => {
        const date = new Date(a.createdAt);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: Calendar,
      bgColor: "bg-rose-100",
      iconColor: "text-rose-600",
      textColor: "text-gray-800",
      delay: 0.6,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          whileHover={{ y: -5 }}
          className="relative group"
        >
          {/* Subtle shadow on hover instead of glow */}
          <div className="relative bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`text-2xl font-bold ${stat.textColor}`}>
                {typeof stat.value === "number" ? stat.value : stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ArticleStats;
