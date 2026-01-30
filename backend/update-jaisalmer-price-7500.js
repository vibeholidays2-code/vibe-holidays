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

async function updateJaisalmerPrice() {
  try {
    console.log('📝 Updating Jaisalmer package main price to ₹7,500...\n');

    // Find the package with price 10000
    const package10k = await Package.findOne({ 
      price: 10000, 
      category: 'Jaisalmer' 
    });

    if (!package10k) {
      console.error('❌ Jaisalmer package not found!');
      process.exit(1);
    }

    // Update the main price to 7500
    await Package.updateOne(
      { _id: package10k._id },
      { $set: { price: 7500 } }
    );

    console.log('✅ Main price updated successfully!');
    console.log(`   Package: ${package10k.name}`);
    console.log(`   Old Price: ₹10,000`);
    console.log(`   New Price: ₹7,500`);
    console.log('\n💡 The package card will now show "Starting from ₹7,500"');
    console.log('🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating price:', error);
    process.exit(1);
  }
}

updateJaisalmerPrice();
