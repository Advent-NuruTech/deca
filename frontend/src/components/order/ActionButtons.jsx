// components/order/ActionButtons.jsx
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
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <ShoppingBag size={18} />
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <motion.div
            animate={{ x: ["0%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </motion.button>
      </Link>

      <Link to="/contact" className="flex-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
        >
          <Headphones size={18} />
          Contact Support
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default ActionButtons;
