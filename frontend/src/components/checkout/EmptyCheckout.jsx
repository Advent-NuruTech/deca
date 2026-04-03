// components/checkout/EmptyCheckout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

const EmptyCheckout = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-16 text-center border border-white/10"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="inline-block mb-6"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          <ShoppingBag size={64} className="text-purple-400" />
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold mb-4">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Your cart is empty
        </span>
      </h2>

      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Add some amazing products to your cart before proceeding to checkout
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/products")}
        className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-purple-500/30 hover:shadow-2xl transition-all"
      >
        Browse Products
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

export default EmptyCheckout;
