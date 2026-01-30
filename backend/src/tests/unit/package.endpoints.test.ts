import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import packageRoutes from '../../routes/packageRoutes';
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

  // Create Express app with package routes
  app = express();
  app.use(express.json());
  app.use('/api/packages', packageRoutes);
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

describe('Package Endpoints Unit Tests', () => {
  describe('Pagination Tests', () => {
    beforeEach(async () => {
      // Create 25 test packages
      const packages = [];
      for (let i = 1; i <= 25; i++) {
        packages.push({
          name: `Package ${i}`,
          destination: `Destination ${i}`,
          duration: 5 + (i % 10),
          price: 1000 + i * 100,
          description: `Description for package ${i}`,
          active: true,
        });
      }
      await Package.insertMany(packages);
    });

    it('should return first page with default limit of 10', async () => {
      const response = await request(app).get('/api/packages').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        pages: 3,
      });
    });

    it('should return second page with default limit', async () => {
      const response = await request(app)
        .get('/api/packages?page=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        pages: 3,
      });
    });

    it('should return third page with remaining items', async () => {
      const response = await request(app)
        .get('/api/packages?page=3')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toEqual({
        page: 3,
        limit: 10,
        total: 25,
        pages: 3,
      });
    });

    it('should respect custom limit parameter', async () => {
      const response = await request(app)
        .get('/api/packages?limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 5,
        total: 25,
        pages: 5,
      });
    });

    it('should handle custom page and limit together', async () => {
      const response = await request(app)
        .get('/api/packages?page=2&limit=7')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(7);
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 7,
        total: 25,
        pages: 4,
      });
    });

    it('should return empty array for page beyond available data', async () => {
      const response = await request(app)
        .get('/api/packages?page=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.page).toBe(10);
      expect(response.body.pagination.total).toBe(25);
    });
  });

  describe('Invalid Package ID Tests', () => {
    it('should return 500 for malformed package ID', async () => {
      const response = await request(app)
        .get('/api/packages/invalid-id-format')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'An error occurred while fetching the package.'
      );
    });

    it('should return 404 for valid but non-existent package ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/packages/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Package not found');
    });

    it('should return package for valid existing ID', async () => {
      const pkg = await Package.create({
        name: 'Test Package',
        destination: 'Test Destination',
        duration: 7,
        price: 1500,
        description: 'Test description',
        active: true,
      });

      const response = await request(app)
        .get(`/api/packages/${pkg._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Package');
      expect(response.body.data._id).toBe(pkg._id.toString());
    });
  });

  describe('Unauthorized Access to Admin Endpoints', () => {
    const validPackageData = {
      name: 'New Package',
      destination: 'New Destination',
      duration: 5,
      price: 2000,
      description: 'New package description',
    };

    it('should reject POST request without authentication token', async () => {
      const response = await request(app)
        .post('/api/packages')
        .send(validPackageData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should reject POST request with malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/packages')
        .set('Authorization', 'InvalidFormat token123')
        .send(validPackageData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should reject POST request with invalid token', async () => {
      const response = await request(app)
        .post('/api/packages')
        .set('Authorization', 'Bearer invalid-token-string')
        .send(validPackageData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid or expired token. Please login again.'
      );
    });

    it('should accept POST request with valid authentication token', async () => {
      const token = generateToken('test-user-id', 'test@example.com');

      const response = await request(app)
        .post('/api/packages')
        .set('Authorization', `Bearer ${token}`)
        .send(validPackageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Package');
      expect(response.body.message).toBe('Package created successfully');
    });

    it('should reject PUT request without authentication token', async () => {
      const pkg = await Package.create({
        name: 'Test Package',
        destination: 'Test Destination',
        duration: 7,
        price: 1500,
        description: 'Test description',
      });

      const response = await request(app)
        .put(`/api/packages/${pkg._id}`)
        .send({ name: 'Updated Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should accept PUT request with valid authentication token', async () => {
      const pkg = await Package.create({
        name: 'Test Package',
        destination: 'Test Destination',
        duration: 7,
        price: 1500,
        description: 'Test description',
      });

      const token = generateToken('test-user-id', 'test@example.com');

      const response = await request(app)
        .put(`/api/packages/${pkg._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Package Name' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Package Name');
      expect(response.body.message).toBe('Package updated successfully');
    });

    it('should reject DELETE request without authentication token', async () => {
      const pkg = await Package.create({
        name: 'Test Package',
        destination: 'Test Destination',
        duration: 7,
        price: 1500,
        description: 'Test description',
      });

      const response = await request(app)
        .delete(`/api/packages/${pkg._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should accept DELETE request with valid authentication token', async () => {
      const pkg = await Package.create({
        name: 'Test Package',
        destination: 'Test Destination',
        duration: 7,
        price: 1500,
        description: 'Test description',
      });

      const token = generateToken('test-user-id', 'test@example.com');

      const response = await request(app)
        .delete(`/api/packages/${pkg._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Package deleted successfully');

      // Verify package was actually deleted
      const deletedPkg = await Package.findById(pkg._id);
      expect(deletedPkg).toBeNull();
    });
  });
});
