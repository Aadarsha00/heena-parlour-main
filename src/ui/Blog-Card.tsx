import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
  slug: string;
  isFeatured: boolean;
}

const BlogCard = ({
  title,
  excerpt,
  image,
  category,
  publishedAt,
  slug,
  isFeatured,
}: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
          Featured
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg"; // fallback image
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-gray-700 transition-colors">
          <Link to={`/blog/${slug}`} className="line-clamp-2">
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatDate(publishedAt)}
          </span>
          <Link
            to={`/blog/${slug}`}
            className="text-black hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
