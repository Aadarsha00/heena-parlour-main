/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import Navbar from "../Home/Navbar";
import Footer from "../Home/footer-home";
import { getBlogPostBySlug, getRecentBlogPosts } from "../../api/blog.api";
import { getServicesBySpecificCategory } from "../../api/services.api";
import type { ServiceCategory } from "../../interface/services.interface";
import type { BlogPost } from "../../interface/blog.interface";

// Helper function to construct full image URL
const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop";
  
  // If it's already a full URL (http/https)
  if (imageUrl.startsWith("http")) {
    // If it's from the backend and missing /media/, insert it
    if (imageUrl.includes("api-beautiful-eyebrow.ctrlbits.xyz")) {
      // Replace /blog/ with /media/blog/ if not already present
      if (!imageUrl.includes("/media/")) {
        return imageUrl.replace("ctrlbits.xyz/blog/", "ctrlbits.xyz/media/blog/");
      }
    }
    return imageUrl;
  }
  
  // If it's a relative path, prepend the base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api-beautiful-eyebrow.ctrlbits.xyz/api/";
  return baseUrl + imageUrl;
};

const useBlogPost = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => {
      if (!slug) throw new Error("Blog slug is required");
      return getBlogPostBySlug(slug);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

const useRelatedServices = (category: string) => {
  return useQuery({
    queryKey: ["relatedServices", category],
    queryFn: () => getServicesBySpecificCategory(category as ServiceCategory),
    enabled: !!category,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

const useRecentPosts = () => {
  return useQuery({
    queryKey: ["recentBlogPosts"],
    queryFn: async () => {
      const data = await getRecentBlogPosts();
      return Array.isArray(data) ? data : data.results || [];
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: blog,
    isLoading: blogLoading,
    error: blogError,
  } = useBlogPost(slug);

  const { data: recentPosts = [], isLoading: recentLoading } = useRecentPosts();

  const {
    data: relatedServices,
    isLoading: servicesLoading,
    error: servicesError,
  } = useRelatedServices(blog?.category || "");

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const capitalizeCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryFAQs = (category: string) => {
    const faqs: any = {
      threading: [
        {
          question: "How long does redness last after threading?",
          answer:
            "Redness usually fades within 30 minutes to 2 hours depending on skin sensitivity. Applying a cold compress can help reduce any irritation.",
        },
        {
          question: "Can I wear makeup after threading?",
          answer:
            "It's best to avoid makeup for 24 hours after threading to prevent irritation and allow your skin to heal properly.",
        },
        {
          question: "How often should I get my eyebrows threaded?",
          answer:
            "Most people need threading every 3-4 weeks, depending on hair growth rate and desired shape maintenance.",
        },
      ],
      beauty: [
        {
          question: "How often should I get a facial?",
          answer:
            "For most people, a professional facial every 4-6 weeks is ideal to maintain healthy skin and address specific concerns.",
        },
        {
          question: "What should I expect during my first facial?",
          answer:
            "Your first facial will include a skin consultation, cleansing, exfoliation, extractions if needed, and a customized mask based on your skin type.",
        },
        {
          question: "Can I wear makeup after a facial?",
          answer:
            "It's best to avoid makeup for at least 6-12 hours after a facial to let your skin breathe and absorb the treatment benefits.",
        },
      ],
      lash: [
        {
          question: "How long do lash extensions last?",
          answer:
            "Lash extensions typically last 4-6 weeks, but infills every 2-3 weeks are recommended to maintain a full look.",
        },
        {
          question: "Can I wear mascara with lash extensions?",
          answer:
            "It's best to avoid mascara with lash extensions, especially waterproof formulas, as they can damage the lashes and shorten their lifespan.",
        },
        {
          question: "How should I care for my lash extensions?",
          answer:
            "Avoid oil-based products, don't rub your eyes, and gently cleanse your lashes daily to maintain hygiene and longevity.",
        },
      ],
      henna: [
        {
          question: "How long does henna last on the skin?",
          answer:
            "Henna typically lasts 1-3 weeks depending on skin type, placement, and how often the area is washed or exfoliated.",
        },
        {
          question: "How can I make my henna stain darker?",
          answer:
            "For a darker stain, leave the henna on for at least 4-6 hours, avoid water for 24 hours after removal, and apply lemon-sugar solution while drying.",
        },
        {
          question: "Is henna safe for all skin types?",
          answer:
            "Natural henna is generally safe, but black henna may contain harmful chemicals. Always do a patch test to avoid allergic reactions.",
        },
      ],
      news: [
        {
          question: "What are your salon opening hours?",
          answer:
            "Our salon is open from 9:00 AM to 6:00 PM, Monday through Friday.",
        },
        {
          question: "Do you accept walk-in clients?",
          answer:
            "Yes, we welcome walk-ins! However, availability may vary depending on the time and service required.",
        },
        {
          question: "Do I need an appointment for volume lashes?",
          answer:
            "Yes, volume lash services require an appointment due to the time and precision involved. Please book in advance.",
        },
      ],
    };
    return faqs[category.toLowerCase()] || faqs.threading;
  };

  if (blogLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FCFAED] py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse flex flex-col lg:flex-row gap-10">
              {/* Main content skeleton */}
              <div className="w-full max-w-[655px]">
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-48 mb-6"></div>
                <div className="h-64 bg-gray-300 rounded mb-6"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
              </div>
              {/* Sidebar skeleton */}
              <div className="flex flex-col gap-6 lg:ml-32">
                <div className="bg-gray-300 rounded-3xl h-96 w-full lg:w-[510px]"></div>
                <div className="bg-gray-300 rounded-3xl h-48 w-full lg:w-[350px]"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (blogError || !blog) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FCFAED] py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-serif mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              {blogError instanceof Error
                ? blogError.message
                : "The blog post you're looking for doesn't exist."}
            </p>
            <Link
              to="/blog"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
            >
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}

      <nav className="text-sm p-3 bg-[#fbf5c7] my-2 w-full -mb-1">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/" className="text-gray-800 hover:underline">
            Home
          </Link>
          <span className="text-gray-800 mx-2">/</span>
          <Link to="/blog" className="text-gray-800 hover:underline">
            Blog
          </Link>
          <span className="text-gray-800 mx-2">/</span>
          <span className="text-gray-800">
            {capitalizeCategory(blog.category)}
          </span>
          <span className="text-gray-800 mx-2">/</span>
          <span className="text-orange-600 truncate max-w-xs inline-block -mb-1">
            {blog.title}
          </span>
        </div>
      </nav>

      <div className="bg-[#FCFAED] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* LEFT MAIN BLOG CONTENT */}
          <div className="w-full lg:max-w-[700px]">
            <p className="text-sm text-gray-500 mb-2">
              {formatDate(blog.published_at)}
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif mb-3 leading-tight break-words">
              {blog.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Category: {capitalizeCategory(blog.category)}
            </p>

            {blog.featured_image_url && (
              <img
                src={getImageUrl(blog.featured_image_url)}
                alt={blog.title}
                className="w-full max-h-[450px] rounded-xl object-cover mb-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/pictures/img4.jpg"; // fallback image
                }}
              />
            )}

            <p className="mb-8 text-gray-700 text-lg leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Share Icons */}
            <div className="mb-8 text-sm text-gray-700 flex gap-6">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Facebook"
              >
                <i className="fab fa-facebook-square text-3xl text-blue-600" />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Instagram"
              >
                <i className="fab fa-instagram text-3xl text-pink-600" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  blog.title
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Twitter"
              >
                <i className="fab fa-twitter text-3xl text-blue-400" />
              </a>
            </div>

            <article className="prose max-w-none mb-12">
              {blog.content ? (
                parse(blog.content)
              ) : (
                <div className="text-gray-600">
                  <p>Content not available for this blog post.</p>
                </div>
              )}
            </article>

            {/* FAQ */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">
                Frequently Asked Questions
              </h2>
              {getCategoryFAQs(blog.category).map((faq: any, index: any) => (
                <details
                  key={index}
                  className="mb-4"
                  open={index === 0} // first open by default
                >
                  <summary className="cursor-pointer font-medium py-3 text-lg hover:text-orange-600 transition-colors">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-4">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="flex flex-col gap-10 lg:ml-8 w-full lg:w-[420px]">
            {/* Book Appointment */}
            <div className="w-full bg-white rounded-2xl shadow-md p-6 md:p-8 border">
              <h2 className="text-xl font-semibold mb-3 text-center">
                Book Your Threading Service
              </h2>
              <p className="text-center text-sm text-gray-600 mb-6 leading-relaxed">
                Ready for perfectly shaped brows? Schedule your appointment with
                our threading experts.
              </p>

              <form className="space-y-5 rounded-2xl">
                <select
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  <option>Select a Service.....</option>
                </select>

                <input
                  type="date"
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed"
                  disabled
                />

                <select
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  <option>Select Preferred Stylist...</option>
                </select>

                <input
                  type="time"
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed"
                  disabled
                />

                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed placeholder-gray-400"
                  disabled
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed placeholder-gray-400"
                  disabled
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded text-gray-400 bg-gray-100 cursor-not-allowed placeholder-gray-400"
                  disabled
                />

                <div className="flex justify-center pt-4">
                  <Link
                    to="/services"
                    className="bg-black text-white px-6 py-3 rounded-full hover:opacity-90 transition-all duration-200 inline-block text-center"
                  >
                    Book Appointment
                  </Link>
                </div>
              </form>
            </div>

            {/* Related Services */}
            <div className="bg-white rounded-3xl shadow-md p-5 w-full">
              <h3 className="text-lg font-semibold mb-4">Related Services</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {servicesLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex space-x-3 items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                          <div className="h-3 bg-gray-300 rounded w-full animate-pulse" />
                        </div>
                      </div>
                    ))
                ) : servicesError ||
                  !relatedServices?.results ||
                  relatedServices.results.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiSearch className="text-gray-400 w-6 h-6" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      No Related Services
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Related services for "
                      {capitalizeCategory(blog?.category || "")}" category are
                      currently not available.
                    </p>
                  </div>
                ) : (
                  relatedServices.results.slice(0, 3).map((service) => (
                    <div
                      key={service.id}
                      className="flex space-x-3 items-center hover:bg-gray-50 p-3 rounded transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {service.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {service.description ||
                            `Professional ${service.name.toLowerCase()} service`}
                        </p>
                        {service.price && (
                          <p className="text-xs text-orange-600 font-semibold mt-1">
                            Starting from ${service.price}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {relatedServices?.results &&
                relatedServices.results.length > 3 && (
                  <div className="mt-5 text-center">
                    <Link
                      to={`/services?category=${blog?.category}`}
                      className="text-xs text-orange-600 hover:underline"
                    >
                      View all {capitalizeCategory(blog?.category || "")}{" "}
                      services
                    </Link>
                  </div>
                )}
            </div>

            {/* Related Posts */}
            <div className="bg-white rounded-3xl shadow-md p-5 w-full">
              <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
              <div className="space-y-5 max-h-[300px] overflow-y-auto">
                {recentLoading
                  ? Array(2)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index}>
                          <div className="w-full h-28 bg-gray-300 rounded mb-3 animate-pulse" />
                          <div className="h-3 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                          <div className="h-2 bg-gray-300 rounded w-1/2 animate-pulse" />
                        </div>
                      ))
                  : recentPosts.slice(0, 2).map((post: BlogPost) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <div className="hover:bg-gray-50 p-3 rounded transition-colors">
                          {post.featured_image_url ? (
                            <img
                              src={getImageUrl(post.featured_image_url)}
                              alt={post.title}
                              className="w-full h-28 bg-gray-300 rounded mb-3 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-28 bg-gray-300 rounded mb-3" />
                          )}
                          <p className="font-medium text-sm line-clamp-2 leading-relaxed">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            {formatDate(post.published_at)}
                          </p>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetailPage;
