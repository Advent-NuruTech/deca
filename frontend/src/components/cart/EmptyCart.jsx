// src/components/cart/EmptyCart.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

const EmptyCart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="inline-block mb-6"
      >
        <div className="w-32 h-32 rounded-full bg-emerald-50 flex items-center justify-center">
          <ShoppingBag size={64} className="text-emerald-500" />
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Your cart is empty
      </h2>

      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Start exploring
        our organic seeds and fresh produce!
      </p>

      <Link to="/products">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group inline-flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-md hover:bg-emerald-700 transition-all"
        >
          Browse Products
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default EmptyCart;
