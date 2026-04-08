// src/components/order/OrderItems.jsx
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
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-5">
        <Package className="w-5 h-5 text-emerald-500" />
        <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

            <div className="relative bg-white rounded-xl p-4 border border-gray-100 group-hover:border-transparent transition-all shadow-sm">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ShoppingBag size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-bl-lg">
                    {item.quantity}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    $ {item.price.toLocaleString()} each
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Subtotal:{" "}
                      <span className="text-gray-800 font-medium">
                        $ {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </p>
                    <span className="text-xs text-gray-400">
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
