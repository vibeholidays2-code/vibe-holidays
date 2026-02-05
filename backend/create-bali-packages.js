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

// Bali package templates based on your PDFs
const baliPackages = [
  {
    name: 'Bali Budget Package',
    destination: 'Bali, Indonesia',
    duration: 5,
    price: 25000,
    description: 'Experience the magic of Bali with our budget-friendly package. Perfect for travelers looking to explore Bali\'s beautiful beaches, temples, and culture without breaking the bank.',
    itinerary: [
      'Day 1: Arrival in Bali - Airport pickup and hotel check-in',
      'Day 2: Ubud Tour - Visit Monkey Forest, Tegalalang Rice Terraces, and Ubud Palace',
      'Day 3: Water Sports at Tanjung Benoa - Banana boat, parasailing, and jet ski',
      'Day 4: Tanah Lot Temple - Sunset tour and traditional Kecak dance',
      'Day 5: Departure - Hotel checkout and airport drop-off'
    ],
    inclusions: [
      'Round-trip airport transfers',
      '4 nights accommodation in 3-star hotel',
      'Daily breakfast',
      'All sightseeing tours as per itinerary',
      'English-speaking guide',
      'All entrance fees'
    ],
    exclusions: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Lunch and dinner',
      'Personal expenses',
      'Tips and gratuities'
    ],
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    featured: true,
    active: true,
    category: 'Bali',
    brochureUrl: 'http://localhost:5000/brochures/bali-budget-25000.pdf'
  },
  {
    name: 'Bali Standard Package',
    destination: 'Bali, Indonesia',
    duration: 6,
    price: 27000,
    description: 'Discover Bali with our standard package offering comfortable accommodations and comprehensive tours. Enjoy the perfect balance of adventure, relaxation, and cultural experiences.',
    itinerary: [
      'Day 1: Arrival in Bali - VIP airport pickup and hotel check-in',
      'Day 2: Ubud Cultural Tour - Monkey Forest, Rice Terraces, Coffee Plantation',
      'Day 3: Water Sports Adventure - Full day at Tanjung Benoa with water activities',
      'Day 4: Kintamani Volcano Tour - Visit Mount Batur and hot springs',
      'Day 5: Beach Day - Relax at Seminyak Beach with optional spa',
      'Day 6: Departure - Hotel checkout and airport drop-off'
    ],
    inclusions: [
      'Round-trip airport transfers with AC vehicle',
      '5 nights accommodation in 4-star hotel',
      'Daily breakfast and 2 dinners',
      'All sightseeing tours as per itinerary',
      'Professional English-speaking guide',
      'All entrance fees and parking',
      'Mineral water during tours'
    ],
    exclusions: [
      'International flights',
      'Visa fees (VOA available)',
      'Travel insurance',
      'Lunches (except mentioned)',
      'Personal expenses and shopping',
      'Optional activities',
      'Tips and gratuities'
    ],
    images: [
      'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=800',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400',
    featured: true,
    active: true,
    category: 'Bali',
    brochureUrl: 'http://localhost:5000/brochures/bali-standard-27000.pdf'
  },
  {
    name: 'Bali Deluxe Package',
    destination: 'Bali, Indonesia',
    duration: 7,
    price: 30000,
    description: 'Indulge in luxury with our deluxe Bali package. Stay in premium hotels, enjoy exclusive experiences, and explore the best of Bali in style and comfort.',
    itinerary: [
      'Day 1: Arrival in Bali - Luxury airport pickup and 5-star hotel check-in',
      'Day 2: Ubud Premium Tour - Private guide, Monkey Forest, Rice Terraces, Spa',
      'Day 3: Water Sports & Beach Club - VIP water activities and beach club access',
      'Day 4: Nusa Penida Island Tour - Private boat tour to stunning beaches',
      'Day 5: Kintamani & Spa Day - Volcano tour followed by luxury spa treatment',
      'Day 6: Seminyak Shopping & Sunset - Beach clubs and fine dining',
      'Day 7: Departure - Hotel checkout and airport drop-off'
    ],
    inclusions: [
      'Private airport transfers in luxury vehicle',
      '6 nights accommodation in 5-star hotel',
      'Daily breakfast, 3 lunches, and 3 dinners',
      'All sightseeing tours with private guide',
      'Professional photographer for one day',
      'All entrance fees and VIP access',
      'One full-body spa treatment',
      'Welcome drink and fruit basket'
    ],
    exclusions: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Additional meals not mentioned',
      'Personal shopping',
      'Optional premium activities',
      'Tips (recommended)'
    ],
    images: [
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
      'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400',
    featured: true,
    active: true,
    category: 'Bali',
    brochureUrl: 'http://localhost:5000/brochures/bali-deluxe-30000.pdf'
  },
  {
    name: 'Bali Premium Luxury Package',
    destination: 'Bali, Indonesia',
    duration: 8,
    price: 35000,
    description: 'Experience the ultimate Bali luxury with our premium package. Enjoy world-class accommodations, exclusive experiences, private tours, and VIP treatment throughout your journey.',
    itinerary: [
      'Day 1: Arrival in Bali - VIP airport service and luxury villa check-in',
      'Day 2: Private Ubud Experience - Personal guide, cultural immersion, gourmet lunch',
      'Day 3: Exclusive Water Sports - Private yacht charter and water activities',
      'Day 4: Nusa Penida VIP Tour - Private speedboat and exclusive beach access',
      'Day 5: Helicopter Tour - Aerial view of Bali followed by spa and wellness',
      'Day 6: Cooking Class & Fine Dining - Learn Balinese cuisine with celebrity chef',
      'Day 7: Beach Villa Day - Private pool villa with butler service',
      'Day 8: Departure - VIP airport service and lounge access'
    ],
    inclusions: [
      'VIP airport meet & greet with fast-track service',
      '7 nights in luxury private villa with pool',
      'All meals included (breakfast, lunch, dinner)',
      'Private tours with luxury vehicles',
      'Personal butler and concierge service',
      'Helicopter tour over Bali',
      'Daily spa and wellness treatments',
      'Private yacht charter for one day',
      'Professional photography package',
      'All entrance fees and VIP access',
      'Welcome champagne and luxury amenities'
    ],
    exclusions: [
      'International business class flights (can be arranged)',
      'Visa fees',
      'Premium travel insurance',
      'Personal shopping and souvenirs',
      'Additional premium experiences',
      'Gratuities (at your discretion)'
    ],
    images: [
      'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=400',
    featured: true,
    active: true,
    category: 'Bali',
    brochureUrl: 'http://localhost:5000/brochures/bali-premium-35000.pdf'
  }
];

async function createPackages() {
  try {
    console.log('🏝️  Creating Bali Packages...\n');

    // Clear existing Bali packages (optional)
    const deleteResult = await Package.deleteMany({ destination: 'Bali, Indonesia' });
    console.log(`🗑️  Removed ${deleteResult.deletedCount} existing Bali packages\n`);

    // Create new packages
    for (const pkg of baliPackages) {
      const newPackage = new Package(pkg);
      await newPackage.save();
      console.log(`✅ Created: ${pkg.name} - ₹${pkg.price}`);
    }

    console.log('\n🎉 All Bali packages created successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Bali Budget Package: ₹25,000 (5 days)`);
    console.log(`   - Bali Standard Package: ₹27,000 (6 days)`);
    console.log(`   - Bali Deluxe Package: ₹30,000 (7 days)`);
    console.log(`   - Bali Premium Luxury Package: ₹35,000 (8 days)`);
    console.log('\n🌐 View them at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating packages:', error);
    process.exit(1);
  }
}

createPackages();
