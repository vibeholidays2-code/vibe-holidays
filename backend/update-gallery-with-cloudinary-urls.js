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

async function updateGalleryUrls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Clear existing gallery items
    await Gallery.deleteMany({});
    console.log('✓ Cleared existing gallery items\n');

    // PASTE YOUR CLOUDINARY URLs HERE
    // Go to Cloudinary dashboard → Media Library → vibe-holidays/gallery folder
    // Copy the URL for each image/video and paste below
    
    const galleryItems = [
      // DESTINATIONS - Replace these URLs with your actual Cloudinary URLs
      {
        caption: 'Bali Beach Paradise',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_1',
        category: 'Destinations',
        destination: 'Bali',
        order: 1
      },
      {
        caption: 'Jaisalmer Desert',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_2',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 2
      },
      {
        caption: 'Vietnam Halong Bay',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_3',
        category: 'Destinations',
        destination: 'Vietnam',
        order: 3
      },
      {
        caption: 'Goa Beach',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_4',
        category: 'Destinations',
        destination: 'Goa',
        order: 4
      },
      {
        caption: 'Spiti Valley',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_5',
        category: 'Destinations',
        destination: 'Spiti Valley',
        order: 5
      },
      {
        caption: 'Mountain Trek',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_6',
        category: 'Destinations',
        destination: 'Mountains',
        order: 6
      },
      
      // EXPERIENCES - Replace these URLs
      {
        caption: 'Travel Adventure 1',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_7',
        category: 'Experiences',
        destination: 'Travel',
        order: 7
      },
      {
        caption: 'Travel Adventure 2',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_8',
        category: 'Experiences',
        destination: 'Travel',
        order: 8
      },
      {
        caption: 'Travel Adventure 3',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_9',
        category: 'Experiences',
        destination: 'Travel',
        order: 9
      },
      {
        caption: 'Travel Adventure 4',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_10',
        category: 'Experiences',
        destination: 'Travel',
        order: 10
      },
      {
        caption: 'Travel Adventure 5',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_11',
        category: 'Experiences',
        destination: 'Travel',
        order: 11
      },
      {
        caption: 'Travel Adventure 6',
        url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_12',
        category: 'Experiences',
        destination: 'Travel',
        order: 12
      },
      
      // VIDEOS - Replace these URLs (should end with .mp4)
      {
        caption: 'Bali Travel Video',
        url: 'PASTE_YOUR_CLOUDINARY_VIDEO_URL_HERE_1',
        category: 'Videos',
        destination: 'Bali',
        order: 13
      },
      {
        caption: 'Desert Safari Video',
        url: 'PASTE_YOUR_CLOUDINARY_VIDEO_URL_HERE_2',
        category: 'Videos',
        destination: 'Jaisalmer',
        order: 14
      },
      {
        caption: 'Vietnam Journey Video',
        url: 'PASTE_YOUR_CLOUDINARY_VIDEO_URL_HERE_3',
        category: 'Videos',
        destination: 'Vietnam',
        order: 15
      },
      {
        caption: 'Goa Beach Video',
        url: 'PASTE_YOUR_CLOUDINARY_VIDEO_URL_HERE_4',
        category: 'Videos',
        destination: 'Goa',
        order: 16
      }
    ];

    // Insert gallery items
    for (const item of galleryItems) {
      if (!item.url.includes('PASTE_YOUR')) {
        await Gallery.create({
          ...item,
          createdAt: new Date()
        });
        console.log(`✓ Added: ${item.caption}`);
      } else {
        console.log(`⚠ Skipped: ${item.caption} (URL not updated)`);
      }
    }

    console.log(`\n✓ Gallery updated successfully!`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateGalleryUrls();
