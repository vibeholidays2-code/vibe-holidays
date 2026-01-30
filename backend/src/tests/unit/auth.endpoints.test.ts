import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import authRoutes from '../../routes/authRoutes';
import User from '../../models/User';
import { generateToken } from '../../utils/auth';

let mongoServer: MongoMemoryServer;
let app: express.Application;

// Setup Express app for testing
beforeAll(async () => {
  // Set JWT_SECRET for tests
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRES_IN = '7d';

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create Express app with auth routes
  app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
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

describe('Authentication Endpoints Unit Tests', () => {
  describe('Login with Missing Credentials', () => {
    it('should return 400 when username is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    it('should return 400 when both username and password are missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    it('should return 400 when username is empty string', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: '', password: 'password123' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    it('should return 400 when password is empty string', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username and password are required');
    });

    it('should return 401 when username does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistent', password: 'password123' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 when password is incorrect', async () => {
      // Create a user first (password will be hashed by pre-save hook)
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'correctpassword', // Plain text - will be hashed by model
        role: 'admin',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 200 and token when credentials are valid', async () => {
      // Create a user with known credentials (password will be hashed by pre-save hook)
      const user = await User.create({
        username: 'validuser',
        email: 'valid@example.com',
        password: 'correctpassword', // Plain text - will be hashed by model
        role: 'admin',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'validuser', password: 'correctpassword' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.username).toBe('validuser');
      expect(response.body.data.user.email).toBe('valid@example.com');
      expect(response.body.data.user.role).toBe('admin');
      expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
    });
  });

  describe('Token Expiration', () => {
    let user: any;

    beforeEach(async () => {
      // Create a test user (password will be hashed by pre-save hook)
      user = await User.create({
        username: 'tokenuser',
        email: 'token@example.com',
        password: 'password123', // Plain text - will be hashed by model
        role: 'admin',
      });
    });

    it('should reject expired token when accessing protected route', async () => {
      // Generate an expired token (expires in 1 second)
      const expiredToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1ms' } // Expires immediately
      );

      // Wait a bit to ensure token is expired
      await new Promise((resolve) => setTimeout(resolve, 10));

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid or expired token. Please login again.'
      );
    });

    it('should accept valid non-expired token', async () => {
      // Generate a valid token
      const validToken = generateToken(user._id.toString(), user.email);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.username).toBe('tokenuser');
    });

    it('should reject malformed token', async () => {
      const malformedToken = 'this-is-not-a-valid-jwt-token';

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${malformedToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid or expired token. Please login again.'
      );
    });

    it('should reject token with invalid signature', async () => {
      // Generate token with different secret
      const invalidToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        'wrong-secret-key',
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid or expired token. Please login again.'
      );
    });

    it('should reject request without Authorization header', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should reject request with malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });
  });

  describe('Logout Functionality', () => {
    let user: any;
    let validToken: string;

    beforeEach(async () => {
      // Create a test user (password will be hashed by pre-save hook)
      user = await User.create({
        username: 'logoutuser',
        email: 'logout@example.com',
        password: 'password123', // Plain text - will be hashed by model
        role: 'admin',
      });

      // Generate valid token
      validToken = generateToken(user._id.toString(), user.email);
    });

    it('should successfully logout with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        'Logout successful. Please remove the token from client storage.'
      );
    });

    it('should reject logout without authentication token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should reject logout with expired token', async () => {
      // Generate an expired token
      const expiredToken = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1ms' }
      );

      // Wait to ensure token is expired
      await new Promise((resolve) => setTimeout(resolve, 10));

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid or expired token. Please login again.'
      );
    });

    it('should reject logout with invalid token', async () => {
      const invalidToken = 'invalid-token-string';

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid or expired token. Please login again.'
      );
    });

    it('should handle logout as stateless operation (JWT remains valid until expiry)', async () => {
      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Token should still be valid for other requests (stateless JWT)
      // This demonstrates that logout is client-side only
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });
  });
});
