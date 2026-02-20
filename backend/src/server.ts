import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/database';
import {
  rateLimiter,
  sanitizeInput,
  securityHeaders,
  getCorsOptions,
} from './middleware/security';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import packageRoutes from './routes/packageRoutes';
import bookingRoutes from './routes/bookingRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import galleryRoutes from './routes/galleryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import newsletterRoutes from './routes/newsletterRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5000", "http://localhost:5173"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images
})); // Security headers with image support
app.use(securityHeaders); // Additional custom security headers
app.use(cors(getCorsOptions())); // CORS with whitelist
app.use(rateLimiter); // Rate limiting
app.use(compression()); // Gzip compression
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(sanitizeInput); // Input sanitization
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve uploaded files
app.use('/brochures', express.static(path.join(__dirname, '../brochures'))); // Serve PDF brochures

// Health check routes for UptimeRobot
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vibe Holidays API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Vibe Holidays API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/admin/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin/bookings', bookingRoutes);
app.use('/api', inquiryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin/gallery', galleryRoutes);
app.use('/api', reviewRoutes);
app.use('/api', newsletterRoutes);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

export default app;
