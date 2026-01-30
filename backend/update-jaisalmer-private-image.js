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

async function updateJaisalmerPrivateImage() {
  try {
    console.log('🖼️  Updating Jaisalmer Private Desert Tour cover photo...\n');

    // Find the Jaisalmer Private package (₹15,000)
    const privatePackage = await Package.findOne({ 
      price: 15000, 
      category: 'Jaisalmer' 
    });

    if (!privatePackage) {
      console.error('❌ Jaisalmer Private Desert Tour package not found!');
      process.exit(1);
    }

    // New image URL
    const newCoverImage = 'http://localhost:5000/uploads/jaisalmer-private-cover.jpg';

    // Update the images array - put the new cover as first image
    const updatedImages = [
      newCoverImage,
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80', // Jaisalmer fort
      'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1200&q=80', // Desert luxury
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80', // Jaisalmer architecture
    ];

    await Package.updateOne(
      { _id: privatePackage._id },
      { 
        $set: { 
          images: updatedImages,
          thumbnail: newCoverImage
        } 
      }
    );

    console.log('✅ Jaisalmer Private Desert Tour cover photo updated!\n');
    console.log('📋 Package Details:');
    console.log(`   Name: ${privatePackage.name}`);
    console.log(`   Price: ₹${privatePackage.price.toLocaleString()}`);
    console.log(`   New Cover: ${newCoverImage}`);
    console.log('\n🌐 View at: http://localhost:5173/packages');
    console.log('💡 The new Jaisalmer photo is now the cover image!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image:', error);
    process.exit(1);
  }
}

updateJaisalmerPrivateImage();
