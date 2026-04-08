// src/components/admin/OrdersTable.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";

const OrdersTable = ({ orders = [], onUpdateStatus }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
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

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      refunded: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getCustomerName = (order) =>
    order?.customer?.name || "Unknown Customer";
  const getCustomerEmail = (order) => order?.customer?.email || "N/A";
  const getCustomerPhone = (order) => order?.customer?.phone || "N/A";
  const getCustomerAddress = (order) => {
    const address = order?.customer?.address;
    if (!address) return "No address provided";
    return (
      `${address.street || ""}, ${address.city || ""} ${address.county || ""}`.trim() ||
      "No address provided"
    );
  };
  const getOrderNumber = (order) =>
    order?.orderNumber || order?._id?.slice(-8) || "N/A";
  const getItemsList = (order) => order?.items || [];
  const getTotal = (order) => order?.total ?? 0;

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
      >
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Orders Found
        </h3>
        <p className="text-gray-500">
          There are no orders to display at the moment.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, index) => {
                if (!order) return null;
                return (
                  <React.Fragment key={order._id || index}>
                    <motion.tr
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === order._id ? null : order._id,
                        )
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-emerald-500" />
                          <span className="text-sm font-medium text-gray-800">
                            {getOrderNumber(order)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {getCustomerName(order)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {getItemsList(order).length} item(s)
                        </div>
                        <div className="text-xs text-gray-500">
                          {getItemsList(order)
                            .slice(0, 2)
                            .map((item) => item?.name || "Unknown")
                            .join(", ")}
                          {getItemsList(order).length > 2 && "..."}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-emerald-700">
                          KSH {getTotal(order).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.orderStatus || "pending"}
                          onChange={(e) => {
                            e.stopPropagation();
                            onUpdateStatus?.(
                              order._id,
                              "orderStatus",
                              e.target.value,
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border ${getStatusColor(
                            order.orderStatus,
                          )} focus:outline-none cursor-pointer bg-white`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.paymentStatus || "pending"}
                          onChange={(e) => {
                            e.stopPropagation();
                            onUpdateStatus?.(
                              order._id,
                              "paymentStatus",
                              e.target.value,
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border ${getPaymentStatusColor(
                            order.paymentStatus,
                          )} focus:outline-none cursor-pointer bg-white`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(order);
                            }}
                            className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </motion.button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRow(
                                expandedRow === order._id ? null : order._id,
                              );
                            }}
                            className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                          >
                            {expandedRow === order._id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Row Details */}
                    <AnimatePresence>
                      {expandedRow === order._id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan="8" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Customer Details */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <User
                                    size={16}
                                    className="text-emerald-500"
                                  />
                                  Customer Details
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail size={14} className="text-gray-400" />
                                    <span className="text-gray-700">
                                      {getCustomerEmail(order)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone
                                      size={14}
                                      className="text-gray-400"
                                    />
                                    <span className="text-gray-700">
                                      {getCustomerPhone(order)}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2 text-sm">
                                    <MapPin
                                      size={14}
                                      className="text-gray-400 mt-1"
                                    />
                                    <span className="text-gray-700">
                                      {getCustomerAddress(order)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Payment & Shipping */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <CreditCard
                                    size={16}
                                    className="text-emerald-500"
                                  />
                                  Payment & Shipping
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <CreditCard
                                      size={14}
                                      className="text-gray-400"
                                    />
                                    <span className="text-gray-700 capitalize">
                                      {order.paymentMethod?.replace("_", " ") ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Truck
                                      size={14}
                                      className="text-gray-400"
                                    />
                                    <span className="text-gray-700 capitalize">
                                      {order.shippingMethod || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <Package
                                    size={16}
                                    className="text-emerald-500"
                                  />
                                  Items
                                </h4>
                                <div className="space-y-2">
                                  {getItemsList(order).map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-gray-700">
                                        {item?.name || "Unknown"} x{" "}
                                        {item?.quantity || 0}
                                      </span>
                                      <span className="text-emerald-700 font-medium">
                                        KSH{" "}
                                        {(
                                          (item?.price || 0) *
                                          (item?.quantity || 0)
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                  {getItemsList(order).length === 0 && (
                                    <span className="text-gray-500">
                                      No items
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

export default OrdersTable;
