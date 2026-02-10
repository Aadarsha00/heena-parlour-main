// src/pages/Sitemap.tsx
// HTML Sitemap Page for Better SEO and User Navigation
import { Link } from 'react-router-dom';
import Navbar from '../components/Home/Navbar';
import Footer from '../components/Home/footer-home';
import SEO from '../components/SEO/SEO';
import { 
  Home, 
  Scissors, 
  Image, 
  BookOpen,
  Calendar,
  Mail
} from 'lucide-react';

interface SitemapSection {
  title: string;
  icon: React.FC<{ className?: string }>;
  links: { to: string; label: string; description?: string }[];
}

export const Sitemap: React.FC = () => {
  const sitemapSections: SitemapSection[] = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { to: '/', label: 'Home', description: 'Welcome to Beautiful Brows & Henna' },
        { to: '/about', label: 'About Us', description: 'Learn about our story and expertise' },
        { to: '/contact', label: 'Contact', description: 'Get in touch with us' },
      ],
    },
    {
      title: 'Services',
      icon: Scissors,
      links: [
        { to: '/services', label: 'All Services', description: 'Browse all our beauty services' },
        { to: '/services#threading', label: 'Threading Services', description: 'Professional eyebrow and facial threading' },
        { to: '/services#henna', label: 'Henna Services', description: 'Traditional and bridal henna art' },
        { to: '/services#lashes', label: 'Lash Extensions', description: 'Classic, volume, and hybrid lashes' },
      ],
    },
    {
      title: 'Portfolio & Reviews',
      icon: Image,
      links: [
        { to: '/gallery', label: 'Gallery', description: 'View our work portfolio' },
        { to: '/testimonials', label: 'Testimonials', description: 'Read client reviews and feedback' },
      ],
    },
    {
      title: 'Blog & Resources',
      icon: BookOpen,
      links: [
        { to: '/blog', label: 'Beauty Blog', description: 'Tips, guides, and beauty trends' },
      ],
    },
    {
      title: 'Account & Bookings',
      icon: Calendar,
      links: [
        { to: '/login', label: 'Login', description: 'Access your account' },
        { to: '/register', label: 'Register', description: 'Create a new account' },
        { to: '/my-appointment', label: 'My Appointments', description: 'Manage your bookings' },
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Sitemap - Beautiful Brows & Henna | All Pages"
        description="Complete sitemap of Beautiful Brows & Henna website. Find all our pages including services, gallery, blog, and contact information."
        keywords="sitemap, site navigation, beauty services sitemap, Baltimore salon pages"
        canonical="https://beautifulbrowsandhenna.com/sitemap"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light mb-4">
                Site Map
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Browse all pages and services available on Beautiful Brows & Henna
              </p>
            </div>
          </div>
        </div>

        {/* Sitemap Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sitemapSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.title}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {section.title}
                    </h2>
                  </div>
                  
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-neutral-900 font-medium group-hover:text-amber-600 transition-colors flex-shrink-0">
                              →
                            </span>
                            <div>
                              <div className="text-neutral-900 font-medium group-hover:text-amber-600 transition-colors">
                                {link.label}
                              </div>
                              {link.description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {link.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Need Help Finding Something?
            </h3>
            <p className="text-gray-700 mb-4">
              Can't find what you're looking for? Our team is here to help you navigate our services and answer any questions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>

          {/* SEO Text */}
          <div className="mt-12 prose prose-gray max-w-none">
            <h3 className="text-2xl font-light text-neutral-900 mb-4">
              About Beautiful Brows & Henna
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Beautiful Brows & Henna is Baltimore's premier destination for professional threading, 
              henna art, and lash extension services. Our experienced beauticians are dedicated to 
              enhancing your natural beauty with precision and care. Browse our complete sitemap above 
              to explore all our services, view our gallery of work, read client testimonials, and 
              learn more about what makes us the best choice for your beauty needs in Baltimore, Maryland.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Sitemap;
