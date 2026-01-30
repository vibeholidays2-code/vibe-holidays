const mongoose = require('mongoose');
require('dotenv').config();

async function updateBali35000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

NIGHT 1-4 – KUTA
🏨 Golden Tulip Jineng Resort, Kuta
🛏️ Deluxe City View Room – 4 Nights
🍽️ Bed & Breakfast

NIGHT 5-6 – UBUD
🏡 Alam Puisi Ubud – PRIVATE POOL VILLA
🛏️ One Bedroom Pool Villa – 2 Nights
🍽️ Bed & Breakfast

💰 PACKAGE PRICE
₹35,000 /- Per Person + Tax

📅 TRAVEL DETAILS
Travel Dates: After 5 January
Number Of Person: 2 Adults
Travel Destination: Bali
No of Days And Night: 6 night / 7 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const itinerary = [
      "🌞 Day 1 – Arrival in Bali | Transfer to Kuta\n\n✈️ Arrival at Ngurah Rai International Airport\n🤝 Meet & greet by local representative\n🚗 Private transfer to hotel in Kuta\n🏨 Check-in & rest\n🛌 Overnight stay at Kuta",
      
      "🛕 Day 2 – Water Sports + Uluwatu & Kecak Dance\n\n🍳 Breakfast at hotel\n\n🌊 Enjoy water sports activities:\n  ✔️ Parasailing\n  ✔️ Jet Ski\n  ✔️ Banana Boat\n\n🛕 Visit Uluwatu Temple\n💃 Experience famous Kecak Dance Show\n🚗 Return to hotel\n🛌 Overnight stay at Kuta",
      
      "🏝️ Day 3 – Nusa Penida West Island Tour\n\n🌅 Early breakfast\n🚤 Speed boat to Nusa Penida\n\n📸 Visit iconic spots:\n  ✔️ Kelingking Beach\n  ✔️ Broken Beach\n  ✔️ Angel's Billabong\n  ✔️ Crystal Bay\n\n🥪 Local snack lunch included\n🚤 Return to Bali mainland\n🛌 Overnight stay at Kuta",
      
      "🛕 Day 4 – Ulun Danu Temple & Handara Gate\n\n🍳 Breakfast at hotel\n🚗 Full day North Bali tour\n🛕 Visit Ulun Danu Beratan Temple\n📸 Stop at famous Handara Gate\n🌿 Scenic mountain & lake views\n🚗 Return to hotel\n🛌 Overnight stay at Kuta",
      
      "🌋 Day 5 – Kintamani + Ubud Village Tour | Transfer to Ubud\n\n🍳 Breakfast & check-out from Kuta\n🚗 Full-day sightseeing:\n🌋 Kintamani – Mt. Batur View\n🛍️ Ubud Village & Market\n💍 Celuk & Mas Villages\n🌾 Tegelalang Rice Terrace\n💦 Tegenungan Waterfall\n🚗 Transfer to Ubud\n🏡 Check-in at Private Pool Villa\n🛌 Overnight stay at Ubud – Private Pool Villa",
      
      "🌴 Day 6 – ATV Ride + Bali Swing\n\n🍳 Breakfast at villa\n🏍️ ATV Ride (1 Bike for 2 Persons)\n🌴 Swing by My Swings\n💦 Free time to enjoy private pool\n🚗 Return to villa\n🛌 Overnight stay at Ubud – Private Pool Villa",
      
      "✈️ Day 7 – Departure from Bali\n\n🍳 Breakfast & check-out\n🚗 Private transfer from Ubud to Airport\n✈️ Departure with unforgettable Bali memories"
    ];

    const inclusions = [
      "6 Nights accommodation (4★ Hotel + Private Pool Villa)",
      "Daily Breakfast",
      "All sightseeing & tours as per itinerary",
      "Water sports & adventure activities",
      "Private airport & inter-hotel transfers",
      "English-speaking driver",
      "All local taxes (Except GST & TCS)"
    ];

    const exclusions = [
      "Airfare",
      "Visa charges",
      "Lunch & Dinner",
      "Personal expenses",
      "Travel insurance",
      "Anything not mentioned above",
      "GST & TCS extra as applicable"
    ];

    const result = await packagesCollection.updateOne(
      { 
        destination: 'Bali, Indonesia',
        price: 35000 
      },
      {
        $set: {
          description: description,
          itinerary: itinerary,
          inclusions: inclusions,
          exclusions: exclusions,
          duration: 7
        },
        $unset: {
          accommodation: "",
          highlights: "",
          cancellationPolicy: ""
        }
      }
    );

    console.log('\n✅ Bali ₹35,000 package updated successfully!');
    console.log('Modified count:', result.modifiedCount);
    console.log('\nPackage Details:');
    console.log('- Price: ₹35,000');
    console.log('- Duration: 7 days');
    console.log('- Itinerary days:', itinerary.length);
    console.log('- Inclusions:', inclusions.length);
    console.log('- Exclusions:', exclusions.length);
    console.log('- Description length:', description.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateBali35000();
