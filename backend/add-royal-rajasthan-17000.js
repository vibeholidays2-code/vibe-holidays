const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const royalRajasthanPackage = {
  name: 'Royal Rajasthan Tour Package',
  destination: 'Udaipur, Jaipur, Jodhpur & Jaisalmer, Rajasthan',
  duration: 6,
  price: 17000,
  description: `Experience the grandeur of Royal Rajasthan with our comprehensive 5 Nights / 6 Days tour covering four magnificent cities. Explore Udaipur's romantic lakes and palaces, witness Jaipur's pink architecture, discover Jodhpur's mighty Mehrangarh Fort, and experience the golden sands of Jaisalmer with a desert camp stay. Travel in comfort with a private Innova Crysta throughout your journey.

We focus on value + comfort + unforgettable memories, not just another package.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Udaipur Arrival',
      description: `🚗 Arrival in Udaipur & hotel transfer

📍 Visit City Palace
🌊 Lake Pichola & Fateh Sagar Lake
🛍️ Evening local market visit

🍽 Dinner at hotel
🛌 Overnight stay in Udaipur`
    },
    {
      day: 2,
      title: 'Udaipur → Jaipur',
      description: `🍳 Breakfast at hotel

🚗 Drive to Jaipur (scenic journey)
🏨 Hotel check-in Jaipur
🛍️ Evening free for market visit

🍽 Dinner at hotel
🛌 Overnight stay in Jaipur`
    },
    {
      day: 3,
      title: 'Jaipur Sightseeing → Jodhpur',
      description: `🍳 Breakfast at hotel

📸 Photo stop at Hawa Mahal
🏰 Visit Jal Mahal

🚗 Drive to Jodhpur
🏰 Visit Mehrangarh Fort
🕰️ Clock Tower market

🍽 Dinner
🛌 Overnight stay in Jodhpur`
    },
    {
      day: 4,
      title: 'Jodhpur → Jaisalmer',
      description: `🍳 Breakfast

🚗 Drive to Jaisalmer
🏨 Hotel check-in

📍 Visit Jaisalmer Fort
🌊 Gadisar Lake
🛍️ Local market

🍽 Dinner
🛌 Overnight stay in Jaisalmer`
    },
    {
      day: 5,
      title: 'Desert Camp Experience',
      description: `🍳 Breakfast

🚗 Transfer to Sam Sand Dunes
🐪 Camel Safari
🏎️ Jeep Safari
🌅 Sunset Point

☕ Welcome tea & snacks
💃 Folk dance & cultural show
🎧 DJ night

🍽 Dinner at camp
⛺ Overnight stay in Desert Camp`
    },
    {
      day: 6,
      title: 'Departure',
      description: `🍳 Breakfast

🚗 Drop at Jaisalmer / Jodhpur / Udaipur

✨ Tour ends with happy memories`
    }
  ],

  inclusions: [
    'Private Innova Crysta for entire trip',
    'All hotel accommodations (5 nights)',
    'Daily breakfast & dinner',
    'Desert camp stay',
    'Camel safari',
    'Jeep safari',
    'Folk dance & cultural show',
    'Toll, parking, driver allowance'
  ],

  exclusions: [
    'GST',
    'Monument entry tickets',
    'Lunch',
    'Boat ride in Udaipur',
    'Personal expenses'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Heritage & Culture',
  brochureUrl: '/brochures/royal-rajasthan-17000.pdf',

  hotelDetails: [
    {
      name: 'Hotel Siddhartha Inn',
      location: 'Udaipur',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    },
    {
      name: 'Lords Inn Jaipur',
      location: 'Jaipur',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    },
    {
      name: 'The Grand Siddharth by Alura',
      location: 'Jodhpur',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    },
    {
      name: 'Hotel Narpat Garh',
      location: 'Jaisalmer',
      nights: 1,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    },
    {
      name: 'Sai Raj Desert Camp & Resort',
      location: 'Sam Sand Dunes, Jaisalmer',
      nights: 1,
      rating: 3,
      roomType: 'Desert Camp',
      amenities: ['Breakfast', 'Dinner', 'Camel Safari', 'Folk Dance', 'DJ Night']
    }
  ],

  pricingOptions: [
    {
      type: 'Double Sharing',
      price: 17000,
      description: 'Per person'
    }
  ],

  travelDetails: {
    mode: 'Private Innova Crysta',
    route: 'Udaipur → Jaipur → Jodhpur → Jaisalmer → Desert Camp',
    included: true
  },

  highlights: [
    'Complete 4-City Rajasthan Tour',
    'Private Innova Crysta throughout',
    'City Palace & Lake Pichola - Udaipur',
    'Hawa Mahal & Jal Mahal - Jaipur',
    'Mehrangarh Fort - Jodhpur',
    'Jaisalmer Fort & Desert Camp Experience',
    'Camel & Jeep Safari with Folk Dance'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Private Innova Crysta included for entire journey. All hotel accommodations and desert camp stay included with daily breakfast and dinner.'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(royalRajasthanPackage);
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
