import express from 'express';
import {
    createReview,
    getApprovedReviews,
    getAllReviews,
    updateReviewStatus,
    deleteReview,
} from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
// POST /api/reviews - Submit a new review
router.post('/reviews', createReview);

// GET /api/reviews - Get approved reviews
router.get('/reviews', getApprovedReviews);

// Admin routes (protected)
// GET /api/admin/reviews - Get all reviews
router.get('/admin/reviews', authenticate, getAllReviews);

// PUT /api/admin/reviews/:id - Update review status (approve/reject)
router.put('/admin/reviews/:id', authenticate, updateReviewStatus);

// DELETE /api/admin/reviews/:id - Delete a review
router.delete('/admin/reviews/:id', authenticate, deleteReview);

export default router;
