// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import SEO from "../../components/SEO";
import OrderStats from "../../components/admin/OrderStats";
import OrderFilters from "../../components/admin/OrderFilters";
import OrdersTable from "../../components/admin/OrdersTable";
import { ShoppingBag, Sparkles } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;

      const { data } = await api.get("/orders", { params });
      setOrders(data.orders || data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, field, value) => {
    try {
      const updateData = { [field]: value };
      await api.put(`/orders/${orderId}/status`, updateData);
      toast.success("Order updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    }
  };

  const handleClearFilters = () => {
    setFilters({ status: "", paymentStatus: "" });
  };

  return (
    <>
      <SEO
        title="Order Management | RemSam Homestead"
        description="Manage customer orders for RemSam Homestead"
      />

      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
                  Order Management
                </span>
              </h1>
              <p className="text-gray-600">
                View and manage all customer orders
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity }}
              className="hidden md:block"
            >
              <ShoppingBag size={32} className="text-emerald-400/50" />
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <OrderStats orders={orders} />

          {/* Filters */}
          <OrderFilters
            filters={filters}
            setFilters={setFilters}
            onClear={handleClearFilters}
          />

          {/* Orders Table */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
              />
              <p className="mt-4 text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                {filters.status || filters.paymentStatus
                  ? "No orders match your filter criteria"
                  : "There are no orders yet"}
              </p>
            </motion.div>
          ) : (
            <OrdersTable orders={orders} onUpdateStatus={updateOrderStatus} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
