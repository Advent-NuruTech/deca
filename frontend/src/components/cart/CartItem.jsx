// src/components/cart/CartItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const CartItem = ({ item, onRemove, onQuantityChange, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="group relative"
    >
      {/* Animated border (emerald) */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

      <div className="relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 group-hover:border-transparent transition-all duration-500">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {item.images && item.images.length > 0 ? (
              <>
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-grow">
            <Link
              to={`/products/${item.slug}`}
              className="text-xl font-semibold text-gray-800 hover:text-emerald-600 transition-colors mb-2 inline-block"
            >
              {item.name}
            </Link>

            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Quantity:</span>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      onQuantityChange(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className={`px-3 py-2 rounded-l-lg transition-colors ${
                      item.quantity <= 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Minus size={16} />
                  </motion.button>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange(item._id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center bg-transparent border-0 text-gray-800 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      onQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-3 py-2 rounded-r-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-700">
                  $ {(item.price * item.quantity).toLocaleString()}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-500">
                    $ {item.price.toLocaleString()} each
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(item._id, item.name)}
            className="absolute top-4 right-4 md:relative md:top-auto md:right-auto text-red-500 hover:text-red-600 transition-colors"
            title="Remove from cart"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
