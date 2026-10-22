"use client";

import type { ProductCategory, PublicProduct } from "@/lib/types";

// src/components/products/CategoryStats.jsx
const CategoryStats = ({ products, categories }: { products: PublicProduct[]; categories: ProductCategory[] }) => {
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const labels = new Map(categories.map((category) => [category.id, category.name]));
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {Object.entries(counts).map(([cat, count]) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
        >
          {labels.get(cat) || "Other"}: {count}
        </span>
      ))}
    </div>
  );
};

export default CategoryStats;
