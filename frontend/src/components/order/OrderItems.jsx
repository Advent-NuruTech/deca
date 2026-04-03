// components/order/OrderItems.jsx
import React from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const OrderItems = ({ items }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Order Items
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

            <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:border-transparent transition-all">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <ShoppingBag size={24} className="text-purple-400" />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-bl-lg">
                    {item.quantity}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    $ {item.price.toLocaleString()} each
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-400">
                      Subtotal:{" "}
                      <span className="text-white font-medium">
                        $ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">
                      Item {index + 1} of {items.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrderItems;
