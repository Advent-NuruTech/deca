"use client";

// src/components/products/ProductsHero.jsx
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";

const ProductsHero = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-50 to-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex p-3 bg-emerald-100 rounded-full mb-6">
            <Sprout className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From Our Farm to Your Table
          </h1>
          <p className="text-lg text-gray-600">
            Organic seeds, fresh produce, and farm products grown with prayer
            and care. Nourish your family the natural way.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsHero;
