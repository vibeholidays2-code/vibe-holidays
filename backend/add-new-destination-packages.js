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

// ============================================
// ADD YOUR NEW PACKAGES HERE
// ============================================

const newPackages = [
  // EXAMPLE: Dubai Packages
  {
    name: 'Dubai Shopping Extravaganza',
    destination: 'Dubai, UAE',
    duration: 5,
    price: 45000,
    description: 'Experience the ultimate shopping paradise in Dubai with visits to world-famous malls, traditional souks, and exclusive shopping districts.',
    itinerary: [
      'Day 1: Arrival in Dubai - Airport pickup and hotel check-in',
      'Day 2: Dubai Mall & Burj Khalifa - Shopping and observation deck',
      'Day 3: Gold Souk & Spice Souk - Traditional market experience',
      'Day 4: Mall of Emirates & Ski Dubai - Shopping and snow activities',
      'Day 5: Departure - Hotel checkout and airport drop-off'
    ],
    inclusions: [
      'Round-trip airport transfers',
      '4 nights accommodation in 4-star hotel',
      'Daily breakfast',
      'Dubai Mall shopping tour',
      'Burj Khalifa tickets (124th floor)',
      'Traditional souk guided tour',
      'All transportation'
    ],
    exclusions: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Lunch and dinner',
      'Shopping expenses',
      'Personal expenses'
    ],
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80', // Dubai skyline
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80', // Burj Khalifa
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80', // Dubai Mall
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    featured: true,
    active: true,
    category: 'Dubai'
  },

  // EXAMPLE: Thailand Packages
  {
    name: 'Thailand Beach Paradise',
    destination: 'Phuket & Krabi, Thailand',
    duration: 6,
    price: 32000,
    description: 'Discover the stunning beaches and islands of Thailand with this comprehensive tour covering Phuket and Krabi.',
    itinerary: [
      'Day 1: Arrival in Phuket - Airport pickup and beach resort check-in',
      'Day 2: Phi Phi Islands Tour - Speedboat tour to Maya Bay',
      'Day 3: Phuket City Tour - Old Town, temples, and viewpoints',
      'Day 4: Transfer to Krabi - Railay Beach and rock climbing',
      'Day 5: Four Islands Tour - Island hopping adventure',
      'Day 6: Departure - Hotel checkout and airport drop-off'
    ],
    inclusions: [
      'Round-trip airport transfers',
      '5 nights accommodation (3 nights Phuket, 2 nights Krabi)',
      'Daily breakfast',
      'Phi Phi Islands speedboat tour',
      'Four Islands tour',
      'All entrance fees',
      'English-speaking guide'
    ],
    exclusions: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Lunch and dinner',
      'Water sports activities',
      'Personal expenses'
    ],
    images: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80', // Thailand beach
      'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=1200&q=80', // Phi Phi
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80', // Thailand boat
    ],
    thumbnail: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
    featured: true,
    active: true,
    category: 'Thailand'
  },

  // ADD MORE PACKAGES HERE...
  // Copy the template above and modify for your destinations
];

// ============================================
// SCRIPT EXECUTION
// ============================================

async function addPackages() {
  try {
    console.log('📦 Adding new destination packages...\n');

    if (newPackages.length === 0) {
      console.log('⚠️  No packages to add. Edit the newPackages array above.');
      process.exit(0);
    }

    for (const pkg of newPackages) {
      // Check if package already exists
      const existing = await Package.findOne({ name: pkg.name });
      
      if (existing) {
        console.log(`⚠️  Package already exists: ${pkg.name}`);
        continue;
      }

      const newPackage = new Package(pkg);
      await newPackage.save();
      console.log(`✅ Added: ${pkg.name} - ₹${pkg.price.toLocaleString()} (${pkg.category})`);
    }

    console.log('\n🎉 All packages added successfully!');
    console.log('\n📋 Summary by Category:');
    
    // Show summary
    const allPackages = await Package.find({}, 'name category price').sort({ category: 1, price: 1 });
    const grouped = {};
    
    allPackages.forEach(pkg => {
      const cat = pkg.category || 'Uncategorized';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(pkg);
    });

    Object.keys(grouped).sort().forEach(category => {
      console.log(`\n🏷️  ${category} (${grouped[category].length} packages):`);
      grouped[category].forEach(pkg => {
        console.log(`   - ${pkg.name} (₹${pkg.price.toLocaleString()})`);
      });
    });

    console.log('\n🌐 View all packages at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding packages:', error);
    process.exit(1);
  }
}

addPackages();
