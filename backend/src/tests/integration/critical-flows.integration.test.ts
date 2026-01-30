import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../server';
import User from '../../models/User';
import Package from '../../models/Package';
import Booking from '../../models/Booking';
import Inquiry from '../../models/Inquiry';

/**
 * Integration Tests for Critical User Flows
 * 
 * Tests three critical flows:
 * 1. Complete booking flow (browse → select → book → confirm)
 * 2. Admin workflow (login → manage packages → logout)
 * 3. Inquiry submission flow
 * 
 * Requirements: 2.1, 3.1, 6.1, 6.3
 */

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Disconnect from any existing connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Clean up
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Integration Test: Complete Booking Flow', () => {
  /**
   * Test complete booking flow: browse → select → book → confirm
   * Requirements: 2.1, 3.1
   */
  it('should allow user to browse packages, select one, and complete booking', async () => {
    // Step 1: Create test packages in database
    const testPackage = await Package.create({
      name: 'Bali Adventure',
      destination: 'Bali, Indonesia',
      duration: 7,
      price: 1500,
      description: 'Amazing Bali adventure package',
      itinerary: ['Day 1: Arrival', 'Day 2: Beach tour'],
      inclusions: ['Hotel', 'Meals', 'Transport'],
      exclusions: ['Flights', 'Insurance'],
      images: ['image1.jpg'],
      featured: true,
      active: true,
    });

    await Package.create({
      name: 'Tokyo Experience',
      destination: 'Tokyo, Japan',
      duration: 5,
      price: 2000,
      description: 'Cultural Tokyo experience',
      itinerary: ['Day 1: Arrival'],
      inclusions: ['Hotel'],
      exclusions: ['Flights'],
      images: ['image2.jpg'],
      active: true,
    });

    // Step 2: Browse packages (GET /api/packages)
    const browseResponse = await request(app)
      .get('/api/packages')
      .expect(200);

    expect(browseResponse.body.success).toBe(true);
    expect(browseResponse.body.data).toHaveLength(2);
    expect(browseResponse.body.data[0].name).toBeDefined();

    // Step 3: Select a specific package (GET /api/packages/:id)
    const selectResponse = await request(app)
      .get(`/api/packages/${testPackage._id}`)
      .expect(200);

    expect(selectResponse.body.success).toBe(true);
    expect(selectResponse.body.data.name).toBe('Bali Adventure');
    expect(selectResponse.body.data.price).toBe(1500);
    expect(selectResponse.body.data.itinerary).toHaveLength(2);

    // Step 4: Create booking (POST /api/bookings)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const bookingData = {
      packageId: testPackage._id.toString(),
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      travelDate: futureDate.toISOString(),
      numberOfTravelers: 2,
      specialRequests: 'Vegetarian meals please',
      totalPrice: 3000,
    };

    const bookingResponse = await request(app)
      .post('/api/bookings')
      .send(bookingData)
      .expect(201);

    expect(bookingResponse.body.success).toBe(true);
    expect(bookingResponse.body.data.customerName).toBe('John Doe');
    expect(bookingResponse.body.data.status).toBe('pending');
    expect(bookingResponse.body.data.packageId).toBeDefined();

    // Step 5: Verify booking was persisted
    const savedBooking = await Booking.findById(bookingResponse.body.data._id);
    expect(savedBooking).toBeDefined();
    expect(savedBooking?.customerName).toBe('John Doe');
    expect(savedBooking?.email).toBe('john@example.com');
    expect(savedBooking?.status).toBe('pending');
  });

  it('should handle booking with invalid package ID', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const invalidBookingData = {
      packageId: new mongoose.Types.ObjectId().toString(),
      customerName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1234567890',
      travelDate: futureDate.toISOString(),
      numberOfTravelers: 1,
      totalPrice: 1500,
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(invalidBookingData)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Package not found');
  });

  it('should reject booking with past travel date', async () => {
    const testPackage = await Package.create({
      name: 'Test Package',
      destination: 'Test Destination',
      duration: 5,
      price: 1000,
      description: 'Test description',
      itinerary: [],
      inclusions: [],
      exclusions: [],
      images: [],
      active: true,
    });

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    const bookingData = {
      packageId: testPackage._id.toString(),
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      travelDate: pastDate.toISOString(),
      numberOfTravelers: 1,
      totalPrice: 1000,
    };

    const response = await request(app)
      .post('/api/bookings')
      .send(bookingData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});

describe('Integration Test: Admin Workflow', () => {
  /**
   * Test admin workflow: login → manage packages → logout
   * Requirements: 6.1, 6.3
   */
  let authToken: string;

  beforeEach(async () => {
    // Create admin user for testing
    await User.create({
      username: 'admin',
      email: 'admin@vibeholidays.com',
      password: 'admin123',
      role: 'admin',
    });
  });

  it('should complete full admin workflow: login, create package, update package, delete package, logout', async () => {
    // Step 1: Admin login (POST /api/auth/login)
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      })
      .expect(200);

    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.token).toBeDefined();
    expect(loginResponse.body.data.user.username).toBe('admin');

    authToken = loginResponse.body.data.token;

    // Step 2: Create new package (POST /api/admin/packages)
    const newPackageData = {
      name: 'Paris Romance',
      destination: 'Paris, France',
      duration: 6,
      price: 2500,
      description: 'Romantic getaway in Paris',
      itinerary: ['Day 1: Eiffel Tower', 'Day 2: Louvre Museum'],
      inclusions: ['Hotel', 'Breakfast', 'City tour'],
      exclusions: ['Flights', 'Lunch', 'Dinner'],
      images: ['paris1.jpg', 'paris2.jpg'],
      featured: true,
      active: true,
      category: 'Romance',
    };

    const createResponse = await request(app)
      .post('/api/admin/packages')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPackageData)
      .expect(201);

    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.name).toBe('Paris Romance');
    expect(createResponse.body.data.price).toBe(2500);

    const packageId = createResponse.body.data._id;

    // Step 3: Verify package was created
    const getResponse = await request(app)
      .get(`/api/packages/${packageId}`)
      .expect(200);

    expect(getResponse.body.success).toBe(true);
    expect(getResponse.body.data.name).toBe('Paris Romance');

    // Step 4: Update package (PUT /api/admin/packages/:id)
    const updateData = {
      price: 2800,
      description: 'Updated romantic getaway in Paris with more inclusions',
      featured: false,
    };

    const updateResponse = await request(app)
      .put(`/api/admin/packages/${packageId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.price).toBe(2800);
    expect(updateResponse.body.data.featured).toBe(false);

    // Step 5: Verify update persisted
    const verifyUpdateResponse = await request(app)
      .get(`/api/packages/${packageId}`)
      .expect(200);

    expect(verifyUpdateResponse.body.data.price).toBe(2800);

    // Step 6: Delete package (DELETE /api/admin/packages/:id)
    const deleteResponse = await request(app)
      .delete(`/api/admin/packages/${packageId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(deleteResponse.body.success).toBe(true);
    expect(deleteResponse.body.message).toContain('deleted');

    // Step 7: Verify package was deleted
    const verifyDeleteResponse = await request(app)
      .get(`/api/packages/${packageId}`)
      .expect(404);

    expect(verifyDeleteResponse.body.success).toBe(false);

    // Step 8: Logout (POST /api/auth/logout)
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(logoutResponse.body.success).toBe(true);
    expect(logoutResponse.body.message).toContain('Logout successful');
  });

  it('should reject package creation without authentication', async () => {
    const packageData = {
      name: 'Unauthorized Package',
      destination: 'Test',
      duration: 5,
      price: 1000,
      description: 'Test',
      itinerary: [],
      inclusions: [],
      exclusions: [],
      images: [],
    };

    const response = await request(app)
      .post('/api/admin/packages')
      .send(packageData)
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should reject package update with invalid token', async () => {
    const testPackage = await Package.create({
      name: 'Test Package',
      destination: 'Test',
      duration: 5,
      price: 1000,
      description: 'Test',
      itinerary: [],
      inclusions: [],
      exclusions: [],
      images: [],
      active: true,
    });

    const response = await request(app)
      .put(`/api/admin/packages/${testPackage._id}`)
      .set('Authorization', 'Bearer invalid-token')
      .send({ price: 1500 })
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it('should handle login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Invalid credentials');
  });
});

describe('Integration Test: Inquiry Submission Flow', () => {
  /**
   * Test inquiry submission flow
   * Requirements: 3.1
   */
  it('should allow user to submit inquiry and verify it is stored', async () => {
    // Step 1: Create a test package (optional for inquiry)
    const testPackage = await Package.create({
      name: 'Custom Tour',
      destination: 'Multiple Destinations',
      duration: 10,
      price: 3000,
      description: 'Customizable tour package',
      itinerary: [],
      inclusions: [],
      exclusions: [],
      images: [],
      active: true,
    });

    // Step 2: Submit inquiry (POST /api/inquiries)
    const inquiryData = {
      name: 'Alice Smith',
      email: 'alice@example.com',
      phone: '+1234567890',
      packageId: testPackage._id.toString(),
      message: 'I would like to customize this package for my family of 4. Can we add extra activities?',
    };

    const inquiryResponse = await request(app)
      .post('/api/inquiries')
      .send(inquiryData)
      .expect(201);

    expect(inquiryResponse.body.success).toBe(true);
    expect(inquiryResponse.body.data.inquiry.name).toBe('Alice Smith');
    expect(inquiryResponse.body.data.inquiry.email).toBe('alice@example.com');
    expect(inquiryResponse.body.data.inquiry.status).toBe('new');
    expect(inquiryResponse.body.data.inquiry.packageId).toBeDefined();

    // Step 3: Verify inquiry was persisted
    const savedInquiry = await Inquiry.findById(inquiryResponse.body.data.inquiry.id);
    expect(savedInquiry).toBeDefined();
    expect(savedInquiry?.name).toBe('Alice Smith');
    expect(savedInquiry?.message).toContain('customize this package');
    expect(savedInquiry?.status).toBe('new');
  });

  it('should allow inquiry submission without package ID', async () => {
    const inquiryData = {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+9876543210',
      message: 'I am interested in planning a custom trip to Europe. Can you help?',
    };

    const response = await request(app)
      .post('/api/inquiries')
      .send(inquiryData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.inquiry.name).toBe('Bob Johnson');
    expect(response.body.data.inquiry.packageId).toBeUndefined();
  });

  it('should reject inquiry with invalid email', async () => {
    const inquiryData = {
      name: 'Invalid User',
      email: 'not-an-email',
      message: 'Test message',
    };

    const response = await request(app)
      .post('/api/inquiries')
      .send(inquiryData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should reject inquiry with missing required fields', async () => {
    const inquiryData = {
      name: 'Test User',
      // Missing email and message
    };

    const response = await request(app)
      .post('/api/inquiries')
      .send(inquiryData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it('should allow admin to view and update inquiry status', async () => {
    // Create admin user
    await User.create({
      username: 'admin',
      email: 'admin@vibeholidays.com',
      password: 'admin123',
      role: 'admin',
    });

    // Login as admin
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123',
      })
      .expect(200);

    const authToken = loginResponse.body.data.token;

    // Create inquiry
    const inquiry = await Inquiry.create({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test inquiry',
      status: 'new',
    });

    // Get all inquiries as admin
    const getInquiriesResponse = await request(app)
      .get('/api/admin/inquiries')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(getInquiriesResponse.body.success).toBe(true);
    expect(getInquiriesResponse.body.data.inquiries).toHaveLength(1);

    // Update inquiry status
    const updateResponse = await request(app)
      .put(`/api/admin/inquiries/${inquiry._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'responded' })
      .expect(200);

    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.inquiry.status).toBe('responded');
  });
});
