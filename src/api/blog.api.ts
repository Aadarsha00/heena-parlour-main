/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../components/axios/api.axios";
import type { BlogApiResponse, BlogPost } from "../interface/blog.interface";

// List blog posts with optional filters (PUBLIC)
export const getBlogPosts = async (params?: {
  category?: string;
  is_published?: boolean;
  is_featured?: boolean;
}): Promise<BlogApiResponse> => {
  try {
    const response = await api.get("/blog/", { 
      params,
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

// Get blog post details by slug (PUBLIC)
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost> => {
  try {
    const response = await api.get(`/blog/${slug}/`, {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

// Get featured blog posts (PUBLIC)
export const getFeaturedBlogPosts = async (): Promise<any> => {
  try {
    const response = await api.get("/blog/featured/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    // If it's a 401 error, it means the endpoint requires auth
    // Return empty results instead of throwing
    if (error?.response?.status === 401) {
      return { results: [], count: 0, next: null, previous: null };
    }
    throw error?.response?.data?.message || error?.message;
  }
};

// Get blog posts by category (grouped) (PUBLIC)
export const getBlogPostsByCategory = async (): Promise<any> => {
  try {
    const response = await api.get("/blog/by_category/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

// Get recent blog posts (PUBLIC)
export const getRecentBlogPosts = async (): Promise<any> => {
  try {
    const response = await api.get("/blog/recent/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};

// Get blog categories (PUBLIC)
export const getBlogCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get("/blog/", {
      skipAuthRedirect: true, // Mark as public endpoint
    } as any);
    const allPosts = Array.isArray(response.data.results)
      ? response.data.results
      : [];

    const rawCategories = allPosts
      .map((post: BlogPost) => post.category)
      .filter(
        (category: any): category is string => typeof category === "string"
      );

    const categories: string[] = [...new Set<string>(rawCategories)];

    return categories;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to fetch categories";
  }
};