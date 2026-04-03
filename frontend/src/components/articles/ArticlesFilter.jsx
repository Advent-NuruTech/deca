// components/articles/ArticlesFilter.jsx
import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Calendar, TrendingUp } from "lucide-react";

const ArticlesFilter = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  onSearch,
  totalArticles,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Filter Articles</h2>
        </div>
        {totalArticles > 0 && (
          <span className="text-sm text-gray-400">
            <span className="text-purple-400 font-semibold">
              {totalArticles}
            </span>{" "}
            articles found
          </span>
        )}
      </div>

      <form onSubmit={onSearch}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Select - Desktop */}
          <div className="hidden md:block md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  className="bg-gray-800"
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white hover:bg-white/10 transition-colors"
          >
            <Filter size={18} />
            {showFilters ? "Hide Categories" : "Show Categories"}
          </button>

          {/* Search Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Search size={18} />
              Search
            </span>
            <motion.div
              animate={{ x: ["0%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </motion.button>
        </div>

        {/* Mobile Category Select */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4"
          >
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setShowFilters(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  className="bg-gray-800"
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </form>

      {/* Active Filters */}
      {(category || search) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10"
        >
          <span className="text-sm text-gray-400">Active filters:</span>
          {category && (
            <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 text-sm px-3 py-1 rounded-full border border-purple-500/30">
              {categories.find((c) => c.value === category)?.label}
              <button onClick={() => setCategory("")}>
                <X size={14} />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30">
              "{search}"
              <button onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setCategory("");
              setSearch("");
            }}
            className="text-sm text-gray-500 hover:text-white transition-colors ml-2"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ArticlesFilter;
