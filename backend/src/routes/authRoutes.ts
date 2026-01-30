import express from 'express';
import { login, logout, getCurrentUser, getAdminStats } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/login - Login
router.post('/login', login);

// POST /api/auth/logout - Logout
router.post('/logout', authenticate, logout);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, getCurrentUser);

export default router;
