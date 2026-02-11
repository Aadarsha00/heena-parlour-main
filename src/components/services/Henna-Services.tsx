import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPartyServices } from "../../api/services.api";
import type { Service } from "../../interface/services.interface";

import { useAuth } from "../../context/Use-Auth";
import type { JSX } from "react";

interface ServiceCardProps {
  service: Service;
  onBookNow: (e: React.MouseEvent, serviceId: number) => void;
  index: number;
}

const ServiceCard = ({ service, onBookNow, index }: ServiceCardProps) => (
  <div
    className="group bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-700 hover:-translate-y-2 flex flex-col h-full"
    style={{
      animationDelay: `${index * 150}ms`,
      animation: "fadeInUp 0.8s ease-out forwards",
    }}
  >
    {/* Header with Price Badge */}
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1">
        <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-amber-700 transition-colors duration-300">
          {service.name}
        </h3>
        <p className="text-gray-600 font-light leading-relaxed mb-4">
          {service.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="w-4 h-4 text-amber-500"
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
          <span>{service.duration_minutes} minutes</span>
        </div>
      </div>

      <div className="ml-4 flex-shrink-0">
        <div className="bg-gradient-to-r from-gray-900 to-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          ${service.price}
        </div>
      </div>
    </div>

    {/* Book Now Button */}
    <div className="mt-auto flex justify-end">
      <Link
        to={`/booking/${service.id}`}
        onClick={(e) => onBookNow(e, service.id)}
        className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
      >
        Book Now
        <svg
          className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
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
      </Link>
    </div>
  </div>
);

const PartyPackageCard = ({ service, onBookNow, index }: ServiceCardProps) => {
  const features = [
    { icon: "✨", text: "Bridal Henna Packages" },
    { icon: "👥", text: "Group Event Services" },
    { icon: "🏠", text: "On-site Services Available" },
    { icon: "🎨", text: "Custom Design Options" },
  ];

  return (
    <div
      className="group bg-gradient-to-br from-white to-amber-50/20 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-700 hover:-translate-y-1 max-w-4xl mx-auto"
      style={{
        animationDelay: `${index * 200}ms`,
        animation: "fadeInUp 0.8s ease-out forwards",
      }}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-8 w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transform -translate-y-0.5"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
              {service.name}
            </h3>
          </div>
          <p className="text-gray-600 font-light leading-relaxed text-lg">
            {service.description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <div className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-sm font-light">Starting from</span>
            <div className="text-xl font-medium">${service.price}</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-amber-100/30"
          >
            <span className="text-lg">{feature.icon}</span>
            <span className="text-gray-700 font-light">{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Book Now Button */}
      <div className="flex justify-end">
        <Link
          to={`/booking/${service.id}`}
          onClick={(e) => onBookNow(e, service.id)}
          className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
        >
          Book Package
          <svg
            className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
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
        </Link>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="py-24 px-6 lg:px-20 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
        <div className="w-20 h-0.5 bg-gray-200 mx-auto animate-pulse"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-2xl p-8 h-80 animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState = ({}: { error: unknown }) => (
  <div className="py-24 px-6 lg:px-20 bg-white">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
          Henna{" "}
          <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Services
          </span>
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
      </div>

      {/* Error Message */}
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-3">
          Unable to load services
        </h3>
        <p className="text-gray-600 font-light mb-6">
          We're experiencing some technical difficulties. Please try again
          later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
        >
          Try Again
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default function HennaServices(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["partyServices"],
    queryFn: getPartyServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const services = data?.results || [];

  // Separate individual services from party packages
  const individualServices = services.filter(
    (service: Service) => !service.name.toLowerCase().includes("package")
  );

  const partyPackages = services.filter((service: Service) =>
    service.name.toLowerCase().includes("package")
  );

  const handleBookNow = (e: React.MouseEvent, serviceId: number) => {
    e.preventDefault();

    if (isAuthenticated) {
      navigate(`/booking/${serviceId}`);
    } else {
      navigate("/login");
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <section className="py-24 px-6 lg:px-20 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-transparent to-amber-400"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Henna{" "}
            <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Experience the artistry of traditional henna with our premium
            services, perfect for special occasions and celebrations.
          </p>
        </div>

        {/* Individual Services */}
        {individualServices.length > 0 && (
          <div className="mb-20">
            <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
              Individual Services
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {individualServices.map((service: Service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBookNow={handleBookNow}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Party Packages */}
        {partyPackages.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
              Party Packages
            </h3>
            {partyPackages.map((partyPackage: Service, index) => (
              <PartyPackageCard
                key={partyPackage.id}
                service={partyPackage}
                onBookNow={handleBookNow}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
