const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function updateJaisalmerPricing() {
  try {
    console.log('📝 Updating Jaisalmer package pricing...\n');

    // Find the ₹15,000 package (we'll change the base price)
    const privatePackage = await Package.findOne({ 
      price: 15000, 
      category: 'Jaisalmer' 
    });

    if (!privatePackage) {
      console.error('❌ Jaisalmer package not found!');
      process.exit(1);
    }

    // Update with variable pricing - base price is for 2 persons
    const updatedData = {
      price: 10000, // Base price for 2 persons
      description: 'Experience the ultimate Jaisalmer desert adventure with our group tour package. Stay at Gujarat Capital Resort in Swiss Luxury Tents at Sam Sand Dunes. Pricing varies by group size: ₹10,000 for 2 persons, ₹8,500 for 3 persons, ₹7,500 for 4+ persons. Includes sleeper bus from Ahmedabad, camel safari, jeep safari, folk performances, and visits to Tanot Mata Temple & Longewala Border.',
    };

    await Package.updateOne({ _id: privatePackage._id }, { $set: updatedData });

    console.log('✅ Jaisalmer package pricing updated!\n');
    console.log('📋 New Pricing Structure:');
    console.log('   2 persons: ₹10,000 per person');
    console.log('   3 persons: ₹8,500 per person');
    console.log('   4 persons: ₹7,500 per person');
    console.log('   6+ persons: ₹7,500 per person');
    console.log('\n💡 Base price shown: ₹10,000 (for 2 persons)');
    console.log('🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating pricing:', error);
    process.exit(1);
  }
}

updateJaisalmerPricing();
