import type { JSX } from "react";

export default function ServicesHero(): JSX.Element {
  return (
    <section className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full max-w-[2100px] mx-auto h-[280px] sm:h-[360px] md:h-[480px] lg:h-[640px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Mobile Image */}
          <img
            src="/pictures/services.png"
            alt="Professional beauty services at Beautiful Eyebrow"
            className="absolute inset-0 w-full h-full object-cover sm:hidden"
            loading="eager"
          />
          {/* Desktop Image */}
          <img
            src="/pictures/services.png"
            alt="Professional beauty services at Beautiful Eyebrow"
            className="absolute inset-0 w-full h-full object-cover hidden sm:block"
            loading="eager"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border border-amber-400 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-amber-400 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-4 opacity-80">
              <nav aria-label="Breadcrumb">
                <span className="text-amber-200 text-sm font-light">Home</span>
                <span className="text-white/60 mx-2">•</span>
                <span className="text-white text-sm font-light">Services</span>
              </nav>
            </div>

            {/* Main Heading */}
            <h1
              className="font-light font-display text-white mb-6 tracking-tight leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
                animation: "fadeInUp 1s ease-out",
              }}
            >
              Our{" "}
              <span className="font-medium bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Services
              </span>
            </h1>

            {/* Decorative Line */}
            <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 mb-6 opacity-90"></div>

            {/* Description */}
            <p
              className="text-white/90 font-light leading-relaxed max-w-2xl"
              style={{
                fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                animation: "fadeInUp 1s ease-out 0.3s both",
              }}
            >
              Discover our comprehensive range of professional beauty services,
              crafted with precision and care. We provide transparent pricing
              and detailed descriptions to help you make informed decisions
              about your beauty journey.
            </p>
          </div>
        </div>
      </div>

      {/* Services Menu Introduction */}
      <div className="py-20 px-6 lg:px-20 bg-gradient-to-br from-white to-amber-50/20 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-transparent to-amber-400"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-3xl font-display lg:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Beauty Services{" "}
              <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Menu
              </span>
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8"></div>
          </div>

          {/* Description Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div
              className="bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 text-left"
              style={{ animation: "fadeInLeft 0.8s ease-out" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mb-6">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Expert Techniques
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Our skilled specialists use traditional techniques combined with
                modern innovations to deliver exceptional results that enhance
                your natural beauty.
              </p>
            </div>

            <div
              className="bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 text-left"
              style={{ animation: "fadeInRight 0.8s ease-out 0.2s both" }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mb-6">
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Premium Products
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We exclusively use high-quality, premium products to ensure the
                best results and a luxurious experience for every client.
              </p>
            </div>
          </div>

          {/* Main Description */}
          <div
            className="bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 mb-8"
            style={{ animation: "fadeInUp 0.8s ease-out 0.4s both" }}
          >
            <p className="text-gray-700 font-light leading-relaxed text-lg mb-4">
              At Beautiful Eyebrow Threading & Henna, we offer a comprehensive
              range of beauty services designed to enhance your natural features
              and boost your confidence. Each service is performed with
              meticulous attention to detail and personalized care.
            </p>
          </div>

          {/* Pricing Note */}
          <div
            className="flex items-center justify-center gap-3 text-gray-500"
            style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-light">
              All prices are in USD and subject to change. Contact us for custom
              packages and special requests.
            </p>
          </div>
        </div>
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
