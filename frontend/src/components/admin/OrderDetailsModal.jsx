// src/components/admin/OrderDetailsModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  DollarSign,
} from "lucide-react";

const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center">
              <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-4xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold">
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
                        Order Details
                      </span>
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Order Number & Date */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="text-xl font-bold text-gray-800">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Order Status</p>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          onUpdateStatus(
                            order._id,
                            "orderStatus",
                            e.target.value,
                          )
                        }
                        className={`text-sm font-semibold rounded-full px-4 py-1.5 border focus:outline-none cursor-pointer bg-white ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Payment Status
                      </p>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          onUpdateStatus(
                            order._id,
                            "paymentStatus",
                            e.target.value,
                          )
                        }
                        className={`text-sm font-semibold rounded-full px-4 py-1.5 border focus:outline-none cursor-pointer bg-white ${getStatusColor(
                          order.paymentStatus,
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <User size={16} className="text-emerald-500" />
                        Customer Details
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-800 font-medium">
                          {order.customer?.name || "N/A"}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-gray-700">
                            {order.customer?.email || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-gray-700">
                            {order.customer?.phone || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin size={16} className="text-emerald-500" />
                        Shipping Address
                      </h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>{order.customer?.address?.street || "N/A"}</p>
                        <p>
                          {order.customer?.address?.city || ""}{" "}
                          {order.customer?.address?.county || ""}
                        </p>
                        {order.customer?.address?.postalCode && (
                          <p>{order.customer?.address?.postalCode}</p>
                        )}
                        <p>Kenya</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <CreditCard size={16} className="text-emerald-500" />
                        Payment Method
                      </h3>
                      <p className="text-gray-800 capitalize">
                        {order.paymentMethod?.replace("_", " ") || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Truck size={16} className="text-emerald-500" />
                        Shipping Method
                      </h3>
                      <p className="text-gray-800 capitalize">
                        {order.shippingMethod === "standard"
                          ? "Standard Delivery"
                          : order.shippingMethod === "express"
                            ? "Express Delivery"
                            : "Pickup from Store"}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Package size={16} className="text-emerald-500" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                        >
                          <div>
                            <p className="text-gray-800 font-medium">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-emerald-700 font-semibold">
                            KSH {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800">
                          KSH {order.subtotal?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-800">
                          {order.shipping === 0
                            ? "Free"
                            : `KSH ${order.shipping?.toLocaleString() || 0}`}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold">
                        <span className="text-gray-800">Total</span>
                        <span className="text-emerald-700">
                          KSH {order.total?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
