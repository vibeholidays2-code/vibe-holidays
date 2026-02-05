const mongoose = require('mongoose');
require('dotenv').config();

async function updateGoa3Night4DaysDetails() {
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
👫 2 Pax: ₹13,000 /- per person
👨‍👩‍👦 3 Pax: ₹11,000 /- per person
👨‍👩‍👧‍👦 4 Pax: ₹10,000 /- per person

📌 Important: Rates are date-wise variable & subject to availability. Please confirm dates before booking.

📅 TRAVEL DETAILS
📍 Destination: Goa
📆 Duration: 3 Nights / 4 Days
👥 Tour Type: Individual/Family Package

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

🍽️ MEAL PLAN
✔️ Daily Breakfast
✔️ Daily Dinner

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
      "📅 DAY 1 – ARRIVAL IN GOA | LEISURE DAY\n\n✈️ Arrival at Goa Airport / Railway Station\n🚗 Transfer to Calangute Hotel\n🏨 Check-in (as per hotel policy)\n\n🏖️ Leisure Time:\n  • Relax at hotel\n  • Visit nearby Calangute Beach\n  • Enjoy sunset & local cafes\n\n🛌 Overnight Stay: Goa (Calangute)",
      
      "📅 DAY 2 – NORTH GOA SIGHTSEEING\n\n🍳 Breakfast at Hotel\n🚐 Full day North Goa tour\n\n🏖️ North Goa Attractions:\n  • Fort Aguada\n  • Dolphin Trip\n  • Candolim Beach\n  • Calangute Beach\n  • Baga Beach\n  • Anjuna Beach\n  • Vagator Beach\n  • Snow Park\n  • Wax Museum\n  • Thunder World\n  • Tito's Lane & Shopping\n\n🍽️ Dinner at Hotel\n🌙 Overnight stay in Goa",
      
      "📅 DAY 3 – SOUTH GOA SIGHTSEEING\n\n🍳 Breakfast at Hotel\n🚐 Full day South Goa tour\n\n🏝️ South Goa Attractions:\n  • Old Goa Church (Basilica of Bom Jesus)\n  • St. Augustine Tower\n  • Mangueshi Temple\n  • Spice Plantation Tour\n  • Panjim Church\n  • Dona Paula Beach\n  • Miramar Beach\n\n🍽️ Dinner at Hotel\n🌙 Overnight stay in Goa",
      
      "📅 DAY 4 – DEPARTURE FROM GOA\n\n🍽️ Breakfast at Hotel\n🏨 Hotel Check-out\n🚗 Transfer to Airport / Railway Station\n🙏 Tour Ends with Sweet Goa Memories"
    ];

    const inclusions = [
      "3 Nights hotel accommodation (Calangute area)",
      "Room with Breakfast & Dinner",
      "Airport / Railway Station Transfers",
      "North Goa & South Goa Sightseeing by AC Vehicle",
      "Driver Allowance, Toll & Parking",
      "Assistance from Vibes Holidays",
      "GST Included"
    ];

    const exclusions = [
      "Flight / Train Tickets",
      "Water Sports, Entry Tickets, Personal Expenses",
      "Tips & Porterage",
      "Anything not mentioned in inclusions"
    ];

    const result = await packagesCollection.updateOne(
      { name: "Goa Beach Paradise - 3N/4D" },
      {
        $set: {
          name: "Goa Tour Package - 3N/4D",
          price: 10000, // Base price for 4 pax
          description: description,
          itinerary: itinerary,
          inclusions: inclusions,
          exclusions: exclusions,
          duration: 4
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log('\n✅ Goa 3N/4D Package updated successfully with detailed information!');
      console.log('Modified count:', result.modifiedCount);
      console.log('\nPackage Details:');
      console.log('- Name: Goa Tour Package - 3N/4D');
      console.log('- Base Price: ₹10,000 (4 Pax)');
      console.log('- 3 Pax: ₹11,000 per person');
      console.log('- 2 Pax: ₹13,000 per person');
      console.log('- Duration: 4 days / 3 nights');
      console.log('- Type: Individual/Family Package');
      console.log('- Hotels: Bloom Hotel / Summit Calangute Resort & Spa');
      console.log('- Special Features: Complete North & South Goa Sightseeing');
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

updateGoa3Night4DaysDetails();