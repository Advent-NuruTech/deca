"use client";

// src/pages/TermsOfService.jsx
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Shield,
  AlertCircle,
  Scale,
  CreditCard,
} from "lucide-react";

const TermsOfService = () => {
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
            <FileText className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-medium text-emerald-700">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
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
          {/* Agreement to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Agreement to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using RemSam Homestead’s website, content, or
              services, you agree to be bound by these Terms of Service. If you
              disagree with any part of the terms, you may not access our
              services.
            </p>
          </section>

          {/* Content & Resources */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Content and Resources
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="font-semibold text-gray-800">1. Faith Content</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  All articles, devotionals, and study materials are provided
                  for personal and educational use.
                </li>
                <li>
                  You may not republish or sell our content without permission.
                </li>
                <li>
                  Downloadable resources (PDFs, guides) are free for personal
                  use.
                </li>
              </ul>

              <p className="font-semibold text-gray-800 mt-4">
                2. Study Materials
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Study materials are offered free of charge as a ministry
                  resource.
                </li>
                <li>
                  We reserve the right to modify or remove resources at any
                  time.
                </li>
                <li>
                  Users may download and print for personal or group study.
                </li>
              </ul>

              <p className="font-semibold text-gray-800 mt-4">
                3. Shop Products
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Product descriptions and prices are subject to change.</li>
                <li>
                  We strive to ensure accuracy but do not guarantee that all
                  information is error‑free.
                </li>
                <li>
                  Organic seeds and produce are sold as described; no refunds
                  once shipped unless damaged.
                </li>
              </ul>
            </div>
          </section>

          {/* Donations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Donations
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>
                Donations are voluntary and non‑refundable unless an error
                occurs.
              </li>
              <li>
                Receipts will be provided for tax purposes where applicable.
              </li>
              <li>
                We use third‑party payment processors; please review their
                terms.
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website (articles, images, logos, study
              materials) is the property of RemSam Homestead unless otherwise
              credited. You may not reproduce, distribute, or create derivative
              works without written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              RemSam Homestead shall not be liable for any indirect, incidental,
              or consequential damages arising from your use of our website,
              content, or products. This includes loss of data, profits, or
              other intangible losses.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by the laws of Kenya, without regard
              to its conflict of law provisions. Any disputes shall be resolved
              in the courts of Kenya.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms from time to time. The “Last updated”
              date at the top of this page indicates when changes were made. By
              continuing to use our site after changes, you accept the revised
              Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Contact Us</h2>
            <p className="text-gray-600 mb-2">
              For questions about these Terms, please contact us:
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

export default TermsOfService;
