const mongoose = require('mongoose');
require('dotenv').config();

async function renameFeaturedField() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('packages');

    // First, check current state
    const packagesWithIsFeatured = await collection.find({ isFeatured: true }).toArray();
    console.log(`📦 Packages with isFeatured=true: ${packagesWithIsFeatured.length}`);
    packagesWithIsFeatured.forEach(pkg => {
      console.log(`   - ${pkg.name} - ₹${pkg.price}`);
    });

    // Rename isFeatured to featured for all documents
    const result = await collection.updateMany(
      { isFeatured: { $exists: true } },
      { $rename: { isFeatured: 'featured' } }
    );
    console.log(`\n✅ Renamed isFeatured to featured: ${result.modifiedCount} documents\n`);

    // Verify featured packages
    const featuredPackages = await collection.find({ featured: true }).toArray();
    console.log(`⭐ Featured Packages: ${featuredPackages.length}`);
    featuredPackages.forEach(pkg => {
      console.log(`   - ${pkg.name} - ₹${pkg.price}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

renameFeaturedField();
