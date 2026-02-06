import api from './api';
import { Gallery } from '../types/gallery';

export const galleryService = {
  // Get all gallery images
  getAllImages: async (): Promise<Gallery[]> => {
    const response = await api.get('/gallery');
    return response.data.data || response.data;
  },

  // Get images by category
  getImagesByCategory: async (category: string): Promise<Gallery[]> => {
    const response = await api.get(`/gallery/${category}`);
    return response.data.data || response.data;
  },
};
