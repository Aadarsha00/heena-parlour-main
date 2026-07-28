import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import type {
  GalleryItem as ApiGalleryItem,
  GalleryResponse as ApiGalleryResponse,
} from "../../interface/gallery.interface";
import { getAllGalleryImages } from "../../api/gallery.api";
import { Link } from "react-router-dom";
import { getApiAssetUrl } from "../../config/api";

// Use imported types to avoid conflicts
type LocalGalleryItem = ApiGalleryItem;
type LocalGalleryResponse = ApiGalleryResponse;

export default function OurWork() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

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
      image_url: "/pictures/image1.webp",
      caption: "Premium Lash Extensions",
      category: "lashes",
      is_featured: false,
    },
    {
      id: 2,
      image_url: "/pictures/img2.webp",
      caption: "Intricate Henna Artistry",
      category: "henna",
      is_featured: false,
    },
    {
      id: 3,
      image_url: "/pictures/img4.webp",
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
  const getDisplayImageUrl = (imageUrl: string) =>
    images.length > 0 ? getApiAssetUrl(imageUrl) : imageUrl;
  const selectedImage =
    selectedImageIndex === null ? null : displayImages[selectedImageIndex];

  useEffect(() => {
    if (selectedImageIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImageIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((currentIndex) =>
          currentIndex === null
            ? null
            : (currentIndex - 1 + displayImages.length) % displayImages.length
        );
      }

      if (event.key === "ArrowRight") {
        setSelectedImageIndex((currentIndex) =>
          currentIndex === null
            ? null
            : (currentIndex + 1) % displayImages.length
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayImages.length, selectedImageIndex]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = "/pictures/image1.webp";
  };

  return (
    <>
      <section className="w-full bg-gradient-to-br from-stone-50 via-amber-50/30 to-white py-20 px-6 md:px-10 lg:px-16">
        <div className="w-full">
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
          <div className="flex w-full flex-wrap gap-8 mb-16">
            {displayImages.map((img, index) => (
              <button
                type="button"
                key={img.id}
                onClick={() => setSelectedImageIndex(index)}
                aria-label={`Preview ${img.caption}`}
                className="group relative min-w-0 basis-64 flex-1 rounded-3xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50"
                onMouseEnter={() => setHoveredId(img.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={getDisplayImageUrl(img.image_url)}
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
              </button>
            ))}
          </div>
        )}

        {/* View Full Gallery Button */}
        {!isLoading && (
          <div className="text-center">
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-stone-900/25 transform hover:-translate-y-1"
            >
              <span>Explore Complete Gallery</span>
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-300">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>

            <p className="text-stone-500 text-sm mt-4 font-light">
              View {displayImages.length > 4 ? "50+" : "more"} examples of our
              premium services
            </p>
          </div>
        )}
        </div>
      </section>

      {selectedImage && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.caption}
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            aria-label="Close image preview"
            className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="h-5 w-5" />
          </button>

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex - 1 + displayImages.length) %
                      displayImages.length
                  );
                }}
                aria-label="Previous artwork"
                className="absolute left-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedImageIndex(
                    (selectedImageIndex + 1) % displayImages.length
                  );
                }}
                aria-label="Next artwork"
                className="absolute right-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <figure
            className="relative max-h-[90vh] max-w-6xl overflow-hidden rounded-3xl bg-stone-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getDisplayImageUrl(selectedImage.image_url)}
              alt={selectedImage.caption}
              className="max-h-[82vh] w-auto max-w-full object-contain"
              onError={handleImageError}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-5 pt-16 text-white">
              <span className="text-xs font-medium uppercase tracking-widest text-amber-300">
                {selectedImage.category}
              </span>
              <p className="mt-1 text-lg font-medium">
                {selectedImage.caption}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
