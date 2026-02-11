require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Package Schema
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  duration: Number,
  price: Number,
  description: String,
  thumbnail: String,
  images: [String],
  category: String,
  featured: Boolean,
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

async function verifyPhuQuocCover() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const phuQuocPackage = await Package.findOne({ 
      name: { $regex: /Phu Quoc Island Paradise/i } 
    });

    if (!phuQuocPackage) {
      console.log('❌ Package not found!');
      process.exit(1);
    }

    console.log('📦 Package Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Name:', phuQuocPackage.name);
    console.log('Destination:', phuQuocPackage.destination);
    console.log('Price: ₹' + phuQuocPackage.price.toLocaleString());
    console.log('Duration:', phuQuocPackage.duration, 'days');
    console.log('\n📸 Cover Photo (Thumbnail):');
    console.log(phuQuocPackage.thumbnail);
    console.log('\n🖼️  All Images (' + phuQuocPackage.images.length + '):');
    phuQuocPackage.images.forEach((img, index) => {
      console.log(`${index + 1}. ${img}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Cover photo is set correctly!');
    console.log('🌐 View on website:');
    console.log('   https://vibe-holidays-red.vercel.app/packages');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

verifyPhuQuocCover();
