const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function verifyPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const pkg = await Package.findById('69c67bd661515ca73aa89c90');

    if (!pkg) {
      console.log('❌ Package not found');
      return;
    }

    console.log('\n📦 SPITI VALLEY COMPLETE TOUR PACKAGE\n');
    console.log(`ID: ${pkg._id}`);
    console.log(`Name: ${pkg.name}`);
    console.log(`Destination: ${pkg.destination}`);
    console.log(`Duration: ${pkg.duration} days / ${pkg.duration - 1} nights`);
    console.log(`Price: ₹${pkg.price} per person`);
    console.log(`Active: ${pkg.active}`);
    console.log(`Featured: ${pkg.featured}`);
    console.log(`Category: ${pkg.category}`);
    console.log(`\nItinerary Days: ${pkg.itinerary.length}`);
    console.log(`Hotels: ${pkg.hotelDetails.length}`);
    console.log(`\nHotels:`);
    pkg.hotelDetails.forEach((hotel, i) => {
      console.log(`  ${i + 1}. ${hotel.name} - ${hotel.location} (${hotel.nights} night${hotel.nights > 1 ? 's' : ''})`);
    });
    console.log(`\nHighlights: ${pkg.highlights.length} items`);
    console.log(`Inclusions: ${pkg.inclusions.length} items`);
    console.log(`Exclusions: ${pkg.exclusions.length} items`);
    console.log(`\nCover Photo: ${pkg.thumbnail || pkg.images[0]}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyPackage();
