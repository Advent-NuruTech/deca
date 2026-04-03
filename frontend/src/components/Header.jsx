// components/Header.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
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
  ChevronDown,
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  // Helper to check active link (including query params)
  const isActiveLink = (to) => {
    if (to.includes("?")) {
      const [path, query] = to.split("?");
      return location.pathname === path && location.search === `?${query}`;
    }
    return location.pathname === to;
  };

  // Dropdown items
  const resourcesItems = [
    { name: "Faith Blogs", path: "/articles?category=faith" },
    { name: "Recipes", path: "/articles?category=recipe" },
    { name: "Agriculture", path: "/articles?category=agriculture" },
    { name: "Homeschooling", path: "/articles?category=homeschooling" },
    { name: "Study Materials", path: "/study-materials" },
  ];

  const shopItems = [
    { name: "Seeds Shop", path: "/products?category=seeds" },
    { name: "Fresh Produce", path: "/products?category=produce" },
  ];

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95  shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="Sami Ministry Logo"
                className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-lg font-semibold text-gray-900">
                  Sami Ministry
                </span>
                <span className="text-xs text-gray-400">
                  Faith • Family • Farming
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation with CSS Dropdowns */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Static links: Home, About, Contact */}
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? "text-purple-400 bg-purple-500/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Resources Dropdown (CSS hover) */}
            <div className="relative group">
              <button className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Resources{" "}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-lg py-1">
                  {resourcesItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Shop Dropdown (CSS hover) */}
            <div className="relative group">
              <button className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Shop{" "}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-lg py-1">
                  {shopItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "bg-purple-500/20 text-purple-400"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Donate Button */}
            <NavLink
              to="/donate"
              className={({ isActive }) =>
                `px-5 py-2 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? "bg-green-700 text-gray-900"
                    : "bg-green-600 text-gray-900 hover:bg-green-700 shadow-lg shadow-green-500/30"
                }`
              }
            >
              Donate
            </NavLink>
          </div>

          {/* Right side icons (Cart, Admin, Mobile) */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-purple-400 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Admin Section */}
            {userInfo && userInfo.role === "admin" ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg text-purple-400 hover:text-purple-300"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 rounded-lg font-medium text-sm shadow-md"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-purple-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu (unchanged logic) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 rounded-2xl bg-white/95  border border-gray-200 shadow-2xl overflow-hidden"
            >
              <div className="py-4 px-4 space-y-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg ${
                      isActive
                        ? "bg-purple-500/20 text-purple-400"
                        : "text-gray-600"
                    }`
                  }
                >
                  Home
                </NavLink>
                <div className="pt-2">
                  <div className="text-gray-400 text-sm px-4 py-1">
                    Resources
                  </div>
                  {resourcesItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-8 py-2 rounded-lg ${
                          isActive ? "text-purple-400" : "text-gray-600"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="pt-2">
                  <div className="text-gray-400 text-sm px-4 py-1">Shop</div>
                  {shopItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-8 py-2 rounded-lg ${
                          isActive ? "text-purple-400" : "text-gray-600"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <NavLink to="/about" className="block px-4 py-3 text-gray-600">
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  className="block px-4 py-3 text-gray-600"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/donate"
                  className="block px-4 py-3 bg-green-600 text-gray-900 rounded-lg text-center"
                >
                  Donate
                </NavLink>
                {userInfo?.role === "admin" ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-3 text-purple-400"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    className="block px-4 py-3 bg-purple-500 text-gray-900 rounded-lg text-center"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
