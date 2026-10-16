"use client";

// src/components/products/ProductsGrid.jsx
import ProductCard from "./ProductCard";
import type { PublicProduct } from "@/lib/types";

const ProductsGrid = ({ products, loading }: { products: PublicProduct[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600" />
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsGrid;
