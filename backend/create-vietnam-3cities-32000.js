const mongoose = require('mongoose');
require('dotenv').config();

async function createVietnam3Cities32000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

HANOI – 2 Nights
🏨 Mayflower Hotel Hanoi
🛏️ Standard Room | Breakfast

DA NANG – 2 Nights
🏨 Grand Citiview Da Nang
🛏️ Superior Room | Breakfast

HO CHI MINH – 2 Nights
🏨 Ciao SaiGon Hotel & Spa
🛏️ Deluxe Room | Breakfast

💰 PACKAGE PRICE
₹32,000 /- Per Person + Taxes

📅 TRAVEL DETAILS
Travel Date: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: VIETNAM
No of Days And Night: 6 night / 7 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const itinerary = [
      "✈️ DAY 1 | ARRIVAL – HANOI\n\n✈️ Arrival at Hanoi Airport\n🚗 Private transfer to hotel\n🏨 Check-in & rest\n🛌 Overnight stay in Hanoi",
      
      "🛳️ DAY 2 | HALONG BAY 4★ DAY CRUISE\n\n🍽️ Breakfast\n🚐 SIC transfer from Old Quarter\n\n🛳️ Ha Long Bay 4★ Day Cruise:\n  • Sung Sot Cave\n  • Luon Cave (Kayak/Bamboo Boat)\n  • Titop Island\n\n🍽️ Lunch on cruise\n🚗 Return to Hanoi by evening\n🛌 Overnight stay in Hanoi",
      
      "✈️ DAY 3 | HANOI → DA NANG | HOI AN TOUR\n\n🍽️ Breakfast & check-out\n🚗 Transfer to airport\n✈️ Flight to Da Nang (flight not included)\n🚐 Transfer to hotel\n\n🕒 Marble Mountain & Hoi An Ancient Town Tour (SIC):\n  • Marble Mountains\n  • Non Nuoc Stone Village\n  • Fukian Assembly Hall\n  • Japanese Covered Bridge\n  • Hoi An Night Market\n\n🍽️ Dinner Included\n🛌 Overnight stay in Da Nang",
      
      "🌉 DAY 4 | BA NA HILLS – GOLDEN BRIDGE\n\n🍽️ Breakfast\n🚐 Ba Na Hills Guided Tour (SIC)\n🚡 Cable Car Ride\n🌉 Golden Hand Bridge\n🏰 French Village & Fantasy Park\n🍽️ Indian Buffet Lunch Included\n🛌 Overnight stay in Da Nang",
      
      "✈️ DAY 5 | DA NANG → HO CHI MINH\n\n🍽️ Breakfast & check-out\n🚗 Transfer to airport\n✈️ Flight to Ho Chi Minh (flight not included)\n🚐 Airport transfer to hotel\n🛌 Overnight stay in Ho Chi Minh",
      
      "🚤 DAY 6 | MEKONG DELTA + CU CHI TUNNEL\n\n🍽️ Breakfast\n🚐 Full Day SIC Tour\n\n• Cu Chi Tunnels exploration\n• Mekong Delta boat ride\n• Coconut candy factory\n• Local village experience\n\n🍽️ Lunch Included\n🚗 Return by evening\n🛌 Overnight stay in Ho Chi Minh",
      
      "✈️ DAY 7 | DEPARTURE – HO CHI MINH\n\n🍽️ Breakfast & check-out\n🚗 Transfer to Ho Chi Minh Airport\n✈️ Departure ✨"
    ];

    const inclusions = [
      "6 Nights accommodation in mentioned hotels",
      "Daily breakfast",
      "All airport transfers (Private)",
      "All sightseeing as per itinerary (SIC)",
      "Ha Long Bay 4★ Day Cruise with lunch",
      "Ba Na Hills tour with Indian lunch",
      "Hoi An tour with dinner",
      "Mekong Delta + Cu Chi Tunnel tour with lunch",
      "English speaking guide",
      "Travel Insurance Included"
    ];

    const exclusions = [
      "International & domestic flights",
      "Vietnam visa",
      "GST",
      "TCS",
      "Personal expenses"
    ];

    const newPackage = {
      name: "Vietnam Budget Explorer",
      destination: "Hanoi + Da Nang + Ho Chi Minh, Vietnam",
      duration: 7,
      price: 32000,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Vietnam Budget Explorer ₹32,000 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹32,000');
    console.log('- Duration: 7 days');
    console.log('- Destination: Hanoi + Da Nang + Ho Chi Minh, Vietnam');
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

createVietnam3Cities32000();
