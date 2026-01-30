import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import express from 'express';
import path from 'path';
import galleryRoutes from '../../routes/galleryRoutes';
import Gallery from '../../models/Gallery';
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

  // Create Express app with gallery routes
  app = express();
  app.use(express.json());
  app.use('/api/gallery', galleryRoutes);
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

describe('Gallery Endpoints Unit Tests', () => {
  describe('File Upload Validation Tests', () => {
    let token: string;

    beforeAll(() => {
      token = generateToken('test-admin-id', 'admin@example.com');
    });

    it('should reject upload with invalid file type (PDF)', async () => {
      const testFilePath = path.join(__dirname, '../fixtures/test.pdf');

      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake pdf content'), {
          filename: 'test.pdf',
          contentType: 'application/pdf',
        })
        .field('category', 'destinations')
        .field('caption', 'Test caption');

      // Multer errors result in 500 status with empty body
      expect(response.status).toBe(500);
    });

    it('should reject upload with invalid file type (text file)', async () => {
      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('plain text content'), {
          filename: 'test.txt',
          contentType: 'text/plain',
        })
        .field('category', 'destinations')
        .field('caption', 'Test caption');

      // Multer errors result in 500 status with empty body
      expect(response.status).toBe(500);
    });

    it('should accept upload with valid image type (JPEG)', async () => {
      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake jpeg content'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        })
        .field('category', 'destinations')
        .field('caption', 'Test caption');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category).toBe('destinations');
      expect(response.body.message).toBe('Image uploaded successfully');
    });

    it('should accept upload with valid image type (PNG)', async () => {
      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake png content'), {
          filename: 'test.png',
          contentType: 'image/png',
        })
        .field('category', 'experiences')
        .field('caption', 'Test PNG image');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.category).toBe('experiences');
    });

    it('should accept upload with valid image type (WebP)', async () => {
      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake webp content'), {
          filename: 'test.webp',
          contentType: 'image/webp',
        })
        .field('category', 'destinations')
        .field('caption', 'Test WebP image');

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should reject upload exceeding file size limit', async () => {
      // Create a buffer larger than 5MB
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB

      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', largeBuffer, {
          filename: 'large-image.jpg',
          contentType: 'image/jpeg',
        })
        .field('category', 'destinations')
        .field('caption', 'Large image');

      // Multer errors result in 500 status with empty body
      expect(response.status).toBe(500);
    });

    it('should reject upload without image file', async () => {
      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .field('category', 'destinations')
        .field('caption', 'Test caption');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No image file provided');
    });

    it('should reject upload without required category field', async () => {
      const response = await request(app)
        .post('/api/gallery')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake jpeg content'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        })
        .field('caption', 'Test caption');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('Invalid Category Filter Tests', () => {
    beforeEach(async () => {
      // Create test gallery images with different categories
      await Gallery.insertMany([
        {
          url: '/uploads/image1.jpg',
          category: 'destinations',
          caption: 'Beach destination',
        },
        {
          url: '/uploads/image2.jpg',
          category: 'destinations',
          caption: 'Mountain destination',
        },
        {
          url: '/uploads/image3.jpg',
          category: 'experiences',
          caption: 'Adventure experience',
        },
        {
          url: '/uploads/image4.jpg',
          category: 'accommodations',
          caption: 'Luxury hotel',
        },
      ]);
    });

    it('should return empty array for non-existent category', async () => {
      const response = await request(app)
        .get('/api/gallery?category=nonexistent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return only matching images for valid category filter', async () => {
      const response = await request(app)
        .get('/api/gallery?category=destinations')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
      response.body.data.forEach((image: any) => {
        expect(image.category).toBe('destinations');
      });
    });

    it('should return all images when no category filter is provided', async () => {
      const response = await request(app).get('/api/gallery').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(4);
      expect(response.body.pagination.total).toBe(4);
    });

    it('should handle category filter with special characters gracefully', async () => {
      const response = await request(app)
        .get('/api/gallery?category=test%20category%20with%20spaces')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return correct images for category route parameter', async () => {
      const response = await request(app)
        .get('/api/gallery/experiences')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].category).toBe('experiences');
    });

    it('should return empty array for non-existent category in route parameter', async () => {
      const response = await request(app)
        .get('/api/gallery/invalid-category')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });
});
