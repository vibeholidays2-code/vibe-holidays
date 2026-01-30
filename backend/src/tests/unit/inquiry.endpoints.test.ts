import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import inquiryRoutes from '../../routes/inquiryRoutes';
import Inquiry from '../../models/Inquiry';
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

  // Create Express app with inquiry routes
  app = express();
  app.use(express.json());
  app.use('/api', inquiryRoutes);
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

describe('Inquiry Endpoints Unit Tests', () => {
  describe('Inquiry Without Optional Package ID', () => {
    it('should create inquiry successfully without packageId', async () => {
      const inquiryData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        message: 'I would like to know more about your services',
      };

      const response = await request(app)
        .post('/api/inquiries')
        .send(inquiryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Inquiry submitted successfully');
      expect(response.body.data.inquiry.name).toBe('John Doe');
      expect(response.body.data.inquiry.email).toBe('john@example.com');
      expect(response.body.data.inquiry.message).toBe(
        'I would like to know more about your services'
      );
      expect(response.body.data.inquiry.packageId).toBeUndefined();
      expect(response.body.data.inquiry.status).toBe('new');
    });

    it('should create inquiry successfully with packageId', async () => {
      // Create a valid package first
      const pkg = await Package.create({
        name: 'Beach Paradise',
        destination: 'Maldives',
        duration: 7,
        price: 1500,
        description: 'Relaxing beach vacation',
        active: true,
      });

      const inquiryData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567890',
        packageId: pkg._id,
        message: 'I am interested in this package',
      };

      const response = await request(app)
        .post('/api/inquiries')
        .send(inquiryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inquiry.packageId).toBeDefined();
      expect(response.body.data.inquiry.packageId.toString()).toBe(
        pkg._id.toString()
      );
    });

    it('should persist inquiry without packageId in database', async () => {
      const inquiryData = {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        message: 'General inquiry about travel packages',
      };

      const response = await request(app)
        .post('/api/inquiries')
        .send(inquiryData)
        .expect(201);

      // Verify in database
      const savedInquiry = await Inquiry.findById(
        response.body.data.inquiry.id
      );
      expect(savedInquiry).toBeDefined();
      expect(savedInquiry?.name).toBe('Bob Johnson');
      expect(savedInquiry?.packageId).toBeUndefined();
    });

    it('should reject inquiry with invalid packageId', async () => {
      const nonExistentPackageId = new mongoose.Types.ObjectId();
      const inquiryData = {
        name: 'Alice Brown',
        email: 'alice@example.com',
        message: 'Inquiry about package',
        packageId: nonExistentPackageId,
      };

      const response = await request(app)
        .post('/api/inquiries')
        .send(inquiryData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid package ID');
    });

    it('should accept inquiry with phone number omitted', async () => {
      const inquiryData = {
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        message: 'I prefer email contact',
      };

      const response = await request(app)
        .post('/api/inquiries')
        .send(inquiryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inquiry.phone).toBeUndefined();
    });
  });

  describe('Inquiry Status Updates', () => {
    let inquiry: any;
    let adminToken: string;

    beforeEach(async () => {
      // Create an inquiry
      inquiry = await Inquiry.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        message: 'Test inquiry message',
        status: 'new',
      });

      // Generate admin token
      adminToken = generateToken('admin-user-id', 'admin@example.com');
    });

    it('should update inquiry status from new to read', async () => {
      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Inquiry status updated successfully');
      expect(response.body.data.inquiry.status).toBe('read');
    });

    it('should update inquiry status from new to responded', async () => {
      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'responded' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inquiry.status).toBe('responded');
    });

    it('should update inquiry status from read to responded', async () => {
      // First update to read
      await Inquiry.findByIdAndUpdate(inquiry._id, { status: 'read' });

      // Then update to responded
      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'responded' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inquiry.status).toBe('responded');
    });

    it('should update inquiry status from responded back to new', async () => {
      // First update to responded
      await Inquiry.findByIdAndUpdate(inquiry._id, { status: 'responded' });

      // Then update back to new
      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'new' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inquiry.status).toBe('new');
    });

    it('should reject invalid status value', async () => {
      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Invalid status. Must be one of: new, read, responded'
      );
    });

    it('should reject status update without authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .send({ status: 'read' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Authentication required. Please provide a valid token.'
      );
    });

    it('should return 404 when updating non-existent inquiry', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/admin/inquiries/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Inquiry not found');
    });

    it('should persist status changes in database', async () => {
      await request(app)
        .put(`/api/admin/inquiries/${inquiry._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'responded' })
        .expect(200);

      // Verify in database
      const updatedInquiry = await Inquiry.findById(inquiry._id);
      expect(updatedInquiry?.status).toBe('responded');
    });

    it('should handle inquiry with packageId in status update', async () => {
      // Create package and inquiry with packageId
      const pkg = await Package.create({
        name: 'Mountain Trek',
        destination: 'Himalayas',
        duration: 10,
        price: 2500,
        description: 'Adventure trek',
        active: true,
      });

      const inquiryWithPackage = await Inquiry.create({
        name: 'Test User 2',
        email: 'test2@example.com',
        message: 'Inquiry about mountain trek',
        packageId: pkg._id,
        status: 'new',
      });

      const response = await request(app)
        .put(`/api/admin/inquiries/${inquiryWithPackage._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.inquiry.package).toBeDefined();
      expect(response.body.data.inquiry.package.name).toBe('Mountain Trek');
      expect(response.body.data.inquiry.status).toBe('read');
    });
  });
});
