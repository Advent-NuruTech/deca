// components/order/ShippingInfo.jsx
import React from "react";
import { motion } from "framer-motion";
import { MapPin, User, Phone, Mail, Home } from "lucide-react";

const ShippingInfo = ({ customer, address }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Shipping Information
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Customer Details
          </h3>

          <div className="space-y-3">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <User size={16} className="text-purple-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-white font-medium">{customer.name}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <Mail size={16} className="text-purple-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{customer.email}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <Phone size={16} className="text-purple-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white">{customer.phone}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Delivery Address
          </h3>

          <div className="space-y-3">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <Home size={16} className="text-purple-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Street Address</p>
                <p className="text-white">{address.street}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <MapPin size={16} className="text-purple-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">City / County</p>
                <p className="text-white">
                  {address.city}, {address.county}
                </p>
              </div>
            </motion.div>

            {address.postalCode && (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-3"
              >
                <MapPin size={16} className="text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Postal Code</p>
                  <p className="text-white">{address.postalCode}</p>
                </div>
              </motion.div>
            )}

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <MapPin size={16} className="text-purple-400 mt-1" />
              <div>
                <p className="text-sm text-gray-400">Country</p>
                <p className="text-white">{address.country || "South Sudan"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingInfo;
