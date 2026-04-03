// components/admin/StatCard.jsx
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
  bgColor,
}) => {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    pink: "from-pink-500 to-pink-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  const bgColorClasses = {
    purple: "bg-purple-500/10",
    blue: "bg-blue-500/10",
    green: "bg-green-500/10",
    yellow: "bg-yellow-500/10",
    orange: "bg-orange-500/10",
    red: "bg-red-500/10",
    pink: "bg-pink-500/10",
    indigo: "bg-indigo-500/10",
  };

  const gradient = colorClasses[color] || colorClasses.purple;
  const bgClass = bgColorClasses[color] || bgColorClasses.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
      />

      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-transparent transition-all duration-500">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <p
              className={`text-3xl font-bold bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}
            >
              {value.toLocaleString()}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
        </div>

        {link && (
          <Link
            to={link}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors group/link"
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
