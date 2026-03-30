const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const packages = await Package.find({ 
      name: { $regex: /royal rajasthan/i }
    });

    console.log(`\n📦 Found ${packages.length} Royal Rajasthan package(s):\n`);
    
    packages.forEach(pkg => {
      console.log(`ID: ${pkg._id}`);
      console.log(`Name: ${pkg.name}`);
      console.log(`Price: ₹${pkg.price}`);
      console.log(`Duration: ${pkg.duration} days`);
      console.log(`Active: ${pkg.active}`);
      console.log(`Destination: ${pkg.destination}`);
      console.log(`Cover Photo: ${pkg.thumbnail || pkg.images?.[0]}`);
      console.log(`---`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPackage();
