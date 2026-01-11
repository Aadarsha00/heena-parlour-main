// Service categories based on your data
export type ServiceCategory = "lashes" | "threading" | "party" | "hair";

// Individual service interface
export interface Service {
  id: number;
  name: string;
  price: string;
  category: ServiceCategory;
  duration_minutes: number;
  deposit_amount: string;
  requires_deposit: boolean;
  description?: string;
}

// API response interface for paginated services
export interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export interface ServicesListProps {
  services: Service[];
  loading?: boolean;
  error?: string | null;
}
