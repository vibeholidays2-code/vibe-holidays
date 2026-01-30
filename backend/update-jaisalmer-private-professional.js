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
    console.log('📝 Updating Jaisalmer Private Desert Tour with professional formatting...\n');

    // Find the ₹15,000 package
    const privatePackage = await Package.findOne({ 
      price: 15000, 
      category: 'Jaisalmer' 
    });

    if (!privatePackage) {
      console.error('❌ Jaisalmer Private Desert Tour package not found!');
      process.exit(1);
    }

    // Update with professional formatting and emojis
    const updatedData = {
      name: 'Jaisalmer Private Desert Tour',
      destination: 'Jaisalmer, Rajasthan',
      duration: 3,
      price: 15000,
      description: '✨ Experience the ultimate Jaisalmer desert adventure with our premium private tour. Stay at Gujarat Capital Resort in Swiss Luxury Tents at Sam Sand Dunes. Enjoy exclusive camel safari, jeep safari, traditional folk performances, and visit the historic Tanot Mata Temple & Longewala Border.',
      itinerary: [
        '🌅 Day 1 – Arrival & Desert Camp Experience\n\n🚌 Arrival at Jaisalmer Bus Station\n🏛️ Morning Sightseeing: Bada Bagh (Royal Cenotaphs) • Vyas Chhatri • Gadisar Lake\n🏜️ Drive to Sam Sand Dunes\n🏕️ Check-in at Desert Camp (2:00 PM)\n☕ Welcome Tea & Snacks\n\n🌄 Evening Activities:\n🐪 Camel Safari across golden dunes\n🚙 Thrilling Jeep Safari\n🌅 Sunset Point at Sand Dunes\n\n🎭 Night Entertainment:\n💃 Rajasthani Folk Music & Dance\n🔥 Bonfire under the stars\n🎵 DJ Party\n🍽️ Pure Vegetarian Dinner\n⛺ Overnight in Swiss Luxury Tent',
        
        '🇮🇳 Day 2 – Tanot Mata & Longewala Border\n\n🥐 Breakfast at Camp\n🚗 Full-Day Border Excursion:\n🙏 Tanot Mata Temple (Historic Temple)\n🪖 Longewala Border (1971 War Memorial)\n🛣️ Scenic Desert Highway Drive\n\n🌆 Evening:\n🏕️ Return to Camp\n⏰ Leisure Time\n🍽️ Pure Vegetarian Dinner\n⛺ Overnight in Swiss Luxury Tent',
        
        '🏰 Day 3 – Golden City Tour & Departure\n\n🥐 Breakfast at Camp\n🧳 Check-out\n\n🏛️ Jaisalmer City Sightseeing:\n🏰 Golden Fort (Sonar Quila) - UNESCO World Heritage Site\n🏯 Patwon Ki Haveli - Intricate Architecture\n🏯 Salim Singh Ki Haveli - Historic Mansion\n🏯 Nathmal Ki Haveli - Carved Masterpiece\n🛍️ Local Market Shopping\n\n🚌 Drop at Jaisalmer Bus Station\n🌙 Overnight Sleeper Bus to Ahmedabad\n✨ Tour Ends with Golden Desert Memories'
      ],
      inclusions: [
        '🚌 Ahmedabad ⇄ Jaisalmer Sleeper Bus (Round Trip)',
        '🏕️ 2 Nights at Gujarat Capital Resort, Sam Sand Dunes',
        '⛺ Swiss Luxury Tent Accommodation',
        '🍽️ Daily Breakfast & Dinner (Pure Vegetarian)',
        '🐪 Camel Safari Experience',
        '🚙 Jeep Safari Adventure',
        '💃 Rajasthani Folk Music & Dance Performance',
        '🔥 Bonfire & DJ Party',
        '🙏 Tanot Mata Temple Visit',
        '🇮🇳 Longewala Border Tour',
        '🏰 All City Sightseeing (Fort & Havelis)',
        '🛍️ Local Market Visit',
        '💰 GST Included',
        '👨‍✈️ Professional Tour Assistance'
      ],
      exclusions: [
        '🍴 Lunch (Not Included)',
        '💳 Personal Expenses',
        '📸 Monument Entry Fees & Camera Charges',
        '🛍️ Shopping & Souvenirs',
        '❌ Anything Not Mentioned in Inclusions'
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

    console.log('✅ Jaisalmer Private Desert Tour updated with professional formatting!\n');
    console.log('📋 Updated with:');
    console.log('   ✨ Professional emojis for each activity');
    console.log('   📝 Well-organized day-by-day breakdown');
    console.log('   🎯 Clear sections for morning, evening, and night activities');
    console.log('   🖼️ Your custom Jaisalmer cover photo');
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating package:', error);
    process.exit(1);
  }
}

updateJaisalmerPrivateTour();
