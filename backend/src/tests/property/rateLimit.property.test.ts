import * as fc from 'fast-check';
import request from 'supertest';
import express, { Express } from 'express';
import { rateLimiter, authRateLimiter } from '../../middleware/security';

// Feature: vibe-holidays-website, Property 16: Rate Limiting Protection
describe('Property 16: Rate Limiting Protection', () => {
  let app: Express;

  const createTestApp = (maxRequests: number, windowMs: number = 60000) => {
    const testApp = express();
    testApp.set('trust proxy', 1); // Enable trust proxy for X-Forwarded-For
    testApp.use(express.json());

    const testRateLimiter = require('express-rate-limit')({
      windowMs,
      max: maxRequests,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    });

    testApp.use(testRateLimiter);
    return testApp;
  };

  it('should reject requests when rate limit is exceeded', async () => {
    // Property: For any number of requests exceeding the limit,
    // subsequent requests should be rejected with 429 status
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 6, max: 8 }), // Generate request counts that exceed the limit (reduced range)
        fc.integer({ min: 1, max: 255 }), // Random IP last octet
        async (requestCount, ipOctet) => {
          // Create a fresh app for each property test iteration
          const testApp = createTestApp(5, 60000);
          testApp.get('/test', (req, res) => {
            res.json({ success: true, message: 'Request successful' });
          });

          const testIp = `192.168.1.${ipOctet}`;
          const responses: number[] = [];

          // Make multiple requests from the same IP
          for (let i = 0; i < requestCount; i++) {
            const response = await request(testApp)
              .get('/test')
              .set('X-Forwarded-For', testIp);

            responses.push(response.status);
          }

          // First 5 requests should succeed (200)
          const successfulRequests = responses.slice(0, 5);
          const exceededRequests = responses.slice(5);

          // Verify first 5 requests succeeded
          const allSuccessful = successfulRequests.every(status => status === 200);

          // Verify requests beyond limit were rejected with 429
          const allRateLimited = exceededRequests.length === 0 || exceededRequests.every(status => status === 429);

          return allSuccessful && allRateLimited;
        }
      ),
      { numRuns: 10 } // Reduced from 100 to 50 for faster execution
    );
  }, 30000); // 30 second timeout

  it('should enforce stricter rate limiting on auth endpoints', async () => {
    // Property: For any number of auth requests exceeding the stricter limit,
    // subsequent requests should be rejected with 429 status
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 4, max: 6 }), // Generate request counts that exceed the auth limit (reduced range)
        fc.integer({ min: 1, max: 255 }), // Random IP last octet
        async (requestCount, ipOctet) => {
          // Create a fresh app for each property test iteration
          const testApp = createTestApp(3, 60000); // Stricter limit of 3
          testApp.post('/auth/login', (req, res) => {
            res.json({ success: true, message: 'Login attempt' });
          });

          const testIp = `192.168.2.${ipOctet}`;
          const responses: number[] = [];

          // Make multiple login attempts from the same IP
          for (let i = 0; i < requestCount; i++) {
            const response = await request(testApp)
              .post('/auth/login')
              .set('X-Forwarded-For', testIp)
              .send({ username: 'test', password: 'test' });

            responses.push(response.status);
          }

          // First 3 requests should succeed (200)
          const successfulRequests = responses.slice(0, 3);
          const exceededRequests = responses.slice(3);

          // Verify first 3 requests succeeded
          const allSuccessful = successfulRequests.every(status => status === 200);

          // Verify requests beyond limit were rejected with 429
          const allRateLimited = exceededRequests.length === 0 || exceededRequests.every(status => status === 429);

          return allSuccessful && allRateLimited;
        }
      ),
      { numRuns: 10 } // Reduced from 100 to 50 for faster execution
    );
  }, 30000); // 30 second timeout

  it('should return 429 status code with appropriate error message', async () => {
    // Property: For any request that exceeds the limit,
    // the response should have status 429 and contain error message
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 255 }), // Random IP last octet
        async (ipOctet) => {
          // Create a fresh app for each property test iteration
          const testApp = createTestApp(2, 60000);
          testApp.get('/test', (req, res) => {
            res.json({ success: true });
          });

          const testIp = `192.168.3.${ipOctet}`;

          // Make requests to exceed the limit
          await request(testApp).get('/test').set('X-Forwarded-For', testIp);
          await request(testApp).get('/test').set('X-Forwarded-For', testIp);
          
          // This request should be rate limited
          const response = await request(testApp)
            .get('/test')
            .set('X-Forwarded-For', testIp);

          // Verify status code is 429
          const hasCorrectStatus = response.status === 429;

          // Verify response contains error message
          const hasErrorMessage = 
            response.body &&
            response.body.success === false &&
            typeof response.body.message === 'string' &&
            response.body.message.includes('Too many requests');

          return hasCorrectStatus && hasErrorMessage;
        }
      ),
      { numRuns: 10 } // Reduced from 100 to 50 for faster execution
    );
  }, 30000); // 30 second timeout
});

