import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "../../api/services.api";
import type { Service } from "../../interface/services.interface";
import type { JSX } from "react";

interface PriceListProps {
  className?: string;
}

interface ServiceRowProps {
  service: Service;
  index: number;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ service, index }) => {
  const formatPrice = (price: string, serviceName: string): string => {
    const variablePricingServices = ["lash fills", "henna art", "henna party"];
    const isVariablePrice = variablePricingServices.some((keyword) =>
      serviceName.toLowerCase().includes(keyword)
    );

    if (serviceName.toLowerCase().includes("party packages")) {
      return "Contact for pricing";
    }

    return isVariablePrice ? `from $${price}` : `$${price}`;
  };

  return (
    <tr
      className="group border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent transition-all duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="py-6 pr-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="font-light text-gray-900 tracking-wide">
            {service.name}
          </span>
        </div>
      </td>
      <td className="py-6 text-right">
        <span className="font-medium text-black tracking-tight">
          {formatPrice(service.price, service.name)}
        </span>
      </td>
    </tr>
  );
};

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white py-24 px-6 flex items-center justify-center">
    <div className="relative max-w-2xl w-full">
      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-20 blur-sm" />
      <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-15 blur-sm" />

      <div className="relative bg-white/90 backdrop-blur-sm border border-black/5 rounded-3xl p-12 shadow-xl shadow-black/5">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mx-auto mb-6 animate-pulse" />
          <p className="text-lg font-light text-gray-600">
            Loading our services...
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ErrorState: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white py-24 px-6 flex items-center justify-center">
    <div className="relative max-w-2xl w-full">
      {/* Floating Elements */}
      <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-20 blur-sm" />
      <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-15 blur-sm" />

      <div className="relative bg-white/90 backdrop-blur-sm border border-black/5 rounded-3xl p-12 shadow-xl shadow-black/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl rotate-45 mx-auto mb-6">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center -rotate-45">
              <span className="text-amber-600 text-xl">⚡</span>
            </div>
          </div>
          <h3 className="text-xl font-light text-black mb-2">
            Service Unavailable
          </h3>
          <p className="text-gray-500 leading-relaxed">
            We're experiencing technical difficulties. Please refresh or try
            again in a moment.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function PriceList({
  className = "",
}: PriceListProps): JSX.Element {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allServices"] as const,
    queryFn: getAllServices,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const services: Service[] = data?.results || [];

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white py-24 px-6 ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute top-32 left-20 w-40 h-40 bg-black rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-24 w-32 h-32 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Luxurious Header */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 blur-xl rounded-full" />
            <h1 className="relative text-5xl md:text-6xl font-extralight text-black tracking-[-0.02em] leading-tight">
              Price List
            </h1>
          </div>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Transparent pricing for our comprehensive beauty services
          </p>
        </div>

        {/* Premium Price Table */}
        <div className="relative max-w-3xl mx-auto">
          {/* Floating Elements */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-20 h-20 bg-gradient-to-r from-yellow-400/15 to-amber-500/15 rounded-full blur-xl" />

          <div className="relative bg-white/90 backdrop-blur-sm border border-black/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50/50 to-amber-50/30 px-12 py-8 border-b border-gray-100/50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-light text-gray-900 tracking-wide">
                  Service
                </h3>
                <h3 className="text-lg font-light text-gray-900 tracking-wide">
                  Investment
                </h3>
              </div>
            </div>

            {/* Services List */}
            <div className="px-12 py-6">
              {services.length > 0 ? (
                <table className="w-full">
                  <tbody>
                    {services.map((service: Service, index: number) => (
                      <ServiceRow
                        key={service.id}
                        service={service}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <span className="text-amber-500 text-2xl">✨</span>
                  </div>
                  <p className="text-gray-500 text-lg font-light">
                    Services will be available soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-full px-6 py-3">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            <p className="text-sm text-gray-600 font-light">
              All prices are subject to change. Contact us for current rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
