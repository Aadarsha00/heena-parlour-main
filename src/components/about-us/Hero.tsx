import React from "react";
import { Link } from "react-router-dom";

interface HeroProps {
  heroImage?: string;
  storyImage?: string;
}

const Hero: React.FC<HeroProps> = ({
  heroImage = "/pictures/hero.png",
  storyImage = "/pictures/hero.png",
}) => {
  return (
    <section className="w-full flex flex-col items-center bg-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full max-w-[2200px] mx-auto relative overflow-hidden">
        <div className="relative h-[85vh] min-h-[700px] max-h-[900px]">
          <img
            src={heroImage}
            alt="Luxurious salon interior showcasing premium beauty services"
            className="w-full h-full object-cover"
            loading="eager"
          />

          {/* Sophisticated Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Golden Accent */}
                <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mb-8" />

                <h1 className="font-light font-display text-white text-4xl md:text-6xl lg:text-7xl leading-tight mb-8 tracking-wide">
                  About Our
                  <span className="block font-extralight bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                    Salon
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed font-light max-w-xl">
                  Discover the story, values, and unwavering commitment behind
                  Beautiful Eyebrow Threading & Henna.
                </p>

                <Link
                  to="/services"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/25 hover:-translate-y-0.5"
                >
                  View Our Services
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="w-full max-w-7xl mx-auto py-32 px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div>
              <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mb-6" />
              <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 leading-tight">
                Our
                <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-extralight">
                  Story
                </span>
              </h2>
            </div>

            {/* Story Content */}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg font-light">
                Beautiful Eyebrow Threading & Henna began as a small family
                business in 2010, founded by Priya Sharma, who brought her
                expertise in traditional South Asian beauty techniques to
                Baltimore.
              </p>

              <p className="text-lg font-light">
                With a passion for threading and henna artistry passed down
                through generations, Priya started with small kiosks offering
                eyebrow threading services. Her precise technique and warm
                personality quickly earned her a loyal clientele.
              </p>

              <p className="text-lg font-light">
                As demand grew, the business expanded to include henna art and
                lash services, eventually moving to our current location on
                O'Donnell Street where we continue to serve the Baltimore
                community with the same dedication to quality and personalized
                care.
              </p>
            </div>

            {/* Founder Info */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-lg">P</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-lg">
                    Priya Sharma
                  </p>
                  <p className="text-sm text-gray-600 font-light tracking-wide uppercase">
                    Founder & Lead Artist
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative lg:ml-12">
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-xl" />

            {/* Main Image Container */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-2 shadow-2xl shadow-gray-900/10">
              <div className="relative overflow-hidden bg-white">
                <img
                  src={storyImage}
                  alt="Elegant salon interior showcasing our commitment to luxury and quality"
                  className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Golden Accent Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
