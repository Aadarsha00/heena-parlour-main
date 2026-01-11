import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

interface IFooter {
  heading?: string;
  subheading?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const Footer: React.FC<IFooter> = ({
  heading,
  subheading,
  primaryButtonText,
  primaryButtonLink = "#",
  secondaryButtonText,
  secondaryButtonLink = "#",
}) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/services", label: "Services" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const services = [
    "Eyebrow Threading",
    "Full Face Threading",
    "Henna Art",
    "Bridal Henna",
    "Classic Lashes",
    "Volume Lashes",
    "Hybrid Lashes",
  ];

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "#",
      label: "Instagram",
    },
    {
      icon: FaFacebookF,
      href: "#",
      label: "Facebook",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-400 to-yellow-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        {/* Optional CTA Section */}
        {(heading ||
          subheading ||
          primaryButtonText ||
          secondaryButtonText) && (
          <div className="border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-6 py-16 text-center">
              {heading && (
                <h2 className="text-3xl lg:text-4xl font-light mb-4 tracking-tight">
                  {heading}
                </h2>
              )}
              {subheading && (
                <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto mb-8 leading-relaxed">
                  {subheading}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {primaryButtonText && (
                  <a
                    href={primaryButtonLink}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
                  >
                    {primaryButtonText}
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
                )}
                {secondaryButtonText && (
                  <a
                    href={secondaryButtonLink}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-amber-200/30 text-white rounded-full font-medium hover:bg-white/10 hover:border-amber-400/50 transition-all duration-300"
                  >
                    {secondaryButtonText}
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-light mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  Beautiful Eyebrow
                </h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  Enhancing your natural beauty through expert threading, henna,
                  and lash services with premium care and attention to detail.
                </p>
              </div>

              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center hover:from-amber-500 hover:to-yellow-500 hover:text-black transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-medium mb-6 text-white">
                Quick Links
              </h4>
              <nav>
                <ul className="space-y-3">
                  {quickLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="text-gray-300 font-light hover:text-amber-400 transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-amber-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-medium mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li
                    key={service}
                    className="text-gray-300 font-light flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-3 flex-shrink-0"></div>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-medium mb-6 text-white">
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-300 font-light">
                      2931 O'Donnell St
                    </p>
                    <p className="text-gray-300 font-light">Baltimore, MD</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-amber-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:+14105551234"
                    className="text-gray-300 font-light hover:text-amber-400 transition-colors duration-300"
                  >
                    (410) 555-1234
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-amber-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:info@beautifuleyebrow.com"
                    className="text-gray-300 font-light hover:text-amber-400 transition-colors duration-300"
                  >
                    info@beautifuleyebrow.com
                  </a>
                </div>

                <div className="pt-2 border-t border-gray-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-amber-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-white font-medium">Hours</span>
                  </div>
                  <p className="text-gray-300 font-light text-sm ml-8">
                    Mon–Sat: 9AM – 6PM
                  </p>
                  <p className="text-gray-300 font-light text-sm ml-8">
                    Sun: 10AM – 4PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm font-light">
                © {currentYear} Beautiful Eyebrow Threading & Henna. All rights
                reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
