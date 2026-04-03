// components/cart/CartSummary.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Shield, ArrowRight } from "lucide-react";

const CartSummary = ({ subtotal, itemCount, onClearCart }) => {
  const features = [
    { icon: Truck, text: "Free shipping on orders over $ 50,000" },
    { icon: Shield, text: "Secure checkout guaranteed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Order Summary
          </span>
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-400">
            <span>
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="text-white font-medium">
              $ {subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span className="text-green-400">Free</span>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between text-lg">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                $ {subtotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <feature.icon size={14} className="text-purple-400" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/checkout">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                animate={{ x: ["0%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </motion.button>
          </Link>

          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Continue Shopping
            </motion.button>
          </Link>
        </div>

        {/* Clear Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearCart}
          className="w-full text-sm text-red-400 hover:text-red-300 mt-4 transition-colors"
        >
          Clear Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CartSummary;
