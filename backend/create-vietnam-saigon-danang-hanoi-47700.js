const mongoose = require('mongoose');
require('dotenv').config();

async function createSaigonDanangHanoi47700() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

HO CHI MINH CITY – 2 Nights
🏨 Ciao SaiGon Hotel & Spa
🛏️ Deluxe Double Room with Window

DA NANG – 2 Nights
🏨 Grand Citiview Da Nang
🛏️ Superior Double Room

HANOI – 2 Nights
🏨 The Bloom Ha Noi
🛏️ Superior King Studio Room

HALONG BAY – 1 Night
🛳️ 4★ Overnight Cruise
🛏️ Deluxe Ocean View Cabin

💰 PACKAGE PRICE
₹47,700 /- Per Person (All Inclusive)

📅 TRAVEL DETAILS
Travel Date: MARCH 2026
Number Of Person: 2 Adults
Travel Destination: Ho Chi Minh • Da Nang • Hanoi
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
      "🛬 DAY 1 | ARRIVAL HANOI – MEGA GRAND WORLD\n\n✈️ Arrival at Hanoi International Airport\n🚗 Private transfer to hotel\n🏨 Hotel check-in (14:00 hrs)\n\n🌆 Evening Visit – Mega Grand World (Ocean City):\n  • Italian & Korean themed zones\n  • Free entry\n  • Gondola rides, shopping & night shows (direct payment)\n\n🌙 Return to hotel\n🛌 Overnight stay at The Bloom Ha Noi",
      
      "🚍 DAY 2 | HANOI → HALONG BAY – OVERNIGHT CRUISE\n\n🍽️ Breakfast at hotel\n🚐 SIC transfer to Halong Bay\n\n🛳️ Board 4★ Cruise:\n  • Welcome drink & lunch\n  • Kayaking at Luon Cave\n  • Swimming at Titop Beach\n  • Cooking demonstration\n\n🍽️ Dinner on cruise\n🌌 Enjoy night view, squid fishing & music\n🛌 Overnight on Halong Bay Cruise",
      
      "🌅 DAY 3 | HALONG BAY → HANOI → DA NANG\n\n🌄 Sunrise & Tai Chi on deck\n🍽️ Light breakfast\n🏞️ Sung Sot Cave exploration\n🍽️ Brunch on cruise\n🚗 Private transfer to Hanoi Airport\n✈️ Flight to Da Nang (evening flight recommended)\n🚐 Arrival transfer to hotel\n🛌 Overnight stay at Grand Citiview Da Nang",
      
      "🌉 DAY 4 | BA NA HILLS – GOLDEN HAND BRIDGE\n\n🍽️ Breakfast at hotel\n🚐 SIC pickup for Ba Na Hills Tour\n🚡 World-record cable car ride\n🌉 Visit Golden Hand Bridge\n🏰 French Village & gardens\n🎢 Fantasy Park games\n🍛 Indian Buffet Lunch at Bharat Restaurant\n⏰ Evening return to hotel\n🛌 Overnight stay at Grand Citiview Da Nang",
      
      "✈️ DAY 5 | DA NANG → HO CHI MINH CITY\n\n🍽️ Breakfast & hotel check-out\n🚗 Transfer to Da Nang Airport\n✈️ Flight to Ho Chi Minh City\n🚗 Arrival transfer to hotel\n🌆 Evening free for shopping & nightlife (District 1)\n🛌 Overnight stay at Ciao Saigon Hotel & Spa",
      
      "🚤 DAY 6 | CU CHI TUNNELS + MEKONG DELTA\n\n🍽️ Breakfast at hotel\n🚐 Full-day SIC tour\n\n🕳️ Explore Cu Chi Tunnels\n🚤 Mekong River boat ride\n🍯 Honey farm & coconut candy workshop\n🍽️ Local lunch included\n🛍️ Drop at Ben Thanh Market\n🎶 Traditional music & fruit tasting\n🛌 Overnight stay at Ciao Saigon Hotel & Spa",
      
      "✈️ DAY 7 | DEPARTURE – HO CHI MINH\n\n🍽️ Breakfast at hotel\n🏨 Check-out\n🚗 Airport transfer\n✈️ Fly back with beautiful Vietnam memories 🇻🇳"
    ];

    const inclusions = [
      "6 Nights accommodation in mentioned hotels",
      "Daily breakfast",
      "Halong Bay Cruise (Lunch + Dinner + Brunch)",
      "Airport & intercity transfers",
      "Sightseeing as per itinerary",
      "English speaking guide (SIC tours)",
      "Travel Insurance INCLUDED",
      "GST INCLUDED",
      "TCS INCLUDED"
    ];

    const exclusions = [
      "International Flights",
      "Vietnam Visa",
      "Personal expenses",
      "Optional rides & activities",
      "Anything not mentioned above"
    ];

    const newPackage = {
      name: "Vietnam Grand Circuit with Halong Cruise",
      destination: "Ho Chi Minh + Da Nang + Hanoi, Vietnam",
      duration: 7,
      price: 47700,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Vietnam Grand Circuit ₹47,700 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹47,700');
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

createSaigonDanangHanoi47700();
