// components/admin/OrderFilters.jsx
import React from "react";
import { motion } from "framer-motion";
import { Filter, X, Search } from "lucide-react";

const OrderFilters = ({ filters, setFilters, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-500 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Order Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Order Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="" className="bg-white">
              All Statuses
            </option>
            <option value="pending" className="bg-white">
              Pending
            </option>
            <option value="processing" className="bg-white">
              Processing
            </option>
            <option value="shipped" className="bg-white">
              Shipped
            </option>
            <option value="delivered" className="bg-white">
              Delivered
            </option>
            <option value="cancelled" className="bg-white">
              Cancelled
            </option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) =>
              setFilters({ ...filters, paymentStatus: e.target.value })
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="" className="bg-white">
              All Payment Statuses
            </option>
            <option value="pending" className="bg-white">
              Pending
            </option>
            <option value="paid" className="bg-white">
              Paid
            </option>
            <option value="failed" className="bg-white">
              Failed
            </option>
            <option value="refunded" className="bg-white">
              Refunded
            </option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClear}
            className="w-full bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
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
          className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200"
        >
          <span className="text-sm text-gray-400">Active filters:</span>
          {filters.status && (
            <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-400 text-sm px-3 py-1 rounded-full border border-purple-500/30">
              Status: {filters.status}
              <button onClick={() => setFilters({ ...filters, status: "" })}>
                <X size={14} />
              </button>
            </span>
          )}
          {filters.paymentStatus && (
            <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/30">
              Payment: {filters.paymentStatus}
              <button
                onClick={() => setFilters({ ...filters, paymentStatus: "" })}
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
