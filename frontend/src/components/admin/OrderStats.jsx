// src/components/admin/OrderStats.jsx
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
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-gray-800",
      delay: 0.1,
    },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.orderStatus === "pending").length,
      icon: Clock,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
      textColor: "text-gray-800",
      delay: 0.2,
    },
    {
      title: "Processing",
      value: orders.filter((o) => o.orderStatus === "processing").length,
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-gray-800",
      delay: 0.3,
    },
    {
      title: "Delivered",
      value: orders.filter((o) => o.orderStatus === "delivered").length,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-gray-800",
      delay: 0.4,
    },
    {
      title: "Cancelled",
      value: orders.filter((o) => o.orderStatus === "cancelled").length,
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      textColor: "text-gray-800",
      delay: 0.5,
    },
    {
      title: "Total Revenue",
      value: `KSH ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
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
          <div className="relative bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span className={`text-2xl font-bold ${stat.textColor}`}>
                {typeof stat.value === "number" ? stat.value : stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrderStats;
