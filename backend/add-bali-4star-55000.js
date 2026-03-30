const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const bali4StarPackage = {
  name: 'Bali 4★ Luxury',
  destination: 'Bali, Indonesia',
  duration: 7,
  price: 55000,
  description: `Experience premium luxury in Bali with stays at Fairfield by Marriott and a private pool villa in Ubud. This 4-star luxury package combines thrilling adventures, cultural experiences, and romantic relaxation. Enjoy water sports, visit iconic temples, explore Safari Park, and unwind in your private villa with complimentary floating breakfast.

Perfect for couples seeking a premium Bali experience with all tours on a private basis and no hidden charges.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Bali + Finns Beach Club',
      description: `🛬 Arrival at Bali Airport
🤝 Meet & greet
🚗 Private transfer to Kuta
🏖️ Visit Finns Beach Club
🌅 Relax by the beach
🌇 Sunset experience
🏨 Hotel check-in

🚐 Transfer & Tour: Private`
    },
    {
      day: 2,
      title: 'Water Sports + Uluwatu + Kecak',
      description: `🍳 Breakfast
🚗 Private pickup

🌊 Water Sports:
🪂 Parasailing
🏄 Jet Ski
🍌 Banana Boat

🌅 Evening:
🛕 Uluwatu Temple
🌄 Sunset view
🔥 Kecak Fire Dance

🚐 Tour Type: Private`
    },
    {
      day: 3,
      title: 'Nusa Penida East Island Tour',
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
      title: 'Bedugul + Handara + Tanah Lot',
      description: `🍳 Breakfast
🚗 Full-day private tour

Visit:
🛕 Ulundanu Temple
🚪 Handara Gate
🏞️ Scenic lake views
🛕 Tanah Lot Temple
🌅 Sunset at Tanah Lot

🚐 Tour Type: Private`
    },
    {
      day: 5,
      title: 'Safari Park + Ubud Villa',
      description: `🍳 Breakfast
🏨 Checkout Kuta

Visit:
🦁 Bali Safari Park
🎫 Jungle Hopper Pass
🎭 Animal shows

🏡 Check-in Private Pool Villa Ubud
🥞 Floating breakfast arranged

🚐 Tour Type: Private`
    },
    {
      day: 6,
      title: 'ATV + Swing Experience',
      description: `🍳 Breakfast
🚗 Private pickup

Activities:
🏍️ ATV tandem ride
🌾 Aloha Swing
📸 Photo spots

🏡 Return villa & relax

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
    '6 Nights 4★ hotel stay (4N Kuta + 2N Ubud)',
    'Daily breakfast',
    'Floating breakfast in Ubud',
    'All private tours',
    'All entry tickets',
    'Water sports (Parasailing, Jet Ski, Banana Boat)',
    'Nusa Penida tour',
    'Bali Safari Park (Jungle Hopper Pass)',
    'ATV ride',
    'Bali swing (Aloha Swing)',
    'All transfers',
    'Driver & vehicle',
    'Parking & toll',
    'Finns Beach Club visit',
    'Uluwatu Temple + Kecak Fire Dance'
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
  category: 'Luxury',
  brochureUrl: '/brochures/bali-55000.pdf',

  hotelDetails: [
    {
      name: 'Fairfield by Marriott Bali Legian',
      location: 'Kuta',
      nights: 4,
      rating: 4,
      roomType: 'Studio Room',
      amenities: ['Prime Location', 'Near Beach & Nightlife', 'Daily Breakfast']
    },
    {
      name: 'Dwaraka The Royal Villas',
      location: 'Ubud',
      nights: 2,
      rating: 4,
      roomType: '1 Bedroom Private Pool Villa (Garden View)',
      amenities: ['Daily Breakfast', 'Floating Breakfast Complimentary', 'Perfect Romantic Stay']
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

    const result = await Package.create(bali4StarPackage);
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
