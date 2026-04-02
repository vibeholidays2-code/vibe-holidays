import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as fs from 'fs';
import * as path from 'path';

// Load packages from JSON file
const packagesPath = path.join(__dirname, '../../data/packages.json');

const loadPackages = (): any[] => {
  try {
    const data = fs.readFileSync(packagesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading packages:', error);
    return [];
  }
};

/**
 * Get all packages with optional filtering and search
 * Public endpoint
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

    let packages = loadPackages();

    // Filter active packages
    packages = packages.filter((pkg: any) => pkg.active !== false);

    // Destination filter
    if (destination) {
      packages = packages.filter((pkg: any) =>
        pkg.destination.toLowerCase().includes((destination as string).toLowerCase())
      );
    }

    // Category filter
    if (category) {
      packages = packages.filter((pkg: any) =>
        pkg.category?.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Price range filter
    if (minPrice) {
      packages = packages.filter((pkg: any) => pkg.price >= Number(minPrice));
    }
    if (maxPrice) {
      packages = packages.filter((pkg: any) => pkg.price <= Number(maxPrice));
    }

    // Duration range filter
    if (minDuration) {
      packages = packages.filter((pkg: any) => pkg.duration >= Number(minDuration));
    }
    if (maxDuration) {
      packages = packages.filter((pkg: any) => pkg.duration <= Number(maxDuration));
    }

    // Featured filter
    if (featured !== undefined) {
      const isFeatured = featured === 'true';
      packages = packages.filter((pkg: any) => pkg.featured === isFeatured);
    }

    // Search functionality
    if (search) {
      const searchLower = (search as string).toLowerCase();
      packages = packages.filter((pkg: any) =>
        pkg.name.toLowerCase().includes(searchLower) ||
        pkg.destination.toLowerCase().includes(searchLower) ||
        pkg.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const total = packages.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedPackages = packages.slice(startIndex, endIndex);

    // Add IDs to packages (use index as ID)
    const packagesWithIds = paginatedPackages.map((pkg: any, index: number) => ({
      ...pkg,
      _id: `pkg-${startIndex + index + 1}`,
    }));

    res.json({
      success: true,
      data: packagesWithIds,
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
    const packages = loadPackages();

    // Extract index from ID (format: pkg-1, pkg-2, etc.)
    const index = parseInt(id.replace('pkg-', '')) - 1;

    if (index < 0 || index >= packages.length) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    const packageData = {
      ...packages[index],
      _id: id,
    };

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
 * Create new package (disabled for static data)
 */
export const createPackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Package creation is disabled in static mode. Please edit packages.json file directly.',
  });
};

/**
 * Update package (disabled for static data)
 */
export const updatePackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Package updates are disabled in static mode. Please edit packages.json file directly.',
  });
};

/**
 * Delete package (disabled for static data)
 */
export const deletePackage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  res.status(501).json({
    success: false,
    message: 'Package deletion is disabled in static mode. Please edit packages.json file directly.',
  });
};
