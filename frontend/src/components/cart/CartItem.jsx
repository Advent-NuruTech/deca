// components/cart/CartItem.jsx
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
      {/* Animated border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-transparent transition-all duration-500">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            {item.images && item.images.length > 0 ? (
              <>
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-grow">
            <Link
              to={`/products/${item.slug}`}
              className="text-xl font-semibold text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 mb-2 inline-block transition-all"
            >
              {item.name}
            </Link>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Quantity:</span>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      onQuantityChange(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className={`px-3 py-2 rounded-l-lg transition-colors ${
                      item.quantity <= 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-white hover:bg-white/10"
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
                    className="w-16 text-center bg-transparent border-0 text-white focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      onQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-3 py-2 rounded-r-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
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
            className="absolute top-4 right-4 md:relative md:top-auto md:right-auto text-red-400 hover:text-red-300 transition-colors"
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
