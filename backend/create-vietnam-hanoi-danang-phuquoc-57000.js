const mongoose = require('mongoose');
require('dotenv').config();

async function createHanoiDanangPhuQuoc57000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

HANOI – 3 Nights
🏨 Skylark Hotel, Hanoi
🛏️ Superior Room Double Bed No window

DA NANG – 3 Nights
🏨 Grand Citiview Hotel, Da Nang
🛏️ Superior Double Room

PHU QUOC – 2 Nights
🏨 Myrtle Boutique Hotel, Phu Quoc
🛏️ Suite Room

💰 PACKAGE PRICE
₹57,000 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: Hanoi – Da Nang – Phu Quoc
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
      "⭐ DAY 1 – ARRIVAL HANOI | CITY TOUR\n\n✈️ Arrival at Hanoi International Airport\n🚗 Private transfer to hotel\n🏨 Check-in & freshen up\n\n🏙️ Hanoi City Tour:\n  • Ho Chi Minh Mausoleum (outside)\n  • One Pillar Pagoda\n  • Temple of Literature\n  • Hoan Kiem Lake\n  • Old Quarter walking tour\n\n🛌 Overnight stay at Skylark Hotel, Hanoi",
      
      "⭐ DAY 2 – NINH BINH (HOA LU – TAM COC)\n\n🍳 Breakfast at hotel\n🚐 Full-day excursion to Ninh Binh\n\n🌿 Sightseeing:\n  • Hoa Lu Ancient Capital\n  • Tam Coc Boat Ride (limestone caves)\n  • Village cycling experience\n\n🛌 Overnight stay at Hanoi",
      
      "⭐ DAY 3 – HALONG BAY DAY CRUISE\n\n🍳 Breakfast\n🚗 Transfer to Halong Bay\n\n🛳️ 4★ Day Cruise Includes:\n  • Scenic limestone islands\n  • Surprising Cave\n  • Titop Island\n  • Kayaking / Bamboo boat\n\n🍽️ Lunch on cruise\n🌅 Return to Hanoi by evening\n🛌 Overnight stay at Hanoi",
      
      "⭐ DAY 4 – HANOI ✈️ DA NANG\n\n🍳 Breakfast & check-out\n✈️ Flight to Da Nang (own arrangement)\n🚐 Airport pickup & hotel transfer\n🌊 Evening free at beach / cafes\n🛌 Overnight stay at Grand Citiview Hotel, Da Nang",
      
      "⭐ DAY 5 – HOI AN & COCONUT FOREST\n\n🍳 Breakfast\n🚐 Excursion to Cam Thanh Coconut Forest\n🛶 Basket Boat Ride\n\n🏮 Hoi An Ancient Town:\n  • Japanese Covered Bridge\n  • Old Merchant Houses\n  • Lantern Market\n\n🛌 Overnight stay at Da Nang",
      
      "⭐ DAY 6 – BANA HILLS & GOLDEN HAND BRIDGE\n\n🍳 Breakfast\n🚐 Full-day tour to Bana Hills\n🚡 Cable Car Ride\n🌉 Golden Hand Bridge\n🎢 Fantasy Park\n🍽️ Indian Buffet Lunch Included\n🛌 Overnight stay at Da Nang",
      
      "⭐ DAY 7 – DA NANG ✈️ PHU QUOC\n\n🍳 Breakfast & check-out\n✈️ Flight to Phu Quoc (own arrangement)\n🚐 Airport pickup & hotel transfer\n🏝️ Rest & leisure at beach\n🛌 Overnight stay at Myrtle Boutique Hotel, Phu Quoc",
      
      "⭐ DAY 8 – PHU QUOC ISLAND TOUR\n\n🍳 Breakfast\n\n🚤 4 Island Tour by Speedboat:\n  • Snorkeling & swimming\n  • Coral viewpoints\n\n🎢 Aquatopia Water Park\n🚡 World's Longest Over-Water Cable Car\n🍽️ Lunch included\n🛌 Overnight stay at Phu Quoc",
      
      "⭐ DAY 9 – DEPARTURE\n\n🍳 Breakfast & check-out\n🚗 Transfer to Phu Quoc Airport\n✨ Tour ends with beautiful memories"
    ];

    const inclusions = [
      "8 Nights accommodation (mentioned hotels)",
      "Daily breakfast",
      "All airport & intercity transfers",
      "All sightseeing as per itinerary",
      "Halong Bay 4★ day cruise with lunch",
      "Bana Hills tour with Indian lunch",
      "Phu Quoc island tour with lunch",
      "English-speaking local guide",
      "Travel Insurance INCLUDED",
      "GST INCLUDED",
      "TCS INCLUDED",
      "All local taxes"
    ];

    const exclusions = [
      "International & domestic flights",
      "Vietnam Visa",
      "Personal expenses",
      "Anything not mentioned above"
    ];

    const newPackage = {
      name: "Hanoi - Da Nang - Phu Quoc Explorer",
      destination: "Hanoi + Da Nang + Phu Quoc, Vietnam",
      duration: 9,
      price: 57000,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Hanoi - Da Nang - Phu Quoc ₹57,000 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹57,000');
    console.log('- Duration: 9 days');
    console.log('- Destination: Hanoi + Da Nang + Phu Quoc, Vietnam');
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

createHanoiDanangPhuQuoc57000();
