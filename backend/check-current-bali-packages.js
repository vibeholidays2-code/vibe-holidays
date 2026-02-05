const mongoose = require('mongoose');
require('dotenv').config();

async function checkCurrentBaliPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const baliPackages = await packagesCollection.find({ 
      category: 'Bali' 
    }).toArray();

    console.log('\n📦 Current Bali Packages:');
    console.log('Total packages found:', baliPackages.length);
    
    baliPackages.forEach((pkg, index) => {
      console.log(`\n${index + 1}. ${pkg.name}`);
      console.log(`   Price: ₹${pkg.price}`);
      console.log(`   Duration: ${pkg.duration} days`);
      console.log(`   Description length: ${pkg.description ? pkg.description.length : 0} characters`);
      console.log(`   Itinerary days: ${pkg.itinerary ? pkg.itinerary.length : 0}`);
      console.log(`   Has Vietnam-style format: ${pkg.description && pkg.description.includes('🏨 ACCOMMODATION DETAILS') ? 'YES' : 'NO'}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

checkCurrentBaliPackages();