const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const baliEscapePackage = {
  name: 'Bali Escape – 6N/7D',
  destination: 'Bali, Indonesia',
  duration: 7,
  price: 29500,
  description: `Experience the perfect blend of adventure, culture, and relaxation in Bali. Stay in prime locations near beaches and nightlife in Kuta, then unwind in a private pool villa with rice terrace views in Ubud. Enjoy thrilling water sports, visit iconic temples, explore theme parks, and create unforgettable memories.

This package includes complimentary floating breakfast and all tours on a private basis - perfect for couples seeking an affordable yet memorable Bali experience.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Bali – Welcome to Paradise',
      description: `✈️ Welcome to Bali at Ngurah Rai International Airport
🚗 Friendly pickup and smooth transfer to your hotel
😌 Unwind and shake off travel tiredness
🌆 Evening free for discovering local spots
🏨 Night stay in Kuta`
    },
    {
      day: 2,
      title: 'Thrilling Watersports & Beach Fun',
      description: `🍳 Breakfast at hotel
🎢 Get ready for an exciting day full of adventure

🌊 Enjoy thrilling water sports:
🍌 Banana Boat Ride
🏄 Jet Ski Experience
🪂 Parasailing Adventure

🏖️ Visit the beautiful Padang Padang Beach
📸 Capture amazing photos & relax by the sea
🏨 Return to hotel & overnight stay`
    },
    {
      day: 3,
      title: 'Scenic Temples & Iconic Bali Views',
      description: `🍳 Breakfast
🛕 Visit the famous Ulundanu Temple (floating temple on lake)
🚪 Stop at the iconic Handara Gate for stunning photos
🏔️ Enjoy cool mountain vibes & scenic beauty
🏨 Return to hotel & relax
🌙 Overnight stay in Kuta`
    },
    {
      day: 4,
      title: 'Entertainment & Fun Day',
      description: `🍳 Breakfast
🎢 Visit Trans Studio Theme Park Indonesia
✈️ Experience Fly Over Indonesia – virtual journey across Indonesia
🎪 Enjoy rides, shows & indoor attractions
🛍️ Evening free for shopping or nightlife
🏨 Overnight stay in Kuta`
    },
    {
      day: 5,
      title: 'Ubud Transfer & Nature Exploration',
      description: `🍳 Breakfast
🚗 Check-out & proceed for full-day sightseeing
🌋 Visit Kintamani Volcano View Point (breathtaking views)
☕ Visit Coffee Plantation (taste Bali coffee)
🎨 Explore Ubud Village – art & culture hub
🌾 Enjoy Bali Swing Experience (Instagram-worthy moments)
🏡 Transfer to your private pool villa in Ubud
💑 Relax in your private pool & enjoy romantic vibes
🌙 Overnight stay in villa`
    },
    {
      day: 6,
      title: 'Leisure & Romantic Villa Day',
      description: `🥞 Floating Breakfast
🏊 Entire day at leisure – enjoy your private villa
💑 Relax in pool | Enjoy nature views | Couple time
✨ Optional: Spa / café hopping / local exploration
🌙 Overnight stay in Ubud`
    },
    {
      day: 7,
      title: 'Departure – Goodbye Bali',
      description: `🍳 Breakfast
🏨 Check-out from villa
🚗 Private transfer to airport
✈️ Departure with beautiful memories`
    }
  ],

  inclusions: [
    '6 Nights Accommodation (4N Kuta + 2N Ubud Villa)',
    'Daily Breakfast',
    'Complimentary Floating Breakfast in Ubud',
    'All Tours & Transfers on Private Basis',
    'Watersports Activities (Banana Boat, Jet Ski, Parasailing)',
    'Bali Swing Experience',
    'Trans Studio Theme Park Entry',
    'Ulundanu Temple Visit',
    'Handara Gate Photo Stop',
    'Kintamani Volcano View',
    'Coffee Plantation Visit',
    'Travel Insurance',
    'GST Included',
    'TCS Included'
  ],

  exclusions: [
    'Airfare',
    'Visa (if applicable)',
    'Personal Expenses'
  ],

  images: [
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali1.jpg',
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali2.jpg',
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali3.jpg'
  ],

  featured: true,
  active: true,
  category: 'Adventure',
  brochureUrl: '/brochures/bali-29500.pdf',

  hotelDetails: [
    {
      name: 'The ONE Legian – Kuta',
      location: 'Kuta',
      nights: 4,
      rating: 4,
      roomType: 'Superior Room',
      amenities: ['Prime Location', 'Near Beach & Nightlife']
    },
    {
      name: 'Samkhya Villas – Ubud',
      location: 'Ubud',
      nights: 2,
      rating: 4,
      roomType: 'Private Pool Villa',
      amenities: ['Rice Terrace View', 'Perfect Romantic Stay', 'Floating Breakfast']
    }
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(baliEscapePackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price}`);
    console.log(`Active: ${result.active}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
