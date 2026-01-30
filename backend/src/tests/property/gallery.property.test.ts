/**
 * @jest-environment node
 */

import * as fc from 'fast-check';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Gallery, { IGallery } from '../../models/Gallery';

// Feature: vibe-holidays-website, Property 7: Gallery Images Organized by Category
// For any category filter applied to gallery images, all returned images should belong 
// to the specified category.
// Validates: Requirements 4.4

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
  await Gallery.deleteMany({});
});

describe('Gallery Model Property Tests', () => {
  // Feature: vibe-holidays-website, Property 7: Gallery Images Organized by Category
  it('should return only images matching the specified category filter', async () => {
    // Generator for category names
    const categoryArbitrary = fc.constantFrom(
      'beaches',
      'mountains',
      'cities',
      'adventures',
      'cultural',
      'wildlife'
    );

    // Generator for gallery image data
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: categoryArbitrary,
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 100 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 10, maxLength: 50 }),
        categoryArbitrary,
        async (images, filterCategory) => {
          // Create gallery images in database
          await Gallery.insertMany(images);

          // Apply category filter (simulating the controller logic)
          const filteredImages = await Gallery.find({ category: filterCategory })
            .sort({ order: 1, createdAt: -1 });

          // Verify all returned images belong to the specified category
          filteredImages.forEach(image => {
            expect(image.category).toBe(filterCategory);
          });

          // Verify that we only get images from the specified category
          const allImages = await Gallery.find({});
          const expectedCount = allImages.filter(img => img.category === filterCategory).length;
          expect(filteredImages.length).toBe(expectedCount);

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should return empty array when filtering by category with no images', async () => {
    // Generator for category names
    const categoryArbitrary = fc.constantFrom(
      'beaches',
      'mountains',
      'cities',
      'adventures',
      'cultural',
      'wildlife'
    );

    // Generator for gallery image data with specific categories
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: fc.constantFrom('beaches', 'mountains'), // Only use two categories
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 100 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 5, maxLength: 20 }),
        fc.constantFrom('cities', 'adventures', 'cultural', 'wildlife'), // Filter by unused categories
        async (images, filterCategory) => {
          // Create gallery images in database (only beaches and mountains)
          await Gallery.insertMany(images);

          // Apply category filter for a category that doesn't exist in the data
          const filteredImages = await Gallery.find({ category: filterCategory })
            .sort({ order: 1, createdAt: -1 });

          // Verify empty result
          expect(filteredImages.length).toBe(0);

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain sort order (by order field, then createdAt) when filtering by category', async () => {
    // Generator for category names
    const categoryArbitrary = fc.constantFrom('beaches', 'mountains', 'cities');

    // Generator for gallery image data with controlled order values
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: categoryArbitrary,
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 10 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 10, maxLength: 30 }),
        categoryArbitrary,
        async (images, filterCategory) => {
          // Create gallery images in database
          await Gallery.insertMany(images);

          // Apply category filter with sorting
          const filteredImages = await Gallery.find({ category: filterCategory })
            .sort({ order: 1, createdAt: -1 });

          // Verify all images belong to the category
          filteredImages.forEach(image => {
            expect(image.category).toBe(filterCategory);
          });

          // Verify sort order is maintained (order ascending, then createdAt descending)
          for (let i = 0; i < filteredImages.length - 1; i++) {
            const current = filteredImages[i];
            const next = filteredImages[i + 1];

            // If order values are different, current should be <= next
            if (current.order !== next.order) {
              expect(current.order).toBeLessThanOrEqual(next.order);
            } else {
              // If order values are the same, createdAt should be descending
              expect(current.createdAt.getTime()).toBeGreaterThanOrEqual(next.createdAt.getTime());
            }
          }

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle multiple categories correctly without cross-contamination', async () => {
    // Generator for gallery images with specific categories
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: fc.constantFrom('beaches', 'mountains', 'cities'),
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 100 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 15, maxLength: 40 }),
        async (images) => {
          // Create gallery images in database
          await Gallery.insertMany(images);

          // Test each category independently
          const categories = ['beaches', 'mountains', 'cities'];

          for (const category of categories) {
            const filteredImages = await Gallery.find({ category })
              .sort({ order: 1, createdAt: -1 });

            // Verify all images belong to the current category
            filteredImages.forEach(image => {
              expect(image.category).toBe(category);
            });

            // Verify no images from other categories are included
            const otherCategories = categories.filter(c => c !== category);
            filteredImages.forEach(image => {
              expect(otherCategories).not.toContain(image.category);
            });
          }

          // Verify total count matches sum of individual category counts
          const allImages = await Gallery.find({});
          const beachCount = await Gallery.countDocuments({ category: 'beaches' });
          const mountainCount = await Gallery.countDocuments({ category: 'mountains' });
          const cityCount = await Gallery.countDocuments({ category: 'cities' });

          expect(allImages.length).toBe(beachCount + mountainCount + cityCount);

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  // Feature: vibe-holidays-website, Property 8: Gallery Image Metadata Completeness
  it('should ensure all gallery image objects include url, category, and caption fields', async () => {
    // Generator for gallery image data with various caption scenarios
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: fc.constantFrom('beaches', 'mountains', 'cities', 'adventures', 'cultural', 'wildlife'),
      caption: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 100 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 5, maxLength: 30 }),
        async (images) => {
          // Create gallery images in database
          await Gallery.insertMany(images);

          // Retrieve all gallery images
          const retrievedImages = await Gallery.find({});

          // Verify each image has the required metadata fields
          retrievedImages.forEach(image => {
            // URL field must exist and be a non-empty string
            expect(image.url).toBeDefined();
            expect(typeof image.url).toBe('string');
            expect(image.url.length).toBeGreaterThan(0);

            // Category field must exist and be a non-empty string
            expect(image.category).toBeDefined();
            expect(typeof image.category).toBe('string');
            expect(image.category.length).toBeGreaterThan(0);

            // Caption field must exist (but can be undefined or empty)
            // The field itself should be present in the schema
            expect('caption' in image).toBe(true);
            
            // If caption is defined, it should be a string
            if (image.caption !== undefined) {
              expect(typeof image.caption).toBe('string');
            }
          });

          // Verify that the retrieved images match the count of inserted images
          expect(retrievedImages.length).toBe(images.length);

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle gallery images with empty captions correctly', async () => {
    // Generator specifically for images with empty or undefined captions
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: fc.constantFrom('beaches', 'mountains', 'cities'),
      caption: fc.constantFrom(undefined, '', 'Valid caption text'),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 100 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 10, maxLength: 25 }),
        async (images) => {
          // Create gallery images in database
          await Gallery.insertMany(images);

          // Retrieve all gallery images
          const retrievedImages = await Gallery.find({});

          // Verify metadata completeness for each image
          retrievedImages.forEach(image => {
            // Required fields must always be present and non-empty
            expect(image.url).toBeDefined();
            expect(image.url.length).toBeGreaterThan(0);
            expect(image.category).toBeDefined();
            expect(image.category.length).toBeGreaterThan(0);

            // Caption field must exist in the object structure
            expect('caption' in image).toBe(true);

            // Caption can be undefined or a string (including empty string)
            if (image.caption !== undefined) {
              expect(typeof image.caption).toBe('string');
            }
          });

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should retrieve gallery images with complete metadata via API-like query', async () => {
    // Generator for gallery image data
    const galleryImageArbitrary = fc.record({
      url: fc.webUrl(),
      category: fc.constantFrom('beaches', 'mountains', 'cities', 'adventures'),
      caption: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      destination: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
      order: fc.integer({ min: 0, max: 100 }),
    });

    await fc.assert(
      fc.asyncProperty(
        fc.array(galleryImageArbitrary, { minLength: 5, maxLength: 20 }),
        async (images) => {
          // Create gallery images in database
          const createdImages = await Gallery.insertMany(images);

          // Simulate API retrieval by ID (testing individual image metadata)
          for (const createdImage of createdImages) {
            const retrievedImage = await Gallery.findById(createdImage._id);

            // Verify the image was found
            expect(retrievedImage).not.toBeNull();

            if (retrievedImage) {
              // Verify all required metadata fields are present
              expect(retrievedImage.url).toBeDefined();
              expect(typeof retrievedImage.url).toBe('string');
              expect(retrievedImage.url.length).toBeGreaterThan(0);

              expect(retrievedImage.category).toBeDefined();
              expect(typeof retrievedImage.category).toBe('string');
              expect(retrievedImage.category.length).toBeGreaterThan(0);

              // Caption field must exist
              expect('caption' in retrievedImage).toBe(true);

              // Verify the retrieved data matches the created data
              expect(retrievedImage.url).toBe(createdImage.url);
              expect(retrievedImage.category).toBe(createdImage.category);
              expect(retrievedImage.caption).toBe(createdImage.caption);
            }
          }

          // Clean up for next iteration
          await Gallery.deleteMany({});
        }
      ),
      { numRuns: 20 }
    );
  });
});

