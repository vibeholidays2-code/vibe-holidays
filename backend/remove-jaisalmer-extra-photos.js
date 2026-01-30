const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function removeExtraPhotos() {
  try {
    console.log('🖼️  Removing extra photos from Jaisalmer packages...\n');

    // Find all Jaisalmer packages
    const jaisalmerPackages = await Package.find({ category: 'Jaisalmer' });

    for (const pkg of jaisalmerPackages) {
      // Keep only the first image (cover photo)
      const coverPhoto = pkg.images && pkg.images.length > 0 ? pkg.images[0] : pkg.thumbnail;
      
      await Package.updateOne(
        { _id: pkg._id },
        { 
          $set: { 
            images: [coverPhoto],
            thumbnail: coverPhoto
          } 
        }
      );

      console.log(`✅ Updated: ${pkg.name}`);
      console.log(`   Cover photo: ${coverPhoto}`);
      console.log(`   Removed ${pkg.images.length - 1} extra photos\n`);
    }

    console.log('🎉 All Jaisalmer packages updated!');
    console.log('💡 Each package now has only the cover photo');
    console.log('🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating packages:', error);
    process.exit(1);
  }
}

removeExtraPhotos();
