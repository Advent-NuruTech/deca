// components/admin/FeaturedProducts.jsx
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
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Featured Products
          </span>
        </h2>
        <p className="text-gray-400 mb-4">No featured products yet.</p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
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
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Featured Products
          </span>
        </h2>
        <Link
          to="/admin/products"
          className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
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
            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 group hover:border-purple-500/50 transition-all"
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              {product.images?.[0] ? (
                <img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Star size={16} className="text-purple-400" />
                </div>
              )}
              <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl">
                <Star size={10} fill="white" />
              </div>
            </div>

            <div className="flex-grow">
              <Link
                to={`/admin/products/edit/${product._id}`}
                className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1"
              >
                {product.name}
              </Link>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">
                  $ {product.price?.toLocaleString()}
                </span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span
                  className={`${product.status === "active" ? "text-green-400" : "text-gray-500"}`}
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
