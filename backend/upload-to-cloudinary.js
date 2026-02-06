const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
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

async function uploadToCloudinary() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing gallery items
    await Gallery.deleteMany({});
    console.log('✓ Cleared existing gallery items\n');

    const galleryDir = path.join(__dirname, 'uploads', 'gallery');
    const files = fs.readdirSync(galleryDir);

    console.log(`Found ${files.length} files to upload...\n`);

    const galleryItems = [];
    let order = 1;

    for (const file of files) {
      const filePath = path.join(galleryDir, file);
      const isVideo = file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.ogg');
      
      try {
        console.log(`Uploading ${file}...`);
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'vibe-holidays/gallery',
          resource_type: isVideo ? 'video' : 'image',
          public_id: file.split('.')[0] // Use filename without extension
        });

        console.log(`✓ Uploaded: ${result.secure_url}\n`);

        // Determine category based on filename or type
        let category = 'Destinations';
        if (isVideo) {
          category = 'Videos';
        } else if (file.includes('WhatsApp')) {
          category = 'Experiences';
        }

        // Create gallery item
        const item = {
          url: result.secure_url,
          category: category,
          caption: file.split('.')[0].replace(/-/g, ' '),
          destination: 'Travel',
          order: order++,
          createdAt: new Date()
        };

        galleryItems.push(item);

      } catch (uploadError) {
        console.error(`✗ Failed to upload ${file}:`, uploadError.message);
      }
    }

    // Save to database
    console.log('\nSaving to database...');
    for (const item of galleryItems) {
      await Gallery.create(item);
      console.log(`✓ Saved: ${item.caption}`);
    }

    console.log(`\n✓ Successfully uploaded and saved ${galleryItems.length} items!`);
    console.log('\nYour gallery is now ready for production! 🎉');

    await mongoose.connection.close();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

uploadToCloudinary();
