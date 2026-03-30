const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const jaisalmerPrivateTour = {
  name: 'Jaisalmer Private Desert Tour',
  destination: 'Jaisalmer, Rajasthan',
  duration: 3,
  price: 8500,
  description: `Experience luxury in the Thar Desert with our Jaisalmer Private Desert Tour from Ahmedabad. Stay in Swiss Luxury Tents at Gujarat Capital Resort, enjoy camel and jeep safaris, visit the historic Tanot Mata Temple and Longewala Border, explore Jaisalmer's golden fort and havelis, with comfortable sleeper bus travel included.

Perfect for groups seeking a premium desert experience with all-inclusive travel from Ahmedabad.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Jaisalmer | City Sightseeing + Desert Camp',
      description: `🚌 Arrival at Jaisalmer Bus Station

🚗 Local Sightseeing (Pre-Lunch / Light):
🌳 Bada Bagh – Royal Cenotaphs
🏛️ Vyas Chhatri
🌅 Gadisar Lake (Photo Stop)

➡️ Drive towards Sam Sand Dunes
⏰ Check-in at Desert Camp – 2:00 PM
☕ Welcome Tea & Snacks

🌄 Evening Desert Experience:
🐪 Camel Safari
🏎️ Jeep Safari
🌅 Sunset Point at Sand Dunes

🎶 Evening Entertainment:
💃 Rajasthani Folk Music & Dance
🔥 Camp Fire
🎧 DJ Party

🍽️ Pure Veg Dinner
⛺ Overnight Stay at Swiss Luxury Tent

🚐 Tour Type: Private`
    },
    {
      day: 2,
      title: 'Tanot Mata & Longewala Border Tour',
      description: `🍳 Morning Breakfast

🚙 Full-Day Excursion:
🙏 Tanot Mata Temple
🇮🇳 Longewala Border
🛣️ Desert Highway Experience

⬅️ Return to camp by evening
🌙 Leisure Time

🍽️ Pure Veg Dinner
⛺ Overnight Stay at Swiss Luxury Tent

🚐 Tour Type: Private`
    },
    {
      day: 3,
      title: 'Jaisalmer City Sightseeing | Departure',
      description: `🍳 Morning Breakfast
🧳 Check-out from Camp

🏰 City Sightseeing:
🏰 Jaisalmer Golden Fort (Sonar Quila)
🏯 Patwon Ki Haveli
🏯 Salim Singh Ki Haveli
🏯 Nathmal Ki Haveli
🛍️ Local Market Shopping

🚌 Drop at Jaisalmer Bus Station
➡️ Overnight Sleeper Bus to Ahmedabad

✨ Tour Ends with Golden Desert Memories

🚐 Tour Type: Private`
    }
  ],

  inclusions: [
    'Ahmedabad ⇄ Jaisalmer Sleeper Bus',
    '2 Nights Stay at Gujarat Capital Resort (Swiss Luxury Tent)',
    'Daily Breakfast & Dinner (Pure Veg)',
    'Camel Safari & Jeep Safari',
    'Folk Dance, DJ Night & Campfire',
    'Tanot Mata & Longewala Border Tour',
    'All sightseeing as per itinerary',
    'GST Included',
    'Group Tour Assistance'
  ],

  exclusions: [
    'Lunch',
    'Personal Expenses',
    'Entry Fees / Camera Charges',
    'Any services not mentioned in inclusions'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Desert Adventure',
  brochureUrl: '/brochures/jaisalmer-private-tour.pdf',

  hotelDetails: [
    {
      name: 'Gujarat Capital Resort',
      location: 'Sam Sand Dunes',
      nights: 2,
      rating: 4,
      roomType: 'Swiss Luxury Tent',
      amenities: ['Breakfast', 'Dinner', 'Folk Dance', 'DJ Party', 'Campfire']
    }
  ],

  pricingOptions: [
    {
      type: '2 Persons',
      price: 10000,
      description: 'Per person'
    },
    {
      type: '3 Persons',
      price: 8500,
      description: 'Per person'
    },
    {
      type: '4 Persons',
      price: 7500,
      description: 'Per person'
    },
    {
      type: '6 Persons or More',
      price: 7500,
      description: 'Per person'
    }
  ],

  travelDetails: {
    route: 'Ahmedabad ⇄ Jaisalmer',
    busType: 'Sleeper Bus',
    pickupPoints: ['Chandkheda RTO Circle', 'Adalaj'],
    dropPoint: 'Jaisalmer Bus Station',
    minimumPersons: 2
  },

  groupDepartures: [
    '23 January 2026',
    '06 February 2026',
    '20 February 2026',
    '06 March 2026',
    '20 March 2026'
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

    const result = await Package.create(jaisalmerPrivateTour);
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
