const mongoose = require('mongoose');
require('dotenv').config();

async function updateBali27000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

NIGHT 1-4 – KUTA
🏨 Eden Hotel Kuta
🛏️ Eden Room – 4 Nights
🍽️ Bed & Breakfast

NIGHT 5-6 – UBUD
🏡 Bumi Linggah Villas, Ubud – PRIVATE POOL VILLA
🛏️ One Bedroom Sapphire Villa – 2 Nights
🍽️ Bed & Breakfast

💰 PACKAGE PRICE
₹27,000 /- Per Person + Tax

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
• Less than 2 weeks / No Show: 100% Non-Refundable

⭐ WHY CHOOSE VIBES HOLIDAYS?

🌍 Trusted & Experienced
Reliable planning with verified hotels and partners.

🎯 Customized Packages
Itineraries designed exactly as per your needs.

🚗 Private Clean Transport
Comfortable vehicles with professional drivers.

💰 Best Price Guarantee
Affordable rates with transparent pricing.

📞 24×7 Support
Always available on call/WhatsApp during the trip

📍 VIBES HOLIDAYS – CONTACT
📞 +91 7048505128
📧 vibesholidays.9@gmail.com
📍 E-block, 510, PNTC, 5, Times Of India Press Rd, Mahakali Society, Vejalpur, Ahmedabad, Gujarat 380015`;

    const itinerary = [
      "🌞 Day 1 – Arrival in Bali | Transfer to Kuta\n\n✈️ Arrival at Ngurah Rai International Airport\n🤝 Meet & greet by local representative\n🚗 Private transfer to hotel in Kuta\n🏨 Check-in & rest\n🛌 Overnight stay at Kuta",
      
      "🌊 Day 2 – Water Sports + Uluwatu Tour\n\n🍳 Breakfast at hotel\n\n🌊 Enjoy thrilling water sports:\n  ✔️ Jet Ski\n  ✔️ Banana Boat\n  ✔️ Parasailing\n\n🏖️ Visit Padang Padang Beach\n🛕 Visit Uluwatu Temple\n🌊 Enjoy scenic coastal views\n🚗 Return to hotel\n🛌 Overnight stay at Kuta",
      
      "🏝️ Day 3 – Nusa Penida West Island Tour\n\n🌅 Early breakfast\n🚤 Speed boat to Nusa Penida\n\n📸 Visit iconic spots:\n  ✔️ Kelingking Beach\n  ✔️ Broken Beach\n  ✔️ Angel's Billabong\n  ✔️ Crystal Bay\n\n🥪 Local snack lunch included\n🚤 Return to Bali mainland\n🛌 Overnight stay at Kuta",
      
      "🛕 Day 4 – Ulun Danu Temple & Handara Gate\n\n🍳 Breakfast at hotel\n🚗 Full day North Bali tour\n🛕 Visit Ulun Danu Beratan Temple\n📸 Stop at famous Handara Gate\n🌿 Scenic mountain & lake views\n🚗 Return to hotel\n🛌 Overnight stay at Kuta",
      
      "🏍️ Day 5 – ATV Ride + Swing | Transfer to Ubud\n\n🍳 Breakfast & check-out\n🏍️ ATV Ride (1 Bike for 2 Persons)\n🌴 Experience Bali Swing (My Swings)\n🚗 Transfer to Ubud\n🏨 Check-in at Private Pool Villa\n🛌 Overnight stay at Ubud",
      
      "🌴 Day 6 – Free Day at Leisure\n\n🍳 Breakfast at hotel\n🛍️ Explore Ubud market\n☕ Cafe hopping / Spa / Relax\n🌿 Enjoy nature & peaceful vibes\n🛌 Overnight stay at Ubud",
      
      "✈️ Day 7 – Departure from Bali\n\n🍳 Breakfast & check-out\n🚗 Private transfer from Ubud to Airport\n✈️ Departure with beautiful memories"
    ];

    const inclusions = [
      "6 Nights accommodation in 4★ hotels",
      "Daily Breakfast",
      "All sightseeing & tours as per itinerary",
      "Water sports & adventure activities",
      "Private airport & hotel transfers",
      "English-speaking driver",
      "Local taxes (Except GST)"
    ];

    const exclusions = [
      "Airfare",
      "Visa charges",
      "Lunch & Dinner",
      "Personal expenses",
      "Travel insurance",
      "Anything not mentioned above",
      "GST + TCS extra as applicable"
    ];

    const result = await packagesCollection.updateOne(
      { 
        destination: 'Bali, Indonesia',
        price: 27000 
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

    console.log('\n✅ Bali ₹27,000 package updated successfully!');
    console.log('Modified count:', result.modifiedCount);
    console.log('\nPackage Details:');
    console.log('- Price: ₹27,000');
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

updateBali27000();
