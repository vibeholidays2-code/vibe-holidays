const mongoose = require('mongoose');
require('dotenv').config();

async function createSaigonDanangHanoi48500() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

HO CHI MINH CITY – 2 Nights
🏨 Ciao SaiGon Hotel & Spa

DA NANG – 2 Nights
🏨 Grand Citiview Da Nang

HANOI – 2 Nights
🏨 The Bloom Ha Noi

💰 PACKAGE PRICE
₹48,500 /- Per Person

📅 TRAVEL DETAILS
Travel Date: 1 March 2026
Number Of Person: 2 Adults
Travel Destination: Ho Chi Minh – Da Nang – Hanoi
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
      "🛬 DAY 1 | ARRIVAL HO CHI MINH\n\n✈️ Arrival at Ho Chi Minh International Airport\n🚗 Private transfer to hotel & check-in\n🌙 Evening free for leisure / Ben Thanh Market\n🛌 Overnight stay in Ho Chi Minh City",
      
      "🚤 DAY 2 | CU CHI TUNNELS + MEKONG DELTA\n\n🍽️ Breakfast at hotel\n🚐 Full Day Private Tour\n\n• Cu Chi Tunnels exploration\n• Mekong Delta boat ride\n• Honey farm & coconut candy workshop\n• Traditional music & tropical fruit tasting\n\n🍽️ Local lunch included\n🛌 Overnight stay in Ho Chi Minh City",
      
      "🌆 DAY 3 | HO CHI MINH CITY TOUR (MORNING) → DA NANG (FLIGHT)\n\n🍽️ Breakfast at hotel\n\n🌆 Morning Ho Chi Minh City Tour (Private):\n  • Reunification Palace\n  • Notre Dame Cathedral (outside view)\n  • Central Post Office\n  • War Remnants Museum\n\n🚗 Transfer to airport\n✈️ Flight: Ho Chi Minh → Da Nang (as per provided schedule)\n🚗 Arrival transfer to hotel\n🛌 Overnight stay in Da Nang",
      
      "🌉 DAY 4 | BA NA HILLS – GOLDEN HAND BRIDGE\n\n🍽️ Breakfast at hotel\n🚐 Private Ba Na Hills Tour\n\n• Cable car ride\n• Golden Hand Bridge\n• French Village\n• Fantasy Park\n\n🍽️ Indian Buffet Lunch at Bharat Restaurant\n🛌 Overnight stay in Da Nang",
      
      "🏮 DAY 5 | COCONUT FOREST – BASKET BOAT – HOI AN (NO DINNER)\n\n🍽️ Breakfast & check-out\n🚐 SIC Tour (Da Nang City Center Hotels only)\n\n🕑 02:00 – 02:15 PM pickup from Da Nang\n  • Visit Non Nuoc Stone Carving Village\n\n🕓 04:00 PM – Bay Mau Coconut Forest:\n  • Basket boat ride\n  • Crab/snail catching\n  • Coconut leaf toy making\n  • Basket boat race\n  • Lemon juice & Hoi An cake\n\n🕔 05:00 PM – Hoi An Ancient Town:\n  • Fukian Assembly Hall\n  • Japanese Covered Bridge\n  • Old Houses\n  • Free time at Nguyen Hoang Night Market\n  • Lantern-lit streets experience\n\n🕗 08:15 – 09:00 PM – Return to Da Nang\n✈️ Late evening / night flight: Da Nang → Hanoi\n🚗 Arrival transfer to hotel\n🛌 Overnight stay in Hanoi",
      
      "🛳️ DAY 6 | HA LONG BAY 4★ DAY CRUISE\n\n🍽️ Early breakfast\n🚐 SIC transfer to Ha Long Bay\n\n🛳️ 4★ Day Cruise:\n  • Sung Sot (Surprising) Cave\n  • Luon Cave (Kayaking / Bamboo Boat)\n  • Titop Island – swimming / viewpoint\n\n🍽️ Lunch on cruise\n🚐 Return to Hanoi\n🛌 Overnight stay in Hanoi",
      
      "🚁 DAY 7 | HANOI CITY TOUR – DEPARTURE\n\n🍽️ Breakfast & check-out\n\n🚐 Half Day Hanoi City Tour (Private):\n  • Tran Quoc Pagoda\n  • Ho Chi Minh Complex\n  • One Pillar Pagoda\n  • Temple of Literature / Hoan Kiem Lake\n\n🚗 Transfer to airport for onward journey"
    ];

    const inclusions = [
      "6 Nights hotel accommodation",
      "Daily breakfast",
      "All airport & sightseeing transfers",
      "Private & SIC tours as mentioned",
      "Cu Chi + Mekong Delta tour with lunch",
      "Ba Na Hills tour with Indian lunch",
      "Coconut Forest + Basket Boat + Hoi An tour",
      "Ha Long Bay 4★ day cruise with lunch",
      "English speaking guide",
      "Vietnam Visa Included",
      "Travel Insurance Included",
      "GST Included",
      "TCS Included"
    ];

    const exclusions = [
      "International & internal airfare",
      "Personal expenses",
      "Any meal not mentioned above"
    ];

    const newPackage = {
      name: "Vietnam South to North Discovery",
      destination: "Ho Chi Minh + Da Nang + Hanoi, Vietnam",
      duration: 7,
      price: 48500,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Vietnam South to North ₹48,500 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹48,500');
    console.log('- Duration: 7 days');
    console.log('- Destination: Ho Chi Minh + Da Nang + Hanoi, Vietnam');
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

createSaigonDanangHanoi48500();
