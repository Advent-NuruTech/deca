"use client";

// src/components/products/ProductsFilter.jsx
import { Search } from "lucide-react";
import type { Dispatch, FormEventHandler, SetStateAction } from "react";

type ProductsFilterProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: (category: string) => void;
  categories: { value: string; label: string }[];
  onSearch: FormEventHandler<HTMLFormElement>;
  totalProducts: number;
};

const ProductsFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  onSearch,
  totalProducts,
}: ProductsFilterProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.value
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <form onSubmit={onSearch} className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </form>
      </div>
      <div className="mt-3 text-right text-sm text-gray-500">
        {totalProducts} product{totalProducts !== 1 ? "s" : ""} found
      </div>
    </div>
  );
};

export default ProductsFilter;
