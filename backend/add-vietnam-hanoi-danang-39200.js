const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamHanoiDanangPackage = {
  name: 'Hanoi + Da Nang Package',
  destination: 'Hanoi & Da Nang, Vietnam',
  duration: 7,
  price: 39200,
  description: `Discover the best of Northern and Central Vietnam with our Hanoi + Da Nang Package. Experience Hanoi's rich history, cruise through the majestic Halong Bay, explore the ancient capital of Hoa Lu, and marvel at Da Nang's Golden Bridge and the charming streets of Hoi An.

Perfect for travelers seeking a comprehensive Vietnam experience combining culture, nature, and adventure.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Hanoi | City Tour',
      description: `✈️ Arrival at Hanoi International Airport
🤝 Meet & greet
🚗 Transfer to hotel & check-in (14:00 hrs)

🕑 Afternoon City Tour (14:00 – 18:00):
🏛️ Ho Chi Minh Complex (Mausoleum, House-on-Stilts)
🛕 One Pillar Pagoda
📚 Temple of Literature – first university of Vietnam
🚲 Cyclo / Green Car ride around Old Quarter
🌉 Hoan Kiem Lake & Ngoc Son Temple

🌆 Evening free to explore Old Quarter
🏨 Overnight stay in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 2,
      title: 'Ha Long Bay 4★ Day Cruise',
      description: `🍳 Breakfast
🚐 Morning pickup from Old Quarter
🚗 Drive via Hanoi – Haiphong – Tuan Chau Highway

🚢 Board 4★ Cruise at Tuan Chau Harbor
🍱 Buffet Lunch on Cruise

📍 Cruise highlights:
🐓 Fighting Chicken Islet
🔥 Incense Burner Islet
🕳️ Sung Sot Cave
🚣 Kayaking / Bamboo Boat at Luon Cave
🏝️ TiTop Island – swimming or viewpoint trek

🌅 Sunset & return to Hanoi
🏨 Overnight stay in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 3,
      title: 'Ninh Binh Day Tour (Hoa Lu – Tam Coc)',
      description: `🍳 Breakfast
🚐 Morning pickup from hotel

🏛️ Visit Hoa Lu – Ancient Royal Capital:
👑 Dinh King Temple
👑 Le King Temple

⛰️ Optional Mua Cave (direct payment)
🚣 Bamboo Boat Ride at Tam Coc (three caves)
🌾 Experience village life & limestone karst scenery

🚐 Return to Hanoi by evening
🏨 Overnight stay in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 4,
      title: 'Hanoi → Da Nang',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Hanoi Airport
✈️ Flight to Da Nang (not included)

✈️ Arrival at Da Nang Airport
🚗 Transfer to hotel & check-in
🌆 Day free at leisure
🏨 Overnight stay in Da Nang

🚐 Transfer: Private`
    },
    {
      day: 5,
      title: 'Ba Na Hills Tour with Indian Lunch',
      description: `🍳 Breakfast
🚐 Morning pickup from hotel

🚡 Cable Car ride to Ba Na Hills

📍 Visit:
🌉 Golden Bridge
🛕 Linh Ung Pagoda
🌺 Le Jardin D'Amour
🏘️ French Village
🎢 Fantasy Park

🍽️ Indian Buffet Lunch at Bharat Restaurant
🎡 Free time at Fantasy Park

🚐 Return to hotel
🏨 Overnight stay in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 6,
      title: 'Coconut Forest + Marble Mountain + Hoi An',
      description: `🍳 Breakfast
🚐 Afternoon pickup

📍 Visit:
⛰️ Marble Mountains & Non Nuoc Stone Village
🥥 Coconut Forest (Basket Boat Ride)
🏮 Hoi An Ancient Town:
  • Old Houses
  • Assembly Halls
  • Japanese Covered Bridge
  • Lantern streets & Night Market

🍽️ Dinner not included (optional local / Indian dinner)

🚐 Return to Da Nang
🏨 Overnight stay in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 7,
      title: 'Departure from Da Nang',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Da Nang International Airport
✈️ Departure with beautiful memories

🚐 Transfer: Private`
    }
  ],

  inclusions: [
    '6 Nights hotel accommodation (3N Hanoi + 3N Da Nang)',
    'Daily breakfast',
    'Airport transfers (private)',
    'All sightseeing & tours as per itinerary (SIC)',
    'Ha Long Bay 4★ Cruise with lunch',
    'Ninh Binh Day Tour',
    'Ba Na Hills tour with Indian lunch',
    'Coconut Forest + Marble Mountain + Hoi An tour',
    'English-speaking tour guide',
    'Mineral water during tours',
    'GST Included',
    'TCS Included',
    'Travel Insurance Included'
  ],

  exclusions: [
    'International & domestic flights',
    'Vietnam visa',
    'Personal expenses & tips',
    'Anything not mentioned above'
  ],

  images: [],

  featured: true,
  active: true,
  category: 'Cultural',
  brochureUrl: '/brochures/vietnam-hanoi-danang-39200.pdf',

  hotelDetails: [
    {
      name: 'Skylark Hotel',
      location: 'Hanoi',
      nights: 3,
      rating: 3,
      roomType: 'Superior Room (Double Bed, No Window)',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Grand Citiview Da Nang',
      location: 'Da Nang',
      nights: 3,
      rating: 3,
      roomType: 'Superior Double Room',
      amenities: ['Daily Breakfast']
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

    const result = await Package.create(vietnamHanoiDanangPackage);
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
