const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema (simplified for updates)
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function addBrochures() {
  try {
    console.log('📄 Adding brochures to packages...\n');

    // Example: Add brochures to packages
    // Replace these with your actual package names and PDF filenames
    
    const updates = [
      {
        packageName: 'Bali Adventure',
        pdfFile: 'bali-adventure.pdf'
      },
      {
        packageName: 'Maldives Luxury',
        pdfFile: 'maldives-luxury.pdf'
      },
      {
        packageName: 'Dubai Shopping Tour',
        pdfFile: 'dubai-shopping.pdf'
      },
      // Add more packages here
    ];

    for (const update of updates) {
      const result = await Package.updateOne(
        { name: update.packageName },
        { $set: { brochureUrl: `http://localhost:5000/brochures/${update.pdfFile}` } }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Added brochure to: ${update.packageName}`);
      } else {
        console.log(`⚠️  Package not found: ${update.packageName}`);
      }
    }

    console.log('\n✅ Brochure update complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy your PDF files to backend/brochures/ folder');
    console.log('2. Make sure the filenames match what you specified above');
    console.log('3. Restart your backend server if needed');
    console.log('4. Visit package detail pages to see the download buttons');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding brochures:', error);
    process.exit(1);
  }
}

// List all packages first to help you know what to update
async function listPackages() {
  try {
    const packages = await Package.find({}, 'name destination');
    
    console.log('📦 Current packages in database:\n');
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} (${pkg.destination})`);
    });
    console.log('\n');
    
    return packages;
  } catch (error) {
    console.error('❌ Error listing packages:', error);
    return [];
  }
}

// Main execution
async function main() {
  console.log('🚀 Vibe Holidays - Brochure Management Tool\n');
  console.log('='.repeat(50) + '\n');
  
  // First, list all packages
  await listPackages();
  
  // Then add brochures
  await addBrochures();
}

main();
