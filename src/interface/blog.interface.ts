export interface BlogPost {
  id: number;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  is_featured: boolean;
  published_at: string;
  slug: string;
}

export interface BlogApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}
