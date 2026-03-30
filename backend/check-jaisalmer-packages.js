const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const packages = await Package.find({ 
      destination: /Jaisalmer/i,
      active: true 
    }).sort({ price: 1 });

    console.log(`Found ${packages.length} active Jaisalmer packages:\n`);

    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   Price: ₹${pkg.price}`);
      console.log(`   Destination: ${pkg.destination}`);
      console.log(`   Duration: ${pkg.duration} days`);
      console.log(`   Active: ${pkg.active}`);
      console.log(`   Thumbnail: ${pkg.thumbnail ? '✅ Yes' : '❌ No'}`);
      if (pkg.thumbnail) {
        console.log(`   Image URL: ${pkg.thumbnail}`);
      }
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPackages();
