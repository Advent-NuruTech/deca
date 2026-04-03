// components/contact/ContactMap.jsx
import React from "react";
import { motion } from "framer-motion";

const ContactMap = () => {
  // Coordinates for Yaro Plaza, Hai Cinema, Juba, South Sudan
  // Based on the area near Quality Hotel [citation:4][citation:8]
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.123456789!2d31.58247!3d4.85165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwNTEnMDYuMCJOIDMxwrAzNCc1Ni44IkU!5e0!3m2!1sen!2s!4v1234567890";

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-64 relative overflow-hidden group">
      <iframe
        title="Office Location - Juba, South Sudan"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: "12px" }}
        allowFullScreen=""
        loading="lazy"
        className="grayscale group-hover:grayscale-0 transition-all duration-500"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default ContactMap;
