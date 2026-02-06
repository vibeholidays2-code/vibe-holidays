const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  thumbnail: String,
  images: [String],
  featured: Boolean
});

const Package = mongoose.model('Package', packageSchema);

async function updateFeaturedImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update images for each featured package
    const updates = [
      {
        name: 'Spiti Valley Group Tour - 7N/8D',
        thumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
          'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
        ]
      },
      {
        name: 'Jaisalmer Desert Group Tour',
        thumbnail: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
          'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
          'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80'
        ]
      },
      {
        name: 'Bali Budget Package',
        thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
          'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800&q=80'
        ]
      },
      {
        name: 'Goa Beach Paradise - 3N/4D',
        thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
          'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80'
        ]
      }
    ];

    for (const update of updates) {
      const result = await Package.findOneAndUpdate(
        { name: update.name },
        { 
          thumbnail: update.thumbnail,
          images: update.images
        },
        { new: true }
      );
      
      if (result) {
        console.log(`✓ Updated images for: ${update.name}`);
      } else {
        console.log(`✗ Package not found: ${update.name}`);
      }
    }

    console.log('\nDone!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateFeaturedImages();
