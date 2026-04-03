// pages/PrivacyPolicy.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie } from "lucide-react";

const PrivacyPolicy = () => {
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
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
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
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              At Fancy Tech Integration, we take your privacy seriously. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or use our
              services. Please read this privacy policy carefully. If you do not
              agree with the terms of this privacy policy, please do not access
              the site.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Purchase our laptops or software products</li>
                <li>
                  Register for our services (FancifyBusiness, FancifySchool,
                  FancifyProperty)
                </li>
                <li>Sign up for newsletters or marketing communications</li>
                <li>Contact us via WhatsApp, email, or contact forms</li>
                <li>Request customer support</li>
              </ul>
              <p className="mt-4">This information may include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Business details (company name, business type)</li>
                <li>
                  Payment information (processed securely through third-party
                  providers)
                </li>
                <li>Communication preferences</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              How We Use Your Information
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Process your orders and deliver laptops or software access
                </li>
                <li>Provide, operate, and maintain our software services</li>
                <li>Improve, personalize, and expand our offerings</li>
                <li>
                  Communicate with you about updates, promotions, and support
                </li>
                <li>Process payments and prevent fraudulent transactions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-purple-400" />
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. Cookies are files
              with small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent.
            </p>
          </section>

          {/* Third-Party Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Third-Party Disclosure
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personally
              identifiable information to outside parties unless we provide you
              with advance notice. This does not include website hosting
              partners and other parties who assist us in operating our website,
              conducting our business, or serving our users, so long as those
              parties agree to keep this information confidential.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/20">
            <h2 className="text-xl font-bold text-white mb-3">Contact Us</h2>
            <p className="text-gray-300 mb-2">
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="text-gray-300 space-y-1">
              <li>📧 Email: privacy@fancytechintegration.com</li>
              <li>📞 Phone: +211 929 097920</li>
              <li>💬 WhatsApp: +211 929 097920</li>
            </ul>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
