// components/admin/OrderStats.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const OrderStats = ({ orders }) => {
  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      delay: 0.1,
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.orderStatus === "pending").length,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      delay: 0.2,
    },
    {
      title: "Processing",
      value: orders.filter((o) => o.orderStatus === "processing").length,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      delay: 0.3,
    },
    {
      title: "Delivered",
      value: orders.filter((o) => o.orderStatus === "delivered").length,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      delay: 0.4,
    },
    {
      title: "Cancelled",
      value: orders.filter((o) => o.orderStatus === "cancelled").length,
      icon: XCircle,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      delay: 0.5,
    },
    {
      title: "Total Revenue",
      value: `$ ${orders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.total, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
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

export default OrderStats;
