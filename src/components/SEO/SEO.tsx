import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noindex?: boolean;
}

const setMetaTag = (
  name: string,
  content: string | undefined,
  useProperty = false
) => {
  const attribute = useProperty ? "property" : "name";
  const selector = `meta[${attribute}="${name}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
};

const setCanonical = (href: string) => {
  let element =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
};

export default function SEO({
  title,
  description,
  keywords,
  ogTitle = title,
  ogDescription = description,
  ogImage,
  ogUrl,
  ogType = "website",
  canonical,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const currentUrl = `${window.location.origin}${window.location.pathname}`;
    const canonicalUrl = canonical ?? currentUrl;

    document.title = title;
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag(
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    setMetaTag("og:title", ogTitle, true);
    setMetaTag("og:description", ogDescription, true);
    setMetaTag("og:image", ogImage, true);
    setMetaTag("og:image:alt", "Beautiful Brows & Henna salon services", true);
    setMetaTag("og:url", ogUrl ?? canonicalUrl, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:site_name", "Beautiful Brows & Henna", true);

    setMetaTag("twitter:card", ogImage ? "summary_large_image" : "summary");
    setMetaTag("twitter:title", ogTitle);
    setMetaTag("twitter:description", ogDescription);
    setMetaTag("twitter:image", ogImage);
    setMetaTag("twitter:image:alt", "Beautiful Brows & Henna salon services");

    setCanonical(canonicalUrl);
  }, [
    canonical,
    description,
    keywords,
    noindex,
    ogDescription,
    ogImage,
    ogTitle,
    ogType,
    ogUrl,
    title,
  ]);

  return null;
}
