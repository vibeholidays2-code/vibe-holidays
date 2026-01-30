import express from 'express';
import { getAdminStats } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', authenticate, getAdminStats);

export default router;
