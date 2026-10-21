"use client";

// src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ResourceTaxonomy } from "@/lib/types";
import { getPublicTaxonomy } from "@/lib/public-settings-client";
import NewsletterSignup from "@/components/public/newsletter-signup";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Heart,
  Sprout,
} from "lucide-react";
const logo = "/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [taxonomy, setTaxonomy] = useState<ResourceTaxonomy>({ majors: [], subcategories: [] });

  useEffect(() => {
    getPublicTaxonomy().then(setTaxonomy).catch(() => undefined);
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    ...taxonomy.majors.map((major) => ({ name: major.name, path: major.id === "study-library" ? "/study-materials" : `/articles?major=${encodeURIComponent(major.id)}` })),
    { name: "Shop", path: "/products" },
    { name: "Donate", path: "/donate" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const productLinks = [
    { name: "Organic Seeds", path: "/products?category=seeds", icon: "🌱" },
    { name: "Fresh Produce", path: "/products?category=produce", icon: "🍅" },
    { name: "Other Products", path: "/products?category=other", icon: "🌿" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/samiministry",
      color: "hover:text-blue-600",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/@samiministry",
      color: "hover:text-red-600",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/samiministry",
      color: "hover:text-pink-600",
    },
  ];

  return (
    <footer className="relative bg-gray-50 text-gray-700 overflow-hidden">
      {/* Decorative background pattern (subtle) */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient orbs (soft) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl"
      />

      <div className="relative container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Image
                  src={logo}
                  alt="RemSam Homestead Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain rounded-full bg-white"
                />
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(16, 185, 129, 0.4)",
                      "0 0 0 8px rgba(16, 185, 129, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  RemSam Homestead
                </span>
                <span className="text-xs text-gray-500">
                  Faith • Family • Farming
                </span>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Inspiring families to grow spiritually, live healthily, learn
              joyfully, and steward God’s creation – from Kenya to the nations.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className={`w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 ${social.color} hover:shadow transition-all`}
                >
                  <social.icon size={16} />
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
            <h4 className="text-md font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
              Explore
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.path}
                    className="group flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 text-emerald-500"
                    />
                    <span>{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Shop Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-md font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
              Shop
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={link.path}
                    className="group flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
                  >
                    <span className="text-base">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-4 pt-2">
              <Link
                href="/donate"
                className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Support Our Work <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-md font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
              Connect
            </h4>
            <ul className="space-y-3 mb-5">
              <li className="flex items-start gap-3 text-gray-500 text-sm">
                <Mail size={16} className="text-emerald-500 mt-0.5" />
                <a
                  href="mailto:linksstan@gmail.com / remmyviolita27@gmail.com"
                  className="hover:text-emerald-600"
                >
                  linksstan@gmail.com / remmyviolita27@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <Phone size={16} className="text-emerald-500" />
                <a href="tel:++254721627977 / +254746840322" className="hover:text-emerald-600">
                 +254721627977 / +254746840322
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <MapPin size={16} className="text-emerald-500" />
                <span>Butere, Kenya</span>
              </li>
            </ul>
            <NewsletterSignup compact />
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-200 mt-10 pt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
            <p className="text-gray-500 flex items-center gap-2">
              © {currentYear} RemSam Homestead. All rights reserved.
              <span className="hidden md:inline">•</span>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-flex items-center gap-1"
              >
                powered by{" "}
                <a
                  href="https://fancytechintegration.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 transition"
                >
                  fancy tech integration
                </a>
              </motion.span>
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-emerald-600 transition"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-emerald-600 transition"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-emerald-600 transition"
              >
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400" />
    </footer>
  );
};

export default Footer;
