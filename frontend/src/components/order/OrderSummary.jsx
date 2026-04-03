// components/order/OrderSummary.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";

const OrderSummary = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      paid: "bg-green-500/20 text-green-400 border-green-500/30",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
      refunded: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Clock size={16} />;
      case "shipped":
        return <Package size={16} />;
      case "delivered":
      case "paid":
        return <CheckCircle size={16} />;
      case "cancelled":
      case "failed":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Order Summary
          </span>
        </h2>

        {/* Status Badges */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Order Status</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.orderStatus)}`}
            >
              {getStatusIcon(order.orderStatus)}
              <span className="capitalize">{order.orderStatus}</span>
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Payment Status</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.paymentStatus)}`}
            >
              {getStatusIcon(order.paymentStatus)}
              <span className="capitalize">{order.paymentStatus}</span>
            </motion.div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-white font-medium">
              $ {order.subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span
              className={order.shipping === 0 ? "text-green-400" : "text-white"}
            >
              {order.shipping === 0
                ? "Free"
                : `$ ${order.shipping.toLocaleString()}`}
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Payment Method</span>
            <span className="text-white font-medium capitalize">
              {order.paymentMethod.replace("_", " ")}
            </span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Shipping Method</span>
            <span className="text-white font-medium capitalize">
              {order.shippingMethod === "standard"
                ? "Standard Delivery"
                : order.shippingMethod === "express"
                  ? "Express Delivery"
                  : "Pickup from Store"}
            </span>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <span className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              $ {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Timeline/Next Steps */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={16} className="text-purple-400" />
            What's Next?
          </h3>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-purple-400">1</span>
              </div>
              <div>
                <p className="text-sm text-white">Order Confirmation</p>
                <p className="text-xs text-gray-400">
                  You'll receive an email confirmation shortly
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-400">2</span>
              </div>
              <div>
                <p className="text-sm text-white">Payment</p>
                <p className="text-xs text-gray-400">
                  {order.paymentMethod === "mpesa"
                    ? "Complete M-Pesa payment when prompted"
                    : order.paymentMethod === "cash_on_delivery"
                      ? "Pay cash when your order is delivered"
                      : "Complete payment via bank transfer"}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-green-400">3</span>
              </div>
              <div>
                <p className="text-sm text-white">Shipping</p>
                <p className="text-xs text-gray-400">
                  We'll notify you when your order ships
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
