// src/pages/ContactPage.jsx
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  CheckCircle,
} from "lucide-react";
import SEO from "../components/SEO";
import HeroSection from "../components/HeroSection";
import AnimatedSection from "../components/AnimatedSection";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      setError("Unable to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Sami Ministry"
        description="Get in touch with Sami Ministry. We'd love to hear from you – whether for prayer requests, questions about our resources, or partnership opportunities."
      />
      <HeroSection
        badge="Get in Touch"
        title="We'd Love to <span class='text-emerald-600'>Hear From You</span>"
        subtitle="Whether you have a prayer request, a question about our resources, or want to partner with us – reach out."
        primaryText="Send a Message"
        primaryLink="#contact-form"
        secondaryText="Join Our Community"
        secondaryLink="/donate"
        imageSrc="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        imageAlt="Hands holding a letter"
      />

      {/* Contact Form & Info Section */}
      <section id="contact-form" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <AnimatedSection
              delay={0.1}
              direction="up"
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <a
                        href="mailto:hello@saministry.org"
                        className="text-gray-600 hover:text-emerald-600"
                      >
                        hello@saministry.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <a
                        href="tel:+211123456789"
                        className="text-gray-600 hover:text-emerald-600"
                      >
                        +211 123 456 789
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">Juba, South Sudan</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="font-medium text-gray-800 mb-3">Follow Us</p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="text-gray-500 hover:text-emerald-600 transition"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-emerald-600 transition"
                    >
                      <Twitter size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-emerald-600 transition"
                    >
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-emerald-800">
                    📖 "Pray without ceasing." – 1 Thessalonians 5:17
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection
              delay={0.2}
              direction="up"
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600 mb-6">
                  We’ll get back to you as soon as possible.
                </p>
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Thank you for reaching out. We'll respond shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send Message"}
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Optional Map Section (if you have a physical location) */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-md h-64 md:h-80">
            <iframe
              title="Sami Ministry Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.449429669445!2d31.5883007!3d4.8512422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17699f9c4e0e8c5b%3A0x7c1b2b2b2b2b2b2b!2sJuba%2C%20South%20Sudan!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
