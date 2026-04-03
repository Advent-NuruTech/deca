// components/RecentArticles.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Newspaper, Calendar } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import ArticleCard from "./articles/ArticleCard";
const RecentArticles = ({ recentArticles, articlesLoading }) => {
  if (!recentArticles.length && !articlesLoading) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      {/* Floating icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-40 left-20 text-purple-500/10 hidden lg:block"
      >
        <Newspaper size={100} />
      </motion.div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection
          delay={0.1}
          direction="fade"
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-4"
          >
            <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-semibold text-purple-400">
              📰 LATEST UPDATES
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
              Latest News & Articles
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest technology trends and insights
          </p>
        </AnimatedSection>

        {articlesLoading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-gray-400">Loading articles...</p>
          </div>
        ) : (
          <AnimatedSection delay={0.2} direction="up">
            <>
              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {recentArticles.map((article, index) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <ArticleCard article={article} />
                  </motion.div>
                ))}
              </div>

              {/* View All Link */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Link
                    to="/articles"
                    className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/5 transition-all duration-300"
                  >
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                      Read All Articles
                    </span>
                    <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              {/* Article count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center gap-2 mt-8 text-gray-500"
              >
                <Calendar size={16} />
                <span className="text-sm">
                  {recentArticles.length} new articles this month
                </span>
              </motion.div>
            </>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default RecentArticles;
