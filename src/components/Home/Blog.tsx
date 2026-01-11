import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getBlogPosts } from "../../api/blog.api";
import type { JSX } from "react";

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  featured_image_url?: string;
  published_at: string;
}

interface BlogResponse {
  results: BlogPost[];
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
  onReadMore: (slug: string) => void;
}

const BlogCard = ({ post, index, onReadMore }: BlogCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "pictures/img3.png";
  };

  return (
    <article
      className="group bg-gradient-to-br from-white to-amber-50/20 backdrop-blur-sm border border-amber-100/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-700 hover:-translate-y-2 cursor-pointer"
      style={{
        animationDelay: `${index * 200}ms`,
        animation: "fadeInUp 0.8s ease-out forwards",
      }}
      onClick={() => onReadMore(post.slug)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.featured_image_url || "pictures/img3.png"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-medium rounded-full shadow-lg backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300 leading-tight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 font-light">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-amber-100/50">
          <div className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Admin</span>
            <div className="mt-1">{formatDate(post.published_at)}</div>
          </div>

          <div className="flex items-center gap-2 text-amber-600 font-medium text-sm group-hover:text-amber-700 transition-colors duration-300">
            Read More
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
          </div>
        </div>
      </div>
    </article>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden">
        <div className="h-56 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({}: { error: unknown }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Unable to load blog posts
    </h3>
    <p className="text-gray-600 text-sm max-w-md mx-auto">
      We're experiencing some technical difficulties. Please try again later.
    </p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-amber-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No blog posts yet
    </h3>
    <p className="text-gray-600 text-sm max-w-md mx-auto">
      We're working on some amazing content. Check back soon for our latest
      beauty tips and insights.
    </p>
  </div>
);

const BlogSection = (): JSX.Element => {
  const navigate = useNavigate();

  const {
    data: blogPosts,
    isLoading,
    isError,
    error,
  } = useQuery<BlogResponse>({
    queryKey: ["allBlogs"],
    queryFn: () => getBlogPosts({ is_published: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const displayPosts = blogPosts?.results?.slice(0, 3) || [];

  const handleReadMore = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <section className="py-24 px-6 lg:px-20 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-transparent to-amber-400"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Beauty{" "}
            <span className="font-medium bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Insights
            </span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Stay updated with our latest beauty advice, expert tips, and salon
            news.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : isError ? (
          <ErrorState error={error} />
        ) : displayPosts.length > 0 ? (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {displayPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-full hover:shadow-lg hover:shadow-gray-900/25 transition-all duration-300 hover:scale-105 font-medium"
              >
                View All Articles
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
              </Link>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default BlogSection;
