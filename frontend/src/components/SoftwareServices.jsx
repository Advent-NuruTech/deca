// components/SoftwareServices.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  ShoppingCart,
  GraduationCap,
  Building2,
  Cloud,
  Wifi,
  WifiOff,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import ServiceDetailModal from "./ServiceDetailModal";
import { Link } from "react-router-dom";

const SoftwareServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      id: "web-design",
      icon: <Globe className="w-8 h-8" />,
      title: "Web Design & Development",
      shortDesc:
        "Stunning, responsive websites that convert visitors into customers.",
      fullDesc:
        "We create custom websites tailored to your brand identity. From simple business sites to complex web portals, our designs are mobile-responsive, SEO-optimized, and built for performance.",
      features: [
        "Custom responsive design",
        "SEO optimization",
        "Fast loading speeds",
        "Content management systems",
        "E-commerce integration",
        "Analytics & tracking setup",
      ],
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
    },
    {
      id: "mobile-apps",
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile & Web Applications",
      shortDesc:
        "Powerful apps for iOS, Android, and cross-platform deployment.",
      fullDesc:
        "End-to-end mobile and web application development. Whether you need a consumer-facing app or an internal business tool, we deliver intuitive, scalable solutions.",
      features: [
        "iOS & Android native apps",
        "Cross-platform (React Native/Flutter)",
        "Progressive Web Apps (PWAs)",
        "Real-time features",
        "Push notifications",
        "App store deployment",
      ],
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
    },
    {
      id: "fancify-business",
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "FancifyBusiness POS",
      shortDesc:
        "Complete POS solution for restaurants, hotels, pharmacies & supermarkets.",
      fullDesc:
        "A powerful, customizable point-of-sale system that streamlines operations. FancifyBusiness adapts to your specific industry needs and budget, with both online and offline capabilities.",
      features: [
        "Inventory management",
        "Sales analytics & reporting",
        "Staff management",
        "Customer loyalty programs",
        "Multi-branch support",
        "Integration with accounting software",
      ],
      industries: [
        "Restaurants",
        "Hotels",
        "Pharmacies",
        "Supermarkets",
        "Retail Stores",
      ],
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
    },
    {
      id: "fancify-school",
      icon: <GraduationCap className="w-8 h-8" />,
      title: "FancifySchool",
      shortDesc:
        "Comprehensive school management system for all education levels.",
      fullDesc:
        "Streamline administrative tasks, enhance parent-teacher communication, and track student progress with our all-in-one school management platform.",
      features: [
        "Student enrollment & records",
        "Attendance tracking",
        "Grade management",
        "Timetable scheduling",
        "Parent portal",
        "Fee collection & accounting",
        "Exam management",
        "Library management",
      ],
      institutions: [
        "Primary Schools",
        "High Schools",
        "Colleges",
        "Universities",
      ],
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500/10",
    },
    {
      id: "fancify-property",
      icon: <Building2 className="w-8 h-8" />,
      title: "FancifyProperty",
      shortDesc:
        "Property management software for landlords, agents, and tenants.",
      fullDesc:
        "Simplify property management with our comprehensive solution. Track rentals, manage maintenance requests, handle payments, and communicate with tenants effortlessly.",
      features: [
        "Property listings management",
        "Tenant screening",
        "Rent collection",
        "Maintenance requests",
        "Lease agreement management",
        "Expense tracking",
        "Financial reporting",
        "Document storage",
      ],
      color: "from-indigo-500 to-blue-500",
      iconBg: "bg-indigo-500/10",
    },
  ];

  const openServiceModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">
                Our Software Solutions
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Software for{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Every Business Need
              </span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From custom web development to specialized business management
              systems. All solutions work{" "}
              <span className="text-white font-semibold">
                online or offline
              </span>
              — because your business never stops.
            </p>
          </motion.div>

          {/* Online/Offline Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 inline-flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Online</span>
              </div>
              <div className="w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Offline</span>
              </div>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                Syncs when connected
              </span>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => openServiceModal(service)}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-full hover:border-purple-500/50 transition-all duration-300">
                  {/* Icon with gradient */}
                  <div
                    className={`inline-flex p-4 rounded-xl ${service.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {/* Icon with solid color that matches gradient theme */}
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{service.icon}</div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {service.shortDesc}
                  </p>

                  {/* Industries/Institutions Tags (for specific services) */}
                  {service.industries && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.industries.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                      {service.industries.length > 3 && (
                        <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                          +{service.industries.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {service.institutions && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.institutions.slice(0, 2).map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                      {service.institutions.length > 2 && (
                        <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                          +{service.institutions.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Learn More Link */}
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 mt-4">
                    <span className="text-sm font-medium">Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Solutions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-3">
                Need Something Custom?
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Every business is unique. We tailor our solutions to fit your
                specific needs and budget. Whether you need modifications to
                existing systems or a completely custom solution, we've got you
                covered.
              </p>
              <Link to="/contact">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                  Request Custom Solution
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SoftwareServices;
