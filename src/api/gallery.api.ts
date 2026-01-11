/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../components/axios/api.axios";
import type {
  GalleryCategory,
  GalleryResponse,
} from "../interface/gallery.interface";

// Get all gallery images
export const getAllGalleryImages = async (): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to fetch gallery images";
  }
};

// Get gallery images with filters
export const getGalleryImagesWithFilters = async (params: {
  category?: GalleryCategory;
  is_featured?: boolean;
  is_active?: boolean;
}): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", { 
      params,
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to fetch gallery images";
  }
};

// Get gallery image details by ID
export const getGalleryImageById = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/gallery/${id}/`, {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to fetch gallery image";
  }
};

// Get featured gallery images
export const getFeaturedGalleryImages = async (): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/featured/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message ||
      "Failed to fetch featured gallery images"
    );
  }
};

// Get gallery images by category (grouped)
export const getGalleryImagesByCategory = async (): Promise<any> => {
  try {
    const response = await api.get("/gallery/by_category/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message ||
      "Failed to fetch gallery images by category"
    );
  }
};

// Category-specific gallery functions
export const getHairGalleryImages = async (): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      params: { category: "hair", is_active: true },
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message || "Failed to fetch hair gallery images"
    );
  }
};

export const getLashGalleryImages = async (): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      params: { category: "lashes", is_active: true },
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message || "Failed to fetch lash gallery images"
    );
  }
};

export const getThreadingGalleryImages = async (): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      params: { category: "threading", is_active: true },
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message ||
      "Failed to fetch threading gallery images"
    );
  }
};

export const getPartyGalleryImages = async (): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      params: { category: "party", is_active: true },
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message || "Failed to fetch party gallery images"
    );
  }
};

// Generic function for any category
export const getGalleryImagesBySpecificCategory = async (
  category: GalleryCategory
): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      params: { category, is_active: true },
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message ||
      `Failed to fetch ${category} gallery images`
    );
  }
};

// Get featured images by category
export const getFeaturedImagesByCategory = async (
  category: GalleryCategory
): Promise<GalleryResponse> => {
  try {
    const response = await api.get("/gallery/", {
      params: { category, is_featured: true, is_active: true },
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message ||
      `Failed to fetch featured ${category} images`
    );
  }
};
