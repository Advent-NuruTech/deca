// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Mail,
  Phone,
  MapPin,
  Facebook,
  YoutubeIcon,
  Instagram,
  ArrowRight,
  Sparkles,
  Heart,
  Youtube,
} from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Articles", path: "/articles" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const productLinks = [
    { name: "Starlink Kits", path: "/products?category=starlink", icon: "🛰️" },
    { name: "Networking", path: "/products?category=networking", icon: "🌐" },
    { name: "Laptops", path: "/products?category=laptop", icon: "💻" },
    { name: "Phones", path: "/products?category=phone", icon: "📱" },
    { name: "Software", path: "/products?category=software", icon: "⚙️" },
    {
      name: "Access Points",
      path: "/products?category=accesspoint",
      icon: "📶",
    },
    { name: "CCTV", path: "/products?category=cctv", icon: "📹" },
    { name: "ROUTER", path: "/products?category=router", icon: " 📡" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1C5boUNkPB/?mibextid=wwXIfr&ref=share",
      color: "hover:text-blue-400",
    },
    {
      icon: Youtube,
      href: "https://www.tiktok.com/@fancy_tech_integration?_r=1&_t=ZS-94BqRrCsEm9",
      color: "hover:text-blue-300",
    },
    {
      icon: YoutubeIcon,
      href: "https://youtube.com/@fancytechintegration?si=Co4IE5-BIU5EW-Cx",
      color: "hover:text-blue-500",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/fancy_tech_juba?igsh=cWI2c3QxYjJjZWpp&utm_source=qr_code_scanner",
      color: "hover:text-pink-400",
    },
    // { icon: Whatsapp, href: "https" },
  ];

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
      />

      {/* Floating sparkles */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-40 right-40 text-purple-500/10 hidden lg:block"
      >
        <Sparkles size={60} />
      </motion.div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
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
                  className="w-12 h-12 object-contain"
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

              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white">
                  Fancy Tech
                </span>
                <span className="text-s text-gray-400">Integration</span>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed">
              Leading provider of technology solutions, Software products,
              Starlink Kits, Networking Equipment, Laptops, and Phones in South
              Sudan.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className={`w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 ${social.color} hover:bg-white/10 transition-all duration-300`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity"
                    />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:text-transparent group-hover:bg-clip-text transition-all">
                      {link.name}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Our Products
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span className="group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:text-transparent group-hover:bg-clip-text transition-all">
                      {link.name}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <motion.li
                whileHover={{ x: 5 }}
                className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <Mail
                  size={18}
                  className="text-purple-400 mt-1 flex-shrink-0"
                />
                <a
                  href="mailto:sales@fancytechintegration.com"
                  className="hover:text-white transition-colors break-all"
                >
                  sales@fancytechintegration.com
                </a>
              </motion.li>

              <motion.li
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                <Phone size={18} className="text-purple-400 flex-shrink-0" />
                <a
                  href="tel:+254759466446"
                  className="hover:text-white transition-colors"
                >
                  +211 929 097 920
                </a>
              </motion.li>

              <motion.li
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 text-gray-400 group"
              >
                <MapPin size={18} className="text-purple-400 flex-shrink-0" />
                <span>Juba, South Sudan</span>
              </motion.li>
            </ul>

            {/* Newsletter Signup (Optional) */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">
                Subscribe to our newsletter
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-l-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-r-lg text-sm font-medium"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/10 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              © {currentYear} Fancy Tech Integration.
              <span className="hidden md:inline">All rights reserved.</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-flex items-center gap-1 ml-2"
              >
                Made with{" "}
                <Heart size={14} className="text-red-400 fill-red-400" /> in
                South Sudan
              </motion.span>
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500" />
    </footer>
  );
};

export default Footer;
