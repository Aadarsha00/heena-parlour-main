import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, AlertCircle, Eye } from "lucide-react";
import type {
  GalleryItem as ApiGalleryItem,
  GalleryResponse as ApiGalleryResponse,
} from "../../interface/gallery.interface";
import { getAllGalleryImages } from "../../api/gallery.api";

// Use imported types to avoid conflicts
type LocalGalleryItem = ApiGalleryItem;
type LocalGalleryResponse = ApiGalleryResponse;

export default function OurWork() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const {
    data: galleryData,
    isLoading,
    isError,
    error,
  } = useQuery<LocalGalleryResponse, Error>({
    queryKey: ["galleryImages", "ourWork"],
    queryFn: getAllGalleryImages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Process the data to get first 4 images excluding salon category
  const images =
    galleryData?.results
      ?.filter((img: LocalGalleryItem) => img.category !== "salon")
      .slice(0, 4) || [];

  // Fallback images in case API fails or no images available
  const fallbackImages: LocalGalleryItem[] = [
    {
      id: 1,
      image_url: "/pictures/image1.jpg",
      caption: "Premium Lash Extensions",
      category: "lashes",
      is_featured: false,
    },
    {
      id: 2,
      image_url: "/pictures/img2.jpg",
      caption: "Intricate Henna Artistry",
      category: "henna",
      is_featured: false,
    },
    {
      id: 3,
      image_url: "/pictures/img4.jpg",
      caption: "Precision Brow Sculpting",
      category: "brows",
      is_featured: false,
    },
    {
      id: 4,
      image_url: "/pictures/services.jpg",
      caption: "Flawless Beauty Services",
      category: "henna",
      is_featured: false,
    },
  ];

  const displayImages = images.length > 0 ? images : fallbackImages;

  const handleViewGallery = () => {
    // Navigate to gallery page - replace with your navigation logic
    window.location.href = "/gallery";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/pictures/placeholder.jpg"; // Use your placeholder image
  };

  return (
    <section className="bg-gradient-to-br from-stone-50 via-amber-50/30 to-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <span className="text-sm font-medium text-stone-600 tracking-widest uppercase">
              Portfolio
            </span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </div>

          <h2 className="text-5xl font-display font-light text-stone-900 mb-6">
            Our
            <span className="block text-6xl font-thin bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent mt-2">
              Artistry
            </span>
          </h2>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover the precision and artistry behind our threading, henna,
            lash extensions, and beauty services
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-stone-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-stone-600 font-light">
              Curating our finest work...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/30 rounded-3xl p-8 mb-12 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Gallery Temporarily Unavailable
                </h3>
                <p className="text-red-700 leading-relaxed">
                  {error?.message ||
                    "We're experiencing technical difficulties."}{" "}
                  Please enjoy these sample images of our work.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {displayImages.map((img) => (
              <div
                key={img.id}
                className="group relative"
                onMouseEnter={() => setHoveredId(img.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={img.image_url}
                      alt={img.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={handleImageError}
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent transition-opacity duration-500 ${
                        hoveredId === img.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-amber-200 tracking-wider uppercase">
                            {img.category}
                          </span>
                        </div>
                        <h3 className="text-white font-medium leading-tight">
                          {img.caption}
                        </h3>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {img.is_featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                          Featured
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-stone-600 text-sm font-medium mb-1 capitalize">
                          {img.category} Service
                        </p>
                        <h3 className="text-stone-900 font-medium leading-tight">
                          {img.caption}
                        </h3>
                      </div>
                      <div
                        className={`w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center transition-all duration-300 ${
                          hoveredId === img.id
                            ? "bg-gradient-to-r from-amber-400 to-yellow-500 rotate-45"
                            : ""
                        }`}
                      >
                        <ArrowRight
                          className={`w-4 h-4 transition-colors duration-300 ${
                            hoveredId === img.id
                              ? "text-white"
                              : "text-stone-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Full Gallery Button */}
        {!isLoading && (
          <div className="text-center">
            <button
              onClick={handleViewGallery}
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-stone-900/25 transform hover:-translate-y-1"
            >
              <span>Explore Complete Gallery</span>
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>

            <p className="text-stone-500 text-sm mt-4 font-light">
              View {displayImages.length > 4 ? "50+" : "more"} examples of our
              premium services
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
