"use client";

import type { PublicProduct } from "@/lib/types";

// src/components/products/CategoryStats.jsx
const CategoryStats = ({ products }: { products: PublicProduct[] }) => {
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const labels: Record<string, string> = {
    seeds: "Organic Seeds",
    produce: "Fresh Produce",
    other: "Other",
  };
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {Object.entries(counts).map(([cat, count]) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
        >
          {labels[cat] || cat}: {count}
        </span>
      ))}
    </div>
  );
};

export default CategoryStats;
