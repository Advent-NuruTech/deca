// src/components/checkout/EmptyCheckout.jsx
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
      className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="inline-block mb-6"
      >
        <div className="w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center">
          <ShoppingBag size={56} className="text-emerald-500" />
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold mb-3 text-gray-800">
        Your cart is empty
      </h2>

      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Add some amazing organic products to your cart before proceeding to
        checkout
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/products")}
        className="group inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-emerald-700 transition-all"
      >
        Browse Products
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};

export default EmptyCheckout;
