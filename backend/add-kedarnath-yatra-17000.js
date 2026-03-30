const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const kedarnathPackage = {
  name: 'Kedarnath Yatra Package',
  destination: 'Kedarnath, Badrinath, Uttarakhand',
  duration: 8,
  price: 17000,
  description: `Embark on a divine spiritual journey to Kedarnath and Badrinath with our comprehensive 5 Nights / 6 Days yatra package. This group tour from Ahmedabad includes AC sleeper bus travel, the sacred 18-20 km trek to Kedarnath Temple, darshan at both Kedarnath and Badrinath, and visits to holy sites including Devprayag Sangam, Dhari Devi Temple, and Mana Village. Experience the spiritual essence of the Char Dham with comfortable accommodation and complete yatra assistance.

We focus on value + comfort + unforgettable memories, not just another package.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Ahmedabad → Delhi',
      description: `🚍 AC Sleeper Bus boarding
🌙 Overnight journey
🧳 Group briefing
🛌 Overnight in bus`
    },
    {
      day: 2,
      title: 'Delhi → Guptkashi',
      description: `🚐 Pickup from Delhi
🚗 Drive via Haridwar & Rudraprayag

📍 Sightseeing:
• Devprayag Sangam
• Dhari Devi Temple

🏨 Hotel check-in Guptkashi
🍽 Dinner & rest`
    },
    {
      day: 3,
      title: 'Guptkashi → Kedarnath Trek',
      description: `🚐 Drive to Sonprayag
🚙 Jeep to Gaurikund

🥾 18-20 km trek to Kedarnath
(Pony/Palki optional)

🛕 Kedarnath Temple darshan
🕉️ Evening aarti

🏕 Overnight stay in Kedarnath`
    },
    {
      day: 4,
      title: 'Kedarnath → Guptkashi',
      description: `🛕 Morning VIP darshan
🙏 Bhairavnath visit

🥾 Trek down to Gaurikund
🚐 Drive to Guptkashi

🏨 Hotel stay
🍽 Dinner`
    },
    {
      day: 5,
      title: 'Guptkashi → Badrinath',
      description: `🚐 Drive to Badrinath

🛕 Badrinath Temple darshan
🏘️ Mana Village visit

🏨 Hotel stay in Badrinath
🍽 Dinner`
    },
    {
      day: 6,
      title: 'Badrinath → Haridwar',
      description: `🚐 Drive to Haridwar

🌊 Ganga Aarti (time permitting)

🏨 Hotel stay in Haridwar
🍽 Dinner`
    },
    {
      day: 7,
      title: 'Haridwar → Delhi → Ahmedabad',
      description: `🚐 Drive to Delhi
🚌 AC sleeper bus to Ahmedabad
🌙 Overnight journey`
    },
    {
      day: 8,
      title: 'Ahmedabad Arrival',
      description: `🏠 Arrival in Ahmedabad
🙏 Yatra complete with blessings & memories`
    }
  ],

  inclusions: [
    'AC sleeper bus Ahmedabad–Delhi–Ahmedabad',
    'Delhi to Delhi vehicle (Sedan/Ertiga/Innova/Tempo Traveller)',
    'Hotel stay (Guptkashi, Kedarnath, Badrinath, Haridwar)',
    'Daily Breakfast',
    'Daily Dinner',
    'Driver allowance, toll & parking',
    'Yatra assistance throughout'
  ],

  exclusions: [
    'GST',
    'Pony/Palki charges for Kedarnath trek',
    'Helicopter charges',
    'Entry tickets',
    'Lunch',
    'Personal expenses',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'],
  thumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',

  featured: true,
  active: true,
  category: 'Pilgrimage & Spiritual',
  brochureUrl: '/brochures/kedarnath-yatra-17000.pdf',

  hotelDetails: [
    {
      name: 'Standard/Deluxe Hotel',
      location: 'Guptkashi',
      nights: 2,
      rating: 3,
      roomType: 'Standard/Deluxe Room',
      amenities: ['Breakfast', 'Dinner', 'Hot Water']
    },
    {
      name: 'Camp/Guesthouse',
      location: 'Kedarnath',
      nights: 1,
      rating: 2,
      roomType: 'Basic Accommodation',
      amenities: ['Basic Facilities', 'Dinner']
    },
    {
      name: 'Standard Hotel',
      location: 'Badrinath',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'Hot Water']
    },
    {
      name: 'Standard Hotel',
      location: 'Haridwar',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner']
    }
  ],

  pricingOptions: [
    {
      type: 'Double Sharing',
      price: 17000,
      description: 'Per person'
    },
    {
      type: 'Triple Sharing',
      price: 15500,
      description: 'Per person'
    },
    {
      type: 'Quad Sharing',
      price: 14500,
      description: 'Per person'
    },
    {
      type: 'Child (6-12 years)',
      price: 8000,
      description: 'Per child'
    }
  ],

  travelDetails: {
    mode: 'AC Sleeper Bus + Private Vehicle',
    route: 'Ahmedabad → Delhi → Guptkashi → Kedarnath → Badrinath → Haridwar → Delhi → Ahmedabad',
    included: true,
    pickupDrop: 'Ahmedabad'
  },

  highlights: [
    'Complete Kedarnath & Badrinath Yatra',
    'AC Sleeper Bus from Ahmedabad',
    'Kedarnath Temple Darshan',
    'Badrinath Temple Darshan',
    'Devprayag Sangam Visit',
    'Dhari Devi Temple',
    'Mana Village - Last Indian Village',
    'Ganga Aarti at Haridwar',
    'Bhairavnath Temple Visit',
    'Complete Yatra Assistance',
    'Group Departures Available',
    'Trek Support (Pony/Palki optional)'
  ],

  groupDepartures: [
    { month: 'April 2026', dates: ['15 April', '22 April', '29 April'] },
    { month: 'May 2026', dates: ['06 May', '13 May', '20 May', '27 May'] },
    { month: 'June 2026', dates: ['03 June', '10 June', '17 June', '24 June'] }
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'AC Sleeper Bus from Ahmedabad to Delhi and back included. Private vehicle from Delhi to Delhi for entire yatra. Kedarnath trek is 18-20 km (Pony/Palki available at extra cost). Rates are date-wise different – confirm before booking. Group departures available from April to June 2026.',

  tourType: 'Group',
  bestTimeToVisit: 'April to June, September to October',
  difficulty: 'Moderate to Challenging',
  altitude: 'Up to 3,583m (Kedarnath)',
  trekDistance: '18-20 km (one way to Kedarnath)'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(kedarnathPackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price} (Double Sharing)`);
    console.log(`Duration: ${result.duration} days`);
    console.log(`Active: ${result.active}`);
    console.log(`\nGroup Departures:`);
    result.groupDepartures.forEach(group => {
      console.log(`  ${group.month}: ${group.dates.join(', ')}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
