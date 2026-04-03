// pages/TermsOfService.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link to="/">
          <motion.div
            whileHover={{ x: -5 }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-8"
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
          <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full mb-4">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-8"
        >
          {/* Agreement to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              Agreement to Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using Fancy Tech Integration's website, products,
              or services, you agree to be bound by these Terms of Service. If
              you disagree with any part of the terms, you may not access our
              services.
            </p>
          </section>

          {/* Products and Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Products and Services
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="font-semibold text-white">1. Laptop Sales</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  All laptops are sold as-is with warranty as specified at the
                  time of purchase
                </li>
                <li>Prices are subject to change without notice</li>
                <li>
                  Stock availability may vary; we reserve the right to cancel
                  orders due to unavailability
                </li>
              </ul>

              <p className="font-semibold text-white mt-4">
                2. Software Services (Fancify Suite)
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  FancifyBusiness POS: For restaurants, hotels, pharmacies, and
                  supermarkets
                </li>
                <li>
                  FancifySchool: For educational institutions (primary to
                  university)
                </li>
                <li>FancifyProperty: For property management</li>
                <li>
                  Software licenses are non-transferable unless explicitly
                  stated
                </li>
                <li>
                  We provide ongoing support and updates as per your
                  subscription plan
                </li>
              </ul>
            </div>
          </section>

          {/* Payments */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Payments and Billing
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>
                All payments must be made in full before product delivery or
                software access
              </li>
              <li>
                We accept various payment methods as displayed at checkout
              </li>
              <li>
                Subscription services (where applicable) will be billed on a
                recurring basis
              </li>
              <li>
                You are responsible for maintaining accurate billing information
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Intellectual Property
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The Fancify software suite (FancifyBusiness, FancifySchool,
              FancifyProperty), our website content, logos, and designs are the
              property of Fancy Tech Integration and are protected by copyright
              and intellectual property laws. You may not copy, modify,
              distribute, or reverse engineer any part of our software without
              explicit written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              Limitation of Liability
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Fancy Tech Integration shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting
              from your use or inability to use our products or services. This
              includes but is not limited to loss of profits, data, or business
              interruption.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Governing Law
            </h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by the laws of South Sudan, without
              regard to its conflict of law provisions. Any disputes arising
              from these terms shall be resolved in the courts of South Sudan.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time.
              We will provide notice of significant changes by posting the new
              Terms on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-3">Contact Us</h2>
            <p className="text-gray-300 mb-2">
              For questions about these Terms, please contact us:
            </p>
            <ul className="text-gray-300 space-y-1">
              <li>📧 Email: legal@fancytechintegration.com</li>
              <li>📞 Phone: +211 929 097920</li>
              <li>💬 WhatsApp: +211 929 097920</li>
            </ul>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
