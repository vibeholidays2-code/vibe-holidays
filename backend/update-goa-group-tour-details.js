const mongoose = require('mongoose');
require('dotenv').config();

async function updateGoaGroupTourDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 HOTEL DETAILS

🔹 Option 1
🏨 Bloom Hotel - Calangute

🔹 Option 2  
🏨 Summit Calangute Resort & Spa
(Hotels subject to availability at time of booking)

💰 PACKAGE COST (PER PERSON – GST INCLUDED)
👤 Double Sharing: ₹17,000 per person
👤 Triple Sharing: ₹15,000 per person

✈️ Flight Cost: Approx. ₹8,000 extra (Ahmedabad–Goa–Ahmedabad)
Flight rates depend on booking date & availability.

📅 TRAVEL DETAILS
📍 Destination: Goa
📆 Duration: 4 Nights / 5 Days
👥 Tour Type: Group Tour
✨ Highlights: Beaches • Cruise Party • Sightseeing • Water Sports

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

🍽️ MEAL PLAN
✔️ Daily Breakfast
✔️ Daily Dinner
✔️ Dinner on Cruise (Day 1)

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
      "📅 DAY 1 – ARRIVAL IN GOA | NIGHT CRUISE PARTY\n\n✈️ Arrival at Goa Airport / Railway Station\n🚗 Transfer to hotel & check-in\n🍽️ Lunch (own expense)\n😴 Rest / Free time\n\n🌃 Evening Highlight:\n🚢 Swastik Cruises – Dinner Cruise Party\n🎵 Live DJ Music\n💃 Dance Floor\n🍽️ Dinner on Cruise\n\n🌙 Overnight stay in Goa",
      
      "📅 DAY 2 – NORTH GOA SIGHTSEEING\n\n🍳 Breakfast at Hotel\n🚐 Full day North Goa tour\n\n🏖️ North Goa Attractions:\n  • Fort Aguada\n  • Dolphin Trip\n  • Candolim Beach\n  • Calangute Beach\n  • Baga Beach\n  • Anjuna Beach\n  • Vagator Beach\n  • Snow Park\n  • Wax Museum\n  • Thunder World\n  • Tito's Lane & Shopping\n\n🍽️ Dinner at Hotel\n🌙 Overnight stay in Goa",
      
      "📅 DAY 3 – SOUTH GOA SIGHTSEEING\n\n🍳 Breakfast at Hotel\n🚐 Full day South Goa tour\n\n🏝️ South Goa Attractions:\n  • Old Goa Church (Basilica of Bom Jesus)\n  • St. Augustine Tower\n  • Mangueshi Temple\n  • Spice Plantation Tour\n  • Panjim Church\n  • Dona Paula Beach\n  • Miramar Beach\n\n🍽️ Dinner at Hotel\n🌙 Overnight stay in Goa",
      
      "📅 DAY 4 – WATER SPORTS\n\n🍳 Breakfast at Hotel\n🌊 Full day water sports activities\n\n🏄‍♂️ Water Sports:\n  • Jet Ski\n  • Parasailing\n  • Banana Boat Ride\n  • Scuba Diving with instructor & equipment\n\n🛍️ Free time at beach / shopping\n🍽️ Dinner at Hotel\n🌙 Overnight stay in Goa",
      
      "📅 DAY 5 – DEPARTURE\n\n🍳 Breakfast at Hotel\n⏰ Check-out from hotel\n🛍️ Last minute shopping\n🚗 Transfer to Airport / Railway Station\n✈️ Departure with unforgettable memories"
    ];

    const inclusions = [
      "4 Nights accommodation in selected hotel",
      "Breakfast & Dinner at hotel",
      "Airport / Railway transfers",
      "North Goa & South Goa sightseeing",
      "Swastik Cruises Dinner Cruise",
      "Dolphin Trip",
      "Snow Park + Wax Museum + Thunder World",
      "AC coach / cab for sightseeing",
      "All tolls, parking & driver charges",
      "Water sports activities",
      "GST Included"
    ];

    const exclusions = [
      "Flights (₹8,000 approx. extra)",
      "Lunch",
      "Personal expenses",
      "Anything not mentioned in inclusions"
    ];

    const result = await packagesCollection.updateOne(
      { name: "Goa Group Tour Package" },
      {
        $set: {
          price: 15000, // Triple sharing price as base
          description: description,
          itinerary: itinerary,
          inclusions: inclusions,
          exclusions: exclusions,
          duration: 5
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('\n✅ Goa Group Tour Package updated successfully with detailed information!');
      console.log('Modified count:', result.modifiedCount);
      console.log('\nPackage Details:');
      console.log('- Name: Goa Group Tour Package');
      console.log('- Base Price: ₹15,000 (Triple Sharing)');
      console.log('- Double Sharing: ₹17,000');
      console.log('- Duration: 5 days / 4 nights');
      console.log('- Type: Group Tour');
      console.log('- Hotels: Bloom Hotel / Summit Calangute Resort & Spa');
      console.log('- Special Features: Cruise Party, Water Sports, Complete Sightseeing');
      console.log('- Itinerary days:', itinerary.length);
      console.log('- Inclusions:', inclusions.length);
      console.log('- Exclusions:', exclusions.length);
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

updateGoaGroupTourDetails();