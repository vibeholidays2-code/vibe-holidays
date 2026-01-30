/**
 * @jest-environment node
 */

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import inquiryRoutes from '../../routes/inquiryRoutes';
import Inquiry from '../../models/Inquiry';

// Mock nodemailer to avoid actual email sending during tests
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  }),
}));

let mongoServer: MongoMemoryServer;
let app: express.Application;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Set up Express app with routes
  app = express();
  app.use(express.json());
  app.use('/api', inquiryRoutes);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Inquiry.deleteMany({});
});

describe('Contact Form Validation Property Tests', () => {
  // Feature: vibe-holidays-website, Property 9: Contact Form Validation
  // For any contact form submission, if the email field is invalid or the message field is empty,
  // the system should reject the submission and return a validation error.
  // Validates: Requirements 5.2
  it('should reject contact form submissions with invalid email', async () => {
    // Generator for invalid email formats
    const invalidEmailArbitrary = fc.oneof(
      fc.constant(''),
      fc.constant('notanemail'),
      fc.constant('missing@domain'),
      fc.constant('@nodomain.com'),
      fc.constant('no-at-sign.com'),
      fc.constant('multiple@@at.com'),
      fc.constant('spaces in@email.com'),
      fc.constant('missing.tld@domain'),
      fc.string().filter(s => !s.includes('@') || !s.includes('.')),
    );

    const contactDataWithInvalidEmailArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      email: invalidEmailArbitrary,
      phone: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      message: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
    });

    await fc.assert(
      fc.asyncProperty(contactDataWithInvalidEmailArbitrary, async (contactData) => {
        const response = await request(app)
          .post('/api/contact')
          .send(contactData);

        // Should reject with 400 status
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        
        // Should return validation error message
        expect(response.body.message).toBeDefined();
        expect(
          response.body.message.toLowerCase().includes('email') ||
          response.body.message.toLowerCase().includes('required')
        ).toBe(true);
        
        // Verify no inquiry was created in database
        const inquiryCount = await Inquiry.countDocuments({
          email: contactData.email,
        });
        expect(inquiryCount).toBe(0);
      }),
      { numRuns: 20 }
    );
  });

  it('should reject contact form submissions with empty message', async () => {
    // Generator for valid email
    const validEmailArbitrary = fc.tuple(
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.constantFrom('com', 'org', 'net')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    // Generator for empty or whitespace-only messages
    const emptyMessageArbitrary = fc.oneof(
      fc.constant(''),
      fc.constant('   '),
      fc.constant('\t'),
      fc.constant('\n'),
      fc.constant('  \t  \n  '),
    );

    const contactDataWithEmptyMessageArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      email: validEmailArbitrary,
      phone: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      message: emptyMessageArbitrary,
    });

    await fc.assert(
      fc.asyncProperty(contactDataWithEmptyMessageArbitrary, async (contactData) => {
        const response = await request(app)
          .post('/api/contact')
          .send(contactData);

        // Should reject with 400 status
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        
        // Should return validation error message
        expect(response.body.message).toBeDefined();
        expect(
          response.body.message.toLowerCase().includes('message') ||
          response.body.message.toLowerCase().includes('required')
        ).toBe(true);
        
        // Verify no inquiry was created in database
        const inquiryCount = await Inquiry.countDocuments({
          email: contactData.email,
        });
        expect(inquiryCount).toBe(0);
      }),
      { numRuns: 20 }
    );
  });

  it('should reject contact form submissions with missing required fields', async () => {
    // Generator for valid email
    const validEmailArbitrary = fc.tuple(
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.constantFrom('com', 'org', 'net')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    // Test missing name
    await fc.assert(
      fc.asyncProperty(
        validEmailArbitrary,
        fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
        async (email, message) => {
          const response = await request(app)
            .post('/api/contact')
            .send({ email, message });

          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
          expect(response.body.message).toBeDefined();
        }
      ),
      { numRuns: 10 }
    );

    // Test missing email
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
        async (name, message) => {
          const response = await request(app)
            .post('/api/contact')
            .send({ name, message });

          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
          expect(response.body.message).toBeDefined();
        }
      ),
      { numRuns: 10 }
    );

    // Test missing message
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        validEmailArbitrary,
        async (name, email) => {
          const response = await request(app)
            .post('/api/contact')
            .send({ name, email });

          expect(response.status).toBe(400);
          expect(response.body.success).toBe(false);
          expect(response.body.message).toBeDefined();
        }
      ),
      { numRuns: 10 }
    );
  });

  it('should accept contact form submissions with valid data', async () => {
    // Generator for valid email
    const validEmailArbitrary = fc.tuple(
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
      fc.constantFrom('com', 'org', 'net')
    ).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

    const validContactDataArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      email: validEmailArbitrary,
      phone: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
      message: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
    });

    await fc.assert(
      fc.asyncProperty(validContactDataArbitrary, async (contactData) => {
        const response = await request(app)
          .post('/api/contact')
          .send(contactData);

        // Should accept with 201 status
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined();
        expect(response.body.data.messageId).toBeDefined();
        
        // Verify inquiry was created in database
        const inquiry = await Inquiry.findById(response.body.data.messageId);
        expect(inquiry).not.toBeNull();
        // Account for trimming by the model
        expect(inquiry?.name).toBe(contactData.name.trim());
        expect(inquiry?.email).toBe(contactData.email.toLowerCase());
        expect(inquiry?.message).toBe(contactData.message);
      }),
      { numRuns: 20 }
    );
  });
});


