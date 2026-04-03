// components/admin/ProductStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Star,
  Clock,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const ProductStats = ({ products }) => {
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      delay: 0.1,
    },
    {
      title: "Active Products",
      value: products.filter((p) => p.status === "active").length,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      delay: 0.2,
    },
    {
      title: "Featured Products",
      value: products.filter((p) => p.featured).length,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      delay: 0.3,
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => !p.inStock).length,
      icon: AlertCircle,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      delay: 0.4,
    },
    {
      title: "Total Value",
      value: `$ ${products
        .filter((p) => p.status === "active")
        .reduce((sum, p) => sum + p.price * (p.stockQuantity || 0), 0)
        .toLocaleString()}`,
      icon: DollarSign,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      delay: 0.5,
    },
    {
      title: "Categories",
      value: [...new Set(products.map((p) => p.category))].length,
      icon: Package,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-400",
      delay: 0.6,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          whileHover={{ y: -5 }}
          className="relative group"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
          />

          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:border-transparent transition-all duration-500">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <span className={`text-2xl font-bold ${stat.textColor}`}>
                {typeof stat.value === "number"
                  ? stat.value
                  : stat.value.split(" ")[1]}
              </span>
            </div>
            <p className="text-sm text-gray-400">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductStats;
