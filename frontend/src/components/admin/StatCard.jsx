// src/components/admin/StatCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  link,
  linkText = "Manage",
}) => {
  // Color mappings for gradient borders (on hover) and icon backgrounds
  const colorMap = {
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    yellow: {
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    red: {
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-100",
      text: "text-red-600",
    },
    pink: {
      gradient: "from-pink-500 to-pink-600",
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    indigo: {
      gradient: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    emerald: {
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-100",
      text: "text-emerald-600",
    },
  };

  const selected = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      {/* Animated gradient border on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${selected.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
      />

      <div className="relative bg-white rounded-xl shadow-sm p-6 border border-gray-100 group-hover:border-transparent transition-all duration-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl ${selected.bg} flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${selected.text}`} />
          </div>
        </div>

        {link && (
          <Link
            to={link}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition-colors group/link"
          >
            {linkText}
            <ArrowRight
              size={14}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
