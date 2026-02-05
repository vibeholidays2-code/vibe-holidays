import { Response } from 'express';
import Package from '../models/Package';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all packages with optional filtering and search
 * Public endpoint
 * Query params: destination, category, minPrice, maxPrice, minDuration, maxDuration, search, featured, page, limit
 */
export const getPackages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      destination,
      category,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      search,
      featured,
      page = '1',
      limit = '10',
    } = req.query;

    // Build filter object
    const filter: any = { active: true };

    // Destination filter
    if (destination) {
      filter.destination = destination;
    }

    // Category filter (for frontend compatibility)
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Duration range filter
    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) filter.duration.$gte = Number(minDuration);
      if (maxDuration) filter.duration.$lte = Number(maxDuration);
    }

    // Featured filter
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    // Search functionality (search in name, destination, description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const packages = await Package.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Package.countDocuments(filter);

    res.json({
      success: true,
      data: packages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching packages.',
    });
  }
};

/**
 * Get single package by ID
 * Public endpoint
 */
export const getPackageById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const packageData = await Package.findById(id);

    if (!packageData) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    res.json({
      success: true,
      data: packageData,
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the package.',
    });
  }
};

/**
 * Create new package
 * Protected endpoint (admin only)
 */
export const createPackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const packageData = new Package(req.body);
    await packageData.save();

    res.status(201).json({
      success: true,
      data: packageData,
      message: 'Package created successfully',
    });
  } catch (error: any) {
    console.error('Error creating package:', error);

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
      message: 'An error occurred while creating the package.',
    });
  }
};

/**
 * Update package by ID
 * Protected endpoint (admin only)
 */
export const updatePackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const packageData = await Package.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!packageData) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    res.json({
      success: true,
      data: packageData,
      message: 'Package updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating package:', error);

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
      message: 'An error occurred while updating the package.',
    });
  }
};

/**
 * Delete package by ID
 * Protected endpoint (admin only)
 */
export const deletePackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const packageData = await Package.findByIdAndDelete(id);

    if (!packageData) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the package.',
    });
  }
};
