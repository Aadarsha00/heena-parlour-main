export type GalleryCategory = "brows" | "henna" | "lashes" | "salon";

export interface GalleryItem {
  id: number;
  image_url: string;
  caption: string;
  category: GalleryCategory;
  is_featured: boolean;
}

export interface GalleryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GalleryItem[];
}

export type CategoryMap = {
  [key in "All" | GalleryCategory]: string;
};
