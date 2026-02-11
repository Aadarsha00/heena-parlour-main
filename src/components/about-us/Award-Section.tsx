import React from "react";

interface AwardsSectionProps {
  awardImage?: string;
  className?: string;
}

const AwardsSection: React.FC<AwardsSectionProps> = ({
  awardImage = "/pictures/Award2.jpeg", 
  className = "",
}) => {
  return (
    <section
      className={`relative bg-white py-32 overflow-hidden ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute top-24 left-10 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-24 right-10 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Award Image */}
          <div className="relative">
            {/* Decorative Frame */}
            <div className="absolute -inset-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-3xl opacity-30" />

            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <img
                src={awardImage}
                alt="Best of Baltimore 2025 Award Winner | Beautiful Brows & Henna Top-Rated Threading Henna Lash Salon Maryland"
                className="w-full h-[480px] object-cover"
                loading="lazy"
              />

              {/* Golden Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mb-8" />
              <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 leading-tight">
                Awards &
                <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-extralight">
                  Recognition
                </span>
              </h2>
            </div>

            {/* Award Meta */}
            <p className="text-sm uppercase tracking-wide text-yellow-700 font-medium">
              The Baltimore Sun • 2025
            </p>

            <h3 className="text-2xl lg:text-3xl font-light text-gray-900">
              Best of Baltimore — Best Brow Threading
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-xl">
              Beautiful Eyebrow Threading & Henna was proudly recognized by{" "}
              <span className="font-medium text-gray-800">
                The Baltimore Sun
              </span>{" "}
              as the{" "}
              <span className="font-medium text-gray-800">
                Best Brow Threading Salon in Baltimore for 2025
              </span>
              . This award reflects our unwavering commitment to precision,
              hygiene, traditional artistry, and exceptional client care.
            </p>

            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-xl">
              Chosen by readers and the local community, this recognition
              celebrates the trust our clients place in us and our dedication to
              delivering consistently outstanding results.
            </p>

            {/* Accent Line */}
            <div className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-px bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="w-6 h-px bg-gradient-to-r from-amber-500 to-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
