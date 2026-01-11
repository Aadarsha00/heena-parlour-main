import React from "react";
import Navbar from "../components/Home/Navbar";
import ContactForm from "../components/Conatct/Contact-Form";
import ContactMap from "../components/Conatct/Contact-Map";
import ContactInfoSection from "../components/Conatct/Contact-Info";

const Footer: React.FC<{
  heading: string;
  subheading: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}> = ({ heading, subheading, primaryButtonText, secondaryButtonText }) => (
  <footer className="bg-gray-900 text-white py-20">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
      <h2 className="text-3xl lg:text-4xl font-light mb-6">{heading}</h2>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
        {subheading}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/25">
          {primaryButtonText}
        </button>
        <button className="border border-gray-600 text-white px-8 py-3 rounded-full font-medium hover:border-yellow-400 transition-colors">
          {secondaryButtonText}
        </button>
      </div>
    </div>
  </footer>
);

interface ContactPageProps {
  className?: string;
}

export const Contact: React.FC<ContactPageProps> = ({ className = "" }) => {
  return (
    <div className={className}>
      <Navbar />
      {/* Hero Section */}
      <section className="relative bg-white py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-yellow-400/8 to-amber-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-amber-400/8 to-yellow-500/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-8" />

          <h1 className="text-4xl lg:text-6xl font-light text-gray-900 leading-tight mb-8">
            Get In
            <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-extralight">
              Touch
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto mb-12">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible to help you achieve your beauty goals with our
            premium services.
          </p>

          {/* Contact Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                Quick Response
              </h3>
              <p className="text-gray-600 font-light">
                We respond within 24 hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                Prime Location
              </h3>
              <p className="text-gray-600 font-light">
                Easily accessible in Baltimore
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-gray-900 mb-2">
                Personal Care
              </h3>
              <p className="text-gray-600 font-light">
                Dedicated to your satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative bg-gray-50 py-20">
        {/* Background Elements */}

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <ContactInfoSection />
            <div className="w-full lg:w-1/2 space-y-8">
              <ContactMap />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer
        heading="Ready To Book Your Service?"
        subheading="Experience the exceptional quality and care that Beautiful Eyebrow Threading & Henna is known for. Book your appointment today."
        primaryButtonText="Book an Appointment"
        primaryButtonLink="/booking"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="/contact"
      />
    </div>
  );
};
