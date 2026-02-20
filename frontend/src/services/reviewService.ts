import api from './api';

export interface Review {
    _id: string;
    name: string;
    email?: string;
    rating: number;
    comment: string;
    destination?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface CreateReviewData {
    name: string;
    email: string;
    rating: number;
    comment: string;
    destination?: string;
}

export const reviewService = {
    // Submit a review (public)
    createReview: async (data: CreateReviewData) => {
        const response = await api.post('/reviews', data);
        return response.data;
    },

    // Get approved reviews (public)
    getApprovedReviews: async (): Promise<Review[]> => {
        const response = await api.get('/reviews');
        return response.data.data;
    },

    // Admin: Get all reviews
    getAllReviews: async (status?: string): Promise<Review[]> => {
        const params = status ? { status } : {};
        const response = await api.get('/admin/reviews', { params });
        return response.data.data;
    },

    // Admin: Update review status
    updateReviewStatus: async (id: string, status: string) => {
        const response = await api.put(`/admin/reviews/${id}`, { status });
        return response.data;
    },

    // Admin: Delete review
    deleteReview: async (id: string) => {
        const response = await api.delete(`/admin/reviews/${id}`);
        return response.data;
    },
};
