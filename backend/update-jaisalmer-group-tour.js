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

async function updateJaisalmerGroupTour() {
  try {
    console.log('📝 Updating Jaisalmer Desert Group Tour with correct details...\n');

    // Find the package - this is the GROUP tour (lower price)
    const groupPackage = await Package.findOne({ 
      price: 8500, 
      category: 'Jaisalmer' 
    });

    if (!groupPackage) {
      console.error('❌ Jaisalmer Desert Group Tour package not found!');
      process.exit(1);
    }

    // Update with correct details from PDF
    const updatedData = {
      name: 'Jaisalmer Desert Group Tour',
      destination: 'Jaisalmer, Rajasthan',
      duration: 3, // 2 nights / 3 days
      price: 8500, // Base price for 3 persons
      description: 'Experience the magic of the Thar Desert with our group tour package. Stay at Gujarat Capital Resort in Swiss Luxury Tents at Sam Sand Dunes. Enjoy camel safari, jeep safari, folk dance, DJ party, and visit Tanot Mata Temple & Longewala Border. Includes sleeper bus from Ahmedabad.',
      itinerary: [
        'Day 1 – Arrival | City Sightseeing + Desert Camp: Visit Bada Bagh, Vyas Chhatri, Gadisar Lake → Drive to Sam Sand Dunes → Check-in at 2:00 PM → Welcome tea & snacks → Camel safari, jeep safari → Sunset point → Folk dance, campfire, DJ party → Pure veg dinner → Overnight in Swiss Luxury Tent',
        'Day 2 – Tanot Mata & Longewala Border: Breakfast → Visit Tanot Mata Temple → Longewala Border → Desert highway drive → Return to camp → Dinner & overnight stay',
        'Day 3 – City Sightseeing & Departure: Visit Golden Fort (Sonar Quila) → Patwon Ki Haveli → Salim Singh Ki Haveli → Nathmal Ki Haveli → Local market shopping → Drop at Jaisalmer Bus Station → Overnight sleeper bus to Ahmedabad'
      ],
      inclusions: [
        'Ahmedabad ⇄ Jaisalmer Sleeper Bus (both ways)',
        '2 Nights stay at Gujarat Capital Resort, Sam Sand Dunes',
        'Swiss Luxury Tent accommodation',
        'Daily breakfast & dinner (pure veg)',
        'Camel safari & jeep safari',
        'Folk dance, DJ night, campfire',
        'Tanot Mata & Longewala Border tour',
        'All sightseeing as per itinerary',
        'GST included',
        'Group tour assistance'
      ],
      exclusions: [
        'Lunch (not included)',
        'Personal expenses',
        'Entry fees / camera charges at monuments',
        'Anything not mentioned in inclusions'
      ],
      featured: true,
      active: true,
      category: 'Jaisalmer',
      brochureUrl: 'http://localhost:5000/brochures/jaisalmer-group-tour.pdf'
    };

    await Package.updateOne({ _id: groupPackage._id }, { $set: updatedData });

    console.log('✅ Jaisalmer Desert Group Tour updated successfully!\n');
    console.log('📋 Updated Details:');
    console.log(`   Name: ${updatedData.name}`);
    console.log(`   Duration: ${updatedData.duration} days (2 nights / 3 days)`);
    console.log(`   Price: ₹${updatedData.price.toLocaleString()} per person (for 3 persons)`);
    console.log(`   Note: ₹10,000 for 2 persons, ₹7,500 for 4+ persons`);
    console.log(`   Hotel: Gujarat Capital Resort, Sam Sand Dunes`);
    console.log(`   Activities: Camel safari, Jeep safari, Folk dance, DJ party, Tanot Mata, Longewala`);
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating package:', error);
    process.exit(1);
  }
}

updateJaisalmerGroupTour();
