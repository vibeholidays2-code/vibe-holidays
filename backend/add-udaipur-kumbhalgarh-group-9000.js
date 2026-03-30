const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const udaipurGroupPackage = {
  name: 'Udaipur - Kumbhalgarh Group Tour',
  destination: 'Udaipur & Kumbhalgarh, Rajasthan',
  duration: 4,
  price: 9000,
  description: `Experience the royal heritage of Rajasthan with our 3 Nights / 4 Days Udaipur & Kumbhalgarh Group Tour. Travel by comfortable sleeper train from Ahmedabad, explore the magnificent City Palace, serene lakes, and the mighty Kumbhalgarh Fort. Perfect for groups seeking a complete Rajasthan experience with breakfast and dinner included.

We focus on value + comfort + unforgettable memories, not just another package.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Ahmedabad → Udaipur | Evening Sightseeing',
      description: `🚆 Board sleeper train from Ahmedabad

🌅 Morning arrival Udaipur
🚗 Hotel transfer & check-in

🌆 Evening Udaipur sightseeing:
🏰 City Palace
🌊 Lake Pichola area
🌊 Fateh Sagar Lake
🛍️ Local market

🍽 Dinner at hotel
🛌 Overnight stay in Udaipur`
    },
    {
      day: 2,
      title: 'Kumbhalgarh Day Trip',
      description: `🍳 Breakfast

🚘 Drive to Kumbhalgarh Fort
🏰 Fort visit & sightseeing
🏔️ Scenic Aravalli drive
📸 Photo points

🌆 Evening return to Udaipur

🍽 Dinner
🛌 Overnight stay`
    },
    {
      day: 3,
      title: 'Udaipur Local Sightseeing',
      description: `🍳 Breakfast

Local sightseeing:
🛕 Jagdish Temple
🏰 Sajjangarh Monsoon Palace
🚤 Optional boat ride Lake Pichola
🛍️ Shopping time

🍽 Dinner
🛌 Overnight stay`
    },
    {
      day: 4,
      title: 'Departure',
      description: `🍳 Breakfast
🧳 Hotel checkout

🚆 Board sleeper train for Ahmedabad

✨ Tour ends with memorable moments`
    }
  ],

  inclusions: [
    'Sleeper train tickets (Ahmedabad–Udaipur–Ahmedabad)',
    '3 Nights hotel stay at Hotel Siddhartha Inn',
    'Daily Breakfast',
    'Daily Dinner',
    'Udaipur sightseeing',
    'Kumbhalgarh day trip',
    'Transfers & local vehicle',
    'Tour assistance from Vibes Holidays'
  ],

  exclusions: [
    'GST',
    'Entry tickets',
    'Boat ride charges',
    'Lunch',
    'Personal expenses',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Heritage & Culture',
  brochureUrl: '/brochures/udaipur-kumbhalgarh-group.pdf',

  hotelDetails: [
    {
      name: 'Hotel Siddhartha Inn',
      location: 'Udaipur',
      nights: 3,
      rating: 3,
      roomType: 'Double/Triple Sharing',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    }
  ],

  pricingOptions: [
    {
      type: 'Double Sharing',
      price: 10000,
      description: 'Per person'
    },
    {
      type: 'Triple Sharing',
      price: 9000,
      description: 'Per person'
    }
  ],

  travelDetails: {
    mode: 'Sleeper Train',
    route: 'Ahmedabad ⇄ Udaipur',
    included: true
  },

  highlights: [
    'Sleeper train travel from Ahmedabad',
    'Kumbhalgarh Fort - UNESCO World Heritage Site',
    'City Palace & Lake Pichola',
    'Sajjangarh Monsoon Palace',
    'Scenic Aravalli mountain drive',
    'Group Tour Experience'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Rates are date-wise different – confirm before booking. Sleeper train tickets included in package cost.'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(udaipurGroupPackage);
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
