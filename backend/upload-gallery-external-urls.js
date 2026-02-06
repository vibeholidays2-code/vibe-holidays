const mongoose = require('mongoose');
require('dotenv').config();

const gallerySchema = new mongoose.Schema({
  url: String,
  category: String,
  caption: String,
  destination: String,
  order: Number,
  createdAt: Date
});

const Gallery = mongoose.model('Gallery', gallerySchema);

async function uploadGalleryMedia() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing gallery items
    await Gallery.deleteMany({});
    console.log('Cleared existing gallery items');

    // Define gallery items with external Unsplash URLs
    const galleryItems = [
      // Destination Images
      {
        caption: 'Bali Beach Paradise',
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        category: 'Destinations',
        destination: 'Bali',
        order: 1
      },
      {
        caption: 'Jaisalmer Desert Fort',
        url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 2
      },
      {
        caption: 'Vietnam Halong Bay',
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
        category: 'Destinations',
        destination: 'Vietnam',
        order: 3
      },
      {
        caption: 'Goa Beach Sunset',
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        category: 'Destinations',
        destination: 'Goa',
        order: 4
      },
      {
        caption: 'Spiti Valley Mountains',
        url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
        category: 'Destinations',
        destination: 'Spiti Valley',
        order: 5
      },
      {
        caption: 'Tropical Paradise',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        category: 'Destinations',
        destination: 'Beach',
        order: 6
      },
      // Experience Images
      {
        caption: 'Adventure Trekking',
        url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
        category: 'Experiences',
        destination: 'Mountains',
        order: 7
      },
      {
        caption: 'Cultural Heritage',
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
        category: 'Experiences',
        destination: 'India',
        order: 8
      },
      {
        caption: 'Beach Activities',
        url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
        category: 'Experiences',
        destination: 'Beach',
        order: 9
      },
      {
        caption: 'Local Cuisine',
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
        category: 'Experiences',
        destination: 'Food',
        order: 10
      },
      {
        caption: 'Sunset Views',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        category: 'Experiences',
        destination: 'Nature',
        order: 11
      },
      {
        caption: 'Group Travel Fun',
        url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80',
        category: 'Experiences',
        destination: 'Group Tours',
        order: 12
      },
      // Video placeholders (using images for now since videos need hosting)
      {
        caption: 'Bali Travel Highlights',
        url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        category: 'Videos',
        destination: 'Bali',
        order: 13
      },
      {
        caption: 'Desert Safari Adventure',
        url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80',
        category: 'Videos',
        destination: 'Jaisalmer',
        order: 14
      },
      {
        caption: 'Vietnam Journey',
        url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
        category: 'Videos',
        destination: 'Vietnam',
        order: 15
      },
      {
        caption: 'Goa Beach Life',
        url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        category: 'Videos',
        destination: 'Goa',
        order: 16
      }
    ];

    // Insert gallery items
    for (const item of galleryItems) {
      await Gallery.create({
        ...item,
        createdAt: new Date()
      });
      console.log(`✓ Added: ${item.caption}`);
    }

    console.log(`\n✓ Successfully added ${galleryItems.length} gallery items`);
    console.log('\nNote: Videos are using image placeholders. Upload actual videos to cloud storage for video support.');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

uploadGalleryMedia();
