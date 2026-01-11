import { useState } from "react";

// Type definitions for better type safety
interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
}

interface NavbarProps {
  isAuthenticated?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Appointments", href: "/my-appointment", requiresAuth: true },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="group flex items-center space-x-3 transition-transform duration-200 hover:scale-[1.02]"
              aria-label="Navigate to homepage"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <img
                  src="/pictures/logo.png"
                  alt="Company Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors duration-200 rounded-lg hover:bg-neutral-50 group"
              >
                {item.label}
                <span className="absolute inset-x-4 -bottom-px h-px bg-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center">
            <a href="/services">
              <button className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2">
                Book Now
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-5 relative">
              <span
                className={`absolute left-0 top-1 w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-4 w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-neutral-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {filteredNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="block px-4 py-3 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}

            <div className="pt-4 border-t border-neutral-100">
              <a href="/services" className="block">
                <button
                  onClick={closeMenu}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
                >
                  Book Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
