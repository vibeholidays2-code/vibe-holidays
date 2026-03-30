const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const goaPackage = {
  name: 'Goa Tour Package',
  destination: 'Goa',
  duration: 4,
  price: 10000,
  description: `Experience the best of Goa with our 3 Nights / 4 Days tour package. Explore stunning beaches from North to South Goa, visit historic churches and temples, enjoy water sports, and relax at comfortable hotels in Calangute. Perfect for families and groups seeking a complete Goa experience with breakfast and dinner included.

We focus on value + comfort + unforgettable memories, not just another package.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Goa | Leisure Day',
      description: `✈ Arrival at Goa Airport / Railway Station
🚗 Transfer to Calangute Hotel
🏨 Check-in (as per hotel policy)

🏖 Leisure Time:
• Relax at hotel
• Visit nearby Calangute Beach
• Enjoy sunset & local cafes

🛌 Overnight Stay: Goa (Calangute)`
    },
    {
      day: 2,
      title: 'North Goa Sightseeing',
      description: `🍳 Breakfast at Hotel

🏖 North Goa Attractions:
🏰 Fort Aguada
🐬 Dolphin Trip
🏖 Candolim Beach
🏖 Calangute Beach
🏖 Baga Beach
🏖 Anjuna Beach
🏖 Vagator Beach
❄️ Snow Park
🎭 Wax Museum
⚡ Thunder World
🛍️ Tito's Lane & Shopping

🍽 Dinner at Hotel
🛌 Overnight stay in Goa`
    },
    {
      day: 3,
      title: 'South Goa Sightseeing',
      description: `🍳 Breakfast at Hotel

🏝 South Goa Attractions:
⛪ Old Goa Church (Basilica of Bom Jesus)
🏛️ St. Augustine Tower
🙏 Mangueshi Temple
🌿 Spice Plantation Tour
⛪ Panjim Church
🌊 Dona Paula Beach
🏖 Miramar Beach

🍽 Dinner at Hotel
🛌 Overnight stay in Goa`
    },
    {
      day: 4,
      title: 'Departure from Goa',
      description: `🍳 Breakfast
🧳 Hotel Check-out
🚗 Transfer to Airport / Railway Station

🙏 Tour Ends with Sweet Goa Memories`
    }
  ],

  inclusions: [
    '3 Nights hotel accommodation (Calangute area)',
    'Daily Breakfast',
    'Daily Dinner',
    'Airport / Railway Station Transfers',
    'North Goa & South Goa Sightseeing by AC Vehicle',
    'Driver Allowance, Toll & Parking',
    'GST Included',
    'Assistance from Vibes Holidays'
  ],

  exclusions: [
    'Flight / Train Tickets',
    'Water Sports',
    'Entry Tickets',
    'Personal Expenses',
    'Tips & Porterage',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Beach Holiday',
  brochureUrl: '/brochures/goa-3n4d.pdf',

  hotelDetails: [
    {
      name: 'Bloom Hotel / Summit Calangute Resort & Spa',
      location: 'Calangute',
      nights: 3,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    }
  ],

  pricingOptions: [
    {
      type: '2 Persons',
      price: 13000,
      description: 'Per person (GST Included)'
    },
    {
      type: '3 Persons',
      price: 11000,
      description: 'Per person (GST Included)'
    },
    {
      type: '4 Persons',
      price: 10000,
      description: 'Per person (GST Included)'
    }
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Rates are date-wise variable & subject to availability. Please confirm dates before booking. Hotels subject to availability at time of booking.'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(goaPackage);
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
