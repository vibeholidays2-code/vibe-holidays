/**
 * @jest-environment node
 */

// Set up environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '7d';

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import User from '../../models/User';
import Booking from '../../models/Booking';
import Inquiry from '../../models/Inquiry';
import Package from '../../models/Package';
import authRoutes from '../../routes/authRoutes';
import adminRoutes from '../../routes/adminRoutes';

// Feature: vibe-holidays-website, Property 12: Dashboard Data Retrieval
// For any authenticated admin request to the dashboard endpoint, the response should 
// include arrays of recent bookings and recent inquiries.
// Validates: Requirements 6.2

let mongoServer: MongoMemoryServer;
let testApp: express.Application;
let adminToken: string;
let testPackageId: mongoose.Types.ObjectId;

beforeAll(async () => {
  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Create a minimal test app
  testApp = express();
  testApp.use(express.json());
  testApp.use('/api/auth', authRoutes);
  testApp.use('/api/admin', adminRoutes);
  
  // Create admin user and get token
  const adminUser = await User.create({
    username: 'admin_test',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  });
  
  const loginResponse = await request(testApp)
    .post('/api/auth/login')
    .send({
      username: 'admin_test',
      password: 'password123',
    });
  
  adminToken = loginResponse.body.data.token;
  
  // Create a test package to reference
  const testPackage = await Package.create({
    name: 'Test Package',
    destination: 'Test Destination',
    duration: 7,
    price: 1000,
    description: 'Test description',
    itinerary: ['Day 1'],
    inclusions: ['Hotel'],
    exclusions: ['Flights'],
    images: ['http://example.com/image.jpg'],
  });
  testPackageId = testPackage._id as mongoose.Types.ObjectId;
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Booking.deleteMany({});
  await Inquiry.deleteMany({});
});

describe('Dashboard Data Retrieval Property Tests', () => {
  // Feature: vibe-holidays-website, Property 12: Dashboard Data Retrieval
  it('should return arrays of recent bookings and inquiries for authenticated admin', async () => {
    // Generator for number of bookings and inquiries to create
    const dataCountArbitrary = fc.record({
      bookingsCount: fc.integer({ min: 0, max: 15 }),
      inquiriesCount: fc.integer({ min: 0, max: 15 }),
    });

    await fc.assert(
      fc.asyncProperty(dataCountArbitrary, async ({ bookingsCount, inquiriesCount }) => {
        // Clean up before each iteration
        await Booking.deleteMany({});
        await Inquiry.deleteMany({});
        
        // Create random bookings
        const bookings = [];
        for (let i = 0; i < bookingsCount; i++) {
          const booking = await Booking.create({
            packageId: testPackageId,
            customerName: `Customer ${i}`,
            email: `customer${i}@example.com`,
            phone: `123456789${i}`,
            travelDate: new Date(Date.now() + 86400000 * (i + 1)),
            numberOfTravelers: Math.floor(Math.random() * 5) + 1,
            totalPrice: Math.random() * 5000 + 500,
            status: ['pending', 'confirmed', 'cancelled'][Math.floor(Math.random() * 3)],
          });
          bookings.push(booking);
        }
        
        // Create random inquiries
        const inquiries = [];
        for (let i = 0; i < inquiriesCount; i++) {
          const inquiry = await Inquiry.create({
            name: `Inquirer ${i}`,
            email: `inquirer${i}@example.com`,
            phone: `987654321${i}`,
            message: `Inquiry message ${i}`,
            status: ['new', 'read', 'responded'][Math.floor(Math.random() * 3)],
          });
          inquiries.push(inquiry);
        }
        
        // Request dashboard stats
        const response = await request(testApp)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Verify response structure
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        
        // Verify recentBookings is an array
        expect(Array.isArray(response.body.data.recentBookings)).toBe(true);
        
        // Verify recentInquiries is an array
        expect(Array.isArray(response.body.data.recentInquiries)).toBe(true);
        
        // Verify arrays contain expected number of items (max 10 each)
        expect(response.body.data.recentBookings.length).toBeLessThanOrEqual(10);
        expect(response.body.data.recentInquiries.length).toBeLessThanOrEqual(10);
        
        // Verify arrays contain correct number of items
        expect(response.body.data.recentBookings.length).toBe(Math.min(bookingsCount, 10));
        expect(response.body.data.recentInquiries.length).toBe(Math.min(inquiriesCount, 10));
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should return empty arrays when no bookings or inquiries exist', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        // Ensure database is empty
        await Booking.deleteMany({});
        await Inquiry.deleteMany({});
        
        // Request dashboard stats
        const response = await request(testApp)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Verify response structure
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        
        // Verify arrays are empty
        expect(Array.isArray(response.body.data.recentBookings)).toBe(true);
        expect(response.body.data.recentBookings.length).toBe(0);
        
        expect(Array.isArray(response.body.data.recentInquiries)).toBe(true);
        expect(response.body.data.recentInquiries.length).toBe(0);
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should return most recent items when more than 10 exist', async () => {
    // Generator for creating more than 10 items
    const largeDataCountArbitrary = fc.record({
      bookingsCount: fc.integer({ min: 11, max: 20 }),
      inquiriesCount: fc.integer({ min: 11, max: 20 }),
    });

    await fc.assert(
      fc.asyncProperty(largeDataCountArbitrary, async ({ bookingsCount, inquiriesCount }) => {
        // Clean up before each iteration
        await Booking.deleteMany({});
        await Inquiry.deleteMany({});
        
        // Create bookings with explicit timestamps to ensure ordering
        const bookingIds = [];
        const baseTime = Date.now();
        for (let i = 0; i < bookingsCount; i++) {
          const booking = await Booking.create({
            packageId: testPackageId,
            customerName: `Customer ${i}`,
            email: `customer${i}_${baseTime}@example.com`,
            phone: `123456789${i}`,
            travelDate: new Date(baseTime + 86400000 * (i + 1)),
            numberOfTravelers: Math.floor(Math.random() * 5) + 1,
            totalPrice: Math.random() * 5000 + 500,
            status: 'pending',
            createdAt: new Date(baseTime + i * 1000), // Increment by 1 second each
          });
          bookingIds.push(booking._id);
        }
        
        // Create inquiries with explicit timestamps to ensure ordering
        const inquiryIds = [];
        for (let i = 0; i < inquiriesCount; i++) {
          const inquiry = await Inquiry.create({
            name: `Inquirer ${i}`,
            email: `inquirer${i}_${baseTime}@example.com`,
            phone: `987654321${i}`,
            message: `Inquiry message ${i}`,
            status: 'new',
            createdAt: new Date(baseTime + i * 1000), // Increment by 1 second each
          });
          inquiryIds.push(inquiry._id);
        }
        
        // Request dashboard stats
        const response = await request(testApp)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Verify response structure
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        
        // Verify exactly 10 items returned
        expect(response.body.data.recentBookings.length).toBe(10);
        expect(response.body.data.recentInquiries.length).toBe(10);
        
        // Verify items are sorted by most recent (newest first)
        const bookingDates = response.body.data.recentBookings.map((b: any) => new Date(b.createdAt).getTime());
        for (let i = 1; i < bookingDates.length; i++) {
          expect(bookingDates[i - 1]).toBeGreaterThanOrEqual(bookingDates[i]);
        }
        
        const inquiryDates = response.body.data.recentInquiries.map((inq: any) => new Date(inq.createdAt).getTime());
        for (let i = 1; i < inquiryDates.length; i++) {
          expect(inquiryDates[i - 1]).toBeGreaterThanOrEqual(inquiryDates[i]);
        }
        
        // Verify the most recent items are included (last 10 created)
        const recentBookingIds = response.body.data.recentBookings.map((b: any) => b._id);
        const expectedRecentBookingIds = bookingIds.slice(-10).reverse().map(id => id.toString());
        expect(recentBookingIds).toEqual(expectedRecentBookingIds);
        
        const recentInquiryIds = response.body.data.recentInquiries.map((inq: any) => inq._id);
        const expectedRecentInquiryIds = inquiryIds.slice(-10).reverse().map(id => id.toString());
        expect(recentInquiryIds).toEqual(expectedRecentInquiryIds);
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should include required fields in booking and inquiry objects', async () => {
    // Generator for creating a few items
    const smallDataCountArbitrary = fc.record({
      bookingsCount: fc.integer({ min: 1, max: 5 }),
      inquiriesCount: fc.integer({ min: 1, max: 5 }),
    });

    await fc.assert(
      fc.asyncProperty(smallDataCountArbitrary, async ({ bookingsCount, inquiriesCount }) => {
        // Create bookings
        for (let i = 0; i < bookingsCount; i++) {
          await Booking.create({
            packageId: testPackageId,
            customerName: `Customer ${i}`,
            email: `customer${i}_${Date.now()}@example.com`,
            phone: `123456789${i}`,
            travelDate: new Date(Date.now() + 86400000 * (i + 1)),
            numberOfTravelers: Math.floor(Math.random() * 5) + 1,
            totalPrice: Math.random() * 5000 + 500,
            status: 'pending',
          });
        }
        
        // Create inquiries
        for (let i = 0; i < inquiriesCount; i++) {
          await Inquiry.create({
            name: `Inquirer ${i}`,
            email: `inquirer${i}_${Date.now()}@example.com`,
            phone: `987654321${i}`,
            message: `Inquiry message ${i}`,
            status: 'new',
          });
        }
        
        // Request dashboard stats
        const response = await request(testApp)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Verify each booking has required fields
        response.body.data.recentBookings.forEach((booking: any) => {
          expect(booking._id).toBeDefined();
          expect(booking.customerName).toBeDefined();
          expect(booking.email).toBeDefined();
          expect(booking.status).toBeDefined();
          expect(booking.totalPrice).toBeDefined();
          expect(booking.createdAt).toBeDefined();
        });
        
        // Verify each inquiry has required fields
        response.body.data.recentInquiries.forEach((inquiry: any) => {
          expect(inquiry._id).toBeDefined();
          expect(inquiry.name).toBeDefined();
          expect(inquiry.email).toBeDefined();
          expect(inquiry.message).toBeDefined();
          expect(inquiry.status).toBeDefined();
          expect(inquiry.createdAt).toBeDefined();
        });
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should reject unauthenticated requests to dashboard endpoint', async () => {
    // Generator for invalid tokens
    const invalidTokenArbitrary = fc.oneof(
      fc.constant(''), // Empty token
      fc.constant('invalid-token'), // Invalid format
      fc.string({ minLength: 1, maxLength: 100 }), // Random string
      fc.constant(undefined) // No token
    );

    await fc.assert(
      fc.asyncProperty(invalidTokenArbitrary, async (invalidToken) => {
        // Attempt to access dashboard with invalid token
        const request_builder = request(testApp).get('/api/admin/stats');
        
        if (invalidToken !== undefined) {
          request_builder.set('Authorization', `Bearer ${invalidToken}`);
        }
        
        const response = await request_builder;

        // Verify access is denied
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should include statistics data along with recent items', async () => {
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        // Create some test data
        await Booking.create({
          packageId: testPackageId,
          customerName: 'Test Customer',
          email: `test_${Date.now()}@example.com`,
          phone: '1234567890',
          travelDate: new Date(Date.now() + 86400000),
          numberOfTravelers: 2,
          totalPrice: 2000,
          status: 'confirmed',
        });
        
        await Inquiry.create({
          name: 'Test Inquirer',
          email: `inquirer_${Date.now()}@example.com`,
          message: 'Test inquiry',
          status: 'new',
        });
        
        // Request dashboard stats
        const response = await request(testApp)
          .get('/api/admin/stats')
          .set('Authorization', `Bearer ${adminToken}`);
        
        // Verify statistics are included
        expect(response.body.data.bookings).toBeDefined();
        expect(response.body.data.bookings.total).toBeDefined();
        expect(typeof response.body.data.bookings.total).toBe('number');
        
        expect(response.body.data.revenue).toBeDefined();
        expect(response.body.data.revenue.total).toBeDefined();
        expect(typeof response.body.data.revenue.total).toBe('number');
        
        expect(response.body.data.inquiries).toBeDefined();
        expect(response.body.data.inquiries.total).toBeDefined();
        expect(typeof response.body.data.inquiries.total).toBe('number');
        
        // Verify arrays are also present
        expect(Array.isArray(response.body.data.recentBookings)).toBe(true);
        expect(Array.isArray(response.body.data.recentInquiries)).toBe(true);
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);
});

