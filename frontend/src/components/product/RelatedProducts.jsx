// components/product/RelatedProducts.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";

const RelatedProducts = ({ products, currentProductId }) => {
  if (!products || products.length === 0) return null;

  const related = products
    .filter((p) => p._id !== currentProductId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            You Might Also Like
          </span>
        </h2>
        <Link
          to="/products"
          className="group flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
