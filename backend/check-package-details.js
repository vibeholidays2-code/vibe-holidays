const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const packages = await Package.find({ destination: 'Bali, Indonesia' });
    
    console.log(`\nFound ${packages.length} Bali packages:\n`);
    
    packages.forEach(pkg => {
      console.log(`Name: ${pkg.name}`);
      console.log(`Price: ₹${pkg.price}`);
      console.log(`Active: ${pkg.active}`);
      console.log(`Featured: ${pkg.featured}`);
      console.log(`ID: ${pkg._id}`);
      console.log('---\n');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDetails();
