// pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { login } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { Shield, Mail, Lock, ArrowRight, Code2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-20 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />

        {/* Floating Icons */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-40 right-40 text-purple-500/10 hidden lg:block"
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
                <Code2 className="w-12 h-12 text-purple-400" />
              </motion.div>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(139, 92, 246, 0.4)",
                    "0 0 0 20px rgba(139, 92, 246, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              F.T.I.
            </span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-3">
                <Shield className="w-full h-full text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                Admin Login
              </span>
            </h2>
            <p className="text-gray-400 mt-2">
              Secure access to your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="admin@example.com"
                />
                {focusedField === "email" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="••••••••"
                />
                {focusedField === "password" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
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
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <motion.div
                    animate={{ x: ["0%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20"
          >
            <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-2">
              <Shield size={14} className="text-purple-400" />
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
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors group"
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
          className="text-center mt-8 text-sm text-gray-500"
        >
          © {new Date().getFullYear()} Fancy Tech Integration South Sudan. All
          rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default AdminLogin;
