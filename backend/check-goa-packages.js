const mongoose = require('mongoose');
require('dotenv').config();

async function checkGoaPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const goaPackages = await packagesCollection.find({ 
      category: 'Goa' 
    }).toArray();

    console.log('\n🏝️ GOA PACKAGES:');
    console.log('Total packages found:', goaPackages.length);
    
    goaPackages.forEach((pkg, index) => {
      console.log(`\n${index + 1}. ${pkg.name}`);
      console.log(`   Price: ₹${pkg.price.toLocaleString()}`);
      console.log(`   Duration: ${pkg.duration} days`);
      console.log(`   Category: ${pkg.category}`);
      console.log(`   Featured: ${pkg.featured ? 'YES' : 'NO'}`);
      console.log(`   Brochure: ${pkg.brochureUrl}`);
      console.log(`   Images: ${pkg.images.length} images`);
      console.log(`   Itinerary days: ${pkg.itinerary.length}`);
    });

    // Check total packages by category
    const allCategories = await packagesCollection.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();

    console.log('\n📊 PACKAGES BY CATEGORY:');
    allCategories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} packages`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

checkGoaPackages();