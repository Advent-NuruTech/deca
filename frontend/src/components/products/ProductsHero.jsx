// components/products/ProductsHero.jsx
import React from "react";
import { motion } from "framer-motion";
import { Package, Sparkles } from "lucide-react";

const ProductsHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-40 right-40 text-purple-500/10 hidden lg:block"
      >
        <Package size={80} />
      </motion.div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-block mb-6"
        >
          <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-sm font-semibold text-purple-400">
            ✦ OUR COLLECTION ✦
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
            Our Products
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Discover cutting-edge technology solutions tailored to meet your needs
        </motion.p>
      </div>
    </section>
  );
};

export default ProductsHero;
