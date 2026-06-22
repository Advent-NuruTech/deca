// components/Header.jsx (smart navbar for light/dark heroes)
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

  // ========== SMART TEXT COLOR BASED ON PAGE ==========
  const lightHeroPages = [
    "/articles",
    "/about",
    "/contact",
    "/products",
    "/cart",
    "/checkout",
    "/order-confirmation",
    "/admin/login",
    "/admin/dashboard",
    "/admin/products",
    "/admin/orders",
    "/admin/articles",
    "/admin/users",
    "/admin/settings",
    "/admin/analytics",
    "/terms",
    "/privacy",
    "/donate",
    "/faith",
  ];
  const isLightHeroPage = lightHeroPages.some((path) =>
    location.pathname.startsWith(path),
  );
  const defaultTextColor = isLightHeroPage ? "text-gray-800" : "text-white";
  const linkColor = isScrolled ? "text-gray-700" : defaultTextColor;
  const linkHoverBg = isScrolled
    ? "hover:bg-gray-100"
    : isLightHeroPage
      ? "hover:bg-gray-100"
      : "hover:bg-white/10";
  const buttonBg = isScrolled
    ? "bg-emerald-600 text-white hover:bg-emerald-700"
    : isLightHeroPage
      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
      : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30";

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
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md py-2"
          : "bg-transparent py-4"
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
                alt="RemSam Homestead Logo"
                className="bg-white rounded-full w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <div className="hidden md:flex flex-col">
                <span
                  className={`text-lg font-semibold ${isScrolled ? "text-gray-900" : isLightHeroPage ? "text-gray-900" : "text-white"}`}
                >
                  RemSam Homestead
                </span>
                <span
                  className={`text-xs ${isScrolled ? "text-gray-500" : isLightHeroPage ? "text-gray-500" : "text-gray-200"}`}
                >
                  Faith • Family • Farming
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? isScrolled
                        ? "text-emerald-600 bg-emerald-50"
                        : isLightHeroPage
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-emerald-300 bg-white/10"
                      : `${linkColor} ${linkHoverBg}`
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* Resources Dropdown */}
            <div className="relative group">
              <button
                className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${linkColor} ${linkHoverBg}`}
              >
                Resources{" "}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div
                  className={`rounded-lg shadow-lg py-1 ${isScrolled ? "bg-white border border-gray-200" : isLightHeroPage ? "bg-white border border-gray-200" : "bg-gray-800 border border-white/10"}`}
                >
                  {resourcesItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? isScrolled || isLightHeroPage
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-white/10 text-emerald-300"
                            : isScrolled || isLightHeroPage
                              ? "text-gray-700 hover:bg-gray-50"
                              : "text-gray-200 hover:bg-white/10"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button
                className={`inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg ${linkColor} ${linkHoverBg}`}
              >
                Shop{" "}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div
                  className={`rounded-lg shadow-lg py-1 ${isScrolled ? "bg-white border border-gray-200" : isLightHeroPage ? "bg-white border border-gray-200" : "bg-gray-800 border border-white/10"}`}
                >
                  {shopItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? isScrolled || isLightHeroPage
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-white/10 text-emerald-300"
                            : isScrolled || isLightHeroPage
                              ? "text-gray-700 hover:bg-gray-50"
                              : "text-gray-200 hover:bg-white/10"
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
                  isActive ? "bg-emerald-700 text-white" : buttonBg
                }`
              }
            >
              Donate
            </NavLink>
          </div>

          {/* Right side icons - Cart and Admin (only if logged in) */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className={`relative p-2 transition-colors ${isScrolled ? "text-gray-700 hover:text-emerald-600" : isLightHeroPage ? "text-gray-700 hover:text-emerald-600" : "text-white hover:text-emerald-300"}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Admin Section – ONLY when admin is logged in */}
            {userInfo && userInfo.role === "admin" && (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isScrolled || isLightHeroPage
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isScrolled || isLightHeroPage
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 transition-colors ${isScrolled ? "text-gray-700" : isLightHeroPage ? "text-gray-700" : "text-white"}`}
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

        {/* Mobile Menu – always white background for readability */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
            >
              <div className="py-4 px-4 space-y-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-gray-800 ${isActive ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-50"}`
                  }
                >
                  Home
                </NavLink>
                <div className="pt-2">
                  <div className="text-gray-500 text-sm px-4 py-1">
                    Resources
                  </div>
                  {resourcesItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-8 py-2 rounded-lg text-gray-700 ${isActive ? "text-emerald-600" : "hover:bg-gray-50"}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="pt-2">
                  <div className="text-gray-500 text-sm px-4 py-1">Shop</div>
                  {shopItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-8 py-2 rounded-lg text-gray-700 ${isActive ? "text-emerald-600" : "hover:bg-gray-50"}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <NavLink
                  to="/about"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/donate"
                  className="block px-4 py-3 bg-emerald-600 text-white rounded-lg text-center"
                >
                  Donate
                </NavLink>
                {userInfo?.role === "admin" && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-3 text-emerald-600 hover:bg-gray-50 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
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
