const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to LOCAL MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibes-holidays';

// Package Schema
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  duration: Number,
  price: Number,
  description: String,
  highlights: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  inclusions: [String],
  exclusions: [String],
  images: [String],
  thumbnail: String,
  featured: Boolean,
  active: Boolean,
  category: String,
  brochureUrl: String
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

async function exportPackages() {
  try {
    console.log('📦 Connecting to local MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📥 Fetching all packages...');
    const packages = await Package.find({}).lean();
    console.log(`✅ Found ${packages.length} packages\n`);

    // Remove MongoDB-specific fields
    const cleanPackages = packages.map(pkg => {
      const { _id, __v, createdAt, updatedAt, ...rest } = pkg;
      return rest;
    });

    // Save to JSON file
    const outputPath = path.join(__dirname, 'all-packages-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(cleanPackages, null, 2));
    
    console.log(`✅ Exported ${cleanPackages.length} packages to: all-packages-export.json`);
    console.log('\n📋 Package Summary:');
    
    // Group by destination
    const byDestination = {};
    cleanPackages.forEach(pkg => {
      const dest = pkg.destination || 'Unknown';
      byDestination[dest] = (byDestination[dest] || 0) + 1;
    });
    
    Object.entries(byDestination).forEach(([dest, count]) => {
      console.log(`   ${dest}: ${count} package(s)`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Export complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

exportPackages();
