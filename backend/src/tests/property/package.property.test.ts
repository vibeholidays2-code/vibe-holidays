/**
 * @jest-environment node
 */

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Package, { IPackage } from '../../models/Package';

// Feature: vibe-holidays-website, Property 1: Package Data Completeness
// For any package retrieved from the database, the package object should contain all required fields:
// name, destination, duration, price, description, itinerary, inclusions, exclusions, and images.
// Validates: Requirements 2.2, 2.3

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 60000); // 60 second timeout for MongoDB setup

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Package.deleteMany({});
});

describe('Package Model Property Tests', () => {
  // Feature: vibe-holidays-website, Property 1: Package Data Completeness
  it('should ensure all packages have complete required fields', async () => {
    // Generator for valid package data
    const packageArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      destination: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      duration: fc.integer({ min: 1, max: 365 }),
      price: fc.float({ min: 0, max: 100000, noNaN: true }),
      description: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
      itinerary: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 20 }),
      inclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 20 }),
      exclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 20 }),
      images: fc.array(fc.webUrl(), { maxLength: 10 }),
    });

    await fc.assert(
      fc.asyncProperty(packageArbitrary, async (packageData) => {
        // Create package in database
        const createdPackage = await Package.create(packageData);
        
        // Retrieve package from database
        const retrievedPackage = await Package.findById(createdPackage._id);
        
        // Verify package exists
        expect(retrievedPackage).not.toBeNull();
        
        if (retrievedPackage) {
          // Verify all required fields are present
          expect(retrievedPackage.name).toBeDefined();
          expect(retrievedPackage.destination).toBeDefined();
          expect(retrievedPackage.duration).toBeDefined();
          expect(retrievedPackage.price).toBeDefined();
          expect(retrievedPackage.description).toBeDefined();
          expect(retrievedPackage.itinerary).toBeDefined();
          expect(retrievedPackage.inclusions).toBeDefined();
          expect(retrievedPackage.exclusions).toBeDefined();
          expect(retrievedPackage.images).toBeDefined();
          
          // Verify field types
          expect(typeof retrievedPackage.name).toBe('string');
          expect(typeof retrievedPackage.destination).toBe('string');
          expect(typeof retrievedPackage.duration).toBe('number');
          expect(typeof retrievedPackage.price).toBe('number');
          expect(typeof retrievedPackage.description).toBe('string');
          expect(Array.isArray(retrievedPackage.itinerary)).toBe(true);
          expect(Array.isArray(retrievedPackage.inclusions)).toBe(true);
          expect(Array.isArray(retrievedPackage.exclusions)).toBe(true);
          expect(Array.isArray(retrievedPackage.images)).toBe(true);
          
          // Verify values match what was stored (accounting for trimming)
          expect(retrievedPackage.name).toBe(packageData.name.trim());
          expect(retrievedPackage.destination).toBe(packageData.destination.trim());
          expect(retrievedPackage.duration).toBe(packageData.duration);
          expect(retrievedPackage.price).toBe(packageData.price);
          expect(retrievedPackage.description).toBe(packageData.description);
        }
      }),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 2: Package Filtering Correctness
  it('should return only packages matching filter criteria', async () => {
    // Generator for destination names
    const destinationArbitrary = fc.constantFrom('Paris', 'Tokyo', 'New York', 'London', 'Dubai');
    
    // Generator for package data with specific destinations
    const packageWithDestinationArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      destination: destinationArbitrary,
      duration: fc.integer({ min: 1, max: 30 }),
      price: fc.float({ min: 100, max: 10000, noNaN: true }),
      description: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
      itinerary: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 5 }),
      inclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 5 }),
      exclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 5 }),
      images: fc.array(fc.webUrl(), { maxLength: 3 }),
      active: fc.constant(true),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(packageWithDestinationArbitrary, { minLength: 5, maxLength: 20 }),
        destinationArbitrary,
        fc.integer({ min: 1, max: 30 }),
        fc.integer({ min: 1, max: 30 }),
        fc.float({ min: 100, max: 10000, noNaN: true }),
        fc.float({ min: 100, max: 10000, noNaN: true }),
        async (packages, filterDestination, minDuration, maxDuration, minPrice, maxPrice) => {
          // Ensure min <= max for duration and price
          const actualMinDuration = Math.min(minDuration, maxDuration);
          const actualMaxDuration = Math.max(minDuration, maxDuration);
          const actualMinPrice = Math.min(minPrice, maxPrice);
          const actualMaxPrice = Math.max(minPrice, maxPrice);

          // Create packages in database
          await Package.insertMany(packages);

          // Test destination filter
          const destinationFilter = { destination: filterDestination, active: true };
          const destinationResults = await Package.find(destinationFilter);
          
          destinationResults.forEach(pkg => {
            expect(pkg.destination).toBe(filterDestination);
            expect(pkg.active).toBe(true);
          });

          // Test price range filter
          const priceFilter = {
            price: { $gte: actualMinPrice, $lte: actualMaxPrice },
            active: true,
          };
          const priceResults = await Package.find(priceFilter);
          
          priceResults.forEach(pkg => {
            expect(pkg.price).toBeGreaterThanOrEqual(actualMinPrice);
            expect(pkg.price).toBeLessThanOrEqual(actualMaxPrice);
            expect(pkg.active).toBe(true);
          });

          // Test duration range filter
          const durationFilter = {
            duration: { $gte: actualMinDuration, $lte: actualMaxDuration },
            active: true,
          };
          const durationResults = await Package.find(durationFilter);
          
          durationResults.forEach(pkg => {
            expect(pkg.duration).toBeGreaterThanOrEqual(actualMinDuration);
            expect(pkg.duration).toBeLessThanOrEqual(actualMaxDuration);
            expect(pkg.active).toBe(true);
          });

          // Test combined filters (destination + price + duration)
          const combinedFilter = {
            destination: filterDestination,
            price: { $gte: actualMinPrice, $lte: actualMaxPrice },
            duration: { $gte: actualMinDuration, $lte: actualMaxDuration },
            active: true,
          };
          const combinedResults = await Package.find(combinedFilter);
          
          combinedResults.forEach(pkg => {
            expect(pkg.destination).toBe(filterDestination);
            expect(pkg.price).toBeGreaterThanOrEqual(actualMinPrice);
            expect(pkg.price).toBeLessThanOrEqual(actualMaxPrice);
            expect(pkg.duration).toBeGreaterThanOrEqual(actualMinDuration);
            expect(pkg.duration).toBeLessThanOrEqual(actualMaxDuration);
            expect(pkg.active).toBe(true);
          });

          // Clean up for next iteration
          await Package.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 3: Package Search Relevance
  it('should return only packages containing search keyword in name, destination, or description', async () => {
    // Generator for search keywords
    const keywordArbitrary = fc.constantFrom('beach', 'mountain', 'luxury', 'adventure', 'family');
    
    // Generator for package data with controlled content
    const packageArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      destination: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      duration: fc.integer({ min: 1, max: 30 }),
      price: fc.float({ min: 100, max: 10000, noNaN: true }),
      description: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
      itinerary: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 5 }),
      inclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 5 }),
      exclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 5 }),
      images: fc.array(fc.webUrl(), { maxLength: 3 }),
      active: fc.constant(true),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(packageArbitrary, { minLength: 10, maxLength: 30 }),
        keywordArbitrary,
        async (packages, keyword) => {
          // Inject the keyword into some packages in different fields
          const packagesWithKeyword = packages.map((pkg, index) => {
            if (index % 3 === 0) {
              // Add keyword to name
              return { ...pkg, name: `${pkg.name} ${keyword}` };
            } else if (index % 3 === 1) {
              // Add keyword to destination
              return { ...pkg, destination: `${pkg.destination} ${keyword}` };
            } else if (index % 3 === 2) {
              // Add keyword to description
              return { ...pkg, description: `${pkg.description} ${keyword}` };
            }
            return pkg;
          });

          // Create packages in database
          await Package.insertMany(packagesWithKeyword);

          // Perform search using the same logic as the controller
          const searchFilter = {
            active: true,
            $or: [
              { name: { $regex: keyword, $options: 'i' } },
              { destination: { $regex: keyword, $options: 'i' } },
              { description: { $regex: keyword, $options: 'i' } },
            ],
          };

          const searchResults = await Package.find(searchFilter);

          // Verify all results contain the keyword in at least one field
          searchResults.forEach(pkg => {
            const nameMatch = pkg.name.toLowerCase().includes(keyword.toLowerCase());
            const destinationMatch = pkg.destination.toLowerCase().includes(keyword.toLowerCase());
            const descriptionMatch = pkg.description.toLowerCase().includes(keyword.toLowerCase());
            
            const hasKeyword = nameMatch || destinationMatch || descriptionMatch;
            
            expect(hasKeyword).toBe(true);
            expect(pkg.active).toBe(true);
          });

          // Verify that we found at least some packages (since we injected the keyword)
          expect(searchResults.length).toBeGreaterThan(0);

          // Clean up for next iteration
          await Package.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 13: Package CRUD Operations
  it('should support complete CRUD lifecycle for any package', async () => {
    // Generator for valid package data
    const packageArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      destination: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      duration: fc.integer({ min: 1, max: 365 }),
      price: fc.float({ min: 0, max: 100000, noNaN: true }),
      description: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
      itinerary: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 20 }),
      inclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 20 }),
      exclusions: fc.array(fc.string({ minLength: 1, maxLength: 200 }), { maxLength: 20 }),
      images: fc.array(fc.webUrl(), { maxLength: 10 }),
      featured: fc.boolean(),
      active: fc.boolean(),
    });

    // Generator for update data (partial fields)
    const updateArbitrary = fc.record({
      name: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0), { nil: undefined }),
      price: fc.option(fc.float({ min: 0, max: 100000, noNaN: true }), { nil: undefined }),
      description: fc.option(fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0), { nil: undefined }),
      featured: fc.option(fc.boolean(), { nil: undefined }),
      active: fc.option(fc.boolean(), { nil: undefined }),
    });

    await fc.assert(
      fc.asyncProperty(packageArbitrary, updateArbitrary, async (packageData, updateData) => {
        // CREATE: Create a new package
        const createdPackage = await Package.create(packageData);
        
        // Verify creation
        expect(createdPackage).toBeDefined();
        expect(createdPackage._id).toBeDefined();
        expect(createdPackage.name).toBe(packageData.name.trim());
        expect(createdPackage.destination).toBe(packageData.destination.trim());
        expect(createdPackage.price).toBe(packageData.price);
        
        // READ: Retrieve the package by ID
        const retrievedPackage = await Package.findById(createdPackage._id);
        
        // Verify retrieval
        expect(retrievedPackage).not.toBeNull();
        expect(retrievedPackage?._id.toString()).toBe(createdPackage._id.toString());
        expect(retrievedPackage?.name).toBe(createdPackage.name);
        expect(retrievedPackage?.destination).toBe(createdPackage.destination);
        expect(retrievedPackage?.price).toBe(createdPackage.price);
        
        // UPDATE: Update the package with new data
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );
        
        const updatedPackage = await Package.findByIdAndUpdate(
          createdPackage._id,
          { ...filteredUpdateData, updatedAt: new Date() },
          { new: true, runValidators: true }
        );
        
        // Verify update
        expect(updatedPackage).not.toBeNull();
        expect(updatedPackage?._id.toString()).toBe(createdPackage._id.toString());
        
        // Verify updated fields reflect changes
        if (updateData.name !== undefined) {
          expect(updatedPackage?.name).toBe(updateData.name.trim());
        }
        if (updateData.price !== undefined) {
          expect(updatedPackage?.price).toBe(updateData.price);
        }
        if (updateData.description !== undefined) {
          expect(updatedPackage?.description).toBe(updateData.description);
        }
        if (updateData.featured !== undefined) {
          expect(updatedPackage?.featured).toBe(updateData.featured);
        }
        if (updateData.active !== undefined) {
          expect(updatedPackage?.active).toBe(updateData.active);
        }
        
        // READ AGAIN: Verify update persisted
        const reRetrievedPackage = await Package.findById(createdPackage._id);
        expect(reRetrievedPackage).not.toBeNull();
        expect(reRetrievedPackage?._id.toString()).toBe(updatedPackage?._id.toString());
        
        // Verify the re-retrieved package matches the updated package
        if (updateData.name !== undefined) {
          expect(reRetrievedPackage?.name).toBe(updateData.name.trim());
        }
        if (updateData.price !== undefined) {
          expect(reRetrievedPackage?.price).toBe(updateData.price);
        }
        
        // DELETE: Delete the package
        const deletedPackage = await Package.findByIdAndDelete(createdPackage._id);
        
        // Verify deletion returned the package
        expect(deletedPackage).not.toBeNull();
        expect(deletedPackage?._id.toString()).toBe(createdPackage._id.toString());
        
        // READ AFTER DELETE: Verify package no longer exists
        const deletedCheck = await Package.findById(createdPackage._id);
        expect(deletedCheck).toBeNull();
        
        // Verify package is not in the collection
        const allPackages = await Package.find({});
        const packageExists = allPackages.some(
          pkg => pkg._id.toString() === createdPackage._id.toString()
        );
        expect(packageExists).toBe(false);
      }),
      { numRuns: 20 }
    );
  });
});

