require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const coverImageUrl = 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770803087/1_sc4g1v.png';

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
  itinerary: [Object],
  inclusions: [String],
  exclusions: [String],
  brochureUrl: String,
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

async function updatePhuQuocCover() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find Phu Quoc Island Paradise package
    console.log('🔍 Searching for Phu Quoc Island Paradise package...');
    const phuQuocPackage = await Package.findOne({ 
      name: { $regex: /Phu Quoc Island Paradise/i } 
    });

    if (!phuQuocPackage) {
      console.log('❌ Phu Quoc Island Paradise package not found!');
      console.log('\n📋 Available packages:');
      const allPackages = await Package.find({}, 'name destination');
      allPackages.forEach(pkg => {
        console.log(`   - ${pkg.name} (${pkg.destination})`);
      });
      process.exit(1);
    }

    console.log('✅ Found package:', phuQuocPackage.name);
    console.log('   Current thumbnail:', phuQuocPackage.thumbnail || 'None');
    console.log('   Current images:', phuQuocPackage.images?.length || 0, 'images\n');

    // Update thumbnail and add to images array if not already there
    console.log('📝 Updating cover photo...');
    
    const updateData = {
      thumbnail: coverImageUrl,
    };

    // Add to images array if not already there
    if (!phuQuocPackage.images || !phuQuocPackage.images.includes(coverImageUrl)) {
      updateData.images = [coverImageUrl, ...(phuQuocPackage.images || [])];
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      phuQuocPackage._id,
      updateData,
      { new: true }
    );

    console.log('✅ Package updated successfully!\n');
    console.log('📸 New cover photo:', updatedPackage.thumbnail);
    console.log('🖼️  Total images:', updatedPackage.images?.length || 0);
    console.log('\n✨ The new cover photo will now appear on:');
    console.log('   - Package cards on homepage');
    console.log('   - Package cards on packages page');
    console.log('   - Package detail page header');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updatePhuQuocCover();
