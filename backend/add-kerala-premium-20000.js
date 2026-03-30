const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const keralaPackage = {
  name: 'Kerala Premium Holiday Package',
  destination: 'Kerala (Cochin, Munnar, Thekkady, Alleppey)',
  duration: 6,
  price: 20000,
  description: `Experience the enchanting beauty of God's Own Country with our premium Kerala holiday package. This 5 Nights / 6 Days private tour takes you through the lush tea gardens of Munnar, the wildlife sanctuary of Thekkady, and the serene backwaters of Alleppey. Explore Fort Kochi's colonial heritage, witness stunning waterfalls, and immerse yourself in Kerala's rich culture and natural beauty.

Available in two options: 3★ Comfort Stay (₹20,000) and 4★ Premium Stay (₹26,000) per person.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Cochin Arrival & Sightseeing',
      description: `• Arrival at Cochin Airport
• Transfer & local sightseeing:
  • Chinese Fishing Nets
  • St. Francis Church
  • Mattancherry Palace
  • Fort Kochi
• Optional: Kathakali Show
• Overnight stay in Cochin`
    },
    {
      day: 2,
      title: 'Cochin → Munnar',
      description: `• Breakfast
• Scenic drive to Munnar
• Enroute:
  • Valara Waterfalls
  • Cheeyappara Waterfalls
• Hotel check-in
• Overnight stay in Munnar`
    },
    {
      day: 3,
      title: 'Munnar Full Day Sightseeing',
      description: `• Breakfast
• Visit:
  • Eravikulam National Park
  • Tea Museum & Tea Factory
  • Rose Garden
  • Blossom Park
  • Mattupetty Dam
  • Echo Point
  • Kundala Lake
• Overnight stay in Munnar`
    },
    {
      day: 4,
      title: 'Munnar → Thekkady',
      description: `• Breakfast
• Drive to Thekkady
• Enroute: Spice Plantation
• Activities:
  • Periyar Wildlife Sanctuary
  • Boating (Optional – pre-book recommended)
• Optional:
  • Kathakali Show
  • Elephant Ride
  • Ayurveda Massage
• Overnight stay in Thekkady`
    },
    {
      day: 5,
      title: 'Thekkady → Alleppey',
      description: `• Breakfast
• Transfer to Alleppey
• Explore:
  • Backwaters
  • Alleppey Beach
  • Lighthouse
  • Optional: Houseboat Experience
• Overnight stay in Alleppey`
    },
    {
      day: 6,
      title: 'Departure',
      description: `• Breakfast
• Transfer to Cochin Airport
• Tour ends with beautiful memories`
    }
  ],

  inclusions: [
    '5 Nights hotel accommodation',
    'Daily Breakfast & Dinner (MAP Plan)',
    'Private A/C Sedan for full trip',
    'All sightseeing & transfers',
    'Driver allowance, toll & parking',
    'All applicable taxes'
  ],

  exclusions: [
    'Flight tickets',
    'Entry tickets & activities',
    'Boating / Houseboat charges',
    'Personal expenses',
    'Lunch',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'],
  thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',

  featured: true,
  active: true,
  category: 'Nature & Backwaters',
  brochureUrl: '/brochures/kerala-premium-20000.pdf',

  hotelDetails: [
    {
      name: 'Broad Bean (3★) / Luxo by Townbridge Hotels (4★)',
      location: 'Cochin',
      nights: 1,
      rating: 3,
      roomType: 'Standard / Premium Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    },
    {
      name: 'Tea Castle (3★) / Munnar Queen Resort (4★)',
      location: 'Munnar',
      nights: 2,
      rating: 3,
      roomType: 'Standard / Premium Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'Mountain View']
    },
    {
      name: 'Periyar Meadows (3★) / Grand Thekkady (4★)',
      location: 'Thekkady',
      nights: 1,
      rating: 3,
      roomType: 'Standard / Premium Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    },
    {
      name: 'Pagoda Resort (3★) / Lemon Tree Vembanad Lake Resort (4★)',
      location: 'Alleppey',
      nights: 1,
      rating: 3,
      roomType: 'Standard / Lake View Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'Lake View']
    }
  ],

  pricingOptions: [
    {
      type: '3★ Comfort Stay',
      price: 20000,
      description: 'Per person - Includes Broad Bean (Cochin), Tea Castle (Munnar), Periyar Meadows (Thekkady), Pagoda Resort (Alleppey)'
    },
    {
      type: '4★ Premium Stay',
      price: 26000,
      description: 'Per person - Includes Luxo by Townbridge (Cochin), Munnar Queen Resort (Munnar), Grand Thekkady (Thekkady), Lemon Tree Vembanad Lake Resort (Alleppey)'
    }
  ],

  travelDetails: {
    mode: 'Private A/C Sedan',
    route: 'Cochin → Munnar → Thekkady → Alleppey → Cochin',
    included: true,
    pickupDrop: 'Cochin Airport'
  },

  highlights: [
    'Complete Kerala Experience',
    'Fort Kochi Colonial Heritage',
    'Chinese Fishing Nets',
    'Munnar Tea Gardens & Plantations',
    'Eravikulam National Park',
    'Valara & Cheeyappara Waterfalls',
    'Periyar Wildlife Sanctuary',
    'Spice Plantation Tour',
    'Alleppey Backwaters',
    'Optional Houseboat Experience',
    'Private A/C Sedan Throughout',
    'Two Accommodation Options (3★ / 4★)'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Private A/C Sedan included for entire journey. MAP plan (Breakfast + Dinner) at all hotels. Two accommodation options available: 3★ Comfort Stay (₹20,000) and 4★ Premium Stay (₹26,000) per person. Pickup & Drop from Cochin Airport included.',

  tourType: 'Private',
  bestTimeToVisit: 'September to March',
  difficulty: 'Easy'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(keralaPackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price} (3★ Comfort) / ₹26,000 (4★ Premium)`);
    console.log(`Duration: ${result.duration} days`);
    console.log(`Active: ${result.active}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
