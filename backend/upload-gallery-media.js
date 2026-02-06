const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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

    // Define gallery items with local paths
    const galleryItems = [
      // Images
      {
        caption: 'Beautiful Destination 1',
        url: '/uploads/gallery/0c1925c1-05c6-427c-80ab-eff4a3d16567.jpg',
        category: 'Destinations',
        destination: 'Travel',
        order: 1
      },
      {
        caption: 'Beautiful Destination 2',
        url: '/uploads/gallery/6d0ccf8b-d3dc-41da-a806-ca12529d3676.jpg',
        category: 'Destinations',
        destination: 'Travel',
        order: 2
      },
      {
        caption: 'Beautiful Destination 3',
        url: '/uploads/gallery/867a6b73-6d89-4500-9232-5a35d3cc64c0.jpg',
        category: 'Destinations',
        destination: 'Travel',
        order: 3
      },
      {
        caption: 'Beautiful Destination 4',
        url: '/uploads/gallery/a33bcec2-aba1-480c-8c96-d261b9ceb46f.jpg',
        category: 'Destinations',
        destination: 'Travel',
        order: 4
      },
      {
        caption: 'Beautiful Destination 5',
        url: '/uploads/gallery/d121a179-6425-410c-b316-bfb182f6a3c8.jpg',
        category: 'Destinations',
        destination: 'Travel',
        order: 5
      },
      {
        caption: 'Beautiful Destination 6',
        url: '/uploads/gallery/d7260db0-dcf6-4809-b493-437be4d20e8a.jpg',
        category: 'Destinations',
        destination: 'Travel',
        order: 6
      },
      {
        caption: 'Travel Experience 1',
        url: '/uploads/gallery/WhatsApp Image 2026-02-06 at 3.15.37 PM (1).jpeg',
        category: 'Experiences',
        destination: 'Travel',
        order: 7
      },
      {
        caption: 'Travel Experience 2',
        url: '/uploads/gallery/WhatsApp Image 2026-02-06 at 3.15.37 PM (2).jpeg',
        category: 'Experiences',
        destination: 'Travel',
        order: 8
      },
      {
        caption: 'Travel Experience 3',
        url: '/uploads/gallery/WhatsApp Image 2026-02-06 at 3.15.37 PM.jpeg',
        category: 'Experiences',
        destination: 'Travel',
        order: 9
      },
      {
        caption: 'Travel Experience 4',
        url: '/uploads/gallery/WhatsApp Image 2026-02-06 at 3.15.38 PM (1).jpeg',
        category: 'Experiences',
        destination: 'Travel',
        order: 10
      },
      {
        caption: 'Travel Experience 5',
        url: '/uploads/gallery/WhatsApp Image 2026-02-06 at 3.15.38 PM (2).jpeg',
        category: 'Experiences',
        destination: 'Travel',
        order: 11
      },
      {
        caption: 'Travel Experience 6',
        url: '/uploads/gallery/WhatsApp Image 2026-02-06 at 3.15.38 PM.jpeg',
        category: 'Experiences',
        destination: 'Travel',
        order: 12
      },
      // Videos
      {
        caption: 'Travel Video 1',
        url: '/uploads/gallery/WhatsApp Video 2026-02-06 at 3.15.35 PM.mp4',
        category: 'Videos',
        destination: 'Travel',
        order: 13
      },
      {
        caption: 'Travel Video 2',
        url: '/uploads/gallery/WhatsApp Video 2026-02-06 at 3.15.36 PM (2).mp4',
        category: 'Videos',
        destination: 'Travel',
        order: 14
      },
      {
        caption: 'Travel Video 3',
        url: '/uploads/gallery/WhatsApp Video 2026-02-06 at 3.15.36 PM (3).mp4',
        category: 'Videos',
        destination: 'Travel',
        order: 15
      },
      {
        caption: 'Travel Video 4',
        url: '/uploads/gallery/WhatsApp Video 2026-02-06 at 3.15.36 PM.mp4',
        category: 'Videos',
        destination: 'Travel',
        order: 16
      }
    ];

    // Insert gallery items
    for (const item of galleryItems) {
      await Gallery.create({
        ...item,
        createdAt: new Date()
      });
      console.log(`✓ Added: ${item.title}`);
    }

    console.log(`\n✓ Successfully added ${galleryItems.length} gallery items`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

uploadGalleryMedia();
