// src/components/checkout/CheckoutForm.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Building,
  Mail as MailIcon,
  FileText,
} from "lucide-react";

const CheckoutForm = ({ formData, errors, onChange, onSubmit, loading }) => {
  const inputClasses = (fieldError) => `
    w-full bg-white border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 
    focus:outline-none focus:ring-2 transition-all
    ${
      fieldError
        ? "border-red-500 focus:ring-red-500/50"
        : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/50"
    }
  `;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Customer Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Customer Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className={inputClasses(errors.name)}
                placeholder="John Doe"
                required
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className={inputClasses(errors.email)}
                placeholder="john@example.com"
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                className={inputClasses(errors.phone)}
                placeholder="+254 700 000 000"
                required
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Shipping Address
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <div className="relative group">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={onChange}
                className={inputClasses(errors["address.street"])}
                placeholder="123 Main Street"
                required
              />
            </div>
            {errors["address.street"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["address.street"]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <div className="relative group">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={onChange}
                  className={inputClasses(errors["address.city"])}
                  placeholder="Nairobi"
                  required
                />
              </div>
              {errors["address.city"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.city"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                County *
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  name="address.county"
                  value={formData.address.county}
                  onChange={onChange}
                  className={inputClasses(errors["address.county"])}
                  placeholder="Nairobi County"
                  required
                />
              </div>
              {errors["address.county"] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors["address.county"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <div className="relative group">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={onChange}
                  className={inputClasses()}
                  placeholder="00100"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Shipping Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Shipping Method
        </h2>

        <div className="space-y-3">
          {[
            {
              method: "standard",
              label: "Standard Delivery",
              time: "5-7 business days",
              rate: 500,
              icon: "🚚",
            },
            {
              method: "express",
              label: "Express Delivery",
              time: "2-3 business days",
              rate: 1500,
              icon: "⚡",
            },
            {
              method: "pickup",
              label: "Pickup from Store",
              time: "Available at our store",
              rate: 0,
              icon: "🏪",
            },
          ].map((option) => (
            <label
              key={option.method}
              className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all group ${
                formData.shippingMethod === option.method
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={option.method}
                checked={formData.shippingMethod === option.method}
                onChange={onChange}
                className="sr-only"
              />
              <div className="flex items-center gap-4 flex-grow">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500">{option.time}</div>
                </div>
                <div className="font-bold text-emerald-600">
                  {option.rate === 0
                    ? "Free"
                    : `$ ${option.rate.toLocaleString()}`}
                </div>
              </div>
              {formData.shippingMethod === option.method && (
                <motion.div
                  layoutId="shippingIndicator"
                  className="absolute inset-0 border-2 border-emerald-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </label>
          ))}
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Payment Method
        </h2>

        <div className="space-y-3">
          {[
            {
              value: "mpesa",
              label: "M-Pesa",
              icon: "📱",
              desc: "Pay with M-Pesa",
            },
            {
              value: "bank_transfer",
              label: "Bank Transfer",
              icon: "🏦",
              desc: "Direct bank transfer",
            },
            {
              value: "cash_on_delivery",
              label: "Cash on Delivery",
              icon: "💵",
              desc: "Pay when you receive",
            },
          ].map((method) => (
            <label
              key={method.value}
              className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                formData.paymentMethod === method.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={formData.paymentMethod === method.value}
                onChange={onChange}
                className="sr-only"
              />
              <div className="flex items-center gap-4">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800">
                    {method.label}
                  </div>
                  <div className="text-sm text-gray-500">{method.desc}</div>
                </div>
              </div>
              {formData.paymentMethod === method.value && (
                <motion.div
                  layoutId="paymentIndicator"
                  className="absolute inset-0 border-2 border-emerald-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </label>
          ))}
        </div>
      </motion.div>

      {/* Additional Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">
          Additional Notes
        </h2>
        <div className="relative group">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            rows="4"
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="Any special instructions or notes for your order..."
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-sm hover:bg-emerald-700 transition"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Processing Order...
          </span>
        ) : (
          <span>Place Order</span>
        )}
      </motion.button>
    </form>
  );
};

export default CheckoutForm;
