import express from 'express';
import {
  getGalleryImages,
  getGalleryImagesByCategory,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/:category', getGalleryImagesByCategory);

// Protected admin routes
router.post('/', authenticate, upload.single('image'), uploadGalleryImage);
router.put('/:id', authenticate, updateGalleryImage);
router.delete('/:id', authenticate, deleteGalleryImage);

export default router;
