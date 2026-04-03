// components/article/ArticleSidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  User,
  Eye,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

const ArticleSidebar = ({ article, formatDate }) => {
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const relatedArticles = [
    {
      title: "Getting Started with Starlink in South Sudan",
      slug: "#",
      date: "2024-01-15",
    },
    {
      title: "Top 5 Networking Tips for Businesses",
      slug: "#",
      date: "2024-01-10",
    },
    { title: "Understanding 5G Technology", slug: "#", date: "2024-01-05" },
  ];

  return (
    <div className="space-y-6">
      {/* Author Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          About the Author
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            {article.author?.name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="text-white font-medium">
              {article.author?.name || "Admin"}
            </p>
            <p className="text-sm text-gray-400">Tech Writer</p>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Passionate about technology and helping businesses leverage digital
          solutions for growth.
        </p>
      </motion.div>

      {/* Article Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Article Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Calendar size={14} className="text-purple-400" />
              Published
            </span>
            <span className="text-white">
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Clock size={14} className="text-blue-400" />
              Read time
            </span>
            <span className="text-white">
              {Math.ceil(article.content?.split(/\s+/).length / 200) || 3} min
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-2">
              <Eye size={14} className="text-green-400" />
              Views
            </span>
            <span className="text-white">{article.views || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Engagement Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-around">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center gap-1"
          >
            <ThumbsUp
              size={20}
              className={
                liked ? "text-purple-400 fill-purple-400" : "text-gray-400"
              }
            />
            <span className="text-xs text-gray-400">
              {liked ? "Liked" : "Like"}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1"
          >
            <MessageCircle size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">Comment</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSaved(!saved)}
            className="flex flex-col items-center gap-1"
          >
            <Bookmark
              size={20}
              className={
                saved ? "text-blue-400 fill-blue-400" : "text-gray-400"
              }
            />
            <span className="text-xs text-gray-400">
              {saved ? "Saved" : "Save"}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-1"
          >
            <Share2 size={20} className="text-gray-400" />
            <span className="text-xs text-gray-400">Share</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Related Articles */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Related Articles
        </h3>
        <div className="space-y-4">
          {relatedArticles.map((item, index) => (
            <Link key={index} to={item.slug}>
              <motion.div
                whileHover={{ x: 5 }}
                className="group cursor-pointer"
              >
                <p className="text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(item.date)}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleSidebar;
