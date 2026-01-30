import { Response } from 'express';
import Gallery from '../models/Gallery';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all gallery images with optional category filter
 * Public endpoint
 * Query params: category, page, limit
 */
export const getGalleryImages = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, page = '1', limit = '20' } = req.query;

    // Build filter object
    const filter: any = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query - sort by order then createdAt
    const images = await Gallery.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Gallery.countDocuments(filter);

    res.json({
      success: true,
      data: images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching gallery images.',
    });
  }
};

/**
 * Get gallery images by category
 * Public endpoint
 */
export const getGalleryImagesByCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;

    // Execute query - sort by order then createdAt
    const images = await Gallery.find({ category }).sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: images,
      count: images.length,
    });
  } catch (error) {
    console.error('Error fetching gallery images by category:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching gallery images.',
    });
  }
};

/**
 * Upload new gallery image
 * Protected endpoint (admin only)
 */
export const uploadGalleryImage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
      return;
    }

    // Get the file path/URL (in production, this would be a cloud storage URL)
    const imageUrl = `/uploads/${req.file.filename}`;

    // Create gallery entry with metadata from request body
    const galleryImage = new Gallery({
      url: imageUrl,
      category: req.body.category,
      caption: req.body.caption,
      destination: req.body.destination,
      order: req.body.order || 0,
    });

    await galleryImage.save();

    res.status(201).json({
      success: true,
      data: galleryImage,
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    console.error('Error uploading gallery image:', error);

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
      message: 'An error occurred while uploading the image.',
    });
  }
};

/**
 * Update gallery image metadata
 * Protected endpoint (admin only)
 */
export const updateGalleryImage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Only allow updating metadata fields, not the URL
    const allowedUpdates = ['category', 'caption', 'destination', 'order'];
    const updates: any = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const galleryImage = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!galleryImage) {
      res.status(404).json({
        success: false,
        message: 'Gallery image not found',
      });
      return;
    }

    res.json({
      success: true,
      data: galleryImage,
      message: 'Gallery image updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);

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
      message: 'An error occurred while updating the gallery image.',
    });
  }
};

/**
 * Delete gallery image by ID
 * Protected endpoint (admin only)
 */
export const deleteGalleryImage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const galleryImage = await Gallery.findByIdAndDelete(id);

    if (!galleryImage) {
      res.status(404).json({
        success: false,
        message: 'Gallery image not found',
      });
      return;
    }

    // In production, you would also delete the actual file from storage here

    res.json({
      success: true,
      message: 'Gallery image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the gallery image.',
    });
  }
};
