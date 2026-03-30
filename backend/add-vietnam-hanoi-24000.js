const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamHanoiPackage = {
  name: 'Hanoi Holiday Package',
  destination: 'Hanoi, Vietnam',
  duration: 4,
  price: 24000,
  description: `Experience the charm of Vietnam's capital with our Hanoi Holiday Package. Explore the historic streets of Hanoi, cruise through the stunning Halong Bay with its limestone karsts, and discover the natural beauty of Ninh Binh's rice paddies and ancient temples.

Perfect for travelers seeking culture, nature, and adventure in Northern Vietnam.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Hanoi',
      description: `✈️ Arrival at Noi Bai International Airport
🤝 Meet & greet
🚗 Private transfer to hotel
🏨 Check-in at Skylark Hotel
🌆 Evening free to explore Old Quarter
🍜 Try local street food

🚐 Transfer: Private`
    },
    {
      day: 2,
      title: 'Hanoi City Tour',
      description: `🍳 Breakfast at hotel

🏛️ Morning:
🏛️ Ho Chi Minh Mausoleum
🏛️ Presidential Palace
🛕 One Pillar Pagoda
📚 Temple of Literature

🍜 Lunch break

🌆 Afternoon:
🏯 Hoan Kiem Lake
🌉 Ngoc Son Temple
🎭 Water Puppet Show
🛍️ Old Quarter walking tour

🚐 Tour Type: SIC (Seat-in-Coach)`
    },
    {
      day: 3,
      title: 'Halong Bay Cruise',
      description: `🍳 Early breakfast
🚗 Transfer to Halong Bay (3.5 hours)

⛵ Cruise Experience:
🚢 Traditional junk boat cruise
🏝️ Limestone karsts & islands
🏊 Swimming & kayaking
🍱 Seafood lunch onboard
🕳️ Cave exploration
🌅 Sunset on deck

🚗 Return to Hanoi
🏨 Hotel check-in

🚐 Tour Type: SIC (Seat-in-Coach)`
    },
    {
      day: 4,
      title: 'Ninh Binh Day Tour + Departure',
      description: `🍳 Breakfast
🚗 Transfer to Ninh Binh (2 hours)

🌾 Ninh Binh Tour:
🚣 Tam Coc boat ride through rice paddies
🛕 Bich Dong Pagoda
🏔️ Mua Cave viewpoint climb
📸 Panoramic valley views
🍱 Local lunch

🚗 Return to Hanoi
✈️ Private airport transfer
🛫 Departure

🚐 Tour Type: SIC (Seat-in-Coach)`
    }
  ],

  inclusions: [
    '3 Nights hotel stay at Skylark Hotel, Hanoi',
    'Daily breakfast',
    'Hanoi City Tour (SIC)',
    'Halong Bay Day Cruise with lunch (SIC)',
    'Ninh Binh Day Tour with lunch (SIC)',
    'Water Puppet Show tickets',
    'All entry tickets',
    'Private airport transfers (arrival & departure)',
    'English-speaking guide'
  ],

  exclusions: [
    'Flights',
    'Visa',
    'GST',
    'TCS',
    'Personal expenses',
    'Lunch & dinner (except on tours)',
    'Travel insurance'
  ],

  images: [],

  featured: true,
  active: true,
  category: 'Cultural',
  brochureUrl: '/brochures/vietnam-hanoi-24000.pdf',

  hotelDetails: [
    {
      name: 'Skylark Hotel',
      location: 'Hanoi',
      nights: 3,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Daily Breakfast', 'Free WiFi']
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

    const result = await Package.create(vietnamHanoiPackage);
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
