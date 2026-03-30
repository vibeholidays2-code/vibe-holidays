const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkVietnamPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const packages = await Package.find({ 
      destination: { $regex: 'Vietnam', $options: 'i' },
      active: true 
    }).sort({ price: 1 });

    console.log(`Found ${packages.length} active Vietnam packages:\n`);

    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   Price: ₹${pkg.price}`);
      console.log(`   Destination: ${pkg.destination}`);
      console.log(`   Duration: ${pkg.duration} days`);
      console.log(`   Active: ${pkg.active}`);
      console.log(`   Thumbnail: ${pkg.thumbnail ? '✅ Yes' : '❌ No'}`);
      console.log(`   Image URL: ${pkg.thumbnail || 'None'}`);
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkVietnamPackages();
