const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const udaipurPackage = {
  name: 'Udaipur Lake City Package',
  destination: 'Udaipur, Rajasthan',
  duration: 3,
  price: 7000,
  description: `Discover the romantic charm of Udaipur, the City of Lakes, with our 2 Nights / 3 Days package. Explore magnificent palaces, serene lakes, ancient temples, and scenic viewpoints. Visit Eklingji and Nathdwara temples on your return journey. Perfect for couples, friends, and families seeking a memorable Rajasthan experience.

We focus on value + comfort + unforgettable memories, not just another package.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Udaipur + Local Sightseeing',
      description: `🚗 Arrival in Udaipur
🏨 Check-in Hotel Siddhartha Inn
💧 Freshen up & start sightseeing

📍 Visit:
🌊 Fateh Sagar Lake
🌺 Saheliyon Ki Bari
🐘 Moti Magri
🚗 Vintage Car Museum
🛍️ Hathi Pol Market & Local Shopping

🚤 Optional: Lake Pichola Boat Ride (self)
🌅 Evening leisure

🍽 Dinner at hotel
🛌 Overnight stay in Udaipur`
    },
    {
      day: 2,
      title: 'Full Day Udaipur Tour',
      description: `🍳 Breakfast at hotel

Start full day sightseeing:
🏰 City Palace
🛕 Jagdish Temple
🏛️ Bagore Ki Haveli
🚡 Karni Mata Ropeway
🏰 Sajjangarh (Monsoon Palace)
🌳 Dudh Talai Garden
⛲ Sukhadia Circle

📸 Sunset point visit
🛍️ Evening free for shopping

🍽 Dinner at hotel
🛌 Overnight stay in Udaipur`
    },
    {
      day: 3,
      title: 'Eklingji + Nathdwara + Departure',
      description: `🍳 Breakfast
🧳 Checkout

Enroute sightseeing:
🛕 Eklingji Temple
🙏 Nathdwara Shrinathji Temple
⚔️ Haldi Ghati (optional)

🚗 Return with sweet memories ✨`
    }
  ],

  inclusions: [
    '2 Nights accommodation at Hotel Siddhartha Inn',
    'Room on double / triple sharing basis',
    'Daily Breakfast (2 breakfasts)',
    'Daily Dinner (2 dinners)',
    'Udaipur local sightseeing guidance as per itinerary',
    'GST Included',
    'Trip assistance from Vibes Holidays'
  ],

  exclusions: [
    'Monument & sightseeing entry tickets',
    'Lake Pichola boat ride charges',
    'Ropeway tickets (Karni Mata)',
    'Lunch & extra meals',
    'Personal expenses',
    'Porterage, laundry, room service',
    'Any additional sightseeing not mentioned',
    'Travel insurance',
    'Early check-in / late checkout',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Heritage & Culture',
  brochureUrl: '/brochures/udaipur-lake-city.pdf',

  hotelDetails: [
    {
      name: 'Hotel Siddhartha Inn',
      location: 'Udaipur',
      nights: 2,
      rating: 3,
      roomType: 'Double/Triple Sharing',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    }
  ],

  pricingOptions: [
    {
      type: 'Sedan (2 Pax)',
      price: 10000,
      description: 'Per person with Dzire/Etios'
    },
    {
      type: 'Sedan (4 Pax)',
      price: 7000,
      description: 'Per person with Dzire/Etios'
    },
    {
      type: 'Ertiga (4 Pax)',
      price: 8000,
      description: 'Per person'
    },
    {
      type: 'Innova Crysta (6 Pax)',
      price: 7500,
      description: 'Per person'
    },
    {
      type: 'Tempo/Crysta (6+ Pax)',
      price: 7500,
      description: 'Per person'
    }
  ],

  highlights: [
    'City Palace - Magnificent royal residence',
    'Lake Pichola & Fateh Sagar Lake',
    'Sajjangarh Monsoon Palace',
    'Karni Mata Ropeway',
    'Eklingji & Nathdwara Temple visit',
    'Perfect for Couples, Friends & Family'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Rates are date-wise different – confirm before booking. Package cost includes transport as per selected vehicle type.'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(udaipurPackage);
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
