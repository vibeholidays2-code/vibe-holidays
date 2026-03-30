const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const baliSafariPackage = {
  name: 'Bali Safari Package',
  destination: 'Bali, Indonesia',
  duration: 7,
  price: 36000,
  description: `Discover the wild side of Bali with our Safari Package. Experience thrilling water sports, explore stunning islands, visit iconic temples, and get up close with wildlife at Bali Safari Park. Stay in comfortable hotels in Kuta and unwind in a private pool villa in Ubud with complimentary floating breakfast.

This package offers the perfect mix of adventure, culture, and relaxation - all on a private basis with no hidden charges.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Bali → Finns Beach Club Day',
      description: `✈️ Arrival at Bali Airport
🤝 Meet & greet
🚗 Private transfer
🏖️ Finns Beach Club entry
🌊 Beach relaxation
🎵 Music & sunset

🚐 Tour Type: Private`
    },
    {
      day: 2,
      title: 'Water Sports + Uluwatu',
      description: `🍳 Breakfast

🌊 Adventure Begins:
🪂 Parasailing
🏄 Jet Ski
🍌 Banana Boat

🌅 Evening:
🛕 Uluwatu Temple
🔥 Kecak Fire Dance
🌄 Sunset point

🚐 Tour Type: Private`
    },
    {
      day: 3,
      title: 'Nusa Penida West Island',
      description: `⛴️ Fast boat ride
📸 Kelingking Beach
🌊 Broken Beach
💎 Angel Billabong
🏖️ Crystal Bay
🍱 Snack lunch

🚐 Tour Type: Private`
    },
    {
      day: 4,
      title: 'Ulundanu + Handara Gate',
      description: `🍳 Breakfast
🛕 Ulundanu Temple
🚪 Handara Gate
🏞️ Scenic lake views
☕ Coffee plantation stop

🚐 Tour Type: Private`
    },
    {
      day: 5,
      title: 'Swing + ATV + Waterfall (Ubud)',
      description: `🍳 Breakfast
🏨 Check-out Kuta
🏡 Check-in private villa
🥞 Floating breakfast

Activities:
🌾 Bali Swing
🏍️ ATV Tandem Ride
💦 Tegenungan Waterfall
📸 Instagram spots

🚐 Tour Type: Private`
    },
    {
      day: 6,
      title: 'Bali Safari Park',
      description: `🍳 Breakfast
🦁 Safari journey
🎫 Jungle Hopper Pass
🎭 Animal shows
🚗 Private transfer

🚐 Tour Type: Private`
    },
    {
      day: 7,
      title: 'Departure',
      description: `🍳 Breakfast
🚗 Private airport transfer
✈️ Return

Transfer: Private`
    }
  ],

  inclusions: [
    '6 Nights hotel stay (4N Kuta + 2N Ubud)',
    'Breakfast daily',
    'Floating breakfast in Ubud',
    'All private tours',
    'All entry tickets',
    'Water sports (Parasailing, Jet Ski, Banana Boat)',
    'Nusa Penida tour',
    'Bali Safari Park (Jungle Hopper Pass)',
    'ATV Tandem Ride',
    'Bali Swing',
    'Tegenungan Waterfall visit',
    'Finns Beach Club entry',
    'Uluwatu Temple + Kecak Fire Dance',
    'Private vehicle',
    'Driver',
    'Parking & toll'
  ],

  exclusions: [
    'Flights',
    'Visa',
    'GST',
    'TCS',
    'Personal expenses'
  ],

  images: [
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali1.jpg',
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali2.jpg',
    'https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali3.jpg'
  ],

  featured: true,
  active: true,
  category: 'Adventure',
  brochureUrl: '/brochures/bali-36000.pdf',

  hotelDetails: [
    {
      name: 'Bliss Surfer Hotel Legian',
      location: 'Kuta',
      nights: 4,
      rating: 3,
      roomType: 'Deluxe Double Room',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Samkhya Villas',
      location: 'Ubud',
      nights: 2,
      rating: 4,
      roomType: 'One Bedroom Private Pool Villa',
      amenities: ['Daily Breakfast', 'Floating Breakfast Complimentary']
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

    const result = await Package.create(baliSafariPackage);
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
