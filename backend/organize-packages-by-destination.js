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

async function organizePackages() {
  try {
    console.log('📦 Organizing packages by destination...\n');

    // Update all Bali packages to have consistent category
    const baliResult = await Package.updateMany(
      { destination: 'Bali, Indonesia' },
      { 
        $set: { 
          category: 'Bali',
          destination: 'Bali, Indonesia'
        } 
      }
    );

    console.log(`✅ Updated ${baliResult.modifiedCount} Bali packages`);
    console.log('   Category: Bali');
    console.log('   Destination: Bali, Indonesia');

    // List all packages
    const allPackages = await Package.find({}, 'name destination category price');
    
    console.log('\n📋 Current Packages:\n');
    
    // Group by category
    const grouped = {};
    allPackages.forEach(pkg => {
      const cat = pkg.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(pkg);
    });

    Object.keys(grouped).sort().forEach(category => {
      console.log(`\n🏷️  ${category}:`);
      grouped[category].forEach(pkg => {
        console.log(`   - ${pkg.name} (₹${pkg.price.toLocaleString()})`);
      });
    });

    console.log('\n\n💡 Next Steps:');
    console.log('   1. Your Bali packages are now organized under "Bali" category');
    console.log('   2. Add new packages for other destinations:');
    console.log('      - Dubai packages → category: "Dubai"');
    console.log('      - Thailand packages → category: "Thailand"');
    console.log('      - Maldives packages → category: "Maldives"');
    console.log('      - etc.');
    console.log('\n   3. Packages will be grouped by category on the website');
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error organizing packages:', error);
    process.exit(1);
  }
}

organizePackages();
