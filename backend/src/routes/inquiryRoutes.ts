import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  sendContactMessage,
} from '../controllers/inquiryController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
// POST /api/inquiries - Create new inquiry
router.post('/inquiries', createInquiry);

// POST /api/contact - Send contact message
router.post('/contact', sendContactMessage);

// Admin routes (protected)
// GET /api/admin/inquiries - Get all inquiries
router.get('/admin/inquiries', authenticate, getAllInquiries);

// PUT /api/admin/inquiries/:id - Update inquiry status
router.put('/admin/inquiries/:id', authenticate, updateInquiryStatus);

export default router;
