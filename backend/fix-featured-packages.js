const mongoose = require('mongoose');
require('dotenv').config();

async function fixFeaturedPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

    // First, remove featured from all packages
    await Package.updateMany({}, { $set: { isFeatured: false } });
    console.log('🗑️  Removed featured status from all packages\n');

    // Set Bali 25000 as featured
    const baliResult = await Package.updateOne(
      { price: 25000, name: /Bali.*Budget/i },
      { $set: { isFeatured: true } }
    );
    console.log(`✅ Bali ₹25,000: ${baliResult.modifiedCount} package updated`);

    // Set Jaisalmer 8500 as featured
    const jaisalmerResult = await Package.updateOne(
      { price: 8500, name: /Jaisalmer.*Group/i },
      { $set: { isFeatured: true } }
    );
    console.log(`✅ Jaisalmer ₹8,500: ${jaisalmerResult.modifiedCount} package updated\n`);

    // Verify featured packages
    const featuredPackages = await Package.find({ isFeatured: true }).select('name price isFeatured');
    console.log(`⭐ Featured Packages (${featuredPackages.length}):`);
    featuredPackages.forEach(pkg => {
      console.log(`   - ${pkg.name} - ₹${pkg.price}`);
    });

    if (featuredPackages.length === 0) {
      console.log('\n⚠️  Still no featured packages. Checking all packages...\n');
      
      const allPackages = await Package.find({}).select('name price');
      console.log('All packages:');
      allPackages.forEach(pkg => {
        console.log(`   - ${pkg.name} - ₹${pkg.price}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixFeaturedPackages();
