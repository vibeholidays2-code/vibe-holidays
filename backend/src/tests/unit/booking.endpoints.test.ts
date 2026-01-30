import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import bookingRoutes from '../../routes/bookingRoutes';
import Booking from '../../models/Booking';
import Package from '../../models/Package';
import { generateToken } from '../../utils/auth';

let mongoServer: MongoMemoryServer;
let app: express.Application;

// Setup Express app for testing
beforeAll(async () => {
  // Set JWT_SECRET for tests
  process.env.JWT_SECRET = 'test-secret-key';

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create Express app with booking routes
  app = express();
  app.use(express.json());
  app.use('/api/bookings', bookingRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Booking Endpoints Unit Tests', () => {
  describe('Booking with Invalid Package ID', () => {
    it('should return 404 when booking with non-existent package ID', async () => {
      const nonExistentPackageId = new mongoose.Types.ObjectId();
      const bookingData = {
        packageId: nonExistentPackageId,
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Package not found');
    });

    it('should return 500 when booking with malformed package ID', async () => {
      const bookingData = {
        packageId: 'invalid-id-format',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'An error occurred while creating the booking.'
      );
    });

    it('should create booking successfully with valid package ID', async () => {
      // Create a valid package first
      const pkg = await Package.create({
        name: 'Beach Paradise',
        destination: 'Maldives',
        duration: 7,
        price: 1500,
        description: 'Relaxing beach vacation',
        active: true,
      });

      const bookingData = {
        packageId: pkg._id,
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body.data.customerName).toBe('John Doe');
      expect(response.body.data.status).toBe('pending');
    });
  });

  describe('Booking with Past Travel Date', () => {
    let validPackage: any;

    beforeEach(async () => {
      // Create a valid package for testing
      validPackage = await Package.create({
        name: 'Mountain Adventure',
        destination: 'Swiss Alps',
        duration: 5,
        price: 2000,
        description: 'Exciting mountain trek',
        active: true,
      });
    });

    it('should reject booking with past travel date', async () => {
      const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      const bookingData = {
        packageId: validPackage._id,
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        travelDate: pastDate,
        numberOfTravelers: 2,
        totalPrice: 4000,
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].field).toBe('travelDate');
      expect(response.body.errors[0].message).toBe(
        'Travel date must be in the future'
      );
    });

    it('should reject booking with today as travel date', async () => {
      const today = new Date();
      const bookingData = {
        packageId: validPackage._id,
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        travelDate: today,
        numberOfTravelers: 2,
        totalPrice: 4000,
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should accept booking with future travel date', async () => {
      const futureDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days from now
      const bookingData = {
        packageId: validPackage._id,
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        travelDate: futureDate,
        numberOfTravelers: 2,
        totalPrice: 4000,
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.travelDate).toBeDefined();
    });
  });

  describe('Booking Status Transitions', () => {
    let validPackage: any;
    let booking: any;
    let adminToken: string;

    beforeEach(async () => {
      // Create a valid package
      validPackage = await Package.create({
        name: 'City Tour',
        destination: 'Paris',
        duration: 3,
        price: 1200,
        description: 'Explore the city of lights',
        active: true,
      });

      // Create a booking
      booking = await Booking.create({
        packageId: validPackage._id,
        customerName: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1234567890',
        travelDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        numberOfTravelers: 3,
        totalPrice: 3600,
        status: 'pending',
      });

      // Generate admin token
      adminToken = generateToken('admin-user-id', 'admin@example.com');
    });

    it('should update booking status from pending to confirmed', async () => {
      const response = await request(app)
        .put(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Booking status updated successfully');
      expect(response.body.data.status).toBe('confirmed');
    });

    it('should update booking status from pending to cancelled', async () => {
      const response = await request(app)
        .put(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });

    it('should update booking status from confirmed back to pending', async () => {
      // First update to confirmed
      await Booking.findByIdAndUpdate(booking._id, { status: 'confirmed' });

      // Then update back to pending
      const response = await request(app)
        .put(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'pending' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('pending');
    });

    it('should reject invalid status value', async () => {
      const response = await request(app)
        .put(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid status. Must be one of: pending, confirmed, cancelled'
      );
    });

    it('should reject status update without authentication', async () => {
      const response = await request(app)
        .put(`/api/bookings/${booking._id}`)
        .send({ status: 'confirmed' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should return 404 when updating non-existent booking', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/bookings/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Booking not found');
    });

    it('should persist status changes in database', async () => {
      await request(app)
        .put(`/api/bookings/${booking._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' })
        .expect(200);

      // Verify in database
      const updatedBooking = await Booking.findById(booking._id);
      expect(updatedBooking?.status).toBe('confirmed');
    });
  });
});
