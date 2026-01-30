import api from './api';
import { PackageFilters, PackagesResponse, PackageResponse, Package } from '../types/package';

export const packageService = {
  /**
   * Get all packages with optional filters
   */
  getPackages: async (filters?: PackageFilters): Promise<PackagesResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get<PackagesResponse>(`/packages?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single package by ID
   */
  getPackageById: async (id: string): Promise<PackageResponse> => {
    const response = await api.get<PackageResponse>(`/packages/${id}`);
    return response.data;
  },

  /**
   * Create a new package (admin only)
   */
  createPackage: async (packageData: Partial<Package>): Promise<PackageResponse> => {
    const response = await api.post<PackageResponse>('/packages', packageData);
    return response.data;
  },

  /**
   * Update an existing package (admin only)
   */
  updatePackage: async (id: string, packageData: Partial<Package>): Promise<PackageResponse> => {
    const response = await api.put<PackageResponse>(`/packages/${id}`, packageData);
    return response.data;
  },

  /**
   * Delete a package (admin only)
   */
  deletePackage: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/packages/${id}`);
    return response.data;
  },
};
