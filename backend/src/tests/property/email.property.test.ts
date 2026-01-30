/**
 * @jest-environment node
 */

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Booking from '../../models/Booking';
import Inquiry from '../../models/Inquiry';
import Package from '../../models/Package';
import {
  sendBookingConfirmationEmail,
  sendBookingAdminNotificationEmail,
  sendInquiryAcknowledgmentEmail,
  sendInquiryAdminNotificationEmail,
} from '../../services/emailService';

// Mock nodemailer to avoid actual email sending during tests
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  }),
}));

let mongoServer: MongoMemoryServer;
let testPackageId: mongoose.Types.ObjectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
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

describe('Email Notification Property Tests', () => {
  // Feature: vibe-holidays-website, Property 5: Booking Persistence and Email Notification
  // For any valid booking submission, the system should store the booking in the database 
  // and trigger a confirmation email to the customer email address.
  // Validates: Requirements 3.3, 10.1
  it('should persist booking and send confirmation email for valid bookings', async () => {
    // Custom email generator that matches the Mongoose regex pattern
    const validEmailArbitrary = fc.tuple(
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.constantFrom('com', 'org', 'net')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    const validBookingArbitrary = fc.record({
      customerName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      email: validEmailArbitrary,
      phone: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      travelDate: fc.date({ min: new Date(Date.now() + 86400000) }),
      numberOfTravelers: fc.integer({ min: 1, max: 20 }),
      totalPrice: fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
    });

    await fc.assert(
      fc.asyncProperty(validBookingArbitrary, async (bookingData) => {
        const fullBookingData = {
          ...bookingData,
          packageId: testPackageId,
        };

        // Create booking
        const createdBooking = await Booking.create(fullBookingData);
        
        // Verify booking was persisted
        expect(createdBooking).not.toBeNull();
        expect(createdBooking._id).toBeDefined();
        
        // Verify booking can be retrieved from database
        const retrievedBooking = await Booking.findById(createdBooking._id);
        expect(retrievedBooking).not.toBeNull();
        expect(retrievedBooking?.email).toBe(bookingData.email.toLowerCase());
        
        // Send confirmation email
        const emailResult = await sendBookingConfirmationEmail(
          bookingData.email,
          {
            customerName: bookingData.customerName,
            packageName: 'Test Package',
            destination: 'Test Destination',
            travelDate: bookingData.travelDate.toISOString(),
            numberOfTravelers: bookingData.numberOfTravelers,
            totalPrice: bookingData.totalPrice,
            bookingId: createdBooking._id.toString(),
          }
        );
        
        // Verify email was sent successfully
        expect(emailResult.success).toBe(true);
        expect(emailResult.messageId).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 17: Booking Admin Notification
  // For any booking created, the system should trigger an email notification to the 
  // admin email address containing the booking details.
  // Validates: Requirements 10.2
  it('should send admin notification email for all bookings', async () => {
    const validEmailArbitrary = fc.tuple(
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.constantFrom('com', 'org', 'net')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    const validBookingArbitrary = fc.record({
      customerName: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      email: validEmailArbitrary,
      phone: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      travelDate: fc.date({ min: new Date(Date.now() + 86400000) }),
      numberOfTravelers: fc.integer({ min: 1, max: 20 }),
      totalPrice: fc.float({ min: Math.fround(0.01), max: Math.fround(100000), noNaN: true }),
    });

    await fc.assert(
      fc.asyncProperty(validBookingArbitrary, async (bookingData) => {
        const fullBookingData = {
          ...bookingData,
          packageId: testPackageId,
        };

        // Create booking
        const createdBooking = await Booking.create(fullBookingData);
        
        // Send admin notification email
        const emailResult = await sendBookingAdminNotificationEmail({
          customerName: bookingData.customerName,
          customerEmail: bookingData.email,
          customerPhone: bookingData.phone,
          packageName: 'Test Package',
          destination: 'Test Destination',
          travelDate: bookingData.travelDate.toISOString(),
          numberOfTravelers: bookingData.numberOfTravelers,
          totalPrice: bookingData.totalPrice,
          bookingId: createdBooking._id.toString(),
        });
        
        // Verify admin notification was sent successfully
        expect(emailResult.success).toBe(true);
        expect(emailResult.messageId).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 6: Inquiry Submission Triggers Dual Notifications
  // For any inquiry submission, the system should create an inquiry record and trigger 
  // both a user acknowledgment email and an admin notification email.
  // Validates: Requirements 3.5, 10.3
  it('should create inquiry and send dual notifications', async () => {
    const validEmailArbitrary = fc.tuple(
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.constantFrom('com', 'org', 'net')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    const validInquiryArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      email: validEmailArbitrary,
      phone: fc.option(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { nil: undefined }),
      message: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
    });

    await fc.assert(
      fc.asyncProperty(validInquiryArbitrary, async (inquiryData) => {
        // Create inquiry
        const createdInquiry = await Inquiry.create(inquiryData);
        
        // Verify inquiry was persisted
        expect(createdInquiry).not.toBeNull();
        expect(createdInquiry._id).toBeDefined();
        
        // Verify inquiry can be retrieved from database
        const retrievedInquiry = await Inquiry.findById(createdInquiry._id);
        expect(retrievedInquiry).not.toBeNull();
        expect(retrievedInquiry?.email).toBe(inquiryData.email.toLowerCase());
        
        // Send user acknowledgment email
        const userEmailResult = await sendInquiryAcknowledgmentEmail(
          inquiryData.email,
          {
            customerName: inquiryData.name,
            message: inquiryData.message,
            inquiryId: createdInquiry._id.toString(),
          }
        );
        
        // Verify user acknowledgment email was sent
        expect(userEmailResult.success).toBe(true);
        expect(userEmailResult.messageId).toBeDefined();
        
        // Send admin notification email
        const adminEmailResult = await sendInquiryAdminNotificationEmail({
          customerName: inquiryData.name,
          customerEmail: inquiryData.email,
          customerPhone: inquiryData.phone,
          message: inquiryData.message,
          inquiryId: createdInquiry._id.toString(),
        });
        
        // Verify admin notification email was sent
        expect(adminEmailResult.success).toBe(true);
        expect(adminEmailResult.messageId).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });
});

