// src/components/checkout/OrderSummary.jsx
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
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Order Summary
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
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={getImageUrl(item.images[0])}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-lg">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-sm text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500">
                  $ {item.price.toLocaleString()} each
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-1">
                  $ {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({cartItems.length} items)</span>
            <span className="text-gray-800">$ {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span
              className={shipping === 0 ? "text-emerald-600" : "text-gray-800"}
            >
              {shipping === 0 ? "Free" : `$ ${shipping.toLocaleString()}`}
            </span>
          </div>

          {/* Shipping Features */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 mt-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck size={14} className="text-emerald-500" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield size={14} className="text-emerald-500" />
              <span>Secure payment guaranteed</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
            <span className="text-gray-800">Total</span>
            <span className="text-xl text-emerald-700">
              $ {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Back to Cart Link */}
        <Link to="/cart">
          <motion.div
            whileHover={{ x: -5 }}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mt-4"
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
