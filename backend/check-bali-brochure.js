const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkBrochure() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const baliPackages = await Package.find({ 
      destination: 'Bali',
      price: 25000 
    });

    console.log(`\nFound ${baliPackages.length} Bali ₹25,000 package(s):\n`);
    
    baliPackages.forEach(pkg => {
      console.log(`Package: ${pkg.title}`);
      console.log(`ID: ${pkg._id}`);
      console.log(`Brochure URL: ${pkg.brochureUrl || 'NOT SET'}`);
      console.log('---');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkBrochure();
