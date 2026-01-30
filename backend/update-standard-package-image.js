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

async function updateStandardPackageImage() {
  try {
    console.log('🖼️  Updating Bali Standard Package cover photo...\n');

    // New images for Bali Standard Package
    const newImages = [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80', // Bali beach sunset
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&q=80', // Rice terraces
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80', // Temple
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80', // Pool
    ];

    const newThumbnail = 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80';

    const result = await Package.updateOne(
      { name: 'Bali Standard Package' },
      { 
        $set: { 
          images: newImages,
          thumbnail: newThumbnail
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Updated Bali Standard Package cover photo!');
      console.log('\n📸 New Cover Photo:');
      console.log('   Beautiful Bali beach at sunset');
      console.log('   - Stunning beach views');
      console.log('   - Golden sunset colors');
      console.log('   - Perfect for standard package');
      console.log('\n🌐 View at: http://localhost:5173/packages');
    } else {
      console.log('⚠️  Bali Standard Package not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image:', error);
    process.exit(1);
  }
}

updateStandardPackageImage();
