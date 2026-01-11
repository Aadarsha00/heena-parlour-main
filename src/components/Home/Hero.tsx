import { Eye, Palette, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

// Type definitions
interface HeroImage {
  desktop: string;
  mobile: string;
  alt: string;
}

interface GalleryImage {
  src: string;
  alt: string;
}

const heroImages: HeroImage = {
  desktop: "/pictures/hero1.png",
  mobile: "/pictures/mobile-hero.png",
  alt: "Beautiful Eyebrow Threading & Henna - Premium Beauty Services",
};

const galleryImages: GalleryImage[] = [
  { src: "/pictures/image1.jpg", alt: "Expert eyebrow threading service" },
  { src: "/pictures/img2.jpg", alt: "Artistic henna design application" },
  { src: "/pictures/img3.png", alt: "Luxurious lash extension service" },
  { src: "/pictures/img4.jpg", alt: "Premium beauty treatment results" },
];

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-amber-50/20 to-white overflow-hidden">
      <div className="w-full max-w-[2100px] mx-auto">
        {/* Hero Section */}
        <div className="relative min-h-[85vh] flex items-center">
          {/* Background Images */}
          <div className="absolute inset-0">
            {/* Desktop Image */}
            <img
              src={heroImages.desktop}
              alt={heroImages.alt}
              className="hidden md:block w-full h-full object-cover object-center"
            />
            {/* Mobile Image */}
            <img
              src={heroImages.mobile}
              alt={heroImages.alt}
              className="block md:hidden w-full h-full object-cover object-center"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent md:from-white/90 md:via-white/60 md:to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12">
            <div
              className={`max-w-2xl transition-all duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              {/* Subtitle */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse" />
                <span className="text-sm font-medium text-amber-700 tracking-wide">
                  Premium Beauty Experience
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-display font light text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-neutral-900 leading-tight mb-6">
                Elegance In Every
                <br />
                <span className="font-semibold text-amber-600">Thread.</span>
                <span className="block font-light">Art In Every</span>
                <span className="font-semibold text-amber-600">Stroke.</span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed mb-8 max-w-xl font-light">
                Experience the art of beauty with our expert threading, henna
                and lash services. Where precision meets artistry.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="/services" className="group">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-4 rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
                    <span className="flex items-center justify-center gap-2">
                      Book Appointment
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </a>

                <a href="/about" className="group">
                  <button className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-neutral-900 hover:border-amber-500 px-8 py-4 rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
                    <span className="flex items-center justify-center gap-2">
                      Discover Our Story
                      <svg
                        className="w-4 h-4 transition-transform group-hover:rotate-45"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </span>
                  </button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium text-neutral-800">
                    5.0 Rating
                  </span>
                </div>
                <div className="h-4 w-px bg-neutral-300" />
                <span>500+ Happy Clients</span>
                <div className="h-4 w-px bg-neutral-300" />
                <span>Expert Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-black text-white py-4 px-6">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-amber-300">
                  Special Offer
                </span>
              </div>
              <span className="text-neutral-400">•</span>
              <span className="font-medium">
                10% off for first-time clients
              </span>
              <span className="text-neutral-400">•</span>
              <code className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-lg font-mono text-sm border border-amber-500/30">
                WELCOME10
              </code>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-amber-50/10">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-display sm:text-4xl lg:text-5xl font-light text-neutral-900 leading-tight">
                    Welcome to
                    <br />
                    <span className="font-semibold text-amber-600">
                      Beautiful Eyebrow
                    </span>
                    <br />
                    <span className="text-2xl sm:text-3xl lg:text-4xl text-neutral-700">
                      Threading & Henna
                    </span>
                  </h2>

                  <p className="text-lg text-neutral-600 leading-relaxed max-w-xl font-light">
                    We are dedicated to enhancing your natural beauty through
                    our expert threading, henna, and lash services. With skilled
                    artists and a commitment to quality, we ensure each client
                    leaves feeling confident and beautiful.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {[
                    {
                      icon: Sparkles,
                      title: "Expert Threading",
                      desc: "Precision shaping for perfect brows",
                      accent: "border-l-amber-400",
                    },
                    {
                      icon: Palette,
                      title: "Artistic Henna",
                      desc: "Beautiful designs and natural color",
                      accent: "border-l-yellow-400",
                    },
                    {
                      icon: Eye,
                      title: "Luxurious Lashes",
                      desc: "Extensions and treatments for stunning eyes",
                      accent: "border-l-amber-500",
                    },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-4 p-5 rounded-xl bg-white border-l-4 ${feature.accent} shadow-sm hover:shadow-md transition-shadow duration-300`}
                    >
                      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <span className="text-xl">
                          <feature.icon className="w-5 h-5 text-amber-500" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-4">
                {galleryImages.map((image, idx) => (
                  <div
                    key={idx}
                    className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                      idx % 3 === 0 ? "row-span-2" : ""
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full object-cover ${
                        idx % 3 === 0 ? "h-80" : "h-40"
                      } sm:${idx % 3 === 0 ? "h-96" : "h-48"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-amber-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

                    {/* Golden accent border on hover */}
                    <div className="absolute inset-0 border-2 border-amber-400/0 hover:border-amber-400/50 transition-colors duration-300 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
