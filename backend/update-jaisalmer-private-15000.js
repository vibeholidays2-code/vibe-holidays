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

async function updateJaisalmerPrivateTour() {
  try {
    console.log('📝 Updating Jaisalmer Private Desert Tour (₹15,000) with detailed itinerary...\n');

    // Find the ₹15,000 package
    const privatePackage = await Package.findOne({ 
      price: 15000, 
      category: 'Jaisalmer' 
    });

    if (!privatePackage) {
      console.error('❌ Jaisalmer Private Desert Tour package not found!');
      process.exit(1);
    }

    // Update with detailed itinerary
    const updatedData = {
      name: 'Jaisalmer Private Desert Tour',
      destination: 'Jaisalmer, Rajasthan',
      duration: 3, // 2 nights / 3 days
      price: 15000,
      description: 'Experience the ultimate Jaisalmer desert adventure with our premium private tour. Stay at Gujarat Capital Resort in Swiss Luxury Tents at Sam Sand Dunes. Enjoy exclusive camel safari, jeep safari, folk dance, DJ party, and visit the historic Tanot Mata Temple & Longewala Border. Includes comfortable sleeper bus from Ahmedabad and all sightseeing.',
      itinerary: [
        'Day 1 – Arrival | City Sightseeing + Desert Camp: Arrival at Jaisalmer Bus Station → Local Sightseeing: Bada Bagh (Royal Cenotaphs), Vyas Chhatri, Gadisar Lake (Photo Stop) → Drive to Sam Sand Dunes → Check-in at Desert Camp (2:00 PM) → Welcome Tea & Snacks → Evening Desert Experience: Camel Safari, Jeep Safari, Sunset Point at Sand Dunes → Evening Entertainment: Rajasthani Folk Music & Dance, Camp Fire, DJ Party → Pure Veg Dinner → Overnight Stay at Swiss Luxury Tent',
        'Day 2 – Tanot Mata & Longewala Border Tour: Morning Breakfast → Full-Day Excursion: Tanot Mata Temple, Longewala Border, Desert Highway Experience → Return to camp by evening → Leisure Time → Pure Veg Dinner → Overnight Stay at Swiss Luxury Tent',
        'Day 3 – Jaisalmer City Sightseeing | Departure: Morning Breakfast → Check-out from Camp → City Sightseeing: Jaisalmer Golden Fort (Sonar Quila), Patwon Ki Haveli, Salim Singh Ki Haveli, Nathmal Ki Haveli → Local Market Shopping → Drop at Jaisalmer Bus Station → Overnight Sleeper Bus to Ahmedabad → Tour Ends with Golden Desert Memories'
      ],
      inclusions: [
        'Ahmedabad ⇄ Jaisalmer Sleeper Bus (both ways)',
        '2 Nights stay at Gujarat Capital Resort, Sam Sand Dunes',
        'Swiss Luxury Tent accommodation',
        'Daily breakfast & dinner (pure veg)',
        'Camel safari & jeep safari',
        'Rajasthani folk music & dance performance',
        'Camp fire & DJ party',
        'Tanot Mata Temple & Longewala Border tour',
        'All city sightseeing (Golden Fort, Havelis)',
        'Local market visit',
        'GST included',
        'Private tour assistance'
      ],
      exclusions: [
        'Lunch (not included)',
        'Personal expenses',
        'Entry fees / camera charges at monuments',
        'Shopping expenses',
        'Anything not mentioned in inclusions'
      ],
      featured: true,
      active: true,
      category: 'Jaisalmer',
      brochureUrl: 'http://localhost:5000/brochures/jaisalmer-private-tour.pdf',
      images: [
        'http://localhost:5000/uploads/jaisalmer-private-cover.jpg',
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80',
        'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=1200&q=80',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
      ],
      thumbnail: 'http://localhost:5000/uploads/jaisalmer-private-cover.jpg'
    };

    await Package.updateOne({ _id: privatePackage._id }, { $set: updatedData });

    console.log('✅ Jaisalmer Private Desert Tour updated successfully!\n');
    console.log('📋 Updated Details:');
    console.log(`   Name: ${updatedData.name}`);
    console.log(`   Duration: ${updatedData.duration} days (2 nights / 3 days)`);
    console.log(`   Price: ₹${updatedData.price.toLocaleString()} per person`);
    console.log(`   Hotel: Gujarat Capital Resort, Sam Sand Dunes`);
    console.log(`   Cover Photo: Your uploaded Jaisalmer image`);
    console.log(`   Full Itinerary: Day-by-day details included`);
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating package:', error);
    process.exit(1);
  }
}

updateJaisalmerPrivateTour();
