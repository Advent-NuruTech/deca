// components/admin/QuickActions.jsx
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
      color: "from-purple-500 to-blue-500",
      description: "Add, edit or remove products",
    },
    {
      icon: FileText,
      label: "Manage Articles",
      path: "/admin/articles",
      color: "from-blue-500 to-cyan-500",
      description: "Create and publish articles",
    },
    {
      icon: ShoppingCart,
      label: "Manage Orders",
      path: "/admin/orders",
      color: "from-green-500 to-emerald-500",
      description: "View and process orders",
    },
    {
      icon: Users,
      label: "Manage Users",
      path: "/admin/users",
      color: "from-orange-500 to-red-500",
      description: "Customer management",
    },
    {
      icon: BarChart,
      label: "Analytics",
      path: "/admin/analytics",
      color: "from-pink-500 to-rose-500",
      description: "View site statistics",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
      color: "from-gray-500 to-gray-600",
      description: "Configure your store",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <h2 className="text-xl font-bold mb-6">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Quick Actions
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to={action.path}
              className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} p-2`}
                >
                  <action.icon className="w-full h-full text-white" />
                </div>
                <span className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {action.label}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{action.description}</p>
              <div className="flex items-center gap-1 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Go to {action.label}
                <ArrowRight size={12} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
