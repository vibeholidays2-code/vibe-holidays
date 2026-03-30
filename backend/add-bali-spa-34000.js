const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const baliSpaPackage = {
  name: 'Bali Spa Package',
  destination: 'Bali, Indonesia',
  duration: 7,
  price: 34000,
  description: `Rejuvenate your mind and body with our Bali Spa Package. Combine adventure with ultimate relaxation - enjoy water sports, explore stunning islands and temples, experience the thrill of ATV rides and Bali Swing, then unwind with a traditional 60-minute Balinese massage. Stay in a private pool villa in Ubud with complimentary floating breakfast.

Perfect for couples seeking a balanced Bali experience with wellness and adventure.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Bali → Kuta',
      description: `🛬 Arrival at Bali Airport
🤝 Meet & greet
🚗 Private transfer to Kuta hotel
🏨 Check-in
🏖️ Relax & explore nearby beach
🛍️ Evening free for shopping & cafés

🚐 Transfer: Private`
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
      title: 'Handara Gate + Tanah Lot',
      description: `🍳 Breakfast
🚗 Private tour

Visit:
🚪 Handara Gate photo stop
🏔️ Scenic mountain views
🛕 Tanah Lot Temple
🌅 Sunset at Tanah Lot

🚐 Tour Type: Private`
    },
    {
      day: 5,
      title: 'Kintamani + Ubud Tour',
      description: `🍳 Breakfast
🏨 Check-out & transfer to Ubud villa

Visit:
🌋 Kintamani Volcano View
☕ Coffee Plantation
🌾 Tegalalang Rice Terrace
💦 Tegenungan Waterfall
🌴 Bali Swing

🏡 Check-in Private Pool Villa
🥞 Floating breakfast arranged

🚐 Tour Type: Private`
    },
    {
      day: 6,
      title: 'ATV Ride + Spa Day',
      description: `🍳 Breakfast
🏍️ ATV Tandem Ride
🌿 Jungle track adventure
💆 60 min Balinese massage
🌙 Evening leisure

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
    'Daily breakfast',
    'Floating breakfast in Ubud',
    'All private tours',
    'All entry tickets',
    'Water sports (Parasailing, Jet Ski, Banana Boat)',
    'Nusa Penida tour',
    'ATV ride',
    '60 min Balinese Spa session',
    'Bali Swing',
    'Uluwatu Temple + Kecak Fire Dance',
    'Handara Gate + Tanah Lot',
    'Kintamani + Coffee Plantation',
    'All transfers',
    'Driver & vehicle',
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
  category: 'Wellness',
  brochureUrl: '/brochures/bali-34000.pdf',

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

    const result = await Package.create(baliSpaPackage);
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
