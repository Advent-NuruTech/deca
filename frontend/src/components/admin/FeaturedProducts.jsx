// src/components/admin/FeaturedProducts.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const FeaturedProducts = ({ products }) => {
  const featured = products.filter((p) => p.featured).slice(0, 5);

  if (featured.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 border-l-3 border-emerald-500 pl-3 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-500 mb-4">No featured products yet.</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Manage Products
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 border-l-3 border-emerald-500 pl-3">
          Featured Products
        </h2>
        <Link
          to="/admin/products"
          className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {featured.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-emerald-200 transition-all"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {product.images?.[0] ? (
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Star size={16} className="text-gray-400" />
                </div>
              )}
              <div className="absolute top-0 right-0 bg-amber-400 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl">
                <Star size={10} fill="white" />
              </div>
            </div>

            <div className="flex-grow">
              <Link
                to={`/admin/products/edit/${product._id}`}
                className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-1"
              >
                {product.name}
              </Link>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 font-medium">
                  KSH {product.price?.toLocaleString()}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span
                  className={`${product.status === "active" ? "text-green-600" : "text-gray-500"}`}
                >
                  {product.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedProducts;
