"use client";

// src/pages/PrivacyPolicy.jsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link href="/">
          <motion.div
            whileHover={{ x: -5 }}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Home
          </motion.div>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-medium text-emerald-700">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 space-y-8"
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At RemSam Homestead, we respect your privacy. This Privacy Policy
              explains how we collect, use, and protect your information when
              you visit our website, subscribe to our content, make donations,
              or purchase products. Please read this policy carefully.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We may collect personal information that you voluntarily
                provide:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>When you subscribe to our newsletter</li>
                <li>When you download study materials</li>
                <li>When you make a donation or purchase a product</li>
                <li>When you contact us via email, phone, or contact forms</li>
              </ul>
              <p className="mt-4">This information may include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and email address</li>
                <li>Mailing address (for product delivery)</li>
                <li>Phone number</li>
                <li>
                  Payment information (processed securely via third‑party
                  gateways)
                </li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Send you requested resources and newsletters</li>
                <li>Process donations and product orders</li>
                <li>Respond to your inquiries</li>
                <li>Improve our website and content</li>
                <li>Comply with legal obligations (e.g., tax receipts)</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-emerald-600" />
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to enhance your browsing experience, analyse site
              traffic, and remember your preferences. You may disable cookies in
              your browser settings, but some features may not function
              properly.
            </p>
          </section>

          {/* Third-Party Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Third-Party Disclosure
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personally
              identifiable information to outside parties except as necessary to
              process payments, deliver products, or comply with the law. We may
              share aggregated, non‑identifying information with analytics
              partners.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="text-gray-600 space-y-1">
              <li>📧 Email: hello@remSamhomestead.org</li>
              <li>📞 Phone: +254 721 627 977</li>
              <li>💬 WhatsApp: +254 721 627 977</li>
            </ul>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
