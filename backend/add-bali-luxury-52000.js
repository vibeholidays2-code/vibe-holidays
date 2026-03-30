const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const baliLuxuryPackage = {
  name: 'Bali Ultra Luxury Honeymoon Escape',
  destination: 'Bali, Indonesia',
  duration: 8,
  price: 52000,
  description: `Experience the ultimate romantic getaway in Bali with our Ultra Luxury Honeymoon Escape. Stay in 5-star beachfront hotels and private pool villas, enjoy thrilling water sports, explore stunning islands, and create unforgettable memories together.

This exclusive package combines luxury accommodation, adventure activities, cultural experiences, and complete relaxation - perfect for couples seeking an extraordinary honeymoon experience.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Bali – Relax & Enjoy',
      description: `✈️ Arrival at Bali Airport
🚗 Private pickup & transfer to hotel
🏨 Check-in & freshen up
🌅 Evening free for beach walk / shopping`
    },
    {
      day: 2,
      title: 'Water Sports + Uluwatu Sunset',
      description: `🌊 Thrilling Day Includes:
🪂 Parasailing Adventure
🏄 Jet Ski Ride
🍌 Banana Boat Ride

🌅 Evening:
🛕 Uluwatu Temple Visit
🔥 Kecak Fire Dance Show`
    },
    {
      day: 3,
      title: 'Nusa Penida Island Tour',
      description: `🏝️ Explore Bali's most famous island:
📸 Kelingking Beach
🌊 Broken Beach
💎 Angel Billabong
🏖️ Crystal Bay
🍱 Snack Lunch Included`
    },
    {
      day: 4,
      title: 'Bedugul + Tanah Lot Tour',
      description: `📸 Instagram Famous Spots:
🚪 Handara Gate
🛕 Ulun Danu Temple (Lake Temple)
🌅 Tanah Lot Sunset Temple`
    },
    {
      day: 5,
      title: 'Kintamani + Ubud Sightseeing',
      description: `🌋 Experience Nature & Culture:
🏔️ Kintamani Volcano View
☕ Coffee Plantation
🌾 Tegalalang Rice Terrace + Swing
💦 Tegenungan Waterfall`
    },
    {
      day: 6,
      title: 'ATV Ride + Spa + Ubud Transfer',
      description: `🏍️ Adventure + Relaxation Day:
🏍️ ATV Ride (Tandem)
💆 60 Min Balinese Spa
🚗 Transfer to Ubud
🏡 Check-in Private Pool Villa`
    },
    {
      day: 7,
      title: 'Full Day Leisure – Romantic Villa Time',
      description: `💑 Enjoy your private pool villa
🥞 Floating breakfast
💕 Complete relaxation & romance day`
    },
    {
      day: 8,
      title: 'Departure',
      description: `🍳 Breakfast
🚗 Private transfer to airport
✈️ Tour ends with unforgettable memories`
    }
  ],

  inclusions: [
    '5 Nights stay in Kuta – 5★ Hotel (Mamaka by Ovolo)',
    '2 Nights stay in Ubud – Private Pool Villa (Asvara Resort & Spa)',
    'Daily Breakfast',
    'All sightseeing on Private basis',
    'Water Sports (3 Activities: Parasailing, Jet Ski, Banana Boat)',
    'Nusa Penida Tour with Lunch',
    'ATV Ride (Tandem)',
    '60 Min Spa Session',
    'Airport Transfers',
    'Uluwatu Temple + Kecak Fire Dance',
    'Bedugul + Tanah Lot Tour',
    'Kintamani + Ubud Sightseeing',
    'Private vehicle throughout'
  ],

  exclusions: [
    'Airfare',
    'Visa Charges (if applicable)',
    'Personal Expenses',
    'Anything not mentioned',
    'GST Extra + TCS'
  ],

  images: [
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali1.jpg',
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali2.jpg',
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali3.jpg'
  ],

  featured: true,
  category: 'Honeymoon',
  brochureUrl: '/brochures/bali-52000.pdf',

  hotelDetails: [
    {
      name: 'Mamaka by Ovolo – Kuta',
      location: 'Kuta',
      nights: 5,
      rating: 5,
      roomType: 'Bali Room',
      amenities: ['Breakfast Included', 'Beachfront lifestyle hotel', 'Trendy & modern honeymoon vibe', 'Walking distance to Kuta Beach']
    },
    {
      name: 'Asvara Resort & Spa Ubud by Ini Vie Hospitality',
      location: 'Ubud',
      nights: 2,
      rating: 5,
      roomType: '1 Bedroom Private Pool Villa',
      amenities: ['Breakfast Included', 'Private infinity pool with jungle view', 'Romantic honeymoon setup', 'Instagram-worthy villas']
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

    const result = await Package.create(baliLuxuryPackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
