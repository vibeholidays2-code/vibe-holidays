const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority';

// Package Schema
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  thumbnail: String,
  images: [String],
});

const Package = mongoose.model('Package', packageSchema);

async function addCacheBuster() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Find all Vietnam packages
    const vietnamPackages = await Package.find({
      $or: [
        { destination: /vietnam/i },
        { name: /vietnam/i },
        { name: /phu quoc/i },
      ]
    }).sort({ _id: 1 });

    console.log(`Found ${vietnamPackages.length} Vietnam packages\n`);
    console.log('Adding cache-buster timestamp to force browser refresh...\n');

    const timestamp = Date.now();

    for (const pkg of vietnamPackages) {
      console.log(`Updating: ${pkg.name}`);
      
      // Add cache buster to thumbnail
      if (pkg.thumbnail && !pkg.thumbnail.includes('?v=')) {
        pkg.thumbnail = `${pkg.thumbnail}?v=${timestamp}`;
        console.log(`  Thumbnail: ${pkg.thumbnail.split('/').pop()}`);
      }
      
      // Add cache buster to all images
      if (pkg.images && pkg.images.length > 0) {
        pkg.images = pkg.images.map(img => {
          if (!img.includes('?v=')) {
            return `${img}?v=${timestamp}`;
          }
          return img;
        });
      }
      
      await pkg.save();
      console.log(`  ✅ Updated with cache-buster\n`);
    }

    console.log('✅ All Vietnam packages updated with cache-buster!');
    console.log(`\nCache-buster timestamp: ${timestamp}`);
    console.log('\nThis will force browsers to reload the images.');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addCacheBuster();
