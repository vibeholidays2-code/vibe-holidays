const mongoose = require('mongoose');
require('dotenv').config();

async function createPhuQuocIsland34500() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

PHU QUOC – 4 Nights
🏨 Myrtle Boutique Hotel
🛏️ Suite Room
🍳 Breakfast Included
⭐ 3★ Hotel

💰 PACKAGE PRICE
₹34,500 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: 🌴 PHU QUOC ISLAND 🌴
No of Days And Night: 4 night / 5 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const itinerary = [
      "✈️🤝 Day 1 – Arrival in Phu Quoc\n\n✈️ Arrival at Phu Quoc International Airport\n🚗 Private airport transfer to hotel (North Phu Quoc area)\n🏨 Check-in & relax\n🌴 Rest of the day at leisure\n🛌 Overnight stay in Phu Quoc",
      
      "🏝🚤 Day 2 – 4 Island Tour + Aquatopia Water Park & Cable Car (SIC)\n\n⏰ Morning pickup from hotel\n🚗 Proceed to An Thoi Port\n\n📍 Island hopping includes:\n  • 🏝️ May Rut Trong Island – swimming & beach time\n  • 🏝️ Gam Ghi Island – snorkeling (gear provided)\n  • 🏝️ May Rut Ngoai Island\n  • 🚡 Hon Thom Cable Car (one of the longest over-water cable cars)\n\n🍽️ Buffet Local Lunch\n🎢 Enjoy Aquatopia Water Park\n📸 Flycam photos & videos included\n🚗 Return to hotel\n🛌 Overnight stay in Phu Quoc",
      
      "🏛🏖 Day 3 – Phu Quoc South City Tour with Lunch (SIC)\n\n⏰ Morning pickup from hotel\n\n📍 Visit:\n  • 💎 Pearl Farm (Long Beach area)\n  • 🐟 Fish Sauce Factory\n  • 🌶️ Pepper Garden\n  • 🌊 Tranh Stream\n  • 🍷 Sim Wine Factory\n  • 🏖️ Sao Beach – swimming & relaxation\n  • 🛕 Ho Quoc Pagoda\n  • 🏛️ Phu Quoc Prison (Coconut Tree Prison)\n\n🍽️ Lunch at local restaurant\n🚗 Return to hotel\n🛌 Overnight stay in Phu Quoc",
      
      "🦁🎢 Day 4 – Vinpearl Safari + VinWonders + Grand World\n\n⏰ Morning pickup from hotel\n🦒 Visit Vinpearl Safari – Vietnam's largest wildlife park\n\n🎢 Proceed to VinWonders Theme Park:\n  • Rides, shows & attractions\n  • 🧜 Mermaid Show at Aquarium (time-bound)\n\n🍽️ Meals included inside the park\n\n🌆 Evening visit to Grand World Phu Quoc:\n  • Venice River\n  • European-style streets\n  • Boat ride optional, self-paid\n\n🚗 Return to hotel\n🛌 Overnight stay in Phu Quoc",
      
      "✈️👋 Day 5 – Departure from Phu Quoc\n\n🍳 Breakfast at hotel\n🏨 Check-out\n🚗 Private transfer to Phu Quoc Airport\n✈️ Departure with wonderful memories 🇻🇳"
    ];

    const inclusions = [
      "4 Nights accommodation at Myrtle Boutique Hotel",
      "Daily breakfast",
      "Private airport transfers (arrival & departure)",
      "All sightseeing & tours as per itinerary",
      "4 Island Tour + Aquatopia Water Park & Cable Car",
      "South City Tour with lunch",
      "Vinpearl Safari + VinWonders + Grand World (combo ticket)",
      "English-speaking tour guide (as per tours)",
      "Mineral water during tours",
      "GST Included",
      "TCS Included",
      "Travel Insurance Included"
    ];

    const exclusions = [
      "Airfare",
      "Vietnam Visa",
      "Personal expenses",
      "Tips & porterage",
      "Anything not mentioned above"
    ];

    const newPackage = {
      name: "Phu Quoc Island Paradise",
      destination: "Phu Quoc Island, Vietnam",
      duration: 5,
      price: 34500,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Phu Quoc Island Paradise ₹34,500 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹34,500');
    console.log('- Duration: 5 days');
    console.log('- Destination: Phu Quoc Island, Vietnam');
    console.log('- Itinerary days:', itinerary.length);
    console.log('- Inclusions:', inclusions.length);
    console.log('- Exclusions:', exclusions.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

createPhuQuocIsland34500();
