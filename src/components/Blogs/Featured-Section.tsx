import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, type JSX } from "react";
import { getFeaturedBlogPosts } from "../../api/blog.api";

// Type definitions for better type safety
interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  published_at: string;
  featured_image_url?: string;
  author?: string;
}

interface FeaturedBlogResponse {
  results?: BlogPost[];
  data?: BlogPost[];
}

// Normalize API response helper
const normalizeBlogResponse = (data: unknown): BlogPost[] => {
  if (!data) return [];

  // Handle array format
  if (Array.isArray(data)) {
    return data;
  }

  // Handle object with results or data property
  if (typeof data === "object" && data !== null) {
    const response = data as FeaturedBlogResponse;
    if (response.results && Array.isArray(response.results)) {
      return response.results;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
  }

  return [];
};

const FeaturedSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: blogData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredBlogPosts"],
    queryFn: getFeaturedBlogPosts,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on auth errors
    throwOnError: false, // Don't throw errors, handle gracefully
  });

  const handleReadMore = (slug: string): void => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const featuredPosts = normalizeBlogResponse(blogData);

  const filteredPosts = featuredPosts.filter((post: BlogPost) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageSrc = (post: BlogPost, fallback: string): string => {
    return post.featured_image_url || fallback;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    fallback: string
  ): void => {
    const target = e.target as HTMLImageElement;
    target.src = fallback;
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-amber-50/20 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.03),transparent_50%)]" />

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-b border-amber-100/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8">
            <span className="text-sm text-amber-600 font-light">Home</span>
            <div className="w-1 h-1 bg-amber-400 rounded-full" />
            <span className="text-sm text-gray-600 font-light">Blog</span>
          </nav>

          {/* Title Section */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600" />
              <span className="text-xs font-medium tracking-[0.3em] text-amber-700 uppercase">
                Expert Insights
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight leading-tight">
              Beauty Tips &
              <span className="block text-4xl lg:text-5xl font-extralight text-amber-600 mt-2">
                Expert Advice
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed font-light max-w-2xl mb-8">
              Discover professional luxury insights, threading tutorials, henna
              care guides, and lash maintenance tips from our certified experts.
            </p>

            {/* Premium Search */}
            <div className="relative max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full blur-sm opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search our beauty insights..."
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-amber-200/50 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all duration-300 shadow-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600" />
            <span className="text-sm font-medium tracking-[0.2em] text-amber-700 uppercase">
              Featured Stories
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-amber-400 to-amber-600" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-light text-black tracking-tight">
            Latest Insights
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse delay-200" />
              <span className="ml-4 text-gray-600 font-light">
                Loading insights...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-light">
                Unable to load featured posts
              </p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured Post - Large */}
            <article
              className={`group ${
                filteredPosts.length === 1 ? "lg:col-span-12" : "lg:col-span-8"
              } bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-1 border border-gray-100/50`}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <img
                  src={getImageSrc(filteredPosts[0], "pictures/img4.webp")}
                  alt={`${filteredPosts[0].title} - Beauty wellness blog from Heena Parlour Baltimore professional henna and threading salon`}
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => handleImageError(e, "pictures/img4.webp")}
                />

                {/* Overlay Content */}
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <span className="inline-block bg-amber-400 text-black text-xs font-medium px-4 py-2 rounded-full mb-4">
                    {filteredPosts[0].category}
                  </span>
                  <h3 className="text-3xl lg:text-4xl font-light text-white mb-4 leading-tight">
                    {filteredPosts[0].title}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <p className="text-gray-600 leading-relaxed mb-6 font-light">
                  {filteredPosts[0].excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-light">
                      {featuredPosts[0].author || "Admin"}
                    </span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="font-light">
                      {formatDate(filteredPosts[0].published_at)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleReadMore(filteredPosts[0].slug)}
                    className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-medium text-sm px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5"
                  >
                    <span>Read More</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            {/* Second Featured Post */}
            {filteredPosts.length > 1 && (
              <article className="lg:col-span-4 group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-1 border border-gray-100/50">
                <div className="relative overflow-hidden">
                  <img
                    src={getImageSrc(filteredPosts[1], "pictures/img3.webp")}
                    alt={`${filteredPosts[1].title} - Beauty care tips and wellness advice from professional henna and threading salon Heena Parlour`}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => handleImageError(e, "pictures/img3.webp")}
                  />

                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-medium px-3 py-1 rounded-full">
                      {filteredPosts[1].category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-light text-black mb-3 leading-tight group-hover:text-amber-700 transition-colors duration-300">
                    {filteredPosts[1].title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-light">
                    {filteredPosts[1].excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 font-light">
                      <div>{filteredPosts[1].author || "Admin"}</div>
                      <div className="mt-1">
                        {formatDate(filteredPosts[1].published_at)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReadMore(filteredPosts[1].slug)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors duration-300 flex items-center gap-1 group/link"
                    >
                      <span>Read</span>
                      <svg
                        className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>
        )}

        {/* No Results State */}
        {filteredPosts.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 font-light">
              {searchTerm
                ? `No results for "${searchTerm}"`
                : "No featured posts available at the moment"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
