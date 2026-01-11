import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "../../api/review.api";

export default function AllClientTestimonials() {
  const { data } = useQuery({
    queryKey: ["review"],
    queryFn: fetchReviews,
  });

  // Defensive fallback: if no data yet, show nothing or a loading placeholder
  if (!data || !Array.isArray(data)) {
    return <p>Loading testimonials...</p>;
  }

  return (
    <section className="bg-white py-16 px-6 lg:px-20 text-center">
      <h2 className="text-3xl font-semibold mb-2 font-display">
        Client Testimonials
      </h2>
      <p className="text-gray-600 mb-12">
        Discover why clients trust us for their beauty needs — honest
        testimonials from real customers.
      </p>

      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        {data.map((item, idx) => {
          // Parse rating as number to render stars
          const rating = Number(item.Rating) || 0;
          return (
            <div
              key={idx}
              className="bg-[#fafae2] w-full max-w-sm rounded-xl shadow px-6 py-6 text-left"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < rating ? "text-black" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-800 mb-6">{item.Review}</p>

              {/* User Info */}
              <div>
                <p className="font-semibold">{item.Name}</p>
                <p className="text-sm text-gray-600">{item.Date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
