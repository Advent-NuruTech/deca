// pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Package,
  FileText,
  ShoppingCart,
  Users,
  Star,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchAllArticles } from "../../store/slices/articleSlice";
import api from "../../services/api";
import StatCard from "../../components/admin/StatCard";
import QuickActions from "../../components/admin/QuickActions";
import FeaturedProducts from "../../components/admin/FeaturedProducts";
import RecentProductsTable from "../../components/admin/RecentProductsTable";
import SEO from "../../components/SEO";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { articles } = useSelector((state) => state.articles);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
    dispatch(fetchAllArticles());
    fetchOrders();
    fetchStats();
  }, [dispatch]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders", { params: { limit: 100 } });
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // You would typically fetch these from your API
      // For now, we'll use sample data
      setStats({
        totalRevenue: 1250000,
        pendingOrders: 23,
        totalCustomers: 450,
        conversionRate: 3.2,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const publishedArticles = articles.filter((a) => a.published);
  const draftArticles = articles.filter((a) => !a.published);
  const activeProducts = products.filter((p) => p.status === "active");
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <>
      <SEO
        title="Admin Dashboard"
        description="Admin dashboard for Fancy Tech Integration South Sudan"
      />

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                    Admin Dashboard
                  </span>
                </h1>
                <p className="text-gray-400">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity }}
                className="hidden md:block"
              >
                <Sparkles size={32} className="text-purple-400/30" />
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={products.length}
              icon={Package}
              color="purple"
              link="/admin/products"
            />
            <StatCard
              title="Active Products"
              value={activeProducts.length}
              icon={Star}
              color="green"
            />
            <StatCard
              title="Published Articles"
              value={publishedArticles.length}
              icon={FileText}
              color="blue"
              link="/admin/articles"
            />
            <StatCard
              title="Total Orders"
              value={orders.length}
              icon={ShoppingCart}
              color="orange"
              link="/admin/orders"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Draft Articles"
              value={draftArticles.length}
              icon={Clock}
              color="yellow"
            />
            <StatCard
              title="Total Revenue"
              value={`$ ${stats.totalRevenue.toLocaleString()}`}
              icon={TrendingUp}
              color="green"
              link="/admin/analytics"
              linkText="View Analytics"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={Clock}
              color="red"
              link="/admin/orders?status=pending"
              linkText="Process Orders"
            />
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={Users}
              color="blue"
              link="/admin/users"
              linkText="Manage Users"
            />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Featured Products & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
            <div className="lg:col-span-2">
              <FeaturedProducts products={products} />
            </div>

            {/* Conversion Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-2">
                  <TrendingUp className="w-full h-full text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.conversionRate}%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Monthly Goal</span>
                    <span>5%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(stats.conversionRate / 5) * 100}%`,
                      }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={14} className="text-yellow-400" />
                    <span className="text-gray-400">
                      You're on track! Keep up the good work.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Products Table */}
          <RecentProductsTable products={products} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
