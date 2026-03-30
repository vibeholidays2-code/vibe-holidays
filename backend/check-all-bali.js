const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const allPackages = await Package.find({});
    console.log(`\nTotal packages: ${allPackages.length}\n`);
    
    allPackages.forEach(pkg => {
      console.log(`${pkg.title} - ${pkg.destination} - ₹${pkg.price}`);
      console.log(`  Brochure: ${pkg.brochureUrl || 'NOT SET'}`);
      console.log(`  ID: ${pkg._id}`);
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAll();
