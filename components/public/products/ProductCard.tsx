"use client";

// src/components/products/ProductCard.jsx
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import type { MouseEvent } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/components/providers/CartProvider";
import type { PublicProduct } from "@/lib/types";
import { richTextToPlainText } from "@/lib/rich-text";

const ProductCard = ({ product, index }: { product: PublicProduct; index: number }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success("Added to cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="block">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {product.images?.[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold px-3 py-1 bg-red-600 rounded-full text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-800 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-emerald-700 font-bold text-lg mt-1">
            ${product.price}
          </p>
          <p className="text-gray-500 text-sm line-clamp-2 mt-2">
            {richTextToPlainText(product.description)}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
