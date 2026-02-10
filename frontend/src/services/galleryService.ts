import api from './api';
import { Gallery } from '../types/gallery';

// Helper function to retry API calls
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries = 2,
  delay = 2000
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error: any) {
      const isLastAttempt = i === maxRetries;
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      
      if (isLastAttempt || !isTimeout) {
        throw error;
      }
      
      console.log(`Request timeout, retrying... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

export const galleryService = {
  // Get all gallery images
  getAllImages: async (): Promise<Gallery[]> => {
    return retryRequest(async () => {
      const response = await api.get('/gallery');
      return response.data.data || response.data;
    });
  },

  // Get images by category
  getImagesByCategory: async (category: string): Promise<Gallery[]> => {
    return retryRequest(async () => {
      const response = await api.get(`/gallery/${category}`);
      return response.data.data || response.data;
    });
  },
};
