import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Booking from '../models/Booking';
import Inquiry from '../models/Inquiry';
import { comparePassword, generateToken } from '../utils/auth';

/**
 * Login controller
 * Authenticates user and returns JWT token
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
      return;
    }

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
};

/**
 * Logout controller
 * Client-side token removal (stateless JWT)
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.',
  });
};

/**
 * Get current user controller
 * Returns authenticated user information
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Find user by ID from token
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user information',
    });
  }
};

/**
 * Get admin dashboard statistics
 * Returns bookings count, revenue, and recent activity
 */
export const getAdminStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Get total bookings count
    const totalBookings = await Booking.countDocuments();

    // Get bookings by status
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({
      status: 'confirmed',
    });
    const cancelledBookings = await Booking.countDocuments({
      status: 'cancelled',
    });

    // Calculate total revenue (from confirmed bookings)
    const revenueResult = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get recent bookings (last 10)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('packageId', 'name destination')
      .select('customerName email status totalPrice createdAt');

    // Get recent inquiries (last 10)
    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('packageId', 'name destination')
      .select('name email message status createdAt');

    // Get total inquiries count
    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });

    res.json({
      success: true,
      data: {
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          total: totalRevenue,
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
        },
        recentBookings,
        recentInquiries,
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching dashboard statistics',
    });
  }
};
