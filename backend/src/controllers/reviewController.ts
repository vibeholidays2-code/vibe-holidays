import { Request, Response } from 'express';
import Review from '../models/Review';

// @desc    Create a new review (public)
// @route   POST /api/reviews
export const createReview = async (req: Request, res: Response) => {
    try {
        const { name, email, rating, comment, destination } = req.body;

        if (!name || !email || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, rating, and comment are required',
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        const review = await Review.create({
            name,
            email,
            rating,
            comment,
            destination,
            status: 'pending',
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your review! It will be visible after approval.',
            data: review,
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e: any) => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get approved reviews (public)
// @route   GET /api/reviews
export const getApprovedReviews = async (_req: Request, res: Response) => {
    try {
        const reviews = await Review.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('-email');

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter: any = {};
        if (status && ['pending', 'approved', 'rejected'].includes(status as string)) {
            filter.status = status;
        }

        const reviews = await Review.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update review status (admin)
// @route   PUT /api/admin/reviews/:id
export const updateReviewStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status (pending, approved, rejected) is required',
            });
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({
            success: true,
            message: `Review ${status}`,
            data: review,
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete a review (admin)
// @route   DELETE /api/admin/reviews/:id
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted',
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
