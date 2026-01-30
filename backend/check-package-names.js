const mongoose = require('mongoose');
require('dotenv').config();

async function checkPackageNames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    console.log('\n=== VIETNAM PACKAGES ===\n');
    const vietnamPackages = await packagesCollection
      .find({ category: "Vietnam" })
      .sort({ price: 1 })
      .toArray();
    
    vietnamPackages.forEach(pkg => {
      console.log(`Name: "${pkg.name}"`);
      console.log(`Price: ₹${pkg.price}`);
      console.log(`Image: ${pkg.images[0]}`);
      console.log('---');
    });

    console.log('\n=== BALI PACKAGES ===\n');
    const baliPackages = await packagesCollection
      .find({ category: "Bali" })
      .sort({ price: 1 })
      .toArray();
    
    baliPackages.forEach(pkg => {
      console.log(`Name: "${pkg.name}"`);
      console.log(`Price: ₹${pkg.price}`);
      console.log(`Image: ${pkg.images[0]}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkPackageNames();
