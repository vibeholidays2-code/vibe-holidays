const mongoose = require('mongoose');
require('dotenv').config();

async function checkJaisalmerOnly() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    console.log('\n=== JAISALMER PACKAGES ===\n');
    const jaisalmerPackages = await packagesCollection
      .find({ category: "Jaisalmer" })
      .sort({ price: 1 })
      .toArray();
    
    jaisalmerPackages.forEach(pkg => {
      console.log(`Name: "${pkg.name}"`);
      console.log(`Price: ₹${pkg.price}`);
      console.log(`Thumbnail: ${pkg.thumbnail}`);
      console.log(`Images: ${JSON.stringify(pkg.images)}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkJaisalmerOnly();
