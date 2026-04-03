// components/admin/OrderFilters.jsx
import React from "react";
import { motion } from "framer-motion";
import { Filter, X, Search } from "lucide-react";

const OrderFilters = ({ filters, setFilters, onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Filter Orders</h2>
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="" className="bg-gray-800">
              All Statuses
            </option>
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="" className="bg-gray-800">
              All Payment Statuses
            </option>
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

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClear}
            className="w-full bg-white/5 border border-white/10 text-gray-300 px-4 py-3 rounded-lg font-medium hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
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
          className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10"
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
