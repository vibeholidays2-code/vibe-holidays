import express from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getPackages);
router.get('/:id', getPackageById);

// Protected admin routes
router.post('/', authenticate, createPackage);
router.put('/:id', authenticate, updatePackage);
router.delete('/:id', authenticate, deletePackage);

export default router;
