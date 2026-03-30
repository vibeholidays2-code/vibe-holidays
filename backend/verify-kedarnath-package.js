const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function verifyPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const pkg = await Package.findById('69c67fce916163ed504228cd');

    if (!pkg) {
      console.log('❌ Package not found');
      return;
    }

    console.log('\n🕉️ KEDARNATH YATRA PACKAGE\n');
    console.log(`ID: ${pkg._id}`);
    console.log(`Name: ${pkg.name}`);
    console.log(`Destination: ${pkg.destination}`);
    console.log(`Duration: ${pkg.duration} days / ${pkg.duration - 3} nights`);
    console.log(`Base Price: ₹${pkg.price} per person (Double Sharing)`);
    console.log(`Active: ${pkg.active}`);
    console.log(`Featured: ${pkg.featured}`);
    console.log(`Category: ${pkg.category}`);
    console.log(`Tour Type: ${pkg.tourType}`);
    console.log(`Trek Distance: ${pkg.trekDistance}`);
    console.log(`Altitude: ${pkg.altitude}`);
    
    console.log(`\n💰 Pricing Options:`);
    pkg.pricingOptions.forEach((option, i) => {
      console.log(`  ${i + 1}. ${option.type}: ₹${option.price}`);
    });

    console.log(`\n📅 Group Departures:`);
    pkg.groupDepartures.forEach(group => {
      console.log(`  ${group.month}:`);
      group.dates.forEach(date => console.log(`    • ${date}`));
    });

    console.log(`\n🏨 Hotels (4 locations):`);
    pkg.hotelDetails.forEach((hotel, i) => {
      console.log(`  ${i + 1}. ${hotel.location} - ${hotel.nights} night${hotel.nights > 1 ? 's' : ''}`);
      console.log(`     ${hotel.name}`);
    });

    console.log(`\n✨ Highlights: ${pkg.highlights.length} items`);
    console.log(`📋 Inclusions: ${pkg.inclusions.length} items`);
    console.log(`❌ Exclusions: ${pkg.exclusions.length} items`);
    console.log(`📅 Itinerary Days: ${pkg.itinerary.length}`);
    console.log(`\n📸 Cover Photo: ${pkg.thumbnail || pkg.images[0]}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyPackage();
