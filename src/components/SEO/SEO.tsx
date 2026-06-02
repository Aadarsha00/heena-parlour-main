// src/components/SEO/SEO.tsx
// Dynamic SEO Meta Tags Component for React 19
import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonical,
  noindex = false,
}) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (content) {
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attribute, name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      }
    };

    // Standard meta tags
    if (description) updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    
    // Robots meta tag
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Open Graph tags
    if (ogTitle) updateMetaTag('og:title', ogTitle, true);
    if (ogDescription) updateMetaTag('og:description', ogDescription, true);
    if (ogImage) updateMetaTag('og:image', ogImage, true);
    if (ogUrl) updateMetaTag('og:url', ogUrl, true);
    
    // Twitter Card tags
    if (ogTitle) updateMetaTag('twitter:title', ogTitle);
    if (ogDescription) updateMetaTag('twitter:description', ogDescription);
    if (ogImage) updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    } else {
      // Set canonical to current URL if not specified
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', window.location.href);
    }

    // Update OG:URL if not explicitly set
    if (!ogUrl) {
      updateMetaTag('og:url', window.location.href, true);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonical, noindex]);

  return null; // This component doesn't render anything
};

export default SEO;
