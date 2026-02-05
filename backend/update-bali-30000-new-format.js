const mongoose = require('mongoose');
require('dotenv').config();

async function updateBali30000NewFormat() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

Eden Hotel Kuta
🛏️ Eden Room – 4 Nights – Bed & Breakfast

🏡 Bumi Linggah Villas, Ubud
🏊‍♂️ PRIVATE POOL VILLA
🛏️ One Bedroom Sapphire Villa | 2 Nights | Bed & Breakfast

💰 PACKAGE PRICE
₹30,000 /- Per Person + Tax

📅 TRAVEL DETAILS
Travel Dates: After 5 January
Number Of Person: 2 Adults
Travel Destination: Bali
No of Days And Night: 6 night / 7 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

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
Always available on call/WhatsApp during the trip`;

    const itinerary = [
      "✈️ Day 1 | Arrival in Bali – Transfer to Kuta\n\n• Arrival at Ngurah Rai International Airport\n• Meet & greet by local representative\n• Private transfer to hotel in Kuta\n• Check-in & rest\n\n🛌 Overnight stay at Kuta",
      
      "🛕🌊 DAY 02 | TANAH LOT + ULUWATU + KECAK DANCE\n\n🍽️ Breakfast at hotel\n🚐 Full-day sightseeing tour\n\n🛕 Visit Tanah Lot Temple\n🌅 Scenic coastal views\n🛕 Visit Uluwatu Temple\n💃 Enjoy Kecak Dance Show\n🚗 Return to hotel\n\n🛌 Overnight stay at Kuta",
      
      "🌊 DAY 03 | NUSA PENIDA WEST ISLAND TOUR\n\n🍽️ Early breakfast\n🚤 Speed boat to Nusa Penida\n\n🏝️ Visit iconic spots:\n  ✔️ Kelingking Beach\n  ✔️ Broken Beach\n  ✔️ Angel's Billabong\n  ✔️ Crystal Bay\n\n🍽️ Local snack lunch included\n🚤 Return to Bali mainland\n\n🛌 Overnight stay at Kuta",
      
      "🛕 DAY 04 | ULUN DANU TEMPLE & HANDARA GATE\n\n🍽️ Breakfast at hotel\n🚐 Full day North Bali tour\n\n🛕 Visit Ulun Danu Beratan Temple\n📸 Stop at famous Handara Gate\n🏔️ Scenic mountain & lake views\n🚗 Return to hotel\n\n🛌 Overnight stay at Kuta",
      
      "🏞️ DAY 05 | ATV RIDE + SWING | TRANSFER TO UBUD\n\n🍽️ Breakfast & check-out\n🏍️ ATV Ride (1 Bike for 2 Persons)\n🌴 Experience Bali Swing (My Swings)\n🚐 Transfer to Ubud\n🏨 Check-in at hotel\n\n🛌 Overnight stay at Ubud",
      
      "🌿☕ DAY 06 | KINTAMANI + UBUD MARKET TOUR\n\n🍽️ Breakfast at villa\n🚗 Full-day sightseeing tour\n\n🌋 Kintamani – Mt. Batur View\n🛍️ Ubud Art Market\n☕ Coffee Plantation\n💍 Celuk Gold & Silver Village\n🚗 Return to villa\n\n🛌 Overnight stay at Ubud – Private Pool Villa",
      
      "✈️ DAY 07 | DEPARTURE FROM BALI\n\n🍽️ Breakfast & check-out\n🚗 Private transfer from Ubud to Airport\n✈️ Departure with beautiful memories"
    ];

    const inclusions = [
      "6 Nights accommodation in 4★ hotels",
      "Private Pool Villa in Ubud (2 nights)",
      "Daily Breakfast",
      "All sightseeing & tours as per itinerary",
      "Water sports & adventure activities",
      "Private airport & hotel transfers",
      "English-speaking driver",
      "Local taxes (Except GST)",
      "Travel Insurance INCLUDED",
      "GST INCLUDED",
      "TCS INCLUDED"
    ];

    const exclusions = [
      "International flights",
      "Visa charges",
      "Lunch & Dinner",
      "Personal expenses",
      "Anything not mentioned above"
    ];

    const result = await packagesCollection.updateOne(
      { name: "Bali Deluxe Package", price: 30000 },
      {
        $set: {
          description: description,
          itinerary: itinerary,
          inclusions: inclusions,
          exclusions: exclusions,
          duration: 7
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('\n✅ Bali ₹30,000 package updated successfully with new format!');
      console.log('Modified count:', result.modifiedCount);
      console.log('\nPackage Details:');
      console.log('- Price: ₹30,000');
      console.log('- Duration: 7 days');
      console.log('- Itinerary days:', itinerary.length);
      console.log('- Inclusions:', inclusions.length);
      console.log('- Exclusions:', exclusions.length);
      console.log('- Description length:', description.length);
      console.log('- Special Features: Tanah Lot + Uluwatu + Kecak Dance, Kintamani + Ubud Market Tour');
      console.log('- Accommodation: Private Pool Villa in Ubud');
    } else {
      console.log('❌ No package found or no changes made');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateBali30000NewFormat();