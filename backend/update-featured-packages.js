const mongoose = require('mongoose');
require('dotenv').config();

async function updateFeaturedPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // First, remove featured status from all packages
    await packagesCollection.updateMany(
      {},
      { $set: { featured: false } }
    );
    console.log('✅ Removed featured status from all packages');

    // Set Bali Budget Package (₹25,000) as featured
    const baliResult = await packagesCollection.updateOne(
      { price: 25000, category: "Bali" },
      { $set: { featured: true } }
    );
    console.log(`✅ Set Bali ₹25,000 package as featured (${baliResult.modifiedCount} updated)`);

    // Set Jaisalmer Desert Group Tour (₹7,000) as featured
    const jaisalmerResult = await packagesCollection.updateOne(
      { price: 7000, category: "Jaisalmer" },
      { $set: { featured: true } }
    );
    console.log(`✅ Set Jaisalmer ₹7,000 package as featured (${jaisalmerResult.modifiedCount} updated)`);

    // Verify featured packages
    console.log('\n=== FEATURED PACKAGES ===\n');
    const featuredPackages = await packagesCollection
      .find({ featured: true })
      .sort({ price: 1 })
      .toArray();
    
    featuredPackages.forEach(pkg => {
      console.log(`✨ ${pkg.name} - ₹${pkg.price} (${pkg.category})`);
    });

    console.log('\n✅ Featured packages updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateFeaturedPackages();
