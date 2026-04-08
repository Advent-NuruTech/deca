// src/components/order/OrderSummary.jsx
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
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      refunded: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Clock size={14} />;
      case "shipped":
        return <Package size={14} />;
      case "delivered":
      case "paid":
        return <CheckCircle size={14} />;
      case "cancelled":
      case "failed":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24"
    >
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Order Summary
        </h2>

        {/* Status Badges */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Order Status</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}
            >
              {getStatusIcon(order.orderStatus)}
              <span className="capitalize">{order.orderStatus}</span>
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Status</span>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}
            >
              {getStatusIcon(order.paymentStatus)}
              <span className="capitalize">{order.paymentStatus}</span>
            </motion.div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="text-gray-800 font-medium">
              $ {order.subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span
              className={
                order.shipping === 0 ? "text-emerald-600" : "text-gray-800"
              }
            >
              {order.shipping === 0
                ? "Free"
                : `$ ${order.shipping.toLocaleString()}`}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Payment Method</span>
            <span className="text-gray-800 font-medium capitalize">
              {order.paymentMethod?.replace("_", " ") || "Not specified"}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Shipping Method</span>
            <span className="text-gray-800 font-medium capitalize">
              {order.shippingMethod === "standard"
                ? "Standard Delivery"
                : order.shippingMethod === "express"
                  ? "Express Delivery"
                  : "Pickup from Store"}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
            <span className="text-gray-800">Total</span>
            <span className="text-xl text-emerald-700">
              $ {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Timeline/Next Steps */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-emerald-500" />
            What's Next?
          </h3>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-emerald-700 font-semibold">
                  1
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium">
                  Order Confirmation
                </p>
                <p className="text-xs text-gray-500">
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
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-700 font-semibold">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium">Payment</p>
                <p className="text-xs text-gray-500">
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
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-emerald-700 font-semibold">
                  3
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-800 font-medium">Shipping</p>
                <p className="text-xs text-gray-500">
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
