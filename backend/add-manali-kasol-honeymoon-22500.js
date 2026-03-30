const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const manaliHoneymoonPackage = {
  name: 'Manali - Kasol - Sissu Honeymoon Package',
  destination: 'Manali, Kasol, Sissu, Himachal Pradesh',
  duration: 6,
  price: 22500,
  description: `Experience the perfect romantic getaway in the Himalayas with our exclusive 5 Nights / 6 Days Manali-Kasol-Sissu Honeymoon Package. Stay in luxury mountain-view rooms, explore the stunning Solang Valley, drive through the magnificent Atal Tunnel to Sissu, discover the hippie paradise of Kasol, and visit the sacred Manikaran Sahib. This all-inclusive package features private cab, breakfast & dinner, and complete sightseeing - perfect for couples seeking adventure and romance in the mountains.

We focus on value + comfort + unforgettable memories, not just another package.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Manali',
      description: `🚗 Pickup from Delhi/Chandigarh
🏔️ Scenic mountain drive
🏨 Hotel check-in

🛍 Evening:
• Mall Road
• Tibetan Market
• Cafe hopping

🛌 Overnight in Manali`
    },
    {
      day: 2,
      title: 'Solang + Atal Tunnel + Sissu',
      description: `🍳 Breakfast

🏔 Solang Valley:
• Ropeway
• Snow scooter
• Paragliding

🚘 Atal Tunnel drive
🏞️ Sissu Village
💦 Sissu Waterfall
🌊 Sissu Lake

🚗 Return to Manali
🛌 Overnight in Manali`
    },
    {
      day: 3,
      title: 'Manali Local Full Day',
      description: `🍳 Breakfast

🛕 Hidimba Temple
🌲 Van Vihar
🛕 Vashisht Temple
♨️ Hot water springs
🎮 Club House
🏘️ Old Manali
☕ Cafe street
🛍️ Mall Road

🛌 Overnight in Manali`
    },
    {
      day: 4,
      title: 'Manali → Kasol',
      description: `🍳 Breakfast

🚗 Drive to Kasol
🏞️ Parvati Valley
🛍️ Kasol Market
☕ Riverside cafes
🥾 Chalal Village walk

🛌 Overnight in Kasol`
    },
    {
      day: 5,
      title: 'Manikaran + Tosh',
      description: `🍳 Breakfast

🛕 Manikaran Sahib
♨️ Hot springs
🍽️ Langar

🚗 Tosh Village
🏔️ Mountain views
📸 Photo stops

🚗 Return to Manali
🛌 Overnight in Manali`
    },
    {
      day: 6,
      title: 'Departure',
      description: `🍳 Breakfast
🚗 Return journey
✨ Tour ends with beautiful memories`
    }
  ],

  inclusions: [
    '5 Nights luxury hotel stay',
    'Breakfast + Dinner daily',
    'Private vehicle for entire trip',
    'All sightseeing as per itinerary',
    'Toll & parking charges',
    'Driver allowance',
    'GST included'
  ],

  exclusions: [
    'Rohtang Pass permit',
    'Adventure activities (Paragliding, Ropeway, etc.)',
    'Lunch',
    'Personal expenses',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'],
  thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',

  featured: true,
  active: true,
  category: 'Honeymoon & Romance',
  brochureUrl: '/brochures/manali-kasol-honeymoon-22500.pdf',

  hotelDetails: [
    {
      name: 'Hotel Swastik Grand',
      location: 'Manali',
      nights: 4,
      rating: 4,
      roomType: 'Luxury Room - Mountain View with Balcony',
      amenities: ['Breakfast', 'Dinner', 'Mountain View', 'Balcony', 'WiFi']
    },
    {
      name: 'Hotel Hukam\'s Holiday Home',
      location: 'Kasol',
      nights: 1,
      rating: 3,
      roomType: 'Luxury Room - River & Mountain View',
      amenities: ['Breakfast', 'Dinner', 'River View', 'Mountain View']
    }
  ],

  pricingOptions: [
    {
      type: 'Per Person',
      price: 22500,
      description: 'All inclusive (GST, Hotels, Meals, Transport, Sightseeing)'
    },
    {
      type: 'Honeymoon Add-On (Optional)',
      price: 1500,
      description: 'Per couple - Room decoration + Candle light dinner + Cake'
    }
  ],

  travelDetails: {
    mode: 'Private Cab',
    route: 'Delhi/Chandigarh → Manali → Kasol → Manikaran → Tosh → Manali → Delhi/Chandigarh',
    included: true,
    pickupDrop: 'Delhi/Chandigarh'
  },

  highlights: [
    'Luxury Mountain View Rooms',
    'Solang Valley Adventure',
    'Atal Tunnel Experience',
    'Sissu Village & Waterfall',
    'Kasol Hippie Paradise',
    'Parvati Valley Exploration',
    'Manikaran Sahib Gurudwara',
    'Tosh Village Trek',
    'Hidimba Temple',
    'Vashisht Hot Springs',
    'Old Manali Cafes',
    'Private Cab Throughout',
    'All-Inclusive Package',
    'Perfect for Honeymoon Couples'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'All-inclusive package with GST, luxury hotels, meals, private cab, and complete sightseeing. Optional honeymoon add-on available (₹1,500 per couple). Rates are date-wise different – confirm before booking. Pickup from Delhi or Chandigarh.',

  tourType: 'Private',
  bestTimeToVisit: 'March to June, September to November',
  difficulty: 'Easy',
  idealFor: 'Honeymoon Couples, Romantic Getaway'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(manaliHoneymoonPackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price} per person (All Inclusive)`);
    console.log(`Duration: ${result.duration} days`);
    console.log(`Active: ${result.active}`);
    console.log(`Ideal For: ${result.idealFor}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
