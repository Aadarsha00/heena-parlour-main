import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
} from "lucide-react";
import { getBlogCategories, getBlogPosts } from "../../api/blog.api";
import type { BlogApiResponse } from "../../interface/blog.interface";

const POSTS_PER_PAGE = 9;

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

export default function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  // Fetch categories for filter buttons
  const { data: backendCategories = [] } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });

  // Create categories array with "All Posts" first, then backend categories
  const categories = ["All Posts", ...backendCategories];

  // Fetch blog posts with filters
  const {
    data: blogResponse,
    isLoading,
    error,
  } = useQuery<BlogApiResponse>({
    queryKey: ["blogPosts", selectedCategory, currentPage],
    queryFn: () =>
      getBlogPosts({
        category:
          selectedCategory === "All Posts" ? undefined : selectedCategory,
        is_published: true,
      }),
  });

  // Handle pagination (client-side for now, can be moved to backend)
  const allPosts = blogResponse?.results || [];
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle navigation to blog post
  const handleReadMore = (slug: string) => {
    // Replace with your navigation logic
    window.location.href = `/blog/${slug}`;
  };

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  if (error) {
    return (
      <div className="bg-gradient-to-br from-stone-50 via-amber-50/30 to-white min-h-screen flex items-center justify-center">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/30 rounded-3xl p-8 max-w-md mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Unable to Load Posts
              </h3>
              <p className="text-red-700">
                We're experiencing technical difficulties. Please try again
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 via-amber-50/30 to-white min-h-screen">
      {/* Header Section */}
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <span className="text-sm font-medium text-stone-600 tracking-widest uppercase">
              Insights
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>

          <h1 className="text-5xl font-display font-light text-stone-900 mb-6">
            Beauty
            <span className="block text-6xl font-thin bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent mt-2">
              Journal
            </span>
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover expert tips, trends, and insights from our beauty
            professionals
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium tracking-wide transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-lg"
                    : "bg-white/80 backdrop-blur-sm text-stone-600 hover:bg-white hover:shadow-md border border-stone-200/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-stone-600 font-light">
            Loading inspiring content...
          </p>
        </div>
      )}

      {/* Blog Grid */}
      {!isLoading && (
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gradient-to-r from-stone-200 to-stone-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-stone-500" />
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">
                  No Posts Found
                </h3>
                <p className="text-stone-600">
                  {selectedCategory !== "All Posts"
                    ? `No posts available in "${selectedCategory}" category.`
                    : "No blog posts are currently available."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {paginatedPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
                      onMouseEnter={() => setHoveredPost(post.id)}
                      onMouseLeave={() => setHoveredPost(null)}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageUrl(post.featured_image_url)}
                          alt={`${post.title} - Professional beauty blog from Heena Parlour Baltimore henna services, threading salon and lash extensions`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop";
                          }}
                        />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                            {post.category}
                          </span>
                        </div>

                        {/* Read More Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-center justify-center transition-opacity duration-300 ${
                            hoveredPost === post.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          <button
                            onClick={() => handleReadMore(post.slug)}
                            className="bg-white/90 backdrop-blur-sm text-stone-900 px-6 py-3 rounded-full font-medium hover:bg-white transition-all duration-200 transform hover:scale-105"
                          >
                            Read Article
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <h2 className="text-xl font-medium text-stone-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors duration-200">
                          {post.title}
                        </h2>

                        <p className="text-stone-600 leading-relaxed mb-6 font-light">
                          {post.excerpt}
                        </p>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-stone-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>
                                {"Beautiful Eyebrow Threading & Henna"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.published_at)}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReadMore(post.slug)}
                            className="flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors duration-200"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-stone-200/30 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 text-stone-600" />
                    </button>

                    <div className="flex gap-2">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-12 h-12 rounded-full font-medium transition-all duration-200 ${
                                pageNum === currentPage
                                  ? "bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-lg"
                                  : "bg-white/80 backdrop-blur-sm text-stone-600 border border-stone-200/30 hover:bg-white hover:shadow-md"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-stone-200/30 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                )}

                {/* Results Summary */}
                <div className="text-center mt-12">
                  <p className="text-stone-500 font-light">
                    Showing{" "}
                    <span className="font-medium">{paginatedPosts.length}</span>{" "}
                    of <span className="font-medium">{allPosts.length}</span>{" "}
                    articles
                    {selectedCategory !== "All Posts" && (
                      <span>
                        {" "}
                        in{" "}
                        <span className="font-medium">
                          "{selectedCategory}"
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
