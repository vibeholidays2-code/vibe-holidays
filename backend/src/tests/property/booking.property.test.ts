/**
 * @jest-environment node
 */

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Booking, { IBooking } from '../../models/Booking';
import Package from '../../models/Package';

// Feature: vibe-holidays-website, Property 4: Booking Validation
// For any booking submission, if any required field (customerName, email, phone, travelDate, 
// numberOfTravelers, packageId) is missing or invalid, the system should reject the booking 
// and return a validation error.
// Validates: Requirements 3.2

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
});

describe('Booking Model Property Tests', () => {
  // Feature: vibe-holidays-website, Property 4: Booking Validation
  it('should reject bookings with missing required fields', async () => {
    // Generator for booking data with potentially missing fields
    const bookingWithMissingFieldsArbitrary = fc.record({
      packageId: fc.option(fc.constant(testPackageId), { nil: undefined }),
      customerName: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      email: fc.option(fc.emailAddress(), { nil: undefined }),
      phone: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      travelDate: fc.option(fc.date({ min: new Date(Date.now() + 86400000) }), { nil: undefined }),
      numberOfTravelers: fc.option(fc.integer({ min: 1, max: 20 }), { nil: undefined }),
      totalPrice: fc.option(fc.float({ min: 0, max: 100000, noNaN: true }), { nil: undefined }),
    }).filter(data => {
      // Ensure at least one required field is missing
      return !data.packageId || !data.customerName || !data.email || 
             !data.phone || !data.travelDate || !data.numberOfTravelers || 
             !data.totalPrice;
    });

    await fc.assert(
      fc.asyncProperty(bookingWithMissingFieldsArbitrary, async (bookingData) => {
        // Attempt to create booking with missing fields
        let validationError = null;
        try {
          await Booking.create(bookingData);
        } catch (error: any) {
          validationError = error;
        }
        
        // Verify that validation error occurred
        expect(validationError).not.toBeNull();
        expect(validationError.name).toBe('ValidationError');
      }),
      { numRuns: 20 }
    );
  });

  it('should reject bookings with invalid email format', async () => {
    // Generator for invalid email addresses
    const invalidEmailArbitrary = fc.string({ minLength: 1, maxLength: 50 })
      .filter(s => !s.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/));

    await fc.assert(
      fc.asyncProperty(invalidEmailArbitrary, async (invalidEmail) => {
        const bookingData = {
          packageId: testPackageId,
          customerName: 'John Doe',
          email: invalidEmail,
          phone: '1234567890',
          travelDate: new Date(Date.now() + 86400000 * 7),
          numberOfTravelers: 2,
          totalPrice: 2000,
        };

        let validationError = null;
        try {
          await Booking.create(bookingData);
        } catch (error: any) {
          validationError = error;
        }

        // Verify that validation error occurred for email
        expect(validationError).not.toBeNull();
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.email).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });

  it('should reject bookings with invalid numberOfTravelers', async () => {
    // Generator for invalid number of travelers (0 or negative)
    const invalidTravelersArbitrary = fc.integer({ max: 0 });

    await fc.assert(
      fc.asyncProperty(invalidTravelersArbitrary, async (invalidTravelers) => {
        const bookingData = {
          packageId: testPackageId,
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          travelDate: new Date(Date.now() + 86400000 * 7),
          numberOfTravelers: invalidTravelers,
          totalPrice: 2000,
        };

        let validationError = null;
        try {
          await Booking.create(bookingData);
        } catch (error: any) {
          validationError = error;
        }

        // Verify that validation error occurred for numberOfTravelers
        expect(validationError).not.toBeNull();
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.numberOfTravelers).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });

  it('should reject bookings with past travel dates', async () => {
    // Generator for past dates
    const pastDateArbitrary = fc.date({ max: new Date() });

    await fc.assert(
      fc.asyncProperty(pastDateArbitrary, async (pastDate) => {
        const bookingData = {
          packageId: testPackageId,
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          travelDate: pastDate,
          numberOfTravelers: 2,
          totalPrice: 2000,
        };

        let validationError = null;
        try {
          await Booking.create(bookingData);
        } catch (error: any) {
          validationError = error;
        }

        // Verify that validation error occurred for travelDate
        expect(validationError).not.toBeNull();
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.travelDate).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });

  it('should reject bookings with negative totalPrice', async () => {
    // Generator for negative prices
    const negativePriceArbitrary = fc.float({ max: Math.fround(-0.01), noNaN: true });

    await fc.assert(
      fc.asyncProperty(negativePriceArbitrary, async (negativePrice) => {
        const bookingData = {
          packageId: testPackageId,
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          travelDate: new Date(Date.now() + 86400000 * 7),
          numberOfTravelers: 2,
          totalPrice: negativePrice,
        };

        let validationError = null;
        try {
          await Booking.create(bookingData);
        } catch (error: any) {
          validationError = error;
        }

        // Verify that validation error occurred for totalPrice
        expect(validationError).not.toBeNull();
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.totalPrice).toBeDefined();
      }),
      { numRuns: 20 }
    );
  });

  it('should accept valid bookings with all required fields', async () => {
    // Generator for valid booking data
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
      totalPrice: fc.float({ min: 0, max: 100000, noNaN: true }),
      specialRequests: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
    });

    await fc.assert(
      fc.asyncProperty(validBookingArbitrary, async (bookingData) => {
        const fullBookingData = {
          ...bookingData,
          packageId: testPackageId,
        };

        // Create booking with valid data
        const createdBooking = await Booking.create(fullBookingData);
        
        // Verify booking was created successfully
        expect(createdBooking).not.toBeNull();
        expect(createdBooking._id).toBeDefined();
        expect(createdBooking.packageId.toString()).toBe(testPackageId.toString());
        expect(createdBooking.customerName).toBe(bookingData.customerName.trim());
        expect(createdBooking.email).toBe(bookingData.email.toLowerCase());
        expect(createdBooking.phone).toBe(bookingData.phone.trim());
        expect(createdBooking.numberOfTravelers).toBe(bookingData.numberOfTravelers);
        expect(createdBooking.totalPrice).toBe(bookingData.totalPrice);
        expect(createdBooking.status).toBe('pending');
      }),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 14: Booking Status Field Presence
  it('should include status field with valid value for any booking retrieved by admin', async () => {
    // Generator for valid booking data
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
      totalPrice: fc.float({ min: 0, max: 100000, noNaN: true }),
      specialRequests: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
      status: fc.option(fc.constantFrom('pending', 'confirmed', 'cancelled'), { nil: undefined }),
    });

    await fc.assert(
      fc.asyncProperty(validBookingArbitrary, async (bookingData) => {
        const fullBookingData = {
          ...bookingData,
          packageId: testPackageId,
        };

        // Create booking
        const createdBooking = await Booking.create(fullBookingData);
        
        // Retrieve booking (simulating admin retrieval)
        const retrievedBooking = await Booking.findById(createdBooking._id);
        
        // Verify status field is present
        expect(retrievedBooking).not.toBeNull();
        expect(retrievedBooking!.status).toBeDefined();
        
        // Verify status has one of the valid values
        expect(['pending', 'confirmed', 'cancelled']).toContain(retrievedBooking!.status);
      }),
      { numRuns: 20 }
    );
  });
});

