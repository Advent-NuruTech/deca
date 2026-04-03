// components/CategoriesSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const CategoriesSection = ({ categoryInfo }) => {
  // Category-specific gradient colors
  const categoryGradients = {
    starlink: "from-purple-500 to-blue-500",
    networking: "from-blue-500 to-cyan-500",
    laptop: "from-green-500 to-emerald-500",
    cctv: "from-red-500 to-orange-500",
    router: "from-indigo-500 to-purple-500",
    phone: "from-pink-500 to-rose-500",
    software: "from-pink-500 to-rose-500",
    accesspoint: "from-yellow-500 to-amber-500",
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />

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
              ✦ PRODUCT CATEGORIES ✦
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
              Our Product Categories
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of technology solutions designed to meet all
            your needs
          </p>
        </AnimatedSection>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(categoryInfo).map(([key, info], index) => (
            <AnimatedSection key={key} delay={0.2 + index * 0.1} direction="up">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative h-full"
              >
                {/* Animated border gradient */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${categoryGradients[key] || "from-purple-500 to-blue-500"} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
                />

                <Link
                  to={`/products?category=${key}`}
                  className="relative block h-full bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 group-hover:border-transparent transition-all duration-500"
                >
                  {/* Image container */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={info.image}
                      alt={info.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60`}
                    />

                    {/* Icon with floating animation */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 text-6xl"
                    >
                      {info.icon}
                    </motion.div>

                    {/* Category badge */}
                    <motion.div
                      initial={{ x: -100 }}
                      animate={{ x: 0 }}
                      transition={{ delay: 0.5 }}
                      className={`absolute top-4 left-4 bg-gradient-to-r ${categoryGradients[key] || "from-purple-500 to-blue-500"} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                    >
                      {info.title}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className={`text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${categoryGradients[key] || "from-purple-400 to-blue-400"} transition-all duration-300`}
                    >
                      {info.title}
                    </h3>

                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {info.description}
                    </p>

                    {/* Explore link */}
                    <motion.span
                      whileHover={{ x: 5 }}
                      className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${categoryGradients[key] || "from-purple-400 to-blue-400"} text-transparent bg-clip-text group-hover:from-purple-400 group-hover:to-blue-400`}
                    >
                      Explore {info.title}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </motion.span>

                    {/* Decorative sparkle */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity }}
                      className="absolute bottom-4 right-4 text-purple-500/20"
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
