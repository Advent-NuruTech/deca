// components/checkout/OrderSummary.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Shield, ArrowLeft } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const OrderSummary = ({ cartItems, subtotal, shipping, total, onBack }) => {
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

        {/* Cart Items */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {cartItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 group"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={getImageUrl(item.images[0])}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-purple-400" />
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">
                  {item.quantity}
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500">
                  $ {item.price.toLocaleString()} each
                </p>
                <p className="text-sm font-bold text-purple-400 mt-1">
                  $ {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal ({cartItems.length} items)</span>
            <span className="text-white">$ {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-green-400" : "text-white"}>
              {shipping === 0 ? "Free" : `$ ${shipping.toLocaleString()}`}
            </span>
          </div>

          {/* Shipping Features */}
          <div className="bg-white/5 rounded-lg p-3 space-y-2 mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Truck size={14} className="text-purple-400" />
              <span>Free shipping on orders over $ 50,000</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield size={14} className="text-purple-400" />
              <span>Secure payment guaranteed</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <span className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              $ {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Back to Cart Link */}
        <Link to="/cart">
          <motion.div
            whileHover={{ x: -5 }}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors mt-4"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
