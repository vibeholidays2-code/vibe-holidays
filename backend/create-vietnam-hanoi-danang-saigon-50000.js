const mongoose = require('mongoose');
require('dotenv').config();

async function createHanoiDanangSaigon50000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

HANOI – 3 Nights
🏨 Skylark Hotel, Hanoi
🛏️ Superior Room – Double Bed (No Window)

DA NANG – 3 Nights
🏨 Nguyen Gia Hotel, Da Nang
🛏️ Superior Double Room with City View

HO CHI MINH (SAIGON) – 3 Nights
🏨 Ramana Saigon Hotel
🛏️ Twin Standard Room

🍳 Daily Breakfast Included at all hotels

💰 PACKAGE PRICE
₹50,000 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: Hanoi – Da Nang – Ho Chi Minh (Saigon)
No of Days And Night: 8 night / 9 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const itinerary = [
      "⭐ DAY 1 – ARRIVAL HANOI | AFTERNOON CITY TOUR (SIC)\n\n✈️ Arrival at Hanoi Airport\n🚗 Transfer to hotel & check-in\n\n🕑 Afternoon City Tour (SIC):\n  • Temple of Literature – Vietnam's first university\n  • Hoa Lo Prison Museum (Hanoi Hilton)\n  • Short cultural & heritage walk\n\n🛌 Overnight stay at Skylark Hotel, Hanoi",
      
      "⭐ DAY 2 – HALONG BAY 4★ DAY CRUISE (SIC)\n\n🍳 Breakfast\n🚐 SIC pickup from Old Quarter / Opera House\n\n🛳️ Luxury Day Cruise Includes:\n  • Limestone karst islands\n  • Sung Sot (Surprise) Cave\n  • Luon Cave – Kayaking / Bamboo Boat\n  • Ti Top Island – swimming & viewpoint\n\n🍽️ Local Lunch on Cruise\n🌅 Return to Hanoi by evening\n🛌 Overnight in Hanoi",
      
      "⭐ DAY 3 – NINH BINH DAY TOUR (SIC)\n\n🍳 Breakfast\n🚐 SIC tour to Ninh Binh\n\n🌿 Sightseeing includes:\n  • Hoa Lu Ancient Capital (Dinh & Le Kings Temple)\n  • Tam Coc Boat Ride through limestone caves\n  • Scenic rice fields & village life\n\n🛌 Overnight in Hanoi",
      
      "⭐ DAY 4 – HANOI ➜ DA NANG\n\n🍳 Breakfast & check-out\n🚗 Transfer to Hanoi Airport\n✈️ Flight to Da Nang (flight not included)\n🚐 Airport pickup & transfer to hotel\n🛌 Overnight at Nguyen Gia Hotel, Da Nang",
      
      "⭐ DAY 5 – BA NA HILLS & GOLDEN BRIDGE (SIC)\n\n🍳 Breakfast\n🚐 SIC pickup from Da Nang city\n🚡 World-record Cable Car Ride\n🌉 Golden Hand Bridge\n🎡 Fantasy Park & French Village\n🍽️ Indian Buffet Lunch Included\n🛌 Overnight in Da Nang",
      
      "⭐ DAY 6 – COCONUT FOREST & HOI AN (SIC)\n\n🍳 Breakfast\n🚐 SIC pickup\n🛶 Cam Thanh Coconut Forest – Basket Boat Ride\n\n🏮 Hoi An Ancient Town sightseeing:\n  • Japanese Covered Bridge\n  • Old Houses & Lantern Market\n\n🍽️ Dinner Included\n🛌 Overnight in Da Nang",
      
      "⭐ DAY 7 – DA NANG ➜ HO CHI MINH (SAIGON)\n\n🍳 Breakfast & check-out\n🚗 Transfer to Da Nang Airport\n✈️ Flight to Ho Chi Minh City\n🚐 Airport pickup & hotel transfer\n🛌 Overnight at Ramana Saigon Hotel",
      
      "⭐ DAY 8 – CU CHI TUNNEL + SAIGON CITY TOUR (SIC)\n\n🍳 Breakfast\n🚐 SIC full-day tour\n\n🕳️ Cu Chi Tunnels:\n  • War documentary experience\n  • Crawl through original tunnels (optional)\n\n🍽️ Lunch Included\n\n🏙️ Afternoon Saigon City Tour:\n  • Notre Dame Cathedral (outside)\n  • Central Post Office\n  • City Hall & Walking Street\n\n🛌 Overnight in Ho Chi Minh",
      
      "⭐ DAY 9 – DEPARTURE HO CHI MINH\n\n🍳 Breakfast & check-out\n🚗 Transfer to Airport\n✨ Tour ends with beautiful memories"
    ];

    const inclusions = [
      "8 Nights hotel accommodation (mentioned hotels)",
      "Daily breakfast",
      "All Airport Transfers (Private)",
      "All sightseeing tours on SIC basis",
      "English-speaking tour guide",
      "Meals as mentioned in itinerary",
      "2 Bottles mineral water per day",
      "Travel Insurance INCLUDED",
      "GST INCLUDED",
      "TCS INCLUDED"
    ];

    const exclusions = [
      "International & domestic flights",
      "Vietnam Visa",
      "Personal expenses",
      "Optional activities not mentioned"
    ];

    const newPackage = {
      name: "Hanoi - Da Nang - Saigon Grand Tour",
      destination: "Hanoi + Da Nang + Ho Chi Minh, Vietnam",
      duration: 9,
      price: 50000,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Hanoi - Da Nang - Saigon ₹50,000 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹50,000');
    console.log('- Duration: 9 days');
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

createHanoiDanangSaigon50000();
