const mongoose = require('mongoose');
require('dotenv').config();

async function createGrandVietnam82000() {
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

PHU QUOC – 3 Nights
🏨 Gaia Hotel Phu Quoc
🛏️ Premium Triple Room with Sea View

🍳 Daily Breakfast Included at all hotels

💰 PACKAGE PRICE
₹82,000 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: GRAND VIETNAM
No of Days And Night: 12 night / 13 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const itinerary = [
      "⭐ DAY 1 – ARRIVAL HANOI | AFTERNOON CITY TOUR\n\n✈️ Arrival at Hanoi Airport\n🚗 Private transfer to hotel & check-in\n\n🏙️ Afternoon City Tour:\n  • Temple of Literature – Vietnam's first university\n  • Hoa Lo Prison Museum (Hanoi Hilton)\n  • Local heritage & culture walk\n\n🛌 Overnight at Skylark Hotel, Hanoi",
      
      "⭐ DAY 2 – HALONG BAY 4★ DAY CRUISE\n\n🍳 Breakfast\n🚗 Drive to Halong Bay\n\n🛳️ Luxury Day Cruise Experience:\n  • Sung Sot (Surprise) Cave\n  • Luon Cave – Kayaking / Bamboo Boat\n  • Ti Top Island – swimming & viewpoint\n\n🍽️ Lunch on cruise\n🌅 Return to Hanoi\n🛌 Overnight in Hanoi",
      
      "⭐ DAY 3 – NINH BINH (HOA LU – TAM COC)\n\n🍳 Breakfast\n🚐 Full-day Ninh Binh tour\n\n🌿 Includes:\n  • Hoa Lu Ancient Capital\n  • Tam Coc scenic boat ride (3 caves)\n  • Village & rice-field landscapes\n\n🛌 Overnight in Hanoi",
      
      "⭐ DAY 4 – HANOI ➝ DA NANG\n\n🍳 Breakfast & check-out\n🚗 Transfer to airport\n✈️ Fly to Da Nang (flight excluded)\n🚐 Transfer to hotel\n🛌 Overnight at Nguyen Gia Hotel, Da Nang",
      
      "⭐ DAY 5 – BANA HILLS & GOLDEN BRIDGE\n\n🍳 Breakfast\n🚐 Full-day Bana Hills tour\n🚡 World-record cable car ride\n🌉 Golden Hand Bridge\n🎢 Fantasy Park\n🍽️ Indian Buffet Lunch\n🛌 Overnight in Da Nang",
      
      "⭐ DAY 6 – COCONUT FOREST & HOI AN (WITH DINNER)\n\n🍳 Breakfast\n🚐 Cam Thanh Coconut Forest\n🛶 Basket boat ride & village experience\n\n🏮 Hoi An Ancient Town:\n  • Japanese Bridge\n  • Old Houses\n  • Lantern market\n\n🍽️ Dinner included\n🛌 Overnight in Da Nang",
      
      "⭐ DAY 7 – DA NANG ➝ HO CHI MINH\n\n🍳 Breakfast & check-out\n🚗 Airport transfer\n✈️ Fly to Ho Chi Minh City\n🚐 Hotel transfer\n🛌 Overnight at Ramana Saigon Hotel",
      
      "⭐ DAY 8 – CU CHI TUNNEL + SAIGON CITY TOUR\n\n🍳 Breakfast\n🚐 Visit Cu Chi Tunnels\n🎬 War history documentary\n🍽️ Lunch included\n\n🏙️ City Tour:\n  • Notre Dame Cathedral\n  • Central Post Office\n  • City Hall & walking street\n\n🛌 Overnight in Ho Chi Minh",
      
      "⭐ DAY 9 – HO CHI MINH CITY TOUR\n\n🍳 Breakfast\n🏛️ Reunification Palace\n🏛️ War Remnants Museum\n🛍️ Ben Thanh Market\n🛌 Overnight in Ho Chi Minh",
      
      "⭐ DAY 10 – HO CHI MINH ➝ PHU QUOC\n\n🍳 Breakfast & check-out\n🚗 Airport transfer\n✈️ Fly to Phu Quoc\n🚐 Hotel transfer\n🛌 Overnight at Gaia Hotel Phu Quoc",
      
      "⭐ DAY 11 – PHU QUOC 4 ISLAND TOUR\n\n🍳 Breakfast\n🚤 Speedboat island hopping\n🤿 Snorkeling at coral reefs\n🍽️ Buffet lunch\n🎢 Aquatopia Water Park\n🚡 World's longest over-water cable car\n🛌 Overnight in Phu Quoc",
      
      "⭐ DAY 12 – VINPEARL SAFARI & GRAND WORLD\n\n🍳 Breakfast\n🦁 Vinpearl Safari\n🎢 VinWonders Theme Park\n🌆 Grand World – Venice style area\n🛌 Overnight in Phu Quoc",
      
      "⭐ DAY 13 – DEPARTURE PHU QUOC\n\n🍳 Breakfast & check-out\n🚗 Transfer to airport\n✨ Tour ends with unforgettable memories"
    ];

    const inclusions = [
      "12 Nights accommodation (mentioned hotels)",
      "Daily breakfast",
      "All airport & inter-city transfers",
      "All sightseeing as per itinerary",
      "SIC & PVT tours as mentioned",
      "English-speaking guides",
      "Mineral water during tours",
      "Travel Insurance INCLUDED",
      "GST INCLUDED",
      "TCS INCLUDED"
    ];

    const exclusions = [
      "International & domestic flights",
      "Vietnam Visa",
      "Personal expenses",
      "Anything not mentioned"
    ];

    const newPackage = {
      name: "Grand Vietnam Complete Tour",
      destination: "Hanoi + Da Nang + Ho Chi Minh + Phu Quoc, Vietnam",
      duration: 13,
      price: 82000,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Grand Vietnam ₹82,000 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹82,000');
    console.log('- Duration: 13 days');
    console.log('- Destination: Hanoi + Da Nang + Ho Chi Minh + Phu Quoc, Vietnam');
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

createGrandVietnam82000();
