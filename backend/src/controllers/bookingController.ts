import { Response } from 'express';
import Booking from '../models/Booking';
import Package from '../models/Package';
import { AuthRequest } from '../middleware/auth';
import {
  sendBookingConfirmationEmail,
  sendBookingAdminNotificationEmail,
} from '../services/emailService';

/**
 * Create new booking
 * Public endpoint
 */
export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      packageId,
      customerName,
      email,
      phone,
      travelDate,
      numberOfTravelers,
      specialRequests,
      totalPrice,
    } = req.body;

    // Verify package exists
    const packageData = await Package.findById(packageId);
    if (!packageData) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    // Create booking
    const booking = new Booking({
      packageId,
      customerName,
      email,
      phone,
      travelDate,
      numberOfTravelers,
      specialRequests,
      totalPrice,
      status: 'pending',
    });

    await booking.save();

    // Send confirmation email to customer (async, don't block response)
    sendBookingConfirmationEmail(email, {
      customerName,
      packageName: packageData.name,
      destination: packageData.destination,
      travelDate: new Date(travelDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      numberOfTravelers,
      totalPrice,
      bookingId: booking._id.toString(),
    }).catch((error) => {
      console.error('Failed to send booking confirmation email:', error);
    });

    // Send notification email to admin (async, don't block response)
    sendBookingAdminNotificationEmail({
      customerName,
      customerEmail: email,
      customerPhone: phone,
      packageName: packageData.name,
      destination: packageData.destination,
      travelDate: new Date(travelDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      numberOfTravelers,
      totalPrice,
      bookingId: booking._id.toString(),
    }).catch((error) => {
      console.error('Failed to send booking admin notification email:', error);
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the booking.',
    });
  }
};

/**
 * Get all bookings
 * Protected endpoint (admin only)
 */
export const getAllBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, page = '1', limit = '20', sortBy = 'createdAt' } = req.query;

    // Build filter object
    const filter: any = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort order
    const sortOrder: any = {};
    if (sortBy === 'createdAt') {
      sortOrder.createdAt = -1;
    } else if (sortBy === 'travelDate') {
      sortOrder.travelDate = 1;
    } else {
      sortOrder.createdAt = -1;
    }

    // Execute query with population
    const bookings = await Booking.find(filter)
      .populate('packageId', 'name destination duration price')
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching bookings.',
    });
  }
};

/**
 * Get single booking by ID
 * Protected endpoint (admin only)
 */
export const getBookingById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate(
      'packageId',
      'name destination duration price description images'
    );

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the booking.',
    });
  }
};

/**
 * Update booking status
 * Protected endpoint (admin only)
 */
export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, cancelled',
      });
      return;
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('packageId', 'name destination duration price');

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking status updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating booking status:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the booking.',
    });
  }
};
