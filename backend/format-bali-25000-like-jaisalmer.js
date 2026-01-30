const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  duration: Number,
  price: Number,
  description: String,
  thumbnail: String,
  images: [String],
  category: String,
  featured: Boolean,
  brochureUrl: String,
  itinerary: [
    {
      day: Number,
      title: String,
      description: String,
      activities: [String],
    },
  ],
  inclusions: [String],
  exclusions: [String],
  accommodation: [
    {
      name: String,
      location: String,
      roomType: String,
      nights: Number,
      mealPlan: String,
    },
  ],
  highlights: [String],
  cancellationPolicy: String,
});

const Package = mongoose.model('Package', packageSchema);

async function formatBali25000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const pkg = await Package.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    });

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log(`Updating: ${pkg.name}`);

    // Update with emoji-formatted activities like Jaisalmer
    pkg.itinerary = [
      {
        day: 1,
        title: 'Arrival in Bali – Transfer to Kuta',
        description: '',
        activities: [
          '✈️ Arrival at Ngurah Rai International Airport',
          '🤝 Meet & greet by local representative',
          '🚗 Private transfer to hotel in Kuta',
          '🏨 Check-in & rest',
          '🛌 Overnight stay at Kuta',
        ],
      },
      {
        day: 2,
        title: 'Water Sports + Uluwatu Tour',
        description: '',
        activities: [
          '🍳 Breakfast at hotel',
          '🌊 Enjoy thrilling water sports:',
          '  ✔️ Jet Ski',
          '  ✔️ Banana Boat',
          '  ✔️ Parasailing',
          '🏖️ Visit Padang Padang Beach',
          '🛕 Visit Uluwatu Temple',
          '🌅 Enjoy scenic coastal views',
          '🚗 Return to hotel',
          '🛌 Overnight stay at Kuta',
        ],
      },
      {
        day: 3,
        title: 'Nusa Penida West Island Tour',
        description: '',
        activities: [
          '🌅 Early breakfast',
          '🚤 Speed boat to Nusa Penida',
          '📸 Visit iconic spots:',
          '  ✔️ Kelingking Beach (T-Rex cliff)',
          '  ✔️ Broken Beach',
          '  ✔️ Angel\'s Billabong',
          '  ✔️ Crystal Bay',
          '🥪 Local snack lunch included',
          '🚤 Return to Bali mainland',
          '🛌 Overnight stay at Kuta',
        ],
      },
      {
        day: 4,
        title: 'Ulun Danu Temple & Handara Gate',
        description: '',
        activities: [
          '🍳 Breakfast at hotel',
          '🚗 Full day North Bali tour',
          '🛕 Visit Ulun Danu Beratan Temple',
          '📸 Stop at famous Handara Gate',
          '🏞️ Scenic mountain & lake views',
          '🚗 Return to hotel',
          '🛌 Overnight stay at Kuta',
        ],
      },
      {
        day: 5,
        title: 'ATV Ride + Swing | Transfer to Ubud',
        description: '',
        activities: [
          '🍳 Breakfast & check-out',
          '🏍️ ATV Ride (1 Bike for 2 Persons)',
          '🌴 Experience Bali Swing (My Swings)',
          '🚗 Transfer to Ubud',
          '🏨 Check-in at hotel',
          '🛌 Overnight stay at Ubud',
        ],
      },
      {
        day: 6,
        title: 'Free Day at Leisure',
        description: '',
        activities: [
          '🍳 Breakfast at hotel',
          '🛍️ Explore Ubud market',
          '☕ Cafe hopping / Spa / Relax',
          '🌿 Enjoy nature & peaceful vibes',
          '🛌 Overnight stay at Ubud',
        ],
      },
      {
        day: 7,
        title: 'Departure from Bali',
        description: '',
        activities: [
          '🍳 Breakfast & check-out',
          '🚗 Private transfer from Ubud to Airport',
          '✈️ Departure with beautiful memories',
        ],
      },
    ];

    pkg.inclusions = [
      '✔️ 6 Nights accommodation in 4★ hotels',
      '✔️ Daily Breakfast',
      '✔️ All sightseeing & tours as per itinerary',
      '✔️ Water sports & adventure activities',
      '✔️ Private airport & hotel transfers',
      '✔️ English-speaking driver',
      '✔️ Local taxes (Except GST)',
    ];

    pkg.exclusions = [
      '✖️ Airfare',
      '✖️ Visa charges',
      '✖️ Lunch & Dinner',
      '✖️ Personal expenses',
      '✖️ Travel insurance',
      '✖️ Anything not mentioned above',
      '✖️ GST + TCS extra as applicable',
    ];

    await pkg.save();

    console.log('\n✅ Bali ₹25,000 package formatted like Jaisalmer!');
    console.log('\nFormatted Itinerary:');
    pkg.itinerary.forEach((day) => {
      console.log(`\nDay ${day.day} – ${day.title}`);
      day.activities.forEach(act => console.log(`  ${act}`));
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

formatBali25000();
