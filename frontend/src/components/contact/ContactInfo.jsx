// components/contact/ContactInfo.jsx
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// Custom icon components using SVG paths from provided links
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="3" />
    <line x1="18" y1="6" x2="17.5" y2="6.5" />
  </svg>
);

const ContactInfo = () => {
  const socialLinks = [
    {
      icon: FacebookIcon,
      href: "https://www.facebook.com/share/1C5boUNkPB/?mibextid=wwXIfr&ref=share",
      color: "hover:text-[#1877F2]",
      label: "Facebook",
      bg: "from-[#1877F2] to-[#0A5C9E]",
    },
    {
      icon: TikTokIcon,
      href: "https://www.tiktok.com/@fancy_tech_integration?_r=1&_t=ZS-94BqRrCsEm9",
      color: "hover:text-[#000000]",
      label: "TikTok",
      bg: "from-[#000000] to-[#333333]",
    },
    {
      icon: YouTubeIcon,
      href: "https://youtube.com/@fancytechintegration?si=Co4IE5-BIU5EW-Cx",
      color: "hover:text-[#FF0000]",
      label: "YouTube",
      bg: "from-[#FF0000] to-[#CC0000]",
    },
    {
      icon: InstagramIcon,
      href: "https://www.instagram.com/fancy_tech_juba?igsh=cWI2c3QxYjJjZWpp&utm_source=qr_code_scanner",
      color: "hover:text-[#E4405F]",
      label: "Instagram",
      bg: "from-[#833AB4] via-[#E4405F] to-[#FDC830]",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/0929097920",
      color: "hover:text-[#25D366]",
      label: "WhatsApp",
      bg: "from-[#25D366] to-[#128C7E]",
    },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-6">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Connect With Us
        </span>
      </h2>

      <p className="text-gray-400 mb-6">
        Follow us on social media for the latest updates, tech news, and
        exclusive offers.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative block"
          >
            {/* Animated background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${social.bg} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
            />

            {/* Card */}
            <div
              className={`relative bg-gradient-to-br ${social.bg} p-4 rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 group-hover:scale-[1.02]`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center text-white">
                  <social.icon />
                </div>
                <span className="text-xs font-medium text-white">
                  {social.label}
                </span>
                <span className="text-[8px] text-white/70">Follow Us</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Decorative message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-5 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 relative overflow-hidden group"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl">
            ⚡
          </div>
          <div>
            <p className="text-sm text-white font-medium">
              Quick Response Guaranteed
            </p>
            <p className="text-xs text-gray-400">
              We typically reply within 2-4 hours on all social platforms!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
