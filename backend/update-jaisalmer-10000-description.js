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

async function updateJaisalmerDescription() {
  try {
    console.log('📝 Updating Jaisalmer ₹10,000 package description...\n');

    // Find the ₹10,000 package
    const package10k = await Package.findOne({ 
      price: 10000, 
      category: 'Jaisalmer' 
    });

    if (!package10k) {
      console.error('❌ Jaisalmer ₹10,000 package not found!');
      process.exit(1);
    }

    // New well-arranged description with hotel details and pricing
    const newDescription = `🏨 HOTEL DETAILS
Gujarat Capital Resort – Sam Sand Dunes
Swiss Luxury Tent
📆 2 Nights Stay

💰 PACKAGE COST (PER PERSON – GST INCLUDED)

👥 2 Persons - ₹10,000
👥 3 Persons - ₹8,500
👥 4 Persons - ₹7,500
👥 6 Persons or More - ₹7,500

Experience the magic of the Thar Desert with our group tour package. Enjoy camel safari, jeep safari, folk dance, DJ party, and visit Tanot Mata Temple & Longewala Border. Includes sleeper bus from Ahmedabad.`;

    await Package.updateOne(
      { _id: package10k._id },
      { $set: { description: newDescription } }
    );

    console.log('✅ Description updated successfully!\n');
    console.log('📋 New Description:');
    console.log(newDescription);
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating description:', error);
    process.exit(1);
  }
}

updateJaisalmerDescription();
