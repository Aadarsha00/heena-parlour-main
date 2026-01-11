import React from "react";

interface PhilosophyItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}

interface PhilosophySectionProps {
  className?: string;
}

const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  className = "",
}) => {
  const philosophies: PhilosophyItem[] = [
    {
      icon: (
        <svg
          className="w-12 h-12 mb-6"
          fill="none"
          stroke="#ca8a04"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: "Natural Approach",
      highlight: "Chemical-Free Excellence",
      description:
        "We prioritize natural beauty enhancement using traditional techniques that have stood the test of time. Our threading method is chemical-free and our henna products are plant-based.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 mb-6"
          fill="none"
          stroke="#ca8a04"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: "Personalized Service",
      highlight: "Tailored to You",
      description:
        "Each client is unique. We tailor our services to suit your features, skin tone, and personal style to bring out your natural beauty.",
    },
    {
      icon: (
        <svg
          className="w-12 h-12 mb-6"
          fill="none"
          stroke="#ca8a04"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Quality & Safety",
      highlight: "Medical-Grade Standards",
      description:
        "We uphold the highest hygiene standards. Threading is done with sanitized threads, henna is allergen-free, and our lash products are medical grade.",
    },
  ];

  return (
    <section className={`relative bg-white py-32 overflow-hidden ${className}`}>
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-8" />

          <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 leading-tight mb-8">
            Our
            <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-extralight">
              Philosophy
            </span>
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
            At Beautiful Eyebrow Threading & Henna, we believe in enhancing your
            natural beauty through time-honored techniques and personalized care
            that honors tradition while embracing modern excellence.
          </p>
        </div>

        {/* Philosophy Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {philosophies.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-100 hover:border-yellow-200 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-900/10 hover:-translate-y-2"
            >
              {/* Card Content */}
              <div className="relative p-10 lg:p-12 text-center h-full flex flex-col">
                {/* Golden Accent Line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className="text-gradient-to-br from-yellow-500 to-amber-600 mb-8 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl group-hover:from-yellow-100 group-hover:to-amber-100 transition-colors duration-300">
                    {React.cloneElement(item.icon as React.ReactElement)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-light text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className="w-8 h-px bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-6 opacity-60" />

                  <p className="text-sm font-medium text-yellow-700 mb-4 tracking-wide uppercase">
                    {item.highlight}
                  </p>

                  <p className="text-gray-600 leading-relaxed font-light text-base flex-1">
                    {item.description}
                  </p>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/0 to-amber-50/0 group-hover:from-yellow-50/30 group-hover:to-amber-50/20 transition-all duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="flex justify-center mt-20">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            <div className="w-2 h-2 bg-yellow-600 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
