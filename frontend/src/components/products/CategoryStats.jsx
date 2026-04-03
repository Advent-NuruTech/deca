// components/products/CategoryStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Satellite,
  Network,
  Laptop,
  Smartphone,
  Code2,
  Sparkles,
} from "lucide-react";

const CategoryStats = ({ products }) => {
  const categories = [
    {
      name: "Starlink",
      icon: Satellite,
      color: "from-purple-500 to-blue-500",
      count: products.filter((p) => p.category === "starlink").length,
    },
    {
      name: "Networking",
      icon: Network,
      color: "from-blue-500 to-cyan-500",
      count: products.filter((p) => p.category === "networking").length,
    },
    {
      name: "Laptop",
      icon: Laptop,
      color: "from-green-500 to-emerald-500",
      count: products.filter((p) => p.category === "laptop").length,
    },
    {
      name: "Phone",
      icon: Smartphone,
      color: "from-orange-500 to-red-500",
      count: products.filter((p) => p.category === "phone").length,
    },
    {
      name: "Software",
      icon: Code2,
      color: "from-pink-500 to-rose-500",
      count: products.filter((p) => p.category === "software").length,
    },
    {
      name: "CCTV",
      icon: Sparkles,
      color: "from-red-500 to-orange-500",
      count: products.filter((p) => p.category === "cctv").length,
    },
    {
      name: "Routers",
      icon: Network,
      color: "from-yellow-500 to-orange-500",
      count: products.filter((p) => p.category === "router").length,
    },
    {
      name: "Access Points",
      icon: Satellite,
      color: "from-indigo-500 to-purple-500",
      count: products.filter((p) => p.category === "accesspoint").length,
    },
  ].filter((cat) => cat.count > 0);

  if (categories.length === 0) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">
          Quick Category Stats
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3 }}
            className="relative group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${cat.color} rounded-lg opacity-0 group-hover:opacity-20 transition-opacity`}
            />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${cat.color} p-1.5`}
                >
                  <cat.icon className="w-full h-full text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{cat.name}</p>
                  <p className="text-lg font-bold text-white">{cat.count}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryStats;
