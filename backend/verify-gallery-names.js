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

async function verifyGalleryNames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const items = await Gallery.find().sort({ order: 1 });
    
    console.log(`Found ${items.length} gallery items:\n`);
    
    items.forEach((item, index) => {
      const type = item.category === 'Videos' ? '🎥' : '📷';
      console.log(`${index + 1}. ${type} ${item.caption} - ${item.destination}`);
    });
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyGalleryNames();
