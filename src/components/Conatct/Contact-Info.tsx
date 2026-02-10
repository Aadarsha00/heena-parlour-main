import React from "react";

interface ContactInfo {
  phone: string;
  email: string;
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
  };
}

interface OperatingHours {
  [key: string]: string;
}

interface ServiceItem {
  name: string;
  price: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

interface ContactInfoSectionProps {
  className?: string;
  contactInfo?: ContactInfo;
  operatingHours?: OperatingHours;
  featuredServices?: ServiceItem[];
  socialLinks?: SocialLink[];
  onNavigateToServices?: () => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  className = "",
  contactInfo = {
    phone: "(410) 555-0123",
    email: "contact@beautifuleyebrow.com",
    address: {
      name: "Beautiful Eyebrow Threading and Henna",
      street: "2931 O'Donnell St",
      city: "Baltimore",
      state: "MD",
    },
  },
  operatingHours = {
    "Monday - Friday": "9:00 AM - 8:00 PM",
    Saturday: "10:00 AM - 7:00 PM",
    Sunday: "11:00 AM - 5:00 PM",
  },
  featuredServices = [
    { name: "Eyebrow Threading", price: "$12" },
    { name: "Upper Lip Threading", price: "$6" },
    { name: "Full Face Threading", price: "$35" },
  ],
  socialLinks = [
    {
      platform: "Instagram",
      url: "#",
      ariaLabel: "Follow us on Instagram",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      platform: "Facebook",
      url: "#",
      ariaLabel: "Follow us on Facebook",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ],
  onNavigateToServices = () => console.log("Navigate to services"),
}) => {
  return (
    <div
      className={`w-full md:w-1/2 space-y-8 px-4 sm:px-6 md:px-8 ${className}`}
    >
      {/* Location Card */}
      <div className="group relative bg-white max-w-md mx-auto md:ml-auto md:mr-8 shadow-lg hover:shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Golden Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
            <svg
              className="w-6 h-6 text-yellow-600"
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

          <div className="flex-1">
            <h3 className="font-medium text-lg text-gray-900 mb-3">
              Our Location
            </h3>
            <div className="space-y-1 text-gray-600">
              <p className="font-medium">{contactInfo.address.name}</p>
              <p>{contactInfo.address.street}</p>
              <p>
                {contactInfo.address.city}, {contactInfo.address.state}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods Card */}
      <div className="group relative bg-white shadow-lg hover:shadow-2xl rounded-2xl p-6 max-w-md mx-auto md:ml-auto md:mr-8 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <h3 className="font-medium text-lg text-gray-900 mb-6">
          Contact Methods
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-gray-900">{contactInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{contactInfo.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hours of Operation Card */}
      <div className="group relative bg-white shadow-lg hover:shadow-2xl rounded-2xl p-6 max-w-md mx-auto md:ml-auto md:mr-8 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
            <svg
              className="w-5 h-5 text-yellow-600"
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
          <h3 className="font-medium text-lg text-gray-900">
            Hours of Operation
          </h3>
        </div>

        <div className="space-y-3">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between items-center py-1">
              <p className="text-gray-600 font-medium">{day}</p>
              <p className="text-gray-900 font-medium">{hours}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Card */}
      <div className="group relative bg-white shadow-lg hover:shadow-2xl rounded-2xl p-6 max-w-sm mx-auto md:mr-16 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <h3 className="font-medium text-lg text-gray-900 mb-6">
          Connect With Us
        </h3>

        <div className="flex gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              aria-label={social.ariaLabel}
              className="group/social p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl text-gray-600 hover:from-yellow-50 hover:to-amber-50 hover:text-yellow-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Featured Services Card */}
      <div className="group relative bg-white shadow-lg hover:shadow-2xl rounded-2xl p-6 max-w-md mx-auto md:ml-auto md:mr-12 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h3 className="font-medium text-lg text-gray-900">
            Featured Services
          </h3>
        </div>

        <p className="text-gray-600 mb-6 font-light">
          Perfect your features with our precise threading services.
        </p>

        <div className="space-y-3 mb-6">
          {featuredServices.map((service, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-700">{service.name}</span>
              <span className="font-medium text-gray-900">{service.price}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onNavigateToServices}
            className="group/button bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/25 hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              View All Services
              <svg
                className="w-4 h-4 transition-transform group-hover/button:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
