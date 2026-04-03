// components/admin/OrderDetailsModal.jsx
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
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
              <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-4xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold">
                      <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                        Order Details
                      </span>
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Order Number & Date */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Order Number</p>
                      <p className="text-xl font-bold text-white">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={16} />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Order Status</p>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          onUpdateStatus(
                            order._id,
                            "orderStatus",
                            e.target.value,
                          )
                        }
                        className={`text-sm font-semibold rounded-full px-4 py-2 border ${getStatusColor(
                          order.orderStatus,
                        )} focus:outline-none cursor-pointer`}
                      >
                        <option value="pending" className="bg-gray-800">
                          Pending
                        </option>
                        <option value="processing" className="bg-gray-800">
                          Processing
                        </option>
                        <option value="shipped" className="bg-gray-800">
                          Shipped
                        </option>
                        <option value="delivered" className="bg-gray-800">
                          Delivered
                        </option>
                        <option value="cancelled" className="bg-gray-800">
                          Cancelled
                        </option>
                      </select>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">
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
                        className={`text-sm font-semibold rounded-full px-4 py-2 border ${getStatusColor(
                          order.paymentStatus,
                        )} focus:outline-none cursor-pointer`}
                      >
                        <option value="pending" className="bg-gray-800">
                          Pending
                        </option>
                        <option value="paid" className="bg-gray-800">
                          Paid
                        </option>
                        <option value="failed" className="bg-gray-800">
                          Failed
                        </option>
                        <option value="refunded" className="bg-gray-800">
                          Refunded
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <User size={16} className="text-purple-400" />
                        Customer Details
                      </h3>
                      <div className="space-y-2">
                        <p className="text-white font-medium">
                          {order.customer.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-gray-500" />
                          <span className="text-gray-300">
                            {order.customer.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} className="text-gray-500" />
                          <span className="text-gray-300">
                            {order.customer.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <MapPin size={16} className="text-purple-400" />
                        Shipping Address
                      </h3>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p>{order.customer.address.street}</p>
                        <p>
                          {order.customer.address.city},{" "}
                          {order.customer.address.county}
                        </p>
                        {order.customer.address.postalCode && (
                          <p>{order.customer.address.postalCode}</p>
                        )}
                        <p>South Sudan</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <CreditCard size={16} className="text-purple-400" />
                        Payment Method
                      </h3>
                      <p className="text-white capitalize">
                        {order.paymentMethod.replace("_", " ")}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Truck size={16} className="text-purple-400" />
                        Shipping Method
                      </h3>
                      <p className="text-white capitalize">
                        {order.shippingMethod === "standard"
                          ? "Standard Delivery"
                          : order.shippingMethod === "express"
                            ? "Express Delivery"
                            : "Pickup from Store"}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Package size={16} className="text-purple-400" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-white/10 last:border-0"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-purple-400 font-semibold">
                            $ {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">
                          $ {order.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-white">
                          {order.shipping === 0
                            ? "Free"
                            : `$ ${order.shipping.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between text-lg font-bold">
                        <span className="text-white">Total</span>
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                          $ {order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
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
