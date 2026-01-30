import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Package from '../../models/Package';
import Booking from '../../models/Booking';
import Inquiry from '../../models/Inquiry';
import User from '../../models/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
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

describe('Model Validation Edge Cases', () => {
  describe('Package Model Validation', () => {
    it('should reject package with missing required name field', async () => {
      const packageData = {
        destination: 'Bali',
        duration: 7,
        price: 1500,
        description: 'Amazing trip',
      };

      const pkg = new Package(packageData);
      await expect(pkg.validate()).rejects.toThrow();
      await expect(pkg.save()).rejects.toThrow('Package name is required');
    });

    it('should reject package with missing required destination field', async () => {
      const packageData = {
        name: 'Bali Adventure',
        duration: 7,
        price: 1500,
        description: 'Amazing trip',
      };

      const pkg = new Package(packageData);
      await expect(pkg.validate()).rejects.toThrow();
      await expect(pkg.save()).rejects.toThrow('Destination is required');
    });

    it('should reject package with missing required price field', async () => {
      const packageData = {
        name: 'Bali Adventure',
        destination: 'Bali',
        duration: 7,
        description: 'Amazing trip',
      };

      const pkg = new Package(packageData);
      await expect(pkg.validate()).rejects.toThrow();
      await expect(pkg.save()).rejects.toThrow('Price is required');
    });

    it('should reject package with negative price', async () => {
      const packageData = {
        name: 'Bali Adventure',
        destination: 'Bali',
        duration: 7,
        price: -100,
        description: 'Amazing trip',
      };

      const pkg = new Package(packageData);
      await expect(pkg.validate()).rejects.toThrow('Price cannot be negative');
    });

    it('should reject package with duration less than 1', async () => {
      const packageData = {
        name: 'Bali Adventure',
        destination: 'Bali',
        duration: 0,
        price: 1500,
        description: 'Amazing trip',
      };

      const pkg = new Package(packageData);
      await expect(pkg.validate()).rejects.toThrow('Duration must be at least 1 day');
    });
  });

  describe('Booking Model Validation - Email Formats', () => {
    const validPackageId = new mongoose.Types.ObjectId();

    it('should reject booking with invalid email format - missing @', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'invalidemail.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Please provide a valid email address');
    });

    it('should reject booking with invalid email format - missing domain', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'invalid@',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Please provide a valid email address');
    });

    it('should reject booking with invalid email format - spaces', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'invalid email@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Please provide a valid email address');
    });

    it('should reject booking with invalid email format - special characters', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'invalid#email@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Please provide a valid email address');
    });

    it('should accept booking with valid email format', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'valid.email@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).resolves.not.toThrow();
    });
  });

  describe('Booking Model Validation - Missing Required Fields', () => {
    const validPackageId = new mongoose.Types.ObjectId();

    it('should reject booking with missing packageId', async () => {
      const bookingData = {
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Package ID is required');
    });

    it('should reject booking with missing customerName', async () => {
      const bookingData = {
        packageId: validPackageId,
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Customer name is required');
    });

    it('should reject booking with missing email', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Email is required');
    });

    it('should reject booking with missing phone', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Phone number is required');
    });

    it('should reject booking with missing travelDate', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Travel date is required');
    });

    it('should reject booking with missing numberOfTravelers', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Number of travelers is required');
    });

    it('should reject booking with numberOfTravelers less than 1', async () => {
      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: new Date(Date.now() + 86400000 * 30),
        numberOfTravelers: 0,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Number of travelers must be at least 1');
    });
  });

  describe('Booking Model Validation - Date Validation', () => {
    const validPackageId = new mongoose.Types.ObjectId();

    it('should reject booking with past travel date', async () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday

      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: pastDate,
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Travel date must be in the future');
    });

    it('should reject booking with current date as travel date', async () => {
      const today = new Date();

      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: today,
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).rejects.toThrow('Travel date must be in the future');
    });

    it('should accept booking with future travel date', async () => {
      const futureDate = new Date(Date.now() + 86400000 * 30); // 30 days from now

      const bookingData = {
        packageId: validPackageId,
        customerName: 'John Doe',
        email: 'john@test.com',
        phone: '1234567890',
        travelDate: futureDate,
        numberOfTravelers: 2,
        totalPrice: 3000,
      };

      const booking = new Booking(bookingData);
      await expect(booking.validate()).resolves.not.toThrow();
    });
  });

  describe('Inquiry Model Validation - Email Formats', () => {
    it('should reject inquiry with invalid email format', async () => {
      const inquiryData = {
        name: 'Jane Doe',
        email: 'invalid-email',
        message: 'I would like more information',
      };

      const inquiry = new Inquiry(inquiryData);
      await expect(inquiry.validate()).rejects.toThrow('Please provide a valid email address');
    });

    it('should accept inquiry with valid email format', async () => {
      const inquiryData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
        message: 'I would like more information',
      };

      const inquiry = new Inquiry(inquiryData);
      await expect(inquiry.validate()).resolves.not.toThrow();
    });
  });

  describe('Inquiry Model Validation - Missing Required Fields', () => {
    it('should reject inquiry with missing name', async () => {
      const inquiryData = {
        email: 'jane@test.com',
        message: 'I would like more information',
      };

      const inquiry = new Inquiry(inquiryData);
      await expect(inquiry.validate()).rejects.toThrow('Name is required');
    });

    it('should reject inquiry with missing email', async () => {
      const inquiryData = {
        name: 'Jane Doe',
        message: 'I would like more information',
      };

      const inquiry = new Inquiry(inquiryData);
      await expect(inquiry.validate()).rejects.toThrow('Email is required');
    });

    it('should reject inquiry with missing message', async () => {
      const inquiryData = {
        name: 'Jane Doe',
        email: 'jane@test.com',
      };

      const inquiry = new Inquiry(inquiryData);
      await expect(inquiry.validate()).rejects.toThrow('Message is required');
    });
  });

  describe('User Model Validation - Email Formats', () => {
    it('should reject user with invalid email format', async () => {
      const userData = {
        username: 'admin',
        email: 'not-an-email',
        password: 'password123',
      };

      const user = new User(userData);
      await expect(user.validate()).rejects.toThrow('Please provide a valid email address');
    });

    it('should accept user with valid email format', async () => {
      const userData = {
        username: 'admin',
        email: 'admin@test.com',
        password: 'password123',
      };

      const user = new User(userData);
      await expect(user.validate()).resolves.not.toThrow();
    });
  });

  describe('User Model Validation - Missing Required Fields', () => {
    it('should reject user with missing username', async () => {
      const userData = {
        email: 'admin@test.com',
        password: 'password123',
      };

      const user = new User(userData);
      await expect(user.validate()).rejects.toThrow('Username is required');
    });

    it('should reject user with missing email', async () => {
      const userData = {
        username: 'admin',
        password: 'password123',
      };

      const user = new User(userData);
      await expect(user.validate()).rejects.toThrow('Email is required');
    });

    it('should reject user with missing password', async () => {
      const userData = {
        username: 'admin',
        email: 'admin@test.com',
      };

      const user = new User(userData);
      await expect(user.validate()).rejects.toThrow('Password is required');
    });

    it('should reject user with username shorter than 3 characters', async () => {
      const userData = {
        username: 'ab',
        email: 'admin@test.com',
        password: 'password123',
      };

      const user = new User(userData);
      await expect(user.validate()).rejects.toThrow('Username must be at least 3 characters long');
    });

    it('should reject user with password shorter than 6 characters', async () => {
      const userData = {
        username: 'admin',
        email: 'admin@test.com',
        password: '12345',
      };

      const user = new User(userData);
      await expect(user.validate()).rejects.toThrow('Password must be at least 6 characters long');
    });
  });
});
