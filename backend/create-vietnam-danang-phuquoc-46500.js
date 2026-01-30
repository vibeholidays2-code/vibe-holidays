const mongoose = require('mongoose');
require('dotenv').config();

async function createDanangPhuQuoc46500() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const description = `🏨 ACCOMMODATION DETAILS

DA NANG – 3 Nights
🏨 Grand Citiview Danang Hotel
🛏️ Superior Double Room

PHU QUOC – 3 Nights
🏨 Myrtle Boutique Hotel, Phu Quoc
🛏️ Suite Room

💰 PACKAGE PRICE
₹46,500 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: After 10 January 2026
Number Of Person: 2 Adults
Travel Destination: Da Nang – Phu Quoc
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
      "✈️🤝 Day 1 – Arrival in Da Nang\n\n✈️ Arrival at Da Nang International Airport\n🚗 Private airport transfer to hotel\n🏨 Check-in & rest of the day at leisure\n🛌 Overnight stay in Da Nang",
      
      "🏔🌉 Day 2 – Ba Na Hills Tour with Indian Lunch (SIC)\n\n🍳 Breakfast at hotel\n🚐 Hotel pickup (07:30–08:00)\n🚡 Cable Car Ride (World Record holder)\n\n📍 Visit:\n  • Golden Bridge\n  • Linh Ung Pagoda\n  • Le Jardin D'Amour Gardens\n  • French Village\n  • Fantasy Park\n\n🍽️ Indian Buffet Lunch at Bharat Restaurant\n🎢 Free time for Fantasy Park & shows\n🚗 Return to hotel\n🛌 Overnight stay in Da Nang",
      
      "🛕🚣 Day 3 – Coconut Forest + Basket Boat + Hoi An with Dinner (SIC)\n\n🍳 Breakfast at hotel\n🚐 Afternoon pickup\n\n📍 Enroute visit:\n  • Non Nuoc Stone Carving Village\n\n🌴 Coconut Forest Experience:\n  • Basket boat ride\n  • Crab catching & local activities\n\n🏮 Hoi An Ancient Town:\n  • Japanese Covered Bridge\n  • Assembly Halls\n  • Old Houses\n  • Lantern-lit streets & Night Market\n\n🍽️ Dinner at Hoi An Restaurant\n🚗 Return to Da Nang\n🛌 Overnight stay in Da Nang",
      
      "✈️🌴 Day 4 – Da Nang → Phu Quoc\n\n🍳 Breakfast & check-out\n🚗 Transfer to Da Nang Airport\n✈️ Flight to Phu Quoc (not included)\n✈️ Arrival at Phu Quoc Airport\n🚗 Private transfer to hotel (North Phu Quoc)\n🏨 Check-in & leisure time\n🛌 Overnight stay in Phu Quoc",
      
      "🏝🚤 Day 5 – 4 Island Tour + Aquatopia Water Park & Cable Car (SIC)\n\n🍳 Breakfast at hotel\n🚐 Morning pickup\n\n🚤 Island Hopping Tour:\n  • May Rut Trong Island – beach & swimming\n  • Gam Ghi Island – snorkeling (gear provided)\n  • May Rut Ngoai Island\n\n🍽️ Buffet Lunch at Hon Thom Island\n🎢 Aquatopia Water Park\n🚡 Hon Thom Cable Car Ride (world's longest overwater cable car)\n📸 Flycam photos & videos included\n🚗 Return to hotel\n🛌 Overnight stay in Phu Quoc (PVT)",
      
      "🦁🎢 Day 6 – Vinpearl Safari + VinWonders + Grand World\n\n🍳 Breakfast at hotel\n🚗 Private transfer\n🦒 Vinpearl Safari – open zoo experience\n🎢 VinWonders Theme Park\n🧜 Mermaid Show at Aquarium (time-bound)\n\n🌆 Evening visit to Grand World Phu Quoc:\n  • Venice River\n  • European-style streets\n  • Boat ride optional, self-paid\n\n🚗 Return to hotel\n🛌 Overnight stay in Phu Quoc",
      
      "✈️👋 Day 7 – Departure from Phu Quoc\n\n🍳 Breakfast & check-out\n🚗 Private transfer to Phu Quoc Airport\n✈️ Departure with beautiful memories 🇻🇳"
    ];

    const inclusions = [
      "6 Nights accommodation",
      "Daily breakfast",
      "Private airport transfers",
      "All sightseeing & tours as per itinerary",
      "Ba Na Hills tour with Indian lunch",
      "Coconut Forest + Hoi An tour with dinner",
      "4 Island Tour + Aquatopia Water Park & Cable Car",
      "Vinpearl Safari + VinWonders + Grand World combo",
      "English-speaking tour guide (as per tours)",
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
      name: "Da Nang - Phu Quoc Beach Escape",
      destination: "Da Nang + Phu Quoc, Vietnam",
      duration: 7,
      price: 46500,
      description: description,
      itinerary: itinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      images: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80"],
      thumbnail: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80",
      category: "Vietnam",
      featured: true,
      active: true,
      brochureUrl: ""
    };

    const result = await packagesCollection.insertOne(newPackage);

    console.log('\n✅ Da Nang - Phu Quoc ₹46,500 package created successfully!');
    console.log('Package ID:', result.insertedId);
    console.log('\nPackage Details:');
    console.log('- Name:', newPackage.name);
    console.log('- Price: ₹46,500');
    console.log('- Duration: 7 days');
    console.log('- Destination: Da Nang + Phu Quoc, Vietnam');
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

createDanangPhuQuoc46500();
