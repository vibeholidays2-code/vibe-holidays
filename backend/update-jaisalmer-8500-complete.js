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

async function updateJaisalmer8500Package() {
  try {
    console.log('📝 Updating Jaisalmer Desert Group Tour with complete details...\n');

    // Find the ₹8,500 package
    const groupPackage = await Package.findOne({ 
      price: 8500, 
      category: 'Jaisalmer' 
    });

    if (!groupPackage) {
      console.error('❌ Jaisalmer Desert Group Tour package not found!');
      process.exit(1);
    }

    // Complete updated data
    const updatedData = {
      name: 'Jaisalmer Desert Group Tour',
      destination: 'Jaisalmer, Rajasthan',
      duration: 3,
      price: 7000, // Main price set to ₹7,000 (Quad Sharing)
      description: `🏨 HOTEL DETAILS

NIGHT 1 – JAISALMER CITY
🏨 Hotel Prince / Similar
✅ AC Rooms
🍽️ Breakfast + Lunch + Dinner Included

NIGHT 2 – SAM SAND DUNES
🏨 Gujarat Capital Resort – Sam Sand Dunes
🛖 Swiss Luxury Tent
🍽️ Breakfast + Lunch + Dinner Included

💰 PACKAGE COST (PER PERSON – GST INCLUDED)

👥 Double Sharing - ₹8,000
👥 Triple Sharing - ₹7,500
👥 Quad Sharing - ₹7,000

➕ Rajkot Pickup: ₹700 per person (Optional)

🚌 TRAVEL DETAILS
Route: Ahmedabad ⇄ Jaisalmer
Bus Type: Sleeper Bus
📍 Pickup Points: Chandkheda RTO Circle, Adalaj
📍 Drop: Jaisalmer Bus Station
Minimum: 2 Persons

📅 FIXED GROUP TOUR DATES
✅ 23 January | 06 February | 20 February | 06 March | 20 March

We focus on value + comfort + unforgettable memories. Stress-free and secure travel experience guaranteed! 🚗🌿`,

      itinerary: [
        `🌞 Day 1 – Arrival in Jaisalmer | City Sightseeing

🚌 Arrival at Jaisalmer Bus Station
🚗 Transfer to city hotel & check-in
🍽️ Lunch at Hotel

🏰 Jaisalmer City Sightseeing:
🏰 Jaisalmer Golden Fort (Sonar Quila)
🏯 Patwon Ki Haveli
🏯 Salim Singh Ki Haveli
🏯 Nathmal Ki Haveli
🌅 Gadisar Lake
👻 Kuldhara Village (Haunted Village)

🍽️ Dinner at Hotel
🌙 Overnight stay in Jaisalmer City`,

        `🇮🇳 Day 2 – Tanot Mata | Longewala | Desert Camp

🥪 Morning Breakfast at Hotel

🚙 Full-Day Excursion:
🙏 Tanot Mata Temple
🇮🇳 Longewala Border
🛣️ Desert Highway Experience

➡️ Proceed to Sam Sand Dunes
🍽️ Lunch at Desert Camp
⏰ Check-in at Camp – 2:00 PM
☕ Welcome Tea & Snacks

🌄 Evening Desert Experience
🐪 Camel Safari
🏎️ Jeep Safari
🌅 Sunset at Sand Dunes

🎶 Evening Entertainment
💃🕺 Rajasthani Folk Dance & Music
🔥 Campfire
🎧 DJ Night

🍽️ Pure Veg Dinner
🌙 Overnight stay in Swiss Luxury Tent ⛺`,

        `🏰 Day 3 – Morning Sightseeing | Departure

🥪 Morning Breakfast at Camp
🧳 Check-out

🚗 Enroute Sightseeing:
🌳 Bada Bagh – Royal Cenotaphs
🏛️ Vyas Chhatri
🛍️ Local Market / Shopping Time

🚌 Drop at Jaisalmer Bus Station
🌙 Overnight Sleeper Bus to Ahmedabad / Rajkot

✨ Tour ends with unforgettable Jaisalmer memories`
      ],

      inclusions: [
        'Ahmedabad ⇄ Jaisalmer Sleeper Bus',
        '1 Night Jaisalmer City Hotel Stay (Hotel Prince / Similar)',
        '1 Night Desert Camp Stay (Swiss Luxury Tent)',
        'Breakfast + Lunch + Dinner (Pure Veg)',
        'Jaisalmer City Sightseeing (Fort & Havelis)',
        'Kuldhara Village Visit',
        'Tanot Mata & Longewala Border Tour',
        'Camel Safari & Jeep Safari',
        'Folk Dance, DJ Night & Campfire',
        'Day 3 Morning Sightseeing (Bada Bagh, Vyas Chhatri)',
        'Complimentary Surprise from Vibes Holidays 🎁',
        'Group Tour Assistance',
        'All applicable hotel taxes'
      ],

      exclusions: [
        'Personal Expenses',
        'Entry Fees / Camera Charges (if any)',
        'Rajkot Pickup (₹700 extra per person)',
        'Any service not mentioned in inclusions'
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
    console.log(`   Main Price: ₹${updatedData.price.toLocaleString()} (Quad Sharing)`);
    console.log(`   Hotels: Hotel Prince (City) + Gujarat Capital Resort (Desert)`);
    console.log(`   Complete itinerary with all activities included`);
    console.log(`   Pricing: Double ₹8,000 | Triple ₹7,500 | Quad ₹7,000`);
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating package:', error);
    process.exit(1);
  }
}

updateJaisalmer8500Package();
