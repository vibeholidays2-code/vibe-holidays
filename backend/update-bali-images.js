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

// High-quality Bali images from Unsplash
const baliImageUpdates = [
  {
    name: 'Bali Budget Package',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80', // Bali temple
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80', // Bali beach
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&q=80', // Bali rice terraces
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80', // Bali pool
    ],
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'
  },
  {
    name: 'Bali Standard Package',
    images: [
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&q=80', // Bali rice terraces
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80', // Bali temple
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80', // Bali pool
      'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=80', // Bali villa
    ],
    thumbnail: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=600&q=80'
  },
  {
    name: 'Bali Deluxe Package',
    images: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80', // Bali luxury pool
      'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=80', // Bali villa
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80', // Bali beach
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80', // Bali temple
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80'
  },
  {
    name: 'Bali Premium Luxury Package',
    images: [
      'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=80', // Luxury villa
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80', // Infinity pool
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80', // Beach resort
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&q=80', // Rice terraces
    ],
    thumbnail: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80'
  }
];

async function updateImages() {
  try {
    console.log('🖼️  Updating Bali package images...\n');

    for (const update of baliImageUpdates) {
      const result = await Package.updateOne(
        { name: update.name },
        { 
          $set: { 
            images: update.images,
            thumbnail: update.thumbnail
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated images for: ${update.name}`);
      } else {
        console.log(`⚠️  Package not found: ${update.name}`);
      }
    }

    console.log('\n🎉 All Bali package images updated successfully!');
    console.log('\n📸 Image Details:');
    console.log('   - High-quality Unsplash images (1200px width)');
    console.log('   - Optimized thumbnails (600px width)');
    console.log('   - Multiple images per package for gallery');
    console.log('\n🌐 View updated packages at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
}

updateImages();
