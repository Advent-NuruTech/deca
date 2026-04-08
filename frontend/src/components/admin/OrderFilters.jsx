// src/components/admin/OrderFilters.jsx
import React from "react";
import { motion } from "framer-motion";
import { Filter, X, Search } from "lucide-react";

const OrderFilters = ({ filters, setFilters, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-semibold text-gray-800">Filter Orders</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Order Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) =>
              setFilters({ ...filters, paymentStatus: e.target.value })
            }
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors cursor-pointer"
          >
            <option value="">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClear}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <X size={18} />
            Clear Filters
          </motion.button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.status || filters.paymentStatus) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100"
        >
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full border border-emerald-200">
              Status: {filters.status}
              <button
                onClick={() => setFilters({ ...filters, status: "" })}
                className="hover:text-emerald-900"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {filters.paymentStatus && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
              Payment: {filters.paymentStatus}
              <button
                onClick={() => setFilters({ ...filters, paymentStatus: "" })}
                className="hover:text-blue-900"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderFilters;
