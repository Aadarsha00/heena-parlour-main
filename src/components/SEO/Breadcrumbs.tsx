// src/components/SEO/Breadcrumbs.tsx
// SEO-Friendly Breadcrumbs Component with Schema.org markup
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect } from 'react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  // Add schema.org structured data for breadcrumbs
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": `https://beautifulbrowsandhenna.com${item.href}`
      }))
    };

    // Check if breadcrumb schema already exists
    let scriptElement = document.querySelector('script[data-breadcrumb-schema]');
    
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'application/ld+json');
      scriptElement.setAttribute('data-breadcrumb-schema', 'true');
      document.head.appendChild(scriptElement);
    }
    
    scriptElement.textContent = JSON.stringify(schema);

    return () => {
      // Cleanup on unmount
      const element = document.querySelector('script[data-breadcrumb-schema]');
      if (element) {
        element.remove();
      }
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`bg-gray-50 border-b border-gray-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              className="flex items-center text-gray-500 hover:text-neutral-900 transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={item.href} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {isLast ? (
                  <span 
                    className="text-neutral-900 font-medium"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-neutral-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
