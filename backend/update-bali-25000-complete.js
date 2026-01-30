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

async function updateBali25000() {
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

    console.log(`Found package: ${pkg.name}`);

    // Update package details
    pkg.name = 'Bali Budget Package';
    pkg.duration = 7;
    pkg.description = '6 Nights / 7 Days Bali adventure package with water sports, Nusa Penida tour, ATV ride, Bali Swing, and cultural temple visits. Perfect blend of adventure, culture, and relaxation.';
    
    pkg.highlights = [
      '🌊 Thrilling Water Sports (Jet Ski, Banana Boat, Parasailing)',
      '🏝️ Nusa Penida West Island Tour (Kelingking Beach, Broken Beach, Angel\'s Billabong)',
      '🛕 Uluwatu Temple & Padang Padang Beach',
      '🏞️ Ulun Danu Beratan Temple & Handara Gate',
      '🏍️ ATV Ride Adventure',
      '🌴 Bali Swing Experience',
      '🏨 4★ Hotels in Kuta & Ubud',
      '🍳 Daily Breakfast Included',
      '🚗 Private Airport & Hotel Transfers',
    ];

    pkg.accommodation = [
      {
        name: 'Eden Hotel Kuta',
        location: 'Kuta',
        roomType: 'Eden Room',
        nights: 4,
        mealPlan: 'Bed & Breakfast',
      },
      {
        name: 'Freddies Resort & Villas',
        location: 'Ubud',
        roomType: 'Deluxe Room',
        nights: 2,
        mealPlan: 'Bed & Breakfast',
      },
    ];

    pkg.itinerary = [
      {
        day: 1,
        title: 'Arrival in Bali – Transfer to Kuta',
        description: 'Welcome to the Island of Gods! Arrive at Ngurah Rai International Airport and transfer to your hotel in Kuta.',
        activities: [
          'Arrival at Ngurah Rai International Airport',
          'Meet & greet by local representative',
          'Private transfer to hotel in Kuta',
          'Check-in & rest',
          'Overnight stay at Kuta',
        ],
      },
      {
        day: 2,
        title: 'Water Sports + Uluwatu Tour',
        description: 'Experience thrilling water sports and visit the iconic Uluwatu Temple perched on dramatic cliffs.',
        activities: [
          'Breakfast at hotel',
          'Enjoy thrilling water sports: Jet Ski, Banana Boat, Parasailing',
          'Visit Padang Padang Beach',
          'Visit Uluwatu Temple',
          'Enjoy scenic coastal views',
          'Return to hotel',
          'Overnight stay at Kuta',
        ],
      },
      {
        day: 3,
        title: 'Nusa Penida West Island Tour',
        description: 'Explore the stunning Nusa Penida island with its iconic Instagram-worthy spots and crystal-clear waters.',
        activities: [
          'Early breakfast',
          'Speed boat to Nusa Penida',
          'Visit Kelingking Beach (T-Rex cliff)',
          'Explore Broken Beach',
          'Discover Angel\'s Billabong natural infinity pool',
          'Relax at Crystal Bay',
          'Local snack lunch included',
          'Return to Bali mainland',
          'Overnight stay at Kuta',
        ],
      },
      {
        day: 4,
        title: 'Ulun Danu Temple & Handara Gate',
        description: 'Journey to North Bali to visit the picturesque water temple and the famous Handara Gate.',
        activities: [
          'Breakfast at hotel',
          'Full day North Bali tour',
          'Visit Ulun Danu Beratan Temple (iconic water temple)',
          'Photo stop at famous Handara Gate',
          'Enjoy scenic mountain & lake views',
          'Return to hotel',
          'Overnight stay at Kuta',
        ],
      },
      {
        day: 5,
        title: 'ATV Ride + Swing | Transfer to Ubud',
        description: 'Adventure day with ATV ride through rice fields and jungle, followed by the famous Bali Swing experience.',
        activities: [
          'Breakfast & check-out from Kuta hotel',
          'ATV Ride adventure (1 bike for 2 persons)',
          'Experience Bali Swing (My Swings)',
          'Transfer to Ubud',
          'Check-in at Ubud hotel',
          'Overnight stay at Ubud',
        ],
      },
      {
        day: 6,
        title: 'Free Day at Leisure in Ubud',
        description: 'Enjoy a relaxing day exploring Ubud at your own pace. Visit markets, cafes, or book a spa treatment.',
        activities: [
          'Breakfast at hotel',
          'Free time to explore Ubud market',
          'Optional: Cafe hopping / Spa / Yoga',
          'Enjoy nature & peaceful vibes',
          'Overnight stay at Ubud',
        ],
      },
      {
        day: 7,
        title: 'Departure from Bali',
        description: 'Check out and transfer to the airport with beautiful memories of your Bali adventure.',
        activities: [
          'Breakfast & check-out',
          'Private transfer from Ubud to Airport',
          'Departure with beautiful memories',
        ],
      },
    ];

    pkg.inclusions = [
      '6 Nights accommodation in 4★ hotels (4N Kuta + 2N Ubud)',
      'Daily Breakfast',
      'All sightseeing & tours as per itinerary',
      'Water sports activities (Jet Ski, Banana Boat, Parasailing)',
      'Nusa Penida island tour with speed boat transfers',
      'ATV Ride (1 bike for 2 persons)',
      'Bali Swing experience',
      'Private airport & hotel transfers',
      'English-speaking driver',
      'Local taxes (Except GST)',
    ];

    pkg.exclusions = [
      'Airfare',
      'Visa charges',
      'Lunch & Dinner',
      'Personal expenses',
      'Travel insurance',
      'Tips and gratuities',
      'Anything not mentioned in inclusions',
      'GST + TCS extra as applicable',
    ];

    pkg.cancellationPolicy = `Refund amount is subject to the cancellation date and the departure date:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    await pkg.save();

    console.log('\n✅ Bali ₹25,000 package updated successfully!');
    console.log('\nPackage Details:');
    console.log(`Name: ${pkg.name}`);
    console.log(`Duration: ${pkg.duration} days`);
    console.log(`Price: ₹${pkg.price.toLocaleString()}`);
    console.log(`Highlights: ${pkg.highlights.length} items`);
    console.log(`Itinerary: ${pkg.itinerary.length} days`);
    console.log(`Inclusions: ${pkg.inclusions.length} items`);
    console.log(`Exclusions: ${pkg.exclusions.length} items`);
    console.log(`Accommodation: ${pkg.accommodation.length} hotels`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateBali25000();
