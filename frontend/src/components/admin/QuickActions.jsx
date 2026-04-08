// src/components/admin/QuickActions.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Package,
  FileText,
  ShoppingCart,
  Users,
  Settings,
  BarChart,
  ArrowRight,
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Package,
      label: "Manage Products",
      path: "/admin/products",
      color: "emerald",
      description: "Add, edit or remove products",
    },
    {
      icon: FileText,
      label: "Manage Articles",
      path: "/admin/articles",
      color: "blue",
      description: "Create and publish articles",
    },
    {
      icon: ShoppingCart,
      label: "Manage Orders",
      path: "/admin/orders",
      color: "green",
      description: "View and process orders",
    },
    {
      icon: Users,
      label: "Manage Users",
      path: "/admin/users",
      color: "orange",
      description: "Customer management",
    },
    {
      icon: BarChart,
      label: "Analytics",
      path: "/admin/analytics",
      color: "pink",
      description: "View site statistics",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
      color: "gray",
      description: "Configure your store",
    },
  ];

  // Color mapping for pastel backgrounds and icon colors
  const colorStyles = {
    emerald: {
      bg: "bg-emerald-100",
      icon: "text-emerald-600",
      hover: "hover:border-emerald-300",
      link: "text-emerald-500",
    },
    blue: {
      bg: "bg-blue-100",
      icon: "text-blue-600",
      hover: "hover:border-blue-300",
      link: "text-blue-500",
    },
    green: {
      bg: "bg-green-100",
      icon: "text-green-600",
      hover: "hover:border-green-300",
      link: "text-green-500",
    },
    orange: {
      bg: "bg-orange-100",
      icon: "text-orange-600",
      hover: "hover:border-orange-300",
      link: "text-orange-500",
    },
    pink: {
      bg: "bg-pink-100",
      icon: "text-pink-600",
      hover: "hover:border-pink-300",
      link: "text-pink-500",
    },
    gray: {
      bg: "bg-gray-100",
      icon: "text-gray-600",
      hover: "hover:border-gray-300",
      link: "text-gray-500",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const style = colorStyles[action.color] || colorStyles.emerald;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to={action.path}
                className={`block p-4 bg-gray-50 rounded-xl border border-gray-200 ${style.hover} transition-all group`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center`}
                  >
                    <action.icon className={`w-5 h-5 ${style.icon}`} />
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {action.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {action.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity">
                  Go to {action.label}
                  <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickActions;
