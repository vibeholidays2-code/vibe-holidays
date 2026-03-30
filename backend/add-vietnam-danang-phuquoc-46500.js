const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamDanangPhuQuocPackage = {
  name: 'Da Nang – Phu Quoc Package',
  destination: 'Da Nang & Phu Quoc, Vietnam',
  duration: 7,
  price: 46500,
  description: `Discover Central Vietnam's mountains and beaches with our Da Nang – Phu Quoc Package. Experience the iconic Golden Bridge at Ba Na Hills, explore Hoi An's ancient lantern streets, then escape to Phu Quoc's tropical paradise with island hopping, water parks, and wildlife adventures.

Perfect for travelers seeking a blend of mountain adventures and beach relaxation.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Da Nang',
      description: `✈️ Arrival at Da Nang International Airport
🚗 Private airport transfer to hotel
🏨 Check-in & rest of the day at leisure
🏨 Overnight stay in Da Nang

🚐 Transfer: Private`
    },
    {
      day: 2,
      title: 'Ba Na Hills Tour with Indian Lunch',
      description: `🍳 Breakfast at hotel
🚐 Hotel pickup (07:30–08:00)

🚡 Cable Car Ride (World Record holder)

📍 Visit:
🌉 Golden Bridge
🛕 Linh Ung Pagoda
🌺 Le Jardin D'Amour Gardens
🏘️ French Village
🎢 Fantasy Park

🍽️ Indian Buffet Lunch at Bharat Restaurant
🎡 Free time for Fantasy Park & shows

🚐 Return to hotel
🏨 Overnight stay in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 3,
      title: 'Coconut Forest + Basket Boat + Hoi An with Dinner',
      description: `🍳 Breakfast at hotel
🚐 Afternoon pickup

📍 Enroute visit:
🗿 Non Nuoc Stone Carving Village

🌴 Coconut Forest Experience:
🛶 Basket boat ride
🦀 Crab catching & local activities

🏮 Hoi An Ancient Town:
🌉 Japanese Covered Bridge
🏛️ Assembly Halls
🏠 Old Houses
🏮 Lantern-lit streets & Night Market

🍽️ Dinner at Hoi An Restaurant

🚐 Return to Da Nang
🏨 Overnight stay in Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 4,
      title: 'Da Nang → Phu Quoc',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Da Nang Airport
✈️ Flight to Phu Quoc (not included)

✈️ Arrival at Phu Quoc Airport
🚗 Private transfer to hotel (North Phu Quoc)
🏨 Check-in & leisure time
🏨 Overnight stay in Phu Quoc

🚐 Transfer: Private`
    },
    {
      day: 5,
      title: '4 Island Tour + Aquatopia Water Park & Cable Car',
      description: `🍳 Breakfast at hotel
🚐 Morning pickup

🚤 Island Hopping Tour:
🏝️ May Rut Trong Island – beach & swimming
🤿 Gam Ghi Island – snorkeling (gear provided)
🏖️ May Rut Ngoai Island

🍽️ Buffet Lunch at Hon Thom Island
💦 Aquatopia Water Park
🚡 Hon Thom Cable Car Ride (world's longest overwater cable car)
📸 Flycam photos & videos included

🚗 Return to hotel
🏨 Overnight stay in Phu Quoc

🚐 Tour Type: SIC`
    },
    {
      day: 6,
      title: 'Vinpearl Safari + VinWonders + Grand World',
      description: `🍳 Breakfast at hotel
🚗 Private transfer

🦒 Vinpearl Safari – open zoo experience
🎢 VinWonders Theme Park
🧜 Mermaid Show at Aquarium (time-bound)

🌆 Evening visit to Grand World Phu Quoc:
🚤 Venice River
🏰 European-style streets
(Boat ride optional, self-paid)

🚗 Return to hotel
🏨 Overnight stay in Phu Quoc

🚐 Tour Type: Private`
    },
    {
      day: 7,
      title: 'Departure from Phu Quoc',
      description: `🍳 Breakfast & check-out
🚗 Private transfer to Phu Quoc Airport
✈️ Departure with beautiful memories

🚐 Transfer: Private`
    }
  ],

  inclusions: [
    '6 Nights accommodation (3N Da Nang + 3N Phu Quoc)',
    'Daily breakfast',
    'Private airport transfers',
    'All sightseeing & tours as per itinerary',
    'Ba Na Hills tour with Indian lunch',
    'Coconut Forest + Hoi An tour with dinner',
    '4 Island Tour + Aquatopia Water Park & Cable Car',
    'Vinpearl Safari + VinWonders + Grand World combo',
    'English-speaking tour guide (as per tours)',
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
  category: 'Beach & Adventure',
  brochureUrl: '/brochures/vietnam-danang-phuquoc-46500.pdf',

  hotelDetails: [
    {
      name: 'Grand Citiview Danang Hotel',
      location: 'Da Nang',
      nights: 3,
      rating: 3,
      roomType: 'Superior Double Room',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Myrtle Boutique Hotel',
      location: 'Phu Quoc',
      nights: 3,
      rating: 4,
      roomType: 'Suite Room',
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

    const result = await Package.create(vietnamDanangPhuQuocPackage);
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
