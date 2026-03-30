const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamGrandTourPackage = {
  name: 'Grand Vietnam Tour',
  destination: 'Hanoi, Da Nang, Ho Chi Minh & Phu Quoc, Vietnam',
  duration: 13,
  price: 82000,
  description: `Experience the ultimate Vietnam journey with our Grand Vietnam Tour covering all four major destinations. From Hanoi's ancient temples and Halong Bay's limestone karsts to Da Nang's Golden Bridge, Ho Chi Minh's historic tunnels, and Phu Quoc's pristine beaches. This comprehensive 13-day tour showcases the best of Vietnam's culture, history, nature, and tropical paradise.

Perfect for travelers seeking the most complete Vietnam experience from north to south.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Hanoi | Afternoon City Tour',
      description: `✈️ Arrival at Hanoi Airport
🚗 Private transfer to hotel & check-in

🏙️ Afternoon City Tour:
📚 Temple of Literature – Vietnam's first university
🏛️ Hoa Lo Prison Museum (Hanoi Hilton)
🚶 Local heritage & culture walk

🏨 Overnight at Skylark Hotel, Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 2,
      title: 'Halong Bay 4★ Day Cruise',
      description: `🍳 Breakfast
🚗 Drive to Halong Bay

🛳️ Luxury Day Cruise Experience:
🕳️ Sung Sot (Surprise) Cave
🚣 Luon Cave – Kayaking / Bamboo Boat
🏖️ Ti Top Island – swimming & viewpoint

🍱 Lunch on cruise
🌅 Return to Hanoi
🏨 Overnight in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 3,
      title: 'Ninh Binh (Hoa Lu – Tam Coc)',
      description: `🍳 Breakfast
🚗 Full-day Ninh Binh tour

🌿 Includes:
🏛️ Hoa Lu Ancient Capital
🚣 Tam Coc scenic boat ride (3 caves)
🌾 Village & rice-field landscapes

🏨 Overnight in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 4,
      title: 'Hanoi → Da Nang',
      description: `🍳 Breakfast & check-out
🚗 Transfer to airport
✈️ Fly to Da Nang (flight excluded)

🚗 Transfer to hotel
🏨 Overnight at Nguyen Gia Hotel, Da Nang

🚐 Transfer: Private`
    },
    {
      day: 5,
      title: 'Bana Hills & Golden Bridge',
      description: `🍳 Breakfast
🚐 Full-day Bana Hills tour

🚡 World-record cable car ride
🌉 Golden Hand Bridge
🎢 Fantasy Park
🍽️ Indian Buffet Lunch

🏨 Overnight in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 6,
      title: 'Coconut Forest & Hoi An (with Dinner)',
      description: `🍳 Breakfast
🚐 Cam Thanh Coconut Forest
🛶 Basket boat ride & village experience

🏮 Hoi An Ancient Town:
🌉 Japanese Bridge
🏛️ Old Houses
🏮 Lantern market

🍽️ Dinner included
🏨 Overnight in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 7,
      title: 'Da Nang → Ho Chi Minh',
      description: `🍳 Breakfast & check-out
🚗 Airport transfer
✈️ Fly to Ho Chi Minh City

🚗 Hotel transfer
🏨 Overnight at Ramana Saigon Hotel

🚐 Transfer: Private`
    },
    {
      day: 8,
      title: 'Cu Chi Tunnel + Saigon City Tour',
      description: `🍳 Breakfast
🚗 Visit Cu Chi Tunnels
📽️ War history documentary
🍱 Lunch included

🏙️ City Tour:
⛪ Notre Dame Cathedral
📮 Central Post Office
🏛️ City Hall & walking street

🏨 Overnight in Ho Chi Minh

🚐 Tour Type: SIC`
    },
    {
      day: 9,
      title: 'Ho Chi Minh City Tour',
      description: `🍳 Breakfast

🏛️ Reunification Palace
🏛️ War Remnants Museum
🛍️ Ben Thanh Market

🏨 Overnight in Ho Chi Minh

🚐 Tour Type: SIC`
    },
    {
      day: 10,
      title: 'Ho Chi Minh → Phu Quoc',
      description: `🍳 Breakfast & check-out
🚗 Airport transfer
✈️ Fly to Phu Quoc

🚗 Hotel transfer
🏨 Overnight at Gaia Hotel Phu Quoc

🚐 Transfer: Private`
    },
    {
      day: 11,
      title: 'Phu Quoc 4 Island Tour',
      description: `🍳 Breakfast
🚤 Speedboat island hopping
🤿 Snorkeling at coral reefs
🍱 Buffet lunch

🎢 Aquatopia Water Park
🚡 World's longest over-water cable car

🏨 Overnight in Phu Quoc

🚐 Tour Type: SIC`
    },
    {
      day: 12,
      title: 'Vinpearl Safari & Grand World',
      description: `🍳 Breakfast

🦒 Vinpearl Safari
🎢 VinWonders Theme Park
🌆 Grand World – Venice style area

🏨 Overnight in Phu Quoc

🚐 Tour Type: SIC`
    },
    {
      day: 13,
      title: 'Departure Phu Quoc',
      description: `🍳 Breakfast & check-out
🚗 Transfer to airport
✈️ Tour ends with unforgettable memories

🚐 Transfer: Private`
    }
  ],

  inclusions: [
    '12 Nights accommodation (3N Hanoi + 3N Da Nang + 3N Ho Chi Minh + 3N Phu Quoc)',
    'Daily breakfast',
    'All airport & inter-city transfers',
    'All sightseeing as per itinerary',
    'Hanoi City Tour',
    'Halong Bay 4★ Cruise with lunch',
    'Ninh Binh Day Tour',
    'Ba Na Hills with Indian lunch',
    'Coconut Forest & Hoi An with dinner',
    'Cu Chi Tunnels with lunch',
    'Ho Chi Minh City Tour',
    'Phu Quoc 4 Island Tour with lunch',
    'Aquatopia Water Park & Cable Car',
    'Vinpearl Safari + VinWonders + Grand World',
    'SIC & PVT tours as mentioned',
    'English-speaking guides',
    'Mineral water during tours',
    'Travel Insurance INCLUDED',
    'GST INCLUDED',
    'TCS INCLUDED'
  ],

  exclusions: [
    'International & domestic flights',
    'Vietnam Visa',
    'Personal expenses',
    'Anything not mentioned'
  ],

  images: [],

  featured: true,
  active: true,
  category: 'Cultural',
  brochureUrl: '/brochures/vietnam-grand-82000.pdf',

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
      nights: 3,
      rating: 3,
      roomType: 'Twin Standard Room',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Gaia Hotel Phu Quoc',
      location: 'Phu Quoc',
      nights: 3,
      rating: 4,
      roomType: 'Premium Triple Room with Sea View',
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
