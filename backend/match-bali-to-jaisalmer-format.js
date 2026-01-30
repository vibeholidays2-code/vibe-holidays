const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function matchBaliToJaisalmer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const pkg = await Package.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    });

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log(`Updating: ${pkg.name}`);

    // Update to match EXACT Jaisalmer format - itinerary as array of strings
    pkg.description = `🏨 ACCOMMODATION DETAILS

NIGHT 1-4 – KUTA
🏨 Eden Hotel Kuta
🛏️ Eden Room
🍽️ Bed & Breakfast

NIGHT 5-6 – UBUD
🏨 Freddies Resort & Villas
🛏️ Deluxe Room
🍽️ Bed & Breakfast

💰 PACKAGE COST (PER PERSON + TAX)
₹25,000 per person

📅 TRAVEL DATES
After 5 January
👥 Minimum: 2 Adults

🌴 6 NIGHTS / 7 DAYS BALI ADVENTURE
We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🌿`;

    pkg.itinerary = [
      `🌞 Day 1 – Arrival in Bali | Transfer to Kuta

✈️ Arrival at Ngurah Rai International Airport
🤝 Meet & greet by local representative
🚗 Private transfer to hotel in Kuta
🏨 Check-in & rest
🛌 Overnight stay at Kuta`,

      `🌊 Day 2 – Water Sports + Uluwatu Tour

🍳 Breakfast at hotel

🌊 Enjoy thrilling water sports:
  ✔️ Jet Ski
  ✔️ Banana Boat
  ✔️ Parasailing

🏖️ Visit Padang Padang Beach
🛕 Visit Uluwatu Temple
🌊 Enjoy scenic coastal views

🚗 Return to hotel
🛌 Overnight stay at Kuta`,

      `🏝️ Day 3 – Nusa Penida West Island Tour

🌅 Early breakfast
🚤 Speed boat to Nusa Penida

📸 Visit iconic spots:
  ✔️ Kelingking Beach
  ✔️ Broken Beach
  ✔️ Angel's Billabong
  ✔️ Crystal Bay

🥪 Local snack lunch included
🚤 Return to Bali mainland
🛌 Overnight stay at Kuta`,

      `🛕 Day 4 – Ulun Danu Temple & Handara Gate

🍳 Breakfast at hotel
🚗 Full day North Bali tour

🛕 Visit Ulun Danu Beratan Temple
📸 Stop at famous Handara Gate
🌿 Scenic mountain & lake views

🚗 Return to hotel
🛌 Overnight stay at Kuta`,

      `🏍️ Day 5 – ATV Ride + Swing | Transfer to Ubud

🍳 Breakfast & check-out

🏍️ ATV Ride (1 Bike for 2 Persons)
🌴 Experience Bali Swing (My Swings)

🚗 Transfer to Ubud
🏨 Check-in at hotel
🛌 Overnight stay at Ubud`,

      `🌴 Day 6 – Free Day at Leisure

🍳 Breakfast at hotel

🛍️ Explore Ubud market
☕ Cafe hopping / Spa / Relax
🌿 Enjoy nature & peaceful vibes

🛌 Overnight stay at Ubud`,

      `✈️ Day 7 – Departure from Bali

🍳 Breakfast & check-out
🚗 Private transfer from Ubud to Airport

✈️ Departure with beautiful memories`
    ];

    pkg.inclusions = [
      "6 Nights accommodation in 4★ hotels",
      "Daily Breakfast",
      "All sightseeing & tours as per itinerary",
      "Water sports & adventure activities",
      "Private airport & hotel transfers",
      "English-speaking driver",
      "Local taxes (Except GST)"
    ];

    pkg.exclusions = [
      "Airfare",
      "Visa charges",
      "Lunch & Dinner",
      "Personal expenses",
      "Travel insurance",
      "Anything not mentioned above",
      "GST + TCS extra as applicable"
    ];

    // Remove fields that Jaisalmer doesn't have
    pkg.accommodation = undefined;
    pkg.highlights = undefined;
    pkg.cancellationPolicy = undefined;

    await pkg.save();

    console.log('\n✅ Bali package now matches Jaisalmer format exactly!');
    console.log('\nItinerary (as string array):');
    pkg.itinerary.forEach((day, index) => {
      console.log(`\n--- Day ${index + 1} ---`);
      console.log(day);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

matchBaliToJaisalmer();
