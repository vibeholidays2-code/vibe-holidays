const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const spitiValleyPackage = {
  name: 'Spiti Valley Complete Tour',
  destination: 'Spiti Valley, Himachal Pradesh',
  duration: 9,
  price: 28500,
  description: `Experience the complete Spiti Valley adventure with our comprehensive 8 Nights / 9 Days tour. Journey through the breathtaking landscapes of Himachal Pradesh, from Shimla to Manali via the stunning Spiti Valley. Explore ancient monasteries, visit the world's highest post office, witness Asia's highest bridge, and discover remote Himalayan villages. This private tour covers all major attractions including Chitkul (Last Village of India), Key Monastery, Chicham Bridge, and the serene Nako Lake.

Holiday in Mind? Vibes Holidays — Every Time!`,
  
  itinerary: [
    {
      day: 1,
      title: 'Chandigarh → Shimla',
      description: `🌄 Scenic hill drive
🏨 Hotel check-in
🛍 Evening free at Mall Road
🛏 Overnight Stay – Shimla`
    },
    {
      day: 2,
      title: 'Shimla → Sangla',
      description: `🍳 Breakfast
🚗 Drive via Sutlej River
🏞 Baspa Valley sightseeing
🛏 Overnight Stay – Sangla`
    },
    {
      day: 3,
      title: 'Sangla → Chitkul → Kalpa',
      description: `🍳 Breakfast

📍 Visit:
🏔 Chitkul (Last Village of India)
🏰 Kamru Fort
🌄 Kinnaur Kailash Views

🏨 Check-in Kalpa
🛏 Overnight Stay – Kalpa`
    },
    {
      day: 4,
      title: 'Kalpa → Nako → Tabo',
      description: `🍳 Breakfast

📍 Visit:
🌊 Nako Lake
🛕 Nako Monastery
🏜 Enter Spiti Valley
🛕 Tabo Monastery (Ajanta of Himalayas)

🛏 Overnight Stay – Tabo`
    },
    {
      day: 5,
      title: 'Tabo → Dhankar → Pin Valley → Kaza',
      description: `🍳 Breakfast

📍 Visit:
🛕 Dhankar Monastery
🌊 Dhankar Lake
🏘️ Pin Valley (Mud Village)

🚗 Drive to Kaza
🏨 Check-in
🛏 Overnight Stay – Kaza`
    },
    {
      day: 6,
      title: 'Kaza Full Sightseeing',
      description: `🍳 Breakfast

📍 Complete Spiti sightseeing:
🛕 Key Monastery
🌉 Chicham Bridge (Asia's highest)
🏘️ Kibber Village
🗿 Langza Buddha Statue
📮 Hikkim Post Office (World's highest)
🏘️ Komik Village

☕ Evening cafe hopping in Kaza
🛏 Overnight Stay – Kaza`
    },
    {
      day: 7,
      title: 'Kaza → Manali',
      description: `🍳 Breakfast
🚗 Drive to Manali via scenic route
📸 Photo stops enroute
🏨 Check-in Manali
🛏 Overnight Stay – Manali`
    },
    {
      day: 8,
      title: 'Manali Local Sightseeing',
      description: `🍳 Breakfast

📍 Visit:
🛕 Hadimba Temple
🌲 Van Vihar
🛍 Mall Road

🛏 Overnight Stay – Manali`
    },
    {
      day: 9,
      title: 'Manali → Chandigarh',
      description: `🍳 Breakfast
🚗 Drive back to Chandigarh
🎉 Tour ends with beautiful memories`
    }
  ],

  inclusions: [
    '8 Nights hotel stay',
    'Breakfast & Dinner (MAP Plan)',
    'Private Tempo Traveller',
    'All sightseeing as per itinerary',
    'Toll, parking, driver allowance',
    'All applicable taxes'
  ],

  exclusions: [
    'Lunch',
    'Entry tickets to monuments',
    'Personal expenses',
    'Adventure activities',
    'GST',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'],
  thumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',

  featured: true,
  active: true,
  category: 'Adventure & Mountains',
  brochureUrl: '/brochures/spiti-valley-complete-28500.pdf',

  hotelDetails: [
    {
      name: 'Rock Castle',
      location: 'Shimla',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'WiFi']
    },
    {
      name: 'Wander Nest',
      location: 'Sangla',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'Mountain View']
    },
    {
      name: 'Kalpa Jungle Retreat',
      location: 'Kalpa',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'Kinnaur Kailash View']
    },
    {
      name: 'Lhunpo House',
      location: 'Tabo',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner']
    },
    {
      name: 'Lhasa Norling',
      location: 'Kaza',
      nights: 2,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'WiFi']
    },
    {
      name: 'Swastik Grand',
      location: 'Manali',
      nights: 2,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'WiFi']
    }
  ],

  pricingOptions: [
    {
      type: 'Per Person',
      price: 28500,
      description: 'Private tour package'
    }
  ],

  travelDetails: {
    mode: 'Private Tempo Traveller',
    route: 'Chandigarh → Shimla → Sangla → Kalpa → Tabo → Kaza → Manali → Chandigarh',
    included: true
  },

  highlights: [
    'Complete Spiti Valley Circuit',
    'Chitkul - Last Village of India',
    'Key Monastery - Ancient Buddhist Monastery',
    'Chicham Bridge - Asia\'s Highest Bridge',
    'Hikkim Post Office - World\'s Highest Post Office',
    'Nako Lake & Monastery',
    'Tabo Monastery - Ajanta of Himalayas',
    'Dhankar Monastery & Lake',
    'Pin Valley - Remote Mud Villages',
    'Langza Buddha Statue',
    'Private Tempo Traveller Throughout'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Private Tempo Traveller included. MAP plan (Breakfast + Dinner) at all hotels. Rates are date-wise different – confirm before booking. NO HIDDEN CHARGES.',

  tourType: 'Private',
  bestTimeToVisit: 'May to October',
  difficulty: 'Moderate',
  altitude: 'Up to 4,500m (Kaza)'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(spitiValleyPackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price}`);
    console.log(`Duration: ${result.duration} days`);
    console.log(`Active: ${result.active}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
