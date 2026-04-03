// pages/ContactPage.jsx
import React from "react";
import SEO from "../components/SEO";
import ContactHero from "../components/contact/ContactHero";
import ContactInfoCards from "../components/contact/ContactInfoCards";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import ContactMap from "../components/contact/ContactMap";
import ContactFAQ from "../components/contact/ContactFAQ";
import SupportCTA from "../components/contact/SupportCTA";
import AnimatedSection from "../components/AnimatedSection";

const ContactPage = () => {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Fancy Tech Integration South Sudan. Contact us for inquiries about our products and services including Starlink Kits, Networking Equipment, Laptops, and Phones."
        keywords={[
          "Contact",
          "Fancy Tech Integration South Sudan",
          "F.T.I. South Sudan",
          "Support",
          "Inquiry",
        ]}
      />

      <ContactHero />
      <ContactInfoCards />

      {/* Main Contact Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Form */}
              <AnimatedSection delay={0.1} direction="right">
                <ContactForm />
              </AnimatedSection>

              {/* Right Column - Map & Info */}
              <div className="space-y-6">
                <AnimatedSection delay={0.2} direction="left">
                  <ContactMap />
                </AnimatedSection>

                <AnimatedSection delay={0.3} direction="left">
                  <ContactInfo />
                </AnimatedSection>
              </div>
            </div>

            {/* FAQ Section - Full Width */}
            <div className="mt-12">
              <AnimatedSection delay={0.4} direction="up">
                <ContactFAQ />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <SupportCTA />

      {/* Add this CSS to your global styles */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default ContactPage;
