import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLashServices } from "../../api/services.api";
import type { Service } from "../../interface/services.interface";
import LoadingScreen from "../../ui/Loading";
import type { JSX } from "react";

interface LashServicesProps {
  className?: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => (
  <div
    className="group relative bg-white/80 backdrop-blur-sm border border-black/5 rounded-3xl p-10 hover:bg-white transition-all duration-700 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Luxury corner accent */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-300/10 via-yellow-400/5 to-transparent rounded-bl-[3rem] pointer-events-none" />
    <div className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-60" />

    <div className="relative z-10">
      {/* Service Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-display font-light text-black tracking-tight leading-tight">
            {service.name}
          </h3>
          <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-black text-sm font-medium px-5 py-2 rounded-full shadow-lg shadow-yellow-500/20">
            ${service.price}
          </div>
        </div>

        <p className="text-gray-600 text-base leading-relaxed font-light">
          {service.description}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent mb-8" />

      {/* Service Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          <span className="text-gray-500 text-sm font-medium tracking-wider uppercase">
            {service.duration_minutes} min
          </span>
        </div>

        <Link
          to={`/booking/${service.id}`}
          className="group/btn relative bg-black text-white text-sm font-medium px-8 py-3 rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-900 hover:shadow-xl hover:shadow-black/20"
        >
          <span className="relative z-10">Reserve Now</span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
        </Link>
      </div>
    </div>
  </div>
);

const ErrorState: React.FC = () => (
  <section className="w-full bg-gradient-to-b from-white to-gray-50/30 min-h-[60vh] flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl rotate-45" />
        <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
          <span className="text-amber-600 text-2xl">⚡</span>
        </div>
      </div>
      <h3 className="text-xl font-light text-black mb-2">
        Service Unavailable
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        We're experiencing technical difficulties. Please refresh or try again
        in a moment.
      </p>
    </div>
  </section>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-20">
    <div className="relative w-24 h-24 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-3xl" />
      <div className="absolute inset-3 bg-white rounded-2xl flex items-center justify-center">
        <span className="text-amber-500 text-3xl">✨</span>
      </div>
    </div>
    <h3 className="text-2xl font-light text-black mb-4">Coming Soon</h3>
    <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
      We're carefully curating our premium lash services. Check back soon for
      our exclusive treatments.
    </p>
  </div>
);

export default function LashServices({
  className = "",
}: LashServicesProps): JSX.Element {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lashServices"] as const,
    queryFn: getLashServices,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const services: Service[] = data?.results || [];

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <section
      className={`relative w-full bg-gradient-to-b from-white via-gray-50/20 to-white py-24 px-6 ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-20 left-10 w-32 h-32 bg-black rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Luxurious Header */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 blur-xl rounded-full" />
            <h1 className="relative font-display text-5xl md:text-6xl lg:text-7xl font-extralight text-black tracking-[-0.02em] leading-tight">
              Lash Services
            </h1>
          </div>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

          <p className="text-gray-600 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
            Elevate your natural beauty with our meticulously crafted lash
            treatments
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {services.map((service: Service, index: number) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
    </section>
  );
}
