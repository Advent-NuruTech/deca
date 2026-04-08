// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { login } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, ArrowRight, Sparkles, Heart } from "lucide-react";
import logo from "../../assets/logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    } catch (err) {
      // Error handled by useEffect
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient Orbs (emerald/teal) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 -left-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />

        {/* Floating Icons */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-40 right-40 text-emerald-500/10 hidden lg:block"
        >
          <Shield size={80} />
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={logo}
                  alt="RemSam Homestead Logo"
                  className="w-12 h-12 object-contain rounded-full bg-white"
                />
              </motion.div>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(16, 185, 129, 0.4)",
                    "0 0 0 20px rgba(16, 185, 129, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">
              RemSam Homestead
            </span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-3 shadow-md">
                <Shield className="w-full h-full text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 mt-2">
              Secure access to your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="admin@samiministry.org"
                />
                {focusedField === "email" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  placeholder="••••••••"
                />
                {focusedField === "password" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-emerald-700 transition"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10 flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
          >
            <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-2">
              <Shield size={14} className="text-emerald-500" />
              This area is restricted to authorized personnel only
            </p>
          </motion.div>

          {/* Back to Site Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors group"
            >
              <ArrowRight
                size={14}
                className="rotate-180 group-hover:-translate-x-1 transition-transform"
              />
              Back to Website
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-400"
        >
          © {new Date().getFullYear()} RemSam Homestead. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default AdminLogin;
