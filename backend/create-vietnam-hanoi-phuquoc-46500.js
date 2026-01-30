const mongoose = require('mongoose');
require('dotenv').config();

async function createHanoiPhuQuoc46500() {
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

NIGHT 4-8 – PHU QUOC
🏨 Myrtle Boutique Hotel, Phu Quoc
🛏️ Suite Room – 5 Nights
🍽️ Breakfast Included

💰 PACKAGE PRICE
₹46,500 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: Hanoi & Phu Quoc
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
      "🌞 Day 1 – Arrival Hanoi | Afternoon City Tour\n\n✈️ Arrival at Hanoi International Airport\n🚗 Private transfer to hotel\n🏨 Check-in & freshen up\n\n🕑 Afternoon Hanoi City Tour (SIC):\n  • Temple of Literature – Vietnam's first university\n  • Hoa Lo Prison Museum (Hanoi Hilton)\n  • Local culture & heritage walk\n\n🛌 Overnight stay at Skylark Hotel, Hanoi",
      
      "🚢 Day 2 – Halong Bay 4★ Day Cruise\n\n🍳 Breakfast at hotel\n🛣️ Drive to Halong Bay via expressway\n\n🛳️ 4★ Day Cruise Experience:\n  • Limestone karst islands\n  • Sung Sot (Surprise) Cave\n  • Luon Cave – Kayaking / Bamboo Boat\n  • Ti Top Island – swimming / viewpoint\n\n🍽️ Lunch on cruise\n🌅 Evening return to Hanoi\n🛌 Overnight stay in Hanoi",
      
      "🏞️ Day 3 – Ninh Binh Day Tour (Hoa Lu Tam Coc)\n\n🍳 Breakfast\n🚐 Full-day excursion to Ninh Binh\n\n🌿 Sightseeing Includes:\n  • Hoa Lu Ancient Capital (Dinh & Le Kings Temple)\n  • Tam Coc Boat Ride (3 caves through rice fields)\n  • Village life & scenic limestone views\n\n🛌 Overnight stay in Hanoi",
      
      "✈️ Day 4 – Hanoi ✈ Phu Quoc | Island Arrival\n\n🍳 Breakfast & check-out\n🚗 Transfer to Hanoi Airport\n✈️ Flight to Phu Quoc (own arrangement)\n🚐 Airport pickup & transfer to hotel\n🏖️ Leisure time at beach\n🛌 Overnight stay at Myrtle Boutique Hotel, Phu Quoc",
      
      "🏝️ Day 5 – Phu Quoc 4 Island Tour + Aquatopia\n\n🍳 Breakfast\n\n🚤 4 Island Speedboat Tour:\n  • May Rut Trong Island – beach time\n  • Gam Ghi Island – snorkeling\n  • May Rut Ngoai Island – swimming\n\n🍽️ Buffet Lunch at Hon Thom\n💦 Aquatopia Water Park\n🚡 World's Longest Overwater Cable Car\n🛌 Overnight stay in Phu Quoc",
      
      "🦁 Day 6 – Vinpearl Safari + VinWonders + Grand World\n\n🍳 Breakfast\n🚐 Visit Vinpearl Safari – largest open zoo in Vietnam\n🎡 VinWonders Theme Park – rides & aquarium\n🍽️ Meal included\n🌆 Evening visit to Grand World Phu Quoc\n  • Venice River style area\n  • European architecture vibes\n🛌 Overnight stay in Phu Quoc",
      
      "🏖️ Day 7 – Leisure Day in Phu Quoc\n\n🍳 Breakfast at hotel\n🌴 Free day to relax at beach\n🏊 Enjoy hotel facilities\n🛍️ Optional: Shopping or spa\n🛌 Overnight stay in Phu Quoc",
      
      "🌅 Day 8 – Free Day | Explore Phu Quoc\n\n🍳 Breakfast at hotel\n🏖️ Beach relaxation\n🌊 Water activities (optional)\n🍽️ Try local seafood restaurants\n🛌 Overnight stay in Phu Quoc",
      
      "✈️ Day 9 – Departure Phu Quoc\n\n🍳 Breakfast & check-out\n🚗 Transfer to Phu Quoc Airport\n✈️ Departure with beautiful memories"
    ];

    const inclusions = [
      "8 Nights accommodation (3N Hanoi + 5N Phu Quoc)",
      "Daily breakfast",
      "All airport transfers (Private)",
      "All sightseeing as per itinerary (SIC / PVT as applicable)",
      "Hanoi City Tour",
      "Ninh Binh Tour",
      "Halong Bay 4★ Cruise with Lunch",
      "Phu Quoc 4 Island Tour with Lunch",
      "Aquatopia Water Park & Cable Car",
      "Vinpearl Safari + VinWonders + Grand World",
      "English-speaking local assistance",
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
      name: "Hanoi & Phu Quoc Island Escape",
      destination: "Hanoi + Phu Quoc, Vietnam",
      duration: 9,
      price: 46500,
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

    console.log('\n✅ Hanoi & Phu Quoc ₹46,500 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹46,500');
    console.log('- Duration: 9 days');
    console.log('- Destination: Hanoi + Phu Quoc, Vietnam');
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

createHanoiPhuQuoc46500();
