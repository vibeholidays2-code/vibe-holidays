/**
 * @jest-environment node
 */

// Set up environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '7d';

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import request from 'supertest';
import express from 'express';
import User, { IUser } from '../../models/User';
import { hashPassword, comparePassword } from '../../utils/auth';
import authRoutes from '../../routes/authRoutes';

// Feature: vibe-holidays-website, Property 15: Password Hashing Security
// For any user account created or password updated, the password stored in the database 
// should be hashed (not plain text) and should be verifiable using bcrypt comparison.
// Validates: Requirements 9.2, 9.3

let mongoServer: MongoMemoryServer;
let testApp: express.Application;

beforeAll(async () => {
  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Create a minimal test app for authentication tests
  testApp = express();
  testApp.use(express.json());
  testApp.use('/api/auth', authRoutes);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Password Hashing Security Property Tests', () => {
  // Feature: vibe-holidays-website, Property 15: Password Hashing Security
  it('should hash passwords when creating new users', async () => {
    // Generator for valid user data with plain text passwords
    const userArbitrary = fc.record({
      username: fc.string({ minLength: 3, maxLength: 50 })
        .filter(s => s.trim().length >= 3)
        .map(s => `user_${s}_${Date.now()}_${Math.random()}`), // Make unique
      email: fc.tuple(
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.constantFrom('com', 'org', 'net')
      ).map(([local, domain, tld]) => `${local}_${Date.now()}_${Math.random()}@${domain}.${tld}`), // Make unique
      password: fc.string({ minLength: 6, maxLength: 100 })
        .filter(s => s.length >= 6),
    });

    await fc.assert(
      fc.asyncProperty(userArbitrary, async (userData) => {
        const plainPassword = userData.password;
        
        // Create user with plain text password
        const createdUser = await User.create(userData);
        
        // Retrieve user from database
        const retrievedUser = await User.findById(createdUser._id);
        
        expect(retrievedUser).not.toBeNull();
        
        if (retrievedUser) {
          // Verify password is NOT stored as plain text
          expect(retrievedUser.password).not.toBe(plainPassword);
          
          // Verify password is a bcrypt hash (starts with $2b$ or $2a$ and has proper length)
          expect(retrievedUser.password).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
          
          // Verify the hashed password can be verified using bcrypt
          const isValid = await bcrypt.compare(plainPassword, retrievedUser.password);
          expect(isValid).toBe(true);
          
          // Verify wrong password fails verification
          const wrongPassword = plainPassword + 'wrong';
          const isInvalid = await bcrypt.compare(wrongPassword, retrievedUser.password);
          expect(isInvalid).toBe(false);
        }
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should hash passwords when updating user passwords', async () => {
    // Generator for passwords
    const passwordArbitrary = fc.string({ minLength: 6, maxLength: 100 })
      .filter(s => s.length >= 6);

    await fc.assert(
      fc.asyncProperty(passwordArbitrary, passwordArbitrary, async (initialPassword, newPassword) => {
        // Create initial user with unique identifiers
        const uniqueId = `${Date.now()}_${Math.random()}`;
        const user = await User.create({
          username: `testuser_${uniqueId}`,
          email: `test_${uniqueId}@example.com`,
          password: initialPassword,
        });

        const initialHashedPassword = user.password;
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        // Retrieve updated user
        const updatedUser = await User.findById(user._id);
        
        expect(updatedUser).not.toBeNull();
        
        if (updatedUser) {
          // Verify new password is NOT stored as plain text
          expect(updatedUser.password).not.toBe(newPassword);
          
          // Verify new password is a bcrypt hash
          expect(updatedUser.password).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
          
          // Verify the new hashed password can be verified
          const isNewPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
          expect(isNewPasswordValid).toBe(true);
          
          // Verify old password no longer works (unless they're the same)
          if (initialPassword !== newPassword) {
            const isOldPasswordValid = await bcrypt.compare(initialPassword, updatedUser.password);
            expect(isOldPasswordValid).toBe(false);
          }
          
          // Verify hash changed (unless passwords are the same)
          if (initialPassword !== newPassword) {
            expect(updatedUser.password).not.toBe(initialHashedPassword);
          }
        }
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should use comparePassword utility correctly', async () => {
    // Generator for passwords
    const passwordArbitrary = fc.string({ minLength: 6, maxLength: 100 })
      .filter(s => s.length >= 6);

    await fc.assert(
      fc.asyncProperty(passwordArbitrary, async (plainPassword) => {
        // Hash password using utility function
        const hashedPassword = await hashPassword(plainPassword);
        
        // Verify hash is not plain text
        expect(hashedPassword).not.toBe(plainPassword);
        
        // Verify hash format
        expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
        
        // Verify comparePassword utility works correctly
        const isValid = await comparePassword(plainPassword, hashedPassword);
        expect(isValid).toBe(true);
        
        // Verify wrong password fails
        const wrongPassword = plainPassword + 'x';
        const isInvalid = await comparePassword(wrongPassword, hashedPassword);
        expect(isInvalid).toBe(false);
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should not rehash password if not modified', async () => {
    // Generator for user data
    const userArbitrary = fc.record({
      username: fc.string({ minLength: 3, maxLength: 50 })
        .filter(s => s.trim().length >= 3)
        .map(s => `user_${s}_${Date.now()}_${Math.random()}`), // Make unique
      email: fc.tuple(
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.constantFrom('com', 'org', 'net')
      ).map(([local, domain, tld]) => `${local}_${Date.now()}_${Math.random()}@${domain}.${tld}`), // Make unique
      password: fc.string({ minLength: 6, maxLength: 100 })
        .filter(s => s.length >= 6),
    });

    await fc.assert(
      fc.asyncProperty(userArbitrary, async (userData) => {
        // Create user
        const user = await User.create(userData);
        const originalHash = user.password;
        
        // Update user without changing password
        user.username = userData.username + '_updated';
        await user.save();
        
        // Retrieve updated user
        const updatedUser = await User.findById(user._id);
        
        expect(updatedUser).not.toBeNull();
        
        if (updatedUser) {
          // Verify password hash hasn't changed
          expect(updatedUser.password).toBe(originalHash);
          
          // Verify original password still works
          const isValid = await bcrypt.compare(userData.password, updatedUser.password);
          expect(isValid).toBe(true);
        }
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);
});

describe('Authentication Property Tests', () => {
  // Feature: vibe-holidays-website, Property 10: Authentication with Valid Credentials
  // For any admin login attempt with valid credentials (correct username and password), 
  // the system should return an authentication token and grant access to protected routes.
  // Validates: Requirements 6.1
  it('should authenticate and return token with valid credentials', async () => {
    // Generator for valid user credentials with UUID for uniqueness
    const credentialsArbitrary = fc.record({
      uniqueId: fc.uuid(),
      password: fc.string({ minLength: 6, maxLength: 100 })
        .filter(s => s.length >= 6),
    }).map(({ uniqueId, password }) => ({
      username: `user_${uniqueId}`,
      email: `test_${uniqueId}@example.com`,
      password,
    }));

    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Check if user already exists (can happen during shrinking)
        const existingUser = await User.findOne({ username: credentials.username });
        if (existingUser) {
          // Skip this test case if user already exists
          return;
        }
        
        // Create user in database
        await User.create({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        });

        // Attempt login with valid credentials
        const response = await request(testApp)
          .post('/api/auth/login')
          .send({
            username: credentials.username,
            password: credentials.password,
          });

        // Verify successful authentication
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.token).toBeDefined();
        expect(typeof response.body.data.token).toBe('string');
        expect(response.body.data.token.length).toBeGreaterThan(0);
        
        // Verify user data is returned
        expect(response.body.data.user).toBeDefined();
        expect(response.body.data.user.username).toBe(credentials.username);
        expect(response.body.data.user.email).toBe(credentials.email);
        
        // Verify token grants access to protected routes
        const protectedResponse = await request(testApp)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${response.body.data.token}`);
        
        expect(protectedResponse.status).toBe(200);
        expect(protectedResponse.body.success).toBe(true);
        expect(protectedResponse.body.data.user.username).toBe(credentials.username);
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  // Feature: vibe-holidays-website, Property 11: Authentication Rejects Invalid Credentials
  // For any admin login attempt with invalid credentials (incorrect username or password), 
  // the system should reject the authentication and not grant access.
  // Validates: Requirements 6.1
  it('should reject authentication with invalid username', async () => {
    // Generator for user credentials
    const credentialsArbitrary = fc.record({
      username: fc.string({ minLength: 3, maxLength: 50 })
        .filter(s => s.trim().length >= 3)
        .map(s => `user_${s}_${Date.now()}_${Math.random()}`), // Make unique
      email: fc.tuple(
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.constantFrom('com', 'org', 'net')
      ).map(([local, domain, tld]) => `${local}_${Date.now()}_${Math.random()}@${domain}.${tld}`), // Make unique
      password: fc.string({ minLength: 6, maxLength: 100 })
        .filter(s => s.length >= 6),
      wrongUsername: fc.string({ minLength: 3, maxLength: 50 })
        .filter(s => s.trim().length >= 3)
        .map(s => `wrong_${s}_${Date.now()}_${Math.random()}`), // Make unique and different
    });

    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Create user in database
        await User.create({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        });

        // Attempt login with invalid username
        const response = await request(testApp)
          .post('/api/auth/login')
          .send({
            username: credentials.wrongUsername,
            password: credentials.password,
          });

        // Verify authentication is rejected
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBeDefined();
        
        // Verify no token is returned
        expect(response.body.token).toBeUndefined();
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should reject authentication with invalid password', async () => {
    // Generator for user credentials
    const credentialsArbitrary = fc.record({
      username: fc.string({ minLength: 3, maxLength: 50 })
        .filter(s => s.trim().length >= 3)
        .map(s => `user_${s}_${Date.now()}_${Math.random()}`), // Make unique
      email: fc.tuple(
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'.split('')), { minLength: 1, maxLength: 10 }),
        fc.constantFrom('com', 'org', 'net')
      ).map(([local, domain, tld]) => `${local}_${Date.now()}_${Math.random()}@${domain}.${tld}`), // Make unique
      password: fc.string({ minLength: 6, maxLength: 100 })
        .filter(s => s.length >= 6),
      wrongPassword: fc.string({ minLength: 6, maxLength: 100 })
        .filter(s => s.length >= 6)
        .map(s => `wrong_${s}`), // Make different
    });

    await fc.assert(
      fc.asyncProperty(credentialsArbitrary, async (credentials) => {
        // Ensure wrong password is actually different
        fc.pre(credentials.password !== credentials.wrongPassword);
        
        // Create user in database
        await User.create({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        });

        // Attempt login with invalid password
        const response = await request(testApp)
          .post('/api/auth/login')
          .send({
            username: credentials.username,
            password: credentials.wrongPassword,
          });

        // Verify authentication is rejected
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.data).toBeUndefined();
        expect(response.body.message).toBeDefined();
        
        // Verify no token is returned
        expect(response.body.token).toBeUndefined();
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should reject authentication with missing credentials', async () => {
    // Generator for partial credentials (missing username or password)
    const missingCredentialsArbitrary = fc.oneof(
      fc.record({
        username: fc.string({ minLength: 3, maxLength: 50 })
          .filter(s => s.trim().length >= 3),
        password: fc.constant(undefined), // Missing password
      }),
      fc.record({
        username: fc.constant(undefined), // Missing username
        password: fc.string({ minLength: 6, maxLength: 100 })
          .filter(s => s.length >= 6),
      }),
      fc.constant({}) // Both missing
    );

    await fc.assert(
      fc.asyncProperty(missingCredentialsArbitrary, async (credentials) => {
        // Attempt login with missing credentials
        const response = await request(testApp)
          .post('/api/auth/login')
          .send(credentials);

        // Verify authentication is rejected
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.data).toBeUndefined();
        
        // Verify no token is returned
        expect(response.body.token).toBeUndefined();
      }),
      { numRuns: 20, timeout: 30000 }
    );
  }, 60000);

  it('should not grant access to protected routes without valid token', async () => {
    // Generator for invalid tokens
    const invalidTokenArbitrary = fc.oneof(
      fc.constant(''), // Empty token
      fc.constant('invalid-token'), // Invalid format
      fc.string({ minLength: 1, maxLength: 100 }), // Random string
      fc.constant(undefined) // No token
    );

    await fc.assert(
      fc.asyncProperty(invalidTokenArbitrary, async (invalidToken) => {
        // Attempt to access protected route with invalid token
        const request_builder = request(testApp).get('/api/auth/me');
        
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
});

