const mongoose = require('mongoose');
require('dotenv').config();

async function createHanoi24000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

NIGHT 1-3 – HANOI
🏨 Skylark Hotel, Hanoi
🛏️ Standard Room – 3 Nights
🍽️ Breakfast Included

💰 PACKAGE PRICE
₹24,000 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: Hanoi
No of Days And Night: 3 night / 4 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const itinerary = [
      "🌞 Day 1 – Arrival in Hanoi | City Tour\n\n✈️ Arrival at Hanoi International Airport\n🤝 Meet our representative outside arrival gate holding your Name Placard\n🚗 Private transfer to hotel\n⏰ Hotel Check-in Time: 14:00 hrs (Early check-in subject to availability)\n\n🕑 Afternoon City Tour (14:00 – 18:00):\n🏛️ Ho Chi Minh Complex\n  • Ho Chi Minh Mausoleum\n  • Ho Chi Minh House-on-Stilts\n  • One Pillar Pagoda\n🎓 Temple of Literature – First University of Vietnam\n🚲 Green Car / Cyclo Ride around Old Quarter\n🏞️ Hoan Kiem Lake & Ngoc Son Temple\n🌆 Evening free to explore Old Quarter, cafes, shops & spas\n\nℹ️ Compulsory tips excluded: USD 5 per person (Guide & Driver)\n🛌 Overnight stay in Hanoi",
      
      "🚤 Day 2 – Full Day Halong Bay Cruise (SIC)\n\n🚐 Pick-up from hotel (Old Quarter / Opera House)\n🛣️ Drive via Hanoi – Haiphong – Tuan Chau Highway\n🚢 Board cruise at Tuan Chau Harbor\n🍽️ Buffet Lunch on Cruise\n\n📍 Visit famous attractions:\n  • 🐓 Fighting Chicken Islet\n  • 🔥 Incense Burner Islet\n  • 🏞️ Sung Sot Cave (largest & most beautiful cave)\n  • 🚣 Kayaking / Bamboo Boat at Luon Cave\n  • 🏝️ TiTop Island – swimming or viewpoint trek\n\n🌅 Sunset Party on cruise (wine, fruits & biscuits)\n🚐 Return to Hanoi & drop at hotel\n🛌 Overnight stay in Hanoi",
      
      "🏞️ Day 3 – Ninh Binh Day Tour with Lunch (SIC)\n\n🚐 Pick-up from hotel\n🏛️ Visit Hoa Lu – Ancient Royal Capital\n  • Dinh King Temple\n  • Le King Temple\n⛰️ Mua Cave – 500 steps climb for panoramic views\n🍽️ Lunch at local restaurant\n🚣 Bamboo Boat Ride at Tam Coc\n  • Three limestone caves\n  • River views, village life & karst formations\n🚐 Return to Hanoi & drop at hotel\n🛌 Overnight stay in Hanoi",
      
      "✈️ Day 4 – Departure | Hanoi Airport Drop\n\n🍳 Breakfast at hotel\n⏰ Check-out: 11:30 hrs (Late check-out subject to hotel policy)\n🛍️ Free time for shopping / personal activities\n🚗 Private transfer to Hanoi Airport\n✈️ Departure with wonderful memories 🇻🇳"
    ];

    const inclusions = [
      "3 Nights accommodation at Skylark Hotel",
      "Daily breakfast",
      "Hanoi City Tour",
      "Halong Bay Day Cruise with lunch (SIC)",
      "Ninh Binh Day Tour with lunch (SIC)",
      "Private airport transfers",
      "All sightseeing as per itinerary",
      "GST Included",
      "TCS Included"
    ];

    const exclusions = [
      "Airfare",
      "Vietnam Visa",
      "Tips (USD 5 per person per day)",
      "Personal expenses",
      "Anything not mentioned above"
    ];

    const newPackage = {
      name: "Hanoi Explorer Package",
      destination: "Hanoi, Vietnam",
      duration: 4,
      price: 24000,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Hanoi ₹24,000 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹24,000');
    console.log('- Duration: 4 days');
    console.log('- Destination: Hanoi, Vietnam');
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

createHanoi24000();
