import { useLocation } from "react-router";

import SEO from "./SEO";

const SITE_ORIGIN = "https://beautifulbrowsandhenna.com";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/pictures/hero1.png`;

interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

const PUBLIC_ROUTE_METADATA: Record<string, RouteMetadata> = {
  "/": {
    title:
      "Beautiful Brows & Henna | Threading, Henna & Lashes in Baltimore",
    description:
      "Explore threading, henna, lash, and beauty services at Beautiful Brows & Henna in Baltimore, Maryland.",
  },
  "/about": {
    title: "About Beautiful Brows & Henna | Baltimore Beauty Salon",
    description:
      "Learn about Beautiful Brows & Henna and our approach to threading, henna, lashes, and client care in Baltimore.",
  },
  "/services": {
    title: "Beauty Services | Beautiful Brows & Henna Baltimore",
    description:
      "Browse available threading, henna, lash, and party beauty services, with current details and prices.",
  },
  "/gallery": {
    title: "Gallery | Beautiful Brows & Henna Baltimore",
    description:
      "View examples of threading, henna, lash, and beauty work from Beautiful Brows & Henna.",
  },
  "/contact": {
    title: "Contact Beautiful Brows & Henna | Baltimore, MD",
    description:
      "Find the salon address, phone number, hours, directions, and contact form for Beautiful Brows & Henna.",
  },
  "/blog": {
    title: "Beauty Blog | Beautiful Brows & Henna",
    description:
      "Read beauty care articles and salon updates from Beautiful Brows & Henna.",
  },
  "/testimonials": {
    title: "Client Testimonials | Beautiful Brows & Henna",
    description:
      "Read feedback shared by clients of Beautiful Brows & Henna in Baltimore.",
  },
  "/sitemap": {
    title: "Site Map | Beautiful Brows & Henna",
    description:
      "Browse the public pages and resources on the Beautiful Brows & Henna website.",
  },
  "/privacy": {
    title: "Privacy Policy | Beautiful Brows & Henna",
    description:
      "Learn how Beautiful Brows & Henna handles account, booking, and contact information.",
  },
  "/terms": {
    title: "Terms of Service | Beautiful Brows & Henna",
    description:
      "Read the terms for using the Beautiful Brows & Henna website and appointment service.",
  },
};

const PRIVATE_ROUTE_METADATA: Record<string, RouteMetadata> = {
  "/login": {
    title: "Sign In | Beautiful Brows & Henna",
    description: "Sign in to manage your Beautiful Brows & Henna appointments.",
    noindex: true,
  },
  "/register": {
    title: "Create an Account | Beautiful Brows & Henna",
    description:
      "Create an account to request and manage salon appointments.",
    noindex: true,
  },
  "/activation-sent": {
    title: "Check Your Email | Beautiful Brows & Henna",
    description: "Account activation email instructions.",
    noindex: true,
    canonicalPath: "/login",
  },
  "/forgot-password": {
    title: "Reset Your Password | Beautiful Brows & Henna",
    description: "Request a secure account password reset link.",
    noindex: true,
  },
  "/my-appointment": {
    title: "My Appointments | Beautiful Brows & Henna",
    description: "View and manage your salon appointments.",
    noindex: true,
  },
};

const normalizePath = (pathname: string): string => {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "") || "/";
};

const getRouteMetadata = (pathname: string): RouteMetadata => {
  const normalizedPath = normalizePath(pathname);
  const exactMetadata =
    PUBLIC_ROUTE_METADATA[normalizedPath] ??
    PRIVATE_ROUTE_METADATA[normalizedPath];

  if (exactMetadata) {
    return exactMetadata;
  }

  if (/^\/blog\/[^/]+$/.test(normalizedPath)) {
    return {
      title: "Beauty Article | Beautiful Brows & Henna",
      description:
        "Read a beauty care article from Beautiful Brows & Henna.",
      type: "article",
    };
  }

  if (/^\/booking\/[^/]+(?:\/detail)?$/.test(normalizedPath)) {
    return {
      title: "Book an Appointment | Beautiful Brows & Henna",
      description: "Choose an available date and time for a salon service.",
      canonicalPath: "/services",
      noindex: true,
    };
  }

  if (/^\/activate\/[^/]+\/[^/]+$/.test(normalizedPath)) {
    return {
      title: "Activate Your Account | Beautiful Brows & Henna",
      description: "Complete account activation.",
      canonicalPath: "/login",
      noindex: true,
    };
  }

  if (
    /^\/(?:password\/reset\/confirm|reset-password)\/[^/]+\/[^/]+$/.test(
      normalizedPath
    )
  ) {
    return {
      title: "Choose a New Password | Beautiful Brows & Henna",
      description: "Set a new password for your account.",
      canonicalPath: "/forgot-password",
      noindex: true,
    };
  }

  return {
    title: "Page Not Found | Beautiful Brows & Henna",
    description: "The requested page could not be found.",
    canonicalPath: "/",
    noindex: true,
  };
};

export default function RouteSEO() {
  const { pathname } = useLocation();
  const normalizedPath = normalizePath(pathname);
  const metadata = getRouteMetadata(normalizedPath);
  const canonicalPath = metadata.canonicalPath ?? normalizedPath;
  const canonical = `${SITE_ORIGIN}${canonicalPath === "/" ? "/" : canonicalPath}`;

  return (
    <SEO
      title={metadata.title}
      description={metadata.description}
      ogTitle={metadata.title}
      ogDescription={metadata.description}
      ogImage={DEFAULT_IMAGE}
      ogUrl={canonical}
      canonical={canonical}
      noindex={metadata.noindex}
      ogType={metadata.type}
    />
  );
}
