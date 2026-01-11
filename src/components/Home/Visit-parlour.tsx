import type { JSX } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { FaInstagram, FaFacebook } from "react-icons/fa";

interface ContactItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string[];
  href?: string;
  ariaLabel?: string;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
  hoverColor: string;
}

export default function VisitParlor(): JSX.Element {
  const contactItems: ContactItem[] = [
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      content: ["2931 O'Donnell St", "Baltimore, MD"],
      href: "https://maps.google.com/?q=2931+O'Donnell+St,+Baltimore,+MD",
      ariaLabel: "View location on Google Maps",
    },
    {
      icon: FaPhone,
      title: "Phone",
      content: ["(410) 555-1234"],
      href: "tel:+14105551234",
      ariaLabel: "Call us",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: ["info@beautifuleyebrow.com"],
      href: "mailto:info@beautifuleyebrow.com",
      ariaLabel: "Send us an email",
    },
    {
      icon: FaClock,
      title: "Hours",
      content: [
        "Monday - Saturday: 9:00 AM - 6:00 PM",
        "Sunday: 10:00 AM - 4:00 PM",
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: FaInstagram,
      href: "#",
      label: "Instagram",
      hoverColor: "hover:from-pink-500 hover:to-orange-400",
    },
    {
      icon: FaFacebook,
      href: "#",
      label: "Facebook",
      hoverColor: "hover:from-blue-600 hover:to-blue-500",
    },
  ];

  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.139146082685!2d-76.57459668464833!3d39.28034347951274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c8049bb3e6c55f%3A0xdeaee2e5a2575ad6!2s2931%20O'Donnell%20St%2C%20Baltimore%2C%20MD%2021224%2C%20USA!5e0!3m2!1sen!2snp!4v1720959059619!5m2!1sen!2snp";

  return (
    <section className="py-24 px-6 lg:px-20 bg-gradient-to-br from-white to-amber-50/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-transparent to-amber-400"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Visit Our{" "}
            <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Parlor
            </span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            We're conveniently located in Baltimore. Visit us for an exceptional
            beauty experience or reach out with any questions.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Contact Information */}
          <div className="space-y-8">
            {contactItems.map((item, index) => {
              const IconComponent = item.icon;
              const content = (
                <div
                  className="group bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "fadeInLeft 0.8s ease-out forwards",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <div className="space-y-1">
                        {item.content.map((line, idx) => (
                          <p
                            key={idx}
                            className="text-gray-600 font-light leading-relaxed"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    {item.href && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                          className="w-5 h-5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );

              return item.href ? (
                <a
                  key={index}
                  href={item.href}
                  aria-label={item.ariaLabel}
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}

            {/* Social Media Links */}
            <div
              className="pt-8"
              style={{
                animationDelay: "600ms",
                animation: "fadeInLeft 0.8s ease-out forwards",
              }}
            >
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Follow Us
              </h4>
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`group w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 ${hoverColor} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div
            className="relative"
            style={{
              animationDelay: "300ms",
              animation: "fadeInRight 0.8s ease-out forwards",
            }}
          >
            <div className="relative bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-700 group">
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-6 w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transform -translate-y-0.5"></div>

              <div className="w-full h-[420px] rounded-xl overflow-hidden relative">
                <iframe
                  title="Beautiful Eyebrow Location - Google Maps"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />

                {/* Overlay with location info */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-amber-100/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      We're Here!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6 text-center">
              <a
                href="https://maps.google.com/?q=2931+O'Donnell+St,+Baltimore,+MD"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-full hover:shadow-lg hover:shadow-gray-900/25 transition-all duration-300 hover:scale-105 font-medium"
              >
                Get Directions
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
