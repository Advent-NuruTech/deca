// src/components/order/ActionButtons.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Headphones, ArrowRight } from "lucide-react";

const ActionButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
    >
      <Link to="/products" className="flex-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 group relative overflow-hidden shadow-sm hover:bg-emerald-700 transition"
        >
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingBag size={18} />
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </Link>

      <Link to="/contact" className="flex-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Headphones size={18} />
          Contact Support
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default ActionButtons;
