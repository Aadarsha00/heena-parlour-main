// src/config/seoMetaTags.ts
// Page Meta Tags Configuration for SEO

export interface MetaTagConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
}

export const pageMetaTags: { [key: string]: MetaTagConfig } = {
  home: {
    title: "Henna Services & Threading Salon in Baltimore, Maryland | Book Online",
    description: "Best henna parlour in Baltimore, Maryland | Professional threading, lash extensions & bridal henna services near you. Book appointments online today!",
    keywords: "henna services Baltimore, threading salon Baltimore MD, lash extensions Baltimore, bridal henna artist Maryland, beauty parlour near me",
    ogTitle: "Heena Parlour Baltimore - Professional Henna, Threading & Lash Services",
    ogDescription: "Premium beauty salon in Baltimore offering professional henna, threading, and lash extensions. Book your appointment online.",
  },
  
  services: {
    title: "Professional Beauty Services in Baltimore, Maryland | Henna, Threading, Lash",
    description: "Professional henna services, eyebrow threading, and lash extensions in Baltimore, Maryland. Expert beauticians for all your beauty needs.",
    keywords: "professional henna Baltimore, threading salon, lash extensions Baltimore, beauty services Maryland",
    ogTitle: "Our Beauty Services - Heena Parlour Baltimore",
    ogDescription: "Discover our henna, threading, and lash extension services with expert beauticians in Baltimore.",
  },
  
  about: {
    title: "About Heena Parlour Baltimore - Expert Beauty Services & Salon",
    description: "Learn about Heena Parlour Baltimore - our expert beauticians, beauty philosophy, and commitment to quality services in Baltimore, Maryland.",
    keywords: "about heena parlour, expert beauticians Baltimore, beauty salon philosophy, professional beauty services",
    ogTitle: "About Heena Parlour Baltimore",
    ogDescription: "Discover our story and meet the expert beauticians behind Heena Parlour Baltimore.",
  },
  
  gallery: {
    title: "Henna & Beauty Portfolio - Heena Parlour Baltimore | View Our Work",
    description: "Browse our beautiful portfolio of henna designs, threading work, and lash extensions in Baltimore, Maryland.",
    keywords: "henna portfolio Baltimore, threading results, lash extension gallery, beauty salon portfolio",
    ogTitle: "Our Portfolio - Heena Parlour Baltimore",
    ogDescription: "View our beautiful work and transformations from satisfied clients in Baltimore.",
  },
  
  blog: {
    title: "Beauty Tips & Wellness Blog - Henna Care Guide | Heena Parlour",
    description: "Read articles on henna care, threading maintenance, lash extension tips, and beauty wellness from our expert beauticians.",
    keywords: "henna care tips, threading maintenance, lash extension care, beauty wellness articles, henna safety",
    ogTitle: "Beauty Wellness Blog - Heena Parlour Baltimore",
    ogDescription: "Expert beauty tips and wellness articles for henna, threading, and lash care.",
  },
  
  testimonials: {
    title: "Client Reviews & Testimonials - Heena Parlour Baltimore | 5-Star Reviews",
    description: "Read real reviews and testimonials from our satisfied clients in Baltimore who trust Heena Parlour for their beauty services.",
    keywords: "heena parlour reviews, client testimonials Baltimore, beauty salon ratings, customer reviews",
    ogTitle: "Client Reviews - Heena Parlour Baltimore",
    ogDescription: "See what our happy clients say about their experience at Heena Parlour Baltimore.",
  },
  
  contact: {
    title: "Contact Heena Parlour Baltimore - Get In Touch | Book Your Service",
    description: "Contact Heena Parlour Baltimore for questions or to book your beauty appointment. Professional henna, threading, and lash services.",
    keywords: "contact heena parlour, beauty salon Baltimore contact, book appointment, professional beauty services",
    ogTitle: "Contact Heena Parlour Baltimore",
    ogDescription: "Get in touch with us to book your next beauty service appointment in Baltimore.",
  },
  
  login: {
    title: "Login - Heena Parlour Baltimore | Access Your Account",
    description: "Login to your Heena Parlour account to view appointments, manage bookings, and access exclusive features.",
    keywords: "login heena parlour, customer account, appointment management",
    ogTitle: "Login - Heena Parlour Baltimore",
    ogDescription: "Access your account to manage your beauty appointments.",
  },
  
  register: {
    title: "Create Account - Heena Parlour Baltimore | Book & Save Preferences",
    description: "Register with Heena Parlour Baltimore to book appointments, save preferences, and manage your beauty services.",
    keywords: "register account, create profile, beauty salon membership",
    ogTitle: "Register - Heena Parlour Baltimore",
    ogDescription: "Create an account to book appointments and enjoy exclusive member benefits.",
  },
};

/**
 * Update HTML meta tags dynamically
 * Usage: updateMetaTags(pageMetaTags.services)
 */
export function updateMetaTags(config: MetaTagConfig) {
  // Update title
  document.title = config.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", config.description);
  }
  
  // Update keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute("content", config.keywords);
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", config.ogTitle);
  }
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", config.ogDescription);
  }
  
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", window.location.href);
  }
}

/**
 * Service-specific meta tags
 */
export const serviceMetaTags = {
  henna: {
    title: "Professional Henna Services & Artist in Baltimore | Bridal & Custom Designs",
    description: "Expert henna artist in Baltimore offering bridal henna, traditional mehendi, party designs, and custom henna for all occasions.",
    keywords: "henna services Baltimore, henna artist Baltimore, bridal henna Maryland, mehendi designs, professional henna application",
  },
  threading: {
    title: "Professional Threading Salon in Baltimore | Eyebrow & Facial Threading",
    description: "Professional eyebrow and facial threading services in Baltimore, Maryland. Expert threading specialists for perfect brows.",
    keywords: "threading salon Baltimore, eyebrow threading, facial threading, professional threading, perfect brows",
  },
  lashes: {
    title: "Lash Extensions in Baltimore | Premium Lash Services & Extensions",
    description: "Premium lash extensions and enhancement services in Baltimore by certified professionals. Book your lash appointment online.",
    keywords: "lash extensions Baltimore, premium lash services, lash specialists, professional lash extensions",
  },
};

/**
 * Schema metadata for structured data
 */
export const schemaMetadata = {
  businessName: "Heena Parlour Baltimore",
  businessType: "BeautySalon",
  city: "Baltimore",
  state: "Maryland",
  country: "United States",
  latitude: "39.2904",
  longitude: "-76.6122",
  serviceTypes: [
    "Henna Services",
    "Threading Services",
    "Lash Extensions"
  ],
  priceRange: "$$",
  ratingValue: "4.8",
  reviewCount: "150",
};

export default pageMetaTags;
