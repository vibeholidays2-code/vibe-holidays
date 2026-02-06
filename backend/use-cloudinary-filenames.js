const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const gallerySchema = new mongoose.Schema({
  url: String,
  category: String,
  caption: String,
  destination: String,
  order: Number,
  createdAt: Date
});

const Gallery = mongoose.model('Gallery', gallerySchema);

async function useCloudinaryFilenames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Clear existing gallery items
    await Gallery.deleteMany({});
    console.log('✓ Cleared existing gallery items\n');

    const galleryItems = [];
    let order = 1;

    // Get all images
    console.log('Fetching images from Cloudinary...');
    const imageResult = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      resource_type: 'image'
    });

    console.log(`Found ${imageResult.resources.length} images\n`);

    // Process images
    for (const resource of imageResult.resources) {
      // Extract filename from public_id
      const filename = resource.public_id.split('/').pop();
      
      // Determine category based on filename
      let category = 'Destinations';
      if (filename.includes('WhatsApp')) {
        category = 'Experiences';
      }

      const item = {
        caption: filename.replace(/_/g, ' '), // Replace underscores with spaces
        url: resource.secure_url,
        category: category,
        destination: 'Travel',
        order: order++
      };

      galleryItems.push(item);
      console.log(`✓ Added image: ${item.caption}`);
    }

    // Get all videos
    console.log('\nFetching videos from Cloudinary...');
    const videoResult = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      resource_type: 'video'
    });

    console.log(`Found ${videoResult.resources.length} videos\n`);

    // Process videos
    for (const resource of videoResult.resources) {
      // Extract filename from public_id
      const filename = resource.public_id.split('/').pop();

      const item = {
        caption: filename.replace(/_/g, ' '), // Replace underscores with spaces
        url: resource.secure_url,
        category: 'Videos',
        destination: 'Travel',
        order: order++
      };

      galleryItems.push(item);
      console.log(`✓ Added video: ${item.caption}`);
    }

    // Save to database
    console.log('\nSaving to database...');
    for (const item of galleryItems) {
      await Gallery.create({
        ...item,
        createdAt: new Date()
      });
    }

    console.log(`\n✓ Successfully added ${galleryItems.length} gallery items!`);
    console.log('✓ Using Cloudinary filenames as captions! 🎉');

    await mongoose.connection.close();

  } catch (error) {
    console.error('Error:', error.message);
    if (error.error && error.error.message) {
      console.error('Details:', error.error.message);
    }
    process.exit(1);
  }
}

useCloudinaryFilenames();
