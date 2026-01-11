import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}

interface WhatSetsUsApartProps {
  className?: string;
  images?: string[];
}

const WhatSetsUsApart: React.FC<WhatSetsUsApartProps> = ({
  className = "",
  images = [
    "pictures/image1.jpg",
    "pictures/img2.jpg",
    "pictures/img3.png",
    "pictures/img4.jpg",
  ],
}) => {
  const features: Feature[] = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#ca8a04"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      title: "Expert Artists",
      highlight: "Master Craftspeople",
      description:
        "Our team consists of highly skilled artists with years of experience in threading, henna, and lash services. Each specialist undergoes rigorous training to maintain our standards of excellence.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#ca8a04"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
      title: "Natural Products",
      highlight: "100% Organic",
      description:
        "We use only the highest quality, natural products. Our henna is 100% organic and our lash products are hypoallergenic and cruelty-free, ensuring your safety and peace of mind.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="#ca8a04"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011 1v3m0-4h8m-8 0V1a1 1 0 00-1-1H4a1 1 0 00-1 1v3"
          />
        </svg>
      ),
      title: "Exceptional Hygiene",
      highlight: "Medical-Grade Standards",
      description:
        "New threads are used for each client, tools are sterilized using hospital-grade equipment, and our salon is cleaned thoroughly every day following strict protocols.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Client-Centered Approach",
      highlight: "Personalized Experience",
      description:
        "We begin with a comprehensive consultation to understand your unique preferences and facial structure, then deliver customized results that exceed your expectations.",
    },
  ];

  return (
    <section
      className={`relative bg-gray-50 py-32 overflow-hidden ${className}`}
    >
      {/* Background Elements */}
      <div className="absolute top-10 right-20 w-40 h-40 bg-gradient-to-br from-yellow-400/8 to-amber-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-amber-400/8 to-yellow-500/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image Gallery */}
          <div className="relative">
            {/* Decorative Frame */}
            <div className="absolute -inset-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-3xl opacity-30" />

            <div className="relative grid grid-cols-2 gap-4">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Golden Border Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="aspect-square overflow-hidden">
                    <img
                      src={src}
                      alt={`Luxury salon feature ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-20" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-20" />
          </div>

          {/* Features Content */}
          <div className="space-y-12">
            {/* Section Header */}
            <div>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mb-8" />
              <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 leading-tight">
                What Sets Us
                <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-extralight">
                  Apart
                </span>
              </h2>
            </div>

            {/* Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon Container */}
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl group-hover:from-yellow-100 group-hover:to-amber-100 transition-colors duration-300">
                    {React.cloneElement(feature.icon as React.ReactElement)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-yellow-300 to-transparent opacity-30" />
                    </div>

                    <p className="text-xs font-semibold text-yellow-700 tracking-wide uppercase mb-3">
                      {feature.highlight}
                    </p>

                    <p className="text-gray-600 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Accent */}
            <div className="pt-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="w-4 h-px bg-gradient-to-r from-amber-500 to-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatSetsUsApart;
