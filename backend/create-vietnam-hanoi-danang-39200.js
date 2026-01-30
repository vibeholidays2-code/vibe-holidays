const mongoose = require('mongoose');
require('dotenv').config();

async function createHanoiDaNang39200() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

NIGHT 1-3 – HANOI
🏨 Skylark Hotel, Hanoi
🛏️ Superior Room | Double Bed | No Window – 3 Nights
🍽️ Breakfast Included

NIGHT 4-6 – DA NANG
🏨 Grand Citiview Da Nang
🛏️ Superior Double Room – 3 Nights
🍽️ Breakfast Included

💰 PACKAGE PRICE
₹39,200 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: Hanoi + Da Nang
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
      "🌞 Day 1 – Arrival in Hanoi | City Tour (SIC)\n\n✈️ Arrival at Hanoi International Airport\n🤝 Meet & greet by our representative\n🚗 Transfer to hotel & check-in (14:00 hrs standard)\n\n🕑 Afternoon City Tour (14:00 – 18:00):\n  • Ho Chi Minh Complex (Mausoleum, House-on-Stilts)\n  • One Pillar Pagoda\n  • Temple of Literature – first university of Vietnam\n  • Cyclo / Green Car ride around Old Quarter\n  • Hoan Kiem Lake & Ngoc Son Temple\n\n🌆 Evening free to explore Old Quarter on your own\n🛌 Overnight stay in Hanoi",
      
      "🚢 Day 2 – Ha Long Bay 4★ Day Cruise with Lunch (SIC)\n\n🚐 Morning pickup from Old Quarter\n🛣️ Drive via Hanoi – Haiphong – Tuan Chau Highway\n🚢 Board 4★ Cruise at Tuan Chau Harbor\n🍽️ Buffet Lunch on Cruise\n\n📍 Cruise highlights:\n  • Fighting Chicken Islet\n  • Incense Burner Islet\n  • Sung Sot Cave\n  • Kayaking / Bamboo Boat at Luon Cave\n  • TiTop Island – swimming or viewpoint trek\n\n🌅 Sunset & return to Hanoi by evening\n🛌 Overnight stay in Hanoi",
      
      "🏞️ Day 3 – Ninh Binh Day Tour (Hoa Lu – Tam Coc) (SIC)\n\n🚐 Morning pickup from hotel\n🏛️ Visit Hoa Lu – Ancient Royal Capital\n  • Dinh King Temple\n  • Le King Temple\n⛰️ Optional Mua Cave (direct payment)\n🚣 Bamboo Boat Ride at Tam Coc (three caves)\n🌾 Experience village life & limestone karst scenery\n🚐 Return to Hanoi by evening\n🛌 Overnight stay in Hanoi",
      
      "✈️ Day 4 – Hanoi → Da Nang\n\n🍳 Breakfast & check-out\n🚗 Transfer to Hanoi Airport\n✈️ Flight to Da Nang (not included)\n✈️ Arrival at Da Nang Airport\n🚗 Transfer to hotel & check-in\n🌆 Day free at leisure\n🛌 Overnight stay in Da Nang",
      
      "🏔️ Day 5 – Ba Na Hills Tour with Indian Lunch (SIC)\n\n🚐 Morning pickup from hotel\n🚡 Cable Car ride to Ba Na Hills\n\n📍 Visit:\n  • Golden Bridge\n  • Linh Ung Pagoda\n  • Le Jardin D'Amour\n  • French Village\n  • Fantasy Park\n\n🍽️ Indian Buffet Lunch at Bharat Restaurant\n🎢 Free time at Fantasy Park\n🚐 Return to hotel\n🛌 Overnight stay in Da Nang",
      
      "🌴 Day 6 – Coconut Forest + Marble Mountain + Hoi An (SIC)\n\n🚐 Afternoon pickup\n\n📍 Visit:\n  • Marble Mountains & Non Nuoc Stone Village\n  • Coconut Forest (Basket Boat Ride)\n  • Hoi An Ancient Town\n    – Old Houses\n    – Assembly Halls\n    – Japanese Covered Bridge\n    – Lantern streets & Night Market\n\n🍽️ Dinner not included (optional local / Indian dinner)\n🚐 Return to Da Nang\n🛌 Overnight stay in Da Nang",
      
      "✈️ Day 7 – Departure from Da Nang\n\n🍳 Breakfast & check-out\n🚗 Transfer to Da Nang International Airport\n✈️ Departure with beautiful memories 🇻🇳"
    ];

    const inclusions = [
      "6 Nights hotel accommodation",
      "Daily breakfast",
      "Airport transfers (private)",
      "All sightseeing & tours as per itinerary (SIC)",
      "Ha Long Bay 4★ Cruise with lunch",
      "Ninh Binh Day Tour",
      "Ba Na Hills tour with Indian lunch",
      "English-speaking tour guide",
      "Mineral water during tours",
      "GST Included",
      "TCS Included",
      "Travel Insurance Included"
    ];

    const exclusions = [
      "International & domestic flights",
      "Vietnam visa",
      "Personal expenses & tips",
      "Anything not mentioned above"
    ];

    const newPackage = {
      name: "Hanoi - Da Nang Discovery",
      destination: "Hanoi + Da Nang, Vietnam",
      duration: 7,
      price: 39200,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Hanoi - Da Nang ₹39,200 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹39,200');
    console.log('- Duration: 7 days');
    console.log('- Destination: Hanoi + Da Nang, Vietnam');
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

createHanoiDaNang39200();
