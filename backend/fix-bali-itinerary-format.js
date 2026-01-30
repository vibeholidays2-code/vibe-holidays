const mongoose = require('mongoose');
require('dotenv').config();

async function fixBaliItinerary() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use direct MongoDB operations to ensure proper format
    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const result = await packagesCollection.updateOne(
      { 
        destination: 'Bali, Indonesia',
        price: 25000 
      },
      {
        $set: {
          itinerary: [
            "🌞 Day 1 – Arrival in Bali | Transfer to Kuta\n\n✈️ Arrival at Ngurah Rai International Airport\n🤝 Meet & greet by local representative\n🚗 Private transfer to hotel in Kuta\n🏨 Check-in & rest\n🛌 Overnight stay at Kuta",
            
            "🌊 Day 2 – Water Sports + Uluwatu Tour\n\n🍳 Breakfast at hotel\n\n🌊 Enjoy thrilling water sports:\n  ✔️ Jet Ski\n  ✔️ Banana Boat\n  ✔️ Parasailing\n\n🏖️ Visit Padang Padang Beach\n🛕 Visit Uluwatu Temple\n🌊 Enjoy scenic coastal views\n🚗 Return to hotel\n🛌 Overnight stay at Kuta",
            
            "🏝️ Day 3 – Nusa Penida West Island Tour\n\n🌅 Early breakfast\n🚤 Speed boat to Nusa Penida\n\n📸 Visit iconic spots:\n  ✔️ Kelingking Beach\n  ✔️ Broken Beach\n  ✔️ Angel's Billabong\n  ✔️ Crystal Bay\n\n🥪 Local snack lunch included\n🚤 Return to Bali mainland\n🛌 Overnight stay at Kuta",
            
            "🛕 Day 4 – Ulun Danu Temple & Handara Gate\n\n🍳 Breakfast at hotel\n🚗 Full day North Bali tour\n🛕 Visit Ulun Danu Beratan Temple\n📸 Stop at famous Handara Gate\n🌿 Scenic mountain & lake views\n🚗 Return to hotel\n🛌 Overnight stay at Kuta",
            
            "🏍️ Day 5 – ATV Ride + Swing | Transfer to Ubud\n\n🍳 Breakfast & check-out\n🏍️ ATV Ride (1 Bike for 2 Persons)\n🌴 Experience Bali Swing (My Swings)\n🚗 Transfer to Ubud\n🏨 Check-in at hotel\n🛌 Overnight stay at Ubud",
            
            "🌴 Day 6 – Free Day at Leisure\n\n🍳 Breakfast at hotel\n🛍️ Explore Ubud market\n☕ Cafe hopping / Spa / Relax\n🌿 Enjoy nature & peaceful vibes\n🛌 Overnight stay at Ubud",
            
            "✈️ Day 7 – Departure from Bali\n\n🍳 Breakfast & check-out\n🚗 Private transfer from Ubud to Airport\n✈️ Departure with beautiful memories"
          ]
        }
      }
    );

    console.log('\n✅ Fixed itinerary format!');
    console.log('Modified count:', result.modifiedCount);

    // Verify the fix
    const pkg = await packagesCollection.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    });

    console.log('\nVerification:');
    console.log('Itinerary type:', Array.isArray(pkg.itinerary) ? 'Array' : typeof pkg.itinerary);
    console.log('Itinerary items:', pkg.itinerary.length);
    console.log('First item type:', typeof pkg.itinerary[0]);
    console.log('\nFirst day preview:');
    console.log(pkg.itinerary[0].substring(0, 150) + '...');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

fixBaliItinerary();
