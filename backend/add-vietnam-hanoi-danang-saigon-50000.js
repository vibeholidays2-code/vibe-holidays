const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamGrandTourPackage = {
  name: 'Hanoi – Da Nang – Ho Chi Minh Grand Tour',
  destination: 'Hanoi, Da Nang & Ho Chi Minh, Vietnam',
  duration: 9,
  price: 50000,
  description: `Experience the complete Vietnam journey from North to South. Explore Hanoi's ancient temples and cruise through Halong Bay, marvel at Da Nang's Golden Bridge and Hoi An's lantern streets, then discover Ho Chi Minh's Cu Chi Tunnels and vibrant city life. A comprehensive tour covering Vietnam's most iconic destinations.

Perfect for travelers seeking a complete Vietnam experience across three major cities.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Hanoi | Afternoon City Tour',
      description: `✈️ Arrival at Hanoi Airport
🚗 Transfer to hotel & check-in

🕑 Afternoon City Tour (SIC):
📚 Temple of Literature – Vietnam's first university
🏛️ Hoa Lo Prison Museum (Hanoi Hilton)
🚶 Short cultural & heritage walk

🏨 Overnight stay at Skylark Hotel, Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 2,
      title: 'Halong Bay 4★ Day Cruise',
      description: `🍳 Breakfast
🚐 SIC pickup from Old Quarter / Opera House

🛳️ Luxury Day Cruise Includes:
🏝️ Limestone karst islands
🕳️ Sung Sot (Surprise) Cave
🚣 Luon Cave – Kayaking / Bamboo Boat
🏖️ Ti Top Island – swimming & viewpoint

🍱 Local Lunch on Cruise
🌅 Return to Hanoi by evening
🏨 Overnight in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 3,
      title: 'Ninh Binh Day Tour',
      description: `🍳 Breakfast
🚐 SIC tour to Ninh Binh

🌿 Sightseeing includes:
🏛️ Hoa Lu Ancient Capital (Dinh & Le Kings Temple)
🚣 Tam Coc Boat Ride through limestone caves
🌾 Scenic rice fields & village life

🏨 Overnight in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 4,
      title: 'Hanoi → Da Nang',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Hanoi Airport
✈️ Flight to Da Nang (flight not included)

🚐 Airport pickup & transfer to hotel
🏨 Overnight at Nguyen Gia Hotel, Da Nang

🚐 Transfer: Private`
    },
    {
      day: 5,
      title: 'Ba Na Hills & Golden Bridge',
      description: `🍳 Breakfast
🚐 SIC pickup from Da Nang city

🚡 World-record Cable Car Ride
🌉 Golden Hand Bridge
🎡 Fantasy Park & French Village
🍽️ Indian Buffet Lunch Included

🏨 Overnight in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 6,
      title: 'Coconut Forest & Hoi An',
      description: `🍳 Breakfast
🚐 SIC pickup

🛶 Cam Thanh Coconut Forest – Basket Boat Ride

🏮 Hoi An Ancient Town sightseeing:
🌉 Japanese Covered Bridge
🏛️ Old Houses & Lantern Market

🍽️ Dinner Included
🏨 Overnight in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 7,
      title: 'Da Nang → Ho Chi Minh (Saigon)',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Da Nang Airport
✈️ Flight to Ho Chi Minh City

🚐 Airport pickup & hotel transfer
🏨 Overnight at Ramana Saigon Hotel

🚐 Transfer: Private`
    },
    {
      day: 8,
      title: 'Cu Chi Tunnel + Saigon City Tour',
      description: `🍳 Breakfast
🚐 SIC full-day tour

🕳️ Cu Chi Tunnels experience & war documentary
🚶 Crawl through original tunnels (optional)
🍱 Lunch Included

🏙️ Afternoon Saigon City Tour:
⛪ Notre Dame Cathedral (outside)
📮 Central Post Office
🏛️ City Hall & Walking Street

🏨 Overnight in Ho Chi Minh

🚐 Tour Type: SIC`
    },
    {
      day: 9,
      title: 'Departure Ho Chi Minh',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Airport
✈️ Tour ends with beautiful memories

🚐 Transfer: Private`
    }
  ],

  inclusions: [
    '8 Nights hotel accommodation (3N Hanoi + 3N Da Nang + 2N Ho Chi Minh)',
    'Daily breakfast',
    'All Airport Transfers (Private)',
    'All sightseeing tours on SIC basis',
    'Hanoi City Tour',
    'Halong Bay 4★ Cruise with lunch',
    'Ninh Binh Day Tour',
    'Ba Na Hills with Indian buffet lunch',
    'Coconut Forest & Hoi An with dinner',
    'Cu Chi Tunnels with lunch',
    'Saigon City Tour',
    'English-speaking tour guide',
    '2 Bottles mineral water per day',
    'Travel Insurance INCLUDED',
    'GST INCLUDED',
    'TCS INCLUDED'
  ],

  exclusions: [
    'International & domestic flights',
    'Vietnam Visa',
    'Personal expenses',
    'Optional activities not mentioned'
  ],

  images: [],

  featured: true,
  active: true,
  category: 'Cultural',
  brochureUrl: '/brochures/vietnam-hanoi-danang-saigon-50000.pdf',

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
      name: 'Nguyen Gia Hotel',
      location: 'Da Nang',
      nights: 3,
      rating: 3,
      roomType: 'Superior Double Room with City View',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Ramana Saigon Hotel',
      location: 'Ho Chi Minh City',
      nights: 2,
      rating: 3,
      roomType: 'Twin Standard Room',
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

    const result = await Package.create(vietnamGrandTourPackage);
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
