import { useState, useEffect, type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  CategoryMap,
  GalleryCategory,
} from "../../interface/gallery.interface";
import {
  getAllGalleryImages,
  getGalleryImagesWithFilters,
} from "../../api/gallery.api";

interface GalleryItemsProps {
  className?: string;
}

interface GalleryItem {
  id: number;
  image_url: string;
  caption?: string;
  category: string;
  is_featured?: boolean;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryItem | null;
  allImages: GalleryItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  image,
  allImages,
  currentIndex,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case "ArrowRight":
          if (currentIndex < allImages.length - 1) onNavigate(currentIndex + 1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, allImages.length, onClose, onNavigate]);

  if (!isOpen || !image) return null;

  const imageUrl = image.image_url.startsWith("http")
    ? image.image_url
    : `https://api-beautiful-eyebrow.ctrlbits.xyz${image.image_url}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 max-w-7xl max-h-[90vh] w-full mx-4 flex items-center justify-center">
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-4 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
          >
            <span className="text-white text-xl">←</span>
          </button>
        )}

        {currentIndex < allImages.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-4 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
          >
            <span className="text-white text-xl">→</span>
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200"
        >
          <span className="text-white text-lg">×</span>
        </button>

        {/* Image Container */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt={image.caption || "Gallery image"}
            className="max-w-full max-h-[80vh] object-contain"
            onError={(e) => {
              const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
                <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                  <rect width="400" height="400" fill="#f8f9fa"/>
                  <text x="200" y="200" font-size="16" text-anchor="middle" fill="#999">Image not found</text>
                </svg>
              `)}`;
              e.currentTarget.src = placeholderSvg;
            }}
          />

          {/* Image Info */}
          {(image.caption || image.category) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <div className="text-white">
                {image.caption && (
                  <h3 className="text-lg font-light mb-1">{image.caption}</h3>
                )}
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="capitalize">{image.category}</span>
                  {image.is_featured && (
                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
          <span className="text-white text-sm font-light">
            {currentIndex + 1} of {allImages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

const MasonryGrid: React.FC<{
  items: GalleryItem[];
  onImageClick: (item: GalleryItem, index: number) => void;
}> = ({ items, onImageClick }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
      {items.map((item, index) => {
        const imageUrl = item.image_url.startsWith("http")
          ? item.image_url
          : `https://api-beautiful-eyebrow.ctrlbits.xyz${item.image_url}`;

        return (
          <div
            key={item.id}
            className="group relative break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={() => onImageClick(item, index)}
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={imageUrl}
                alt={item.caption || "Gallery image"}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="300" fill="#f8f9fa"/>
                      <text x="200" y="150" font-size="14" text-anchor="middle" fill="#ccc">Image not found</text>
                    </svg>
                  `)}`;
                  e.currentTarget.src = placeholderSvg;
                }}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Featured Badge */}
              {item.is_featured && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                  Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-light text-gray-900 text-sm mb-1 line-clamp-2">
                {item.caption || "Untitled"}
              </h3>
              <p className="text-xs text-gray-500 capitalize font-medium tracking-wide">
                {item.category}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LoadingMasonry: React.FC = () => (
  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
    {Array.from({ length: 12 }).map((_, i) => {
      const heights = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-60"];
      const randomHeight = heights[i % heights.length];

      return (
        <div
          key={i}
          className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-lg"
        >
          <div className={`w-full ${randomHeight} bg-gray-200 animate-pulse`} />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      );
    })}
  </div>
);

export default function GalleryItems({
  className = "",
}: GalleryItemsProps): JSX.Element {
  const categoryMap: CategoryMap = {
    All: "All",
    brows: "Eye Brows",
    henna: "Henna",
    lashes: "Lashes",
    salon: "Salon",
  };

  const categories = Object.values(categoryMap);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const getApiCategory = (displayName: string): GalleryCategory | undefined => {
    const entry = Object.entries(categoryMap).find(
      ([, label]) => label === displayName
    );
    return entry ? (entry[0] as GalleryCategory) : undefined;
  };

  const {
    data: galleryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["gallery-images", selectedCategory] as const,
    queryFn: () => {
      if (selectedCategory === "All") {
        return getAllGalleryImages();
      } else {
        const apiCategory = getApiCategory(selectedCategory);
        return getGalleryImagesWithFilters({
          category: apiCategory,
        });
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const galleryItems: GalleryItem[] = galleryData?.results || [];

  const handleImageClick = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedImage(null);
    }, 200);
  };

  const handleModalNavigate = (index: number) => {
    setSelectedIndex(index);
    setSelectedImage(galleryItems[index]);
  };

  // Error State Component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl rotate-45" />
        <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
          <span className="text-amber-600 text-2xl">⚠</span>
        </div>
      </div>
      <h3 className="text-xl font-light text-black mb-4">
        Gallery Unavailable
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md leading-relaxed">
        {error instanceof Error
          ? error.message
          : "Unable to load gallery images at the moment. Please try again."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors duration-200"
      >
        Retry
      </button>
    </div>
  );

  return (
    <>
      <section
        className={`min-h-screen bg-gradient-to-b from-white via-amber-50/15 to-white py-24 px-6 ${className}`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute top-40 left-20 w-40 h-40 bg-black rounded-full blur-3xl" />
          <div className="absolute bottom-60 right-24 w-32 h-32 bg-amber-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/10 via-transparent to-amber-400/10 blur-xl rounded-full" />
              <h1 className="relative font-display text-5xl md:text-6xl font-extralight text-black tracking-[-0.02em] leading-tight">
                Our Gallery
              </h1>
            </div>

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />

            <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Discover the artistry in every transformation
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-black text-white shadow-lg shadow-black/20"
                    : "bg-white text-black border border-black/10 hover:bg-gray-50 hover:border-black/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Content */}
          {isLoading && <LoadingMasonry />}

          {isError && <ErrorState />}

          {!isLoading && !isError && (
            <>
              {galleryItems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                    <span className="text-amber-500 text-3xl">📸</span>
                  </div>
                  <h3 className="text-xl font-light text-black mb-2">
                    No Images Found
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    No images available for the selected category.
                  </p>
                </div>
              ) : (
                <>
                  <MasonryGrid
                    items={galleryItems}
                    onImageClick={handleImageClick}
                  />

                  {/* Results Counter */}
                  <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-full px-6 py-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      <p className="text-sm text-gray-600 font-light">
                        Showing {galleryItems.length} of{" "}
                        {galleryData?.count || galleryItems.length} images
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        image={selectedImage}
        allImages={galleryItems}
        currentIndex={selectedIndex}
        onNavigate={handleModalNavigate}
      />
    </>
  );
}
