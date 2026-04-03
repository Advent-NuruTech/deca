// components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../store/slices/authSlice";
import { selectCartItemsCount } from "../store/slices/cartSlice";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import logo from "../assets/logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Articles", path: "/articles" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 },
    }),
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-purple-500/10 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo with Image */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Logo Image */}
                <img
                  src={logo}
                  alt="F.T.I. Logo"
                  className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 object-contain"
                />
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(139, 92, 246, 0.4)",
                      "0 0 0 10px rgba(139, 92, 246, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
              </motion.div>

              {/* Hidden on mobile, visible on medium screens and up */}
              <div className="hidden md:flex flex-col">
                <span className="text-lg font-semibold text-white">
                  Fancy Tech
                </span>
                <span className="text-s text-gray-400">Integration</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                custom={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors group ${
                    location.pathname === item.path
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side icons and buttons */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cart"
                className="relative p-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Admin Section */}
            {userInfo && userInfo.role === "admin" ? (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-lg text-purple-400 hover:text-purple-300 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/admin/login"
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium text-sm shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-2 text-gray-300 hover:text-purple-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-4 overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <div className="py-4">
                <div className="flex flex-col space-y-2 px-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`block px-4 py-3 rounded-lg transition-all ${
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile admin section */}
                  <div className="pt-4 mt-2 border-t border-white/10">
                    {userInfo && userInfo.role === "admin" ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-3 text-purple-400 hover:bg-white/5 rounded-lg transition-all"
                          >
                            Dashboard
                          </Link>
                        </motion.div>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                        >
                          Logout
                        </motion.button>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link
                          to="/admin/login"
                          className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium text-center"
                        >
                          Admin Login
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
