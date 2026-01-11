import { useQuery } from "@tanstack/react-query";
import ServiceCard from "../../ui/Service-Card";
import {
  getLashServices,
  getPartyServices,
  getThreadingServices,
} from "../../api/services.api";
import { Link } from "react-router-dom";
import type { JSX } from "react";

// Base service interface from API
interface ApiService {
  name: string;
  price: string | number;
  id?: string | number;
}

// API response structure - let's handle both possible formats
type ApiResponse = ApiService[] | { results: ApiService[] };

// Service for display with formatted price
interface DisplayService {
  name: string;
  price: string;
}

// Static service configuration
interface StaticService {
  id: number;
  title: string;
  description: string;
  image: string;
  apiCategory: "threading" | "party" | "lashes";
}

// Combined service with pricing data
interface ServiceWithPrices extends StaticService {
  prices: DisplayService[];
}

// Static service data with enhanced descriptions
const staticServices: StaticService[] = [
  {
    id: 1,
    title: "Threading",
    description:
      "Precision eyebrow shaping that enhances your natural beauty with clean, defined lines.",
    image: "./pictures/img2.jpg",
    apiCategory: "threading",
  },
  {
    id: 2,
    title: "Henna",
    description:
      "Intricate traditional artistry that transforms your hands into stunning masterpieces.",
    image: "./pictures/image1.jpg",
    apiCategory: "party",
  },
  {
    id: 3,
    title: "Lash Extension",
    description:
      "Luxurious volume and length that creates captivating, long-lasting allure.",
    image: "./pictures/img4.jpg",
    apiCategory: "lashes",
  },
];

// Helper function to normalize API response
const normalizeApiResponse = (data: ApiResponse | undefined): ApiService[] => {
  if (!data) return [];

  // Handle array format
  if (Array.isArray(data)) {
    return data;
  }

  // Handle object with results property
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray(data.results)
  ) {
    return data.results;
  }

  return [];
};

// Helper function to format price
const formatPrice = (price: string | number): string => {
  const priceStr = String(price);
  return priceStr.startsWith("$") ? priceStr : `$${priceStr}`;
};

const ServicesSection = (): JSX.Element => {
  // Fetch threading services
  const { data: threadingData } = useQuery({
    queryKey: ["services", "threading"],
    queryFn: getThreadingServices,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch lash services
  const { data: lashData } = useQuery({
    queryKey: ["services", "lashes"],
    queryFn: getLashServices,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch party services
  const { data: partyData } = useQuery({
    queryKey: ["services", "party"],
    queryFn: getPartyServices,
    staleTime: 5 * 60 * 1000,
  });

  // Get services for a specific category with proper typing
  const getServicesForCategory = (
    category: StaticService["apiCategory"]
  ): DisplayService[] => {
    let rawData: ApiResponse | undefined;

    switch (category) {
      case "threading":
        rawData = threadingData;
        break;
      case "lashes":
        rawData = lashData;
        break;
      case "party":
        rawData = partyData;
        break;
      default:
        return [];
    }

    const services = normalizeApiResponse(rawData);

    return services
      .slice(0, 3)
      .filter((service): service is ApiService =>
        Boolean(
          service?.name &&
            service?.price !== undefined &&
            service?.price !== null
        )
      )
      .map(
        (service): DisplayService => ({
          name: service.name,
          price: formatPrice(service.price),
        })
      );
  };

  // Combine static data with API pricing
  const servicesWithPrices: ServiceWithPrices[] = staticServices.map(
    (staticService) => ({
      ...staticService,
      prices: getServicesForCategory(staticService.apiCategory),
    })
  );

  return (
    <section className="relative bg-gradient-to-b from-white via-amber-50/30 to-white py-24 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.05),transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600" />
            <span className="text-sm font-medium tracking-[0.2em] text-amber-700 uppercase">
              Premium Services
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-amber-400 to-amber-600" />
          </div>

          <h2 className="text-5xl font-display lg:text-6xl font-light text-black mb-6 tracking-tight">
            Luxury
            <span className="block text-4xl lg:text-5xl font-extralight text-amber-600 mt-2">
              Redefined
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Experience unparalleled artistry where every service is meticulously
            crafted to enhance your natural elegance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {servicesWithPrices.map((service, index) => (
            <div
              key={service.id}
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                image={service.image}
                prices={service.prices}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            to="/services"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-medium text-sm tracking-wide uppercase transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
          >
            <span>Explore All Services</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          <div className="mt-8 flex justify-center">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
