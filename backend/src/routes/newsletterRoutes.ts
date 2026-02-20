import { Router, Request, Response } from 'express';
import Newsletter from '../models/Newsletter';

const router = Router();

// POST /api/newsletter - Subscribe to newsletter
router.post('/newsletter', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(200).json({
                success: true,
                message: 'You are already subscribed!',
            });
        }

        await Newsletter.create({ email: email.toLowerCase().trim() });

        return res.status(201).json({
            success: true,
            message: 'Successfully subscribed to the newsletter!',
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(200).json({
                success: true,
                message: 'You are already subscribed!',
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
            });
        }

        console.error('Newsletter subscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
        });
    }
});

export default router;
