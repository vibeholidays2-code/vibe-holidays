const mongoose = require('mongoose');
require('dotenv').config();

async function checkFeaturedPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

    // Get all packages
    const allPackages = await Package.find({}).select('name price isFeatured');
    console.log('📦 All Packages:');
    allPackages.forEach(pkg => {
      console.log(`   ${pkg.isFeatured ? '⭐' : '  '} ${pkg.name} - ₹${pkg.price} - Featured: ${pkg.isFeatured || false}`);
    });

    // Get featured packages
    const featuredPackages = await Package.find({ isFeatured: true });
    console.log(`\n⭐ Featured Packages: ${featuredPackages.length}`);
    featuredPackages.forEach(pkg => {
      console.log(`   - ${pkg.name} - ₹${pkg.price}`);
    });

    if (featuredPackages.length === 0) {
      console.log('\n⚠️  No featured packages found!');
      console.log('   Setting featured packages now...\n');

      // Set Bali 25000 as featured
      const bali25k = await Package.findOne({ price: 25000, name: /Bali.*Budget/i });
      if (bali25k) {
        bali25k.isFeatured = true;
        await bali25k.save();
        console.log('✅ Set Bali ₹25,000 as featured');
      }

      // Set Jaisalmer 8500 as featured
      const jaisalmer = await Package.findOne({ price: 8500, name: /Jaisalmer.*Group/i });
      if (jaisalmer) {
        jaisalmer.isFeatured = true;
        await jaisalmer.save();
        console.log('✅ Set Jaisalmer ₹8,500 as featured');
      }

      // Verify
      const newFeatured = await Package.find({ isFeatured: true });
      console.log(`\n✅ Now have ${newFeatured.length} featured packages:`);
      newFeatured.forEach(pkg => {
        console.log(`   - ${pkg.name} - ₹${pkg.price}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkFeaturedPackages();
