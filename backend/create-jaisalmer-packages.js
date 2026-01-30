const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

// Jaisalmer package templates based on your PDFs
const jaisalmerPackages = [
  {
    name: 'Jaisalmer Desert Group Tour',
    destination: 'Jaisalmer, Rajasthan',
    duration: 3,
    price: 8500,
    description: 'Experience the magic of the Thar Desert with our group tour package. Explore the Golden City of Jaisalmer, enjoy camel safari, desert camping, and witness stunning sunsets over the sand dunes.',
    itinerary: [
      'Day 1: Arrival in Jaisalmer - Hotel check-in and Jaisalmer Fort visit',
      'Day 2: Desert Safari - Camel ride, sand dunes, sunset, cultural program, and overnight camping',
      'Day 3: Departure - Sunrise at desert, breakfast, and drop-off'
    ],
    inclusions: [
      'Pickup and drop from Jaisalmer railway station/bus stand',
      '2 nights accommodation (1 night hotel + 1 night desert camp)',
      'Daily breakfast and dinner',
      'Jaisalmer Fort guided tour',
      'Camel safari in Thar Desert',
      'Desert camping with cultural program',
      'Bonfire and Rajasthani folk dance',
      'All transportation in AC vehicle'
    ],
    exclusions: [
      'Train/flight tickets to Jaisalmer',
      'Lunch',
      'Entry fees to monuments',
      'Personal expenses',
      'Tips and gratuities',
      'Anything not mentioned in inclusions'
    ],
    images: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80', // Jaisalmer fort
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80', // Desert camel
      'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1200&q=80', // Desert sunset
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80', // Jaisalmer city
    ],
    thumbnail: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80',
    featured: true,
    active: true,
    category: 'Jaisalmer',
    brochureUrl: 'http://localhost:5000/brochures/jaisalmer-group-tour.pdf'
  },
  {
    name: 'Jaisalmer Private Desert Tour',
    destination: 'Jaisalmer, Rajasthan',
    duration: 3,
    price: 15000,
    description: 'Enjoy an exclusive private tour of Jaisalmer with personalized service. Experience luxury desert camping, private camel safari, and explore the Golden City at your own pace with a dedicated guide.',
    itinerary: [
      'Day 1: Arrival in Jaisalmer - Private pickup, luxury hotel check-in, and Jaisalmer Fort private tour',
      'Day 2: Private Desert Experience - Exclusive camel safari, luxury desert camp, private cultural show, and gourmet dinner under stars',
      'Day 3: Departure - Sunrise breakfast, Patwon Ki Haveli visit, and private drop-off'
    ],
    inclusions: [
      'Private pickup and drop from Jaisalmer railway station/airport',
      '2 nights accommodation (1 night luxury hotel + 1 night premium desert camp)',
      'All meals (breakfast, lunch, dinner)',
      'Private guide for Jaisalmer city tour',
      'Exclusive private camel safari',
      'Luxury desert camping with attached bathroom',
      'Private cultural program and bonfire',
      'Patwon Ki Haveli and Gadisar Lake visit',
      'All monument entry fees',
      'Private AC vehicle throughout'
    ],
    exclusions: [
      'Train/flight tickets to Jaisalmer',
      'Travel insurance',
      'Personal shopping',
      'Tips and gratuities',
      'Anything not mentioned in inclusions'
    ],
    images: [
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80', // Luxury desert camel
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80', // Jaisalmer fort
      'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1200&q=80', // Desert luxury
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80', // Jaisalmer architecture
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
    featured: true,
    active: true,
    category: 'Jaisalmer',
    brochureUrl: 'http://localhost:5000/brochures/jaisalmer-private-tour.pdf'
  }
];

async function createPackages() {
  try {
    console.log('🏜️  Creating Jaisalmer Packages...\n');

    // Clear existing Jaisalmer packages (optional)
    const deleteResult = await Package.deleteMany({ destination: 'Jaisalmer, Rajasthan' });
    console.log(`🗑️  Removed ${deleteResult.deletedCount} existing Jaisalmer packages\n`);

    // Create new packages
    for (const pkg of jaisalmerPackages) {
      const newPackage = new Package(pkg);
      await newPackage.save();
      console.log(`✅ Created: ${pkg.name} - ₹${pkg.price.toLocaleString()}`);
    }

    console.log('\n🎉 All Jaisalmer packages created successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Jaisalmer Desert Group Tour: ₹8,500 (3 days)`);
    console.log(`   - Jaisalmer Private Desert Tour: ₹15,000 (3 days)`);
    console.log('\n🌐 View them at: http://localhost:5173/packages');
    console.log('\n💡 Tip: Copy your PDF files to backend/brochures/ folder:');
    console.log('   - Rename "✨JAISALMER DESERT GROUP TOUR.pdf" → "jaisalmer-group-tour.pdf"');
    console.log('   - Rename "✨Jaisalmer ✨PRIVATE TOUR✨🌟.pdf" → "jaisalmer-private-tour.pdf"');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating packages:', error);
    process.exit(1);
  }
}

createPackages();
