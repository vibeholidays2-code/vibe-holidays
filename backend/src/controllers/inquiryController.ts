import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Inquiry from '../models/Inquiry';
import Package from '../models/Package';
import {
  sendInquiryAcknowledgmentEmail,
  sendInquiryAdminNotificationEmail,
} from '../services/emailService';

/**
 * Create new inquiry (public endpoint)
 * POST /api/inquiries
 */
export const createInquiry = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, packageId, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
      return;
    }

    // Validate that fields are not just whitespace
    if (name.trim().length === 0 || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Name and message cannot be empty or contain only whitespace',
      });
      return;
    }

    // If packageId is provided, verify it exists
    let packageName: string | undefined;
    if (packageId) {
      const pkg = await Package.findById(packageId);
      if (!pkg) {
        res.status(400).json({
          success: false,
          message: 'Invalid package ID',
        });
        return;
      }
      packageName = pkg.name;
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      packageId: packageId || undefined,
      message,
      status: 'new',
    });

    // Send acknowledgment email to customer (async, don't block response)
    sendInquiryAcknowledgmentEmail(email, {
      customerName: name,
      message,
      inquiryId: inquiry._id.toString(),
    }).catch((error) => {
      console.error('Failed to send inquiry acknowledgment email:', error);
    });

    // Send notification email to admin (async, don't block response)
    sendInquiryAdminNotificationEmail({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message,
      packageName,
      inquiryId: inquiry._id.toString(),
    }).catch((error) => {
      console.error('Failed to send inquiry admin notification email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        inquiry: {
          id: inquiry._id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          packageId: inquiry.packageId,
          message: inquiry.message,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Create inquiry error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting inquiry',
    });
  }
};

/**
 * Get all inquiries (admin endpoint)
 * GET /api/admin/inquiries
 */
export const getAllInquiries = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Build query
    const query: any = {};
    if (status && typeof status === 'string') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get inquiries with pagination
    const inquiries = await Inquiry.find(query)
      .populate('packageId', 'name destination')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count
    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      data: {
        inquiries: inquiries.map((inquiry) => ({
          id: inquiry._id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          package: inquiry.packageId
            ? {
                id: (inquiry.packageId as any)._id,
                name: (inquiry.packageId as any).name,
                destination: (inquiry.packageId as any).destination,
              }
            : null,
          message: inquiry.message,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching inquiries',
    });
  }
};

/**
 * Update inquiry status (admin endpoint)
 * PUT /api/admin/inquiries/:id
 */
export const updateInquiryStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['new', 'read', 'responded'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: new, read, responded',
      });
      return;
    }

    // Find and update inquiry
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('packageId', 'name destination');

    if (!inquiry) {
      res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: {
        inquiry: {
          id: inquiry._id,
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          package: inquiry.packageId
            ? {
                id: (inquiry.packageId as any)._id,
                name: (inquiry.packageId as any).name,
                destination: (inquiry.packageId as any).destination,
              }
            : null,
          message: inquiry.message,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating inquiry status',
    });
  }
};

/**
 * Send contact message (public endpoint)
 * POST /api/contact
 */
export const sendContactMessage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
      return;
    }

    // Validate that fields are not just whitespace
    if (name.trim().length === 0 || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Name and message cannot be empty or contain only whitespace',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
      return;
    }

    // Create inquiry with contact type (reuse inquiry model)
    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      status: 'new',
    });

    // Send acknowledgment email to customer (async, don't block response)
    sendInquiryAcknowledgmentEmail(email, {
      customerName: name,
      message,
      inquiryId: inquiry._id.toString(),
    }).catch((error) => {
      console.error('Failed to send contact acknowledgment email:', error);
    });

    // Send notification email to admin (async, don't block response)
    sendInquiryAdminNotificationEmail({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      message,
      inquiryId: inquiry._id.toString(),
    }).catch((error) => {
      console.error('Failed to send contact admin notification email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: {
        messageId: inquiry._id,
      },
    });
  } catch (error: any) {
    console.error('Send contact message error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while sending contact message',
    });
  }
};
