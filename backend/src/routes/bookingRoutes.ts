import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createBooking);

// Protected admin routes
router.get('/', authenticate, getAllBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id', authenticate, updateBookingStatus);

export default router;
