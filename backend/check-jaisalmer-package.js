const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function checkPackage() {
  try {
    const pkg = await Package.findOne({ price: 15000, category: 'Jaisalmer' });
    
    if (!pkg) {
      console.log('❌ Package not found!');
      process.exit(1);
    }

    console.log('\n📦 Jaisalmer Private Desert Tour Package:');
    console.log('Name:', pkg.name);
    console.log('Price:', pkg.price);
    console.log('Thumbnail:', pkg.thumbnail);
    console.log('\nImages:');
    pkg.images.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPackage();
