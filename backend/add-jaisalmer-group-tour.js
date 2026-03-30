const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const jaisalmerGroupTour = {
  name: 'Jaisalmer Desert Group Tour',
  destination: 'Jaisalmer, Rajasthan',
  duration: 3,
  price: 7000,
  description: `Experience the magic of the Thar Desert with our Jaisalmer Desert Group Tour. Explore the golden city's magnificent forts and havelis, visit the historic Tanot Mata Temple and Longewala Border, enjoy camel and jeep safaris in the Sam dunes, and spend a night under the stars at a desert camp with folk dance and cultural programs.

Perfect for travelers seeking an authentic Rajasthani desert adventure with group camaraderie.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Jaisalmer | City Sightseeing',
      description: `🚗 Arrival & hotel check-in

🏰 Jaisalmer Fort
🌊 Gadisar Lake
🏛️ Patwon Ki Haveli
🏛️ Nathmal Ki Haveli
🏛️ Salim Singh Haveli
🛍️ Local market shopping

🍽️ Dinner at hotel
🏨 Overnight stay at city hotel

🚐 Tour Type: Group`
    },
    {
      day: 2,
      title: 'Border Tour → Desert Camp',
      description: `🍳 Breakfast & checkout

🇮🇳 Tanot Mata Temple
🪖 Longewala Border
📍 Zero Point

🏜️ Proceed to Sam dunes
🏕️ Camp check-in
☕ High tea & snacks
💃 Folk dance
🎭 Cultural program

🍽️ Dinner at camp
🏕️ Overnight desert camp

🚐 Tour Type: Group`
    },
    {
      day: 3,
      title: 'Safari → Local Sightseeing → Departure',
      description: `🍳 Breakfast

🐪 Camel safari
🚙 Jeep safari
🚿 Freshen up

🌅 Bada Bagh
🏚️ Kuldhara Village
📸 Photo stops
🛍️ Market time

🚗 Departure

🚐 Tour Type: Group`
    }
  ],

  inclusions: [
    '1 Night city hotel stay (Narpat Garh Haveli)',
    '1 Night desert camp stay (Limra Desert Camp)',
    'Daily breakfast',
    'Dinner (2 nights)',
    'Camel safari',
    'Jeep safari',
    'High tea at camp',
    'Folk dance program',
    'Border tour (Tanot Mata Temple, Longewala, Zero Point)',
    'Full city sightseeing',
    'Private vehicle',
    'Driver, toll, parking'
  ],

  exclusions: [
    'GST',
    'Lunch',
    'Entry tickets',
    'Adventure activities',
    'Personal expenses'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Desert Adventure',
  brochureUrl: '/brochures/jaisalmer-group-tour.pdf',

  hotelDetails: [
    {
      name: 'Narpat Garh Haveli',
      location: 'Jaisalmer City',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner']
    },
    {
      name: 'Limra Desert Camp',
      location: 'Sam Sand Dunes',
      nights: 1,
      rating: 3,
      roomType: 'Desert Camp Tent',
      amenities: ['Breakfast', 'Dinner', 'Folk Dance', 'Cultural Program']
    }
  ],

  pricingOptions: [
    {
      type: 'Double Sharing',
      price: 7500,
      description: '2 persons in one room'
    },
    {
      type: 'Triple Sharing',
      price: 7000,
      description: '3 persons in one room'
    },
    {
      type: 'Quad Sharing',
      price: 6500,
      description: '4 persons in one room'
    }
  ],

  groupDepartures: [
    '19 February 2026',
    '02 March 2026'
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

    const result = await Package.create(jaisalmerGroupTour);
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
