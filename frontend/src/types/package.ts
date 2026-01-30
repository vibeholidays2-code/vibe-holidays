export interface Package {
  _id: string;
  name: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  images: string[];
  thumbnail?: string;
  brochureUrl?: string;
  featured: boolean;
  active: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFilters {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface PackagesResponse {
  success: boolean;
  data: Package[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PackageResponse {
  success: boolean;
  data: Package;
}
