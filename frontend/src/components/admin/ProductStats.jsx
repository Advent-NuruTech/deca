// src/components/admin/ProductStats.jsx
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
  const totalValue = products
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.price * (p.stockQuantity || 0), 0);

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-gray-800",
      delay: 0.1,
    },
    {
      title: "Active Products",
      value: products.filter((p) => p.status === "active").length,
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-gray-800",
      delay: 0.2,
    },
    {
      title: "Featured Products",
      value: products.filter((p) => p.featured).length,
      icon: Star,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-gray-800",
      delay: 0.3,
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => !p.inStock).length,
      icon: AlertCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-gray-800",
      delay: 0.4,
    },
    {
      title: "Total Value",
      value: `KSH ${totalValue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-gray-800",
      delay: 0.5,
    },
    {
      title: "Categories",
      value: [...new Set(products.map((p) => p.category))].length,
      icon: Package,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      textColor: "text-gray-800",
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
          {/* Subtle hover border effect (optional) */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

          <div className="relative bg-white rounded-xl shadow-sm p-4 border border-gray-100 group-hover:border-transparent transition-all duration-500">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`text-2xl font-bold ${stat.textColor}`}>
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductStats;
