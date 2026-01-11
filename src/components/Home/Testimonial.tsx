import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "../../api/review.api";
import type { JSX } from "react";

interface Review {
  Rating: string | number;
  Review: string;
  Name: string;
  Date: string;
}

interface TestimonialCardProps {
  review: Review;
  index: number;
}

const TestimonialCard = ({ review, index }: TestimonialCardProps) => {
  const rating = Number(review.Rating) || 0;

  return (
    <div
      className="group relative bg-gradient-to-br from-white to-amber-50/30 backdrop-blur-sm border border-amber-100/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-700 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 150}ms`,
        animation: "fadeInUp 0.8s ease-out forwards",
      }}
    >
      {/* Decorative golden accent */}
      <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transform -translate-y-0.5"></div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-6">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 transition-colors duration-300 ${
              i < rating ? "text-amber-400 drop-shadow-sm" : "text-gray-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="text-gray-700 leading-relaxed mb-8 font-light text-lg relative">
        <span className="text-amber-400 text-4xl font-serif absolute -top-2 -left-1 opacity-20">
          "
        </span>
        {review.Review}
      </blockquote>

      {/* Client Info */}
      <div className="flex items-center justify-between pt-4 border-t border-amber-100/50">
        <div>
          <p className="font-medium text-gray-900 text-lg">{review.Name}</p>
          <p className="text-sm text-gray-500 font-light">{review.Date}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
          <span className="text-amber-600 font-medium text-lg">
            {review.Name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8 animate-pulse">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="bg-gray-100 rounded-2xl p-8 h-64 flex-1"></div>
    ))}
  </div>
);

export default function ClientTestimonials(): JSX.Element {
  const { data, isLoading, isError } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (isError || !data || !Array.isArray(data)) {
    return (
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">
            Unable to load testimonials at this time.
          </p>
        </div>
      </section>
    );
  }

  const reviewsToShow = data.slice(0, 3);

  return (
    <section className="py-24 px-6 lg:px-20 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-transparent to-amber-400"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Client{" "}
            <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Testimonials
            </span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Discover why clients trust us for their beauty needs — authentic
            experiences from real customers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {reviewsToShow.map((review, index) => (
            <TestimonialCard
              key={`${review.Name}-${index}`}
              review={review}
              index={index}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/testimonials"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-full hover:shadow-lg hover:shadow-gray-900/25 transition-all duration-300 hover:scale-105 font-medium"
          >
            View All Testimonials
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
          </a>
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
      `}</style>
    </section>
  );
}
