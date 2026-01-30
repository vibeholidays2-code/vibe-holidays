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
    console.log('📝 Updating Jaisalmer Private Desert Tour with clean bullet format...\n');

    // Find the ₹15,000 package
    const privatePackage = await Package.findOne({ 
      price: 15000, 
      category: 'Jaisalmer' 
    });

    if (!privatePackage) {
      console.error('❌ Jaisalmer Private Desert Tour package not found!');
      process.exit(1);
    }

    // Update with clean bullet-point format
    const updatedData = {
      name: 'Jaisalmer Private Desert Tour',
      destination: 'Jaisalmer, Rajasthan',
      duration: 3,
      price: 15000,
      description: 'Experience the ultimate Jaisalmer desert adventure with our premium private tour. Stay at Gujarat Capital Resort in Swiss Luxury Tents at Sam Sand Dunes. Enjoy exclusive camel safari, jeep safari, traditional folk performances, and visit the historic Tanot Mata Temple & Longewala Border.',
      itinerary: [
        'Day 1 – Arrival in Jaisalmer | City Sightseeing + Desert Camp\n\n🚌 Arrival at Jaisalmer Bus Station\n🚗 Local Sightseeing (Pre-Lunch / Light):\n🌳 Bada Bagh – Royal Cenotaphs\n🏛️ Vyas Chhatri\n🌅 Gadisar Lake (Photo Stop)\n➡️ Drive towards Sam Sand Dunes\n⏰ Check-in at Desert Camp – 2:00 PM\n☕ Welcome Tea & Snacks\n\n🌄 Evening Desert Experience\n🐪 Camel Safari\n🚙 Jeep Safari\n🌅 Sunset Point at Sand Dunes\n\n🎶 Evening Entertainment\n💃🕺 Rajasthani Folk Music & Dance\n🔥 Camp Fire\n🎧 DJ Party\n🍽️ Pure Veg Dinner\n🌙 Overnight Stay at Swiss Luxury Tent ⛺',
        
        'Day 2 – Tanot Mata & Longewala Border Tour\n\n🥪 Morning Breakfast\n🚙 Full-Day Excursion:\n🙏 Tanot Mata Temple\n🇮🇳 Longewala Border\n🛣️ Desert Highway Experience\n⬅️ Return to camp by evening\n🕰️ Leisure Time\n🍽️ Pure Veg Dinner\n🌙 Overnight Stay at Swiss Luxury Tent ⛺',
        
        'Day 3 – Jaisalmer City Sightseeing | Departure\n\n🥪 Morning Breakfast\n🧳 Check-out from Camp\n\n🏰 City Sightseeing:\n🏰 Jaisalmer Golden Fort (Sonar Quila)\n🏯 Patwon Ki Haveli\n🏯 Salim Singh Ki Haveli\n🏯 Nathmal Ki Haveli\n🛍️ Local Market Shopping\n\n🚌 Drop at Jaisalmer Bus Station\nOvernight Sleeper Bus to Ahmedabad\n✨ Tour Ends with Golden Desert Memories'
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
        'Professional tour assistance'
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

    console.log('✅ Jaisalmer Private Desert Tour updated with clean bullet format!\n');
    console.log('📋 Format matches your reference image');
    console.log('   ✓ Clean bullet points with emojis');
    console.log('   ✓ Organized sections');
    console.log('   ✓ Professional layout');
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating package:', error);
    process.exit(1);
  }
}

updateJaisalmerPrivateTour();
