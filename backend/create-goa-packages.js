const mongoose = require('mongoose');
require('dotenv').config();

async function createGoaPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Package 1: Goa 3 Night 4 Days
    const goa3Night4Days = {
      name: "Goa Beach Paradise - 3N/4D",
      destination: "Goa",
      duration: 4,
      price: 12000,
      description: `🏨 ACCOMMODATION DETAILS

NIGHT 1-3 – GOA
🏨 Beach Resort, Goa
🛏️ Standard Room – 3 Nights
🍽️ Breakfast Included

💰 PACKAGE PRICE
₹12,000 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: Year Round
Number Of Person: 2 Adults
Travel Destination: Goa
No of Days And Night: 3 night / 4 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable

⭐ WHY CHOOSE VIBES HOLIDAYS?

🌍 Trusted & Experienced
Reliable planning with verified hotels and partners.

🎯 Customized Packages
Itineraries designed exactly as per your needs.

🚗 Private Clean Transport
Comfortable vehicles with professional drivers.

💰 Best Price Guarantee
Affordable rates with transparent pricing.

📞 24×7 Support
Always available on call/WhatsApp during the trip`,

      itinerary: [
        "✈️ Day 1 | Arrival in Goa\n\n• Arrival at Goa Airport/Railway Station\n• Meet & greet by local representative\n• Transfer to hotel\n• Check-in & rest\n• Evening free for leisure\n\n🛌 Overnight stay at Goa",
        
        "🏖️ Day 2 | North Goa Sightseeing\n\n🍽️ Breakfast at hotel\n🚐 Full day North Goa tour\n\n🏖️ Visit famous beaches:\n  • Calangute Beach\n  • Baga Beach\n  • Anjuna Beach\n  • Vagator Beach\n\n🛕 Visit Fort Aguada\n🛍️ Shopping at local markets\n🌅 Sunset at beach\n\n🛌 Overnight stay at Goa",
        
        "🏖️ Day 3 | South Goa Sightseeing\n\n🍽️ Breakfast at hotel\n🚐 Full day South Goa tour\n\n🏖️ Visit pristine beaches:\n  • Colva Beach\n  • Benaulim Beach\n  • Palolem Beach\n\n⛪ Visit Old Goa Churches\n🏛️ Basilica of Bom Jesus\n🌴 Spice Plantation visit (optional)\n\n🛌 Overnight stay at Goa",
        
        "✈️ Day 4 | Departure\n\n🍽️ Breakfast at hotel\n⏰ Check-out from hotel\n🛍️ Last minute shopping\n🚗 Transfer to Airport/Railway Station\n✈️ Departure with beautiful memories"
      ],

      inclusions: [
        "3 Nights accommodation in beach resort",
        "Daily breakfast",
        "North Goa sightseeing tour",
        "South Goa sightseeing tour",
        "Airport/Railway station transfers",
        "All transportation by AC vehicle",
        "Professional driver",
        "GST Included",
        "TCS Included"
      ],

      exclusions: [
        "Airfare/Train tickets",
        "Lunch & Dinner",
        "Water sports activities",
        "Personal expenses",
        "Entry fees to monuments",
        "Anything not mentioned above"
      ],

      images: [
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&q=80"
      ],
      thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
      category: "Goa",
      featured: true,
      active: true,
      brochureUrl: "/pdfs/goa/🏝️ GOA  3 Night 4 days.pdf"
    };

    // Package 2: Goa Group Tour Package
    const goaGroupTour = {
      name: "Goa Group Tour Package",
      destination: "Goa",
      duration: 5,
      price: 15000,
      description: `🏨 ACCOMMODATION DETAILS

NIGHT 1-4 – GOA
🏨 Premium Beach Resort, Goa
🛏️ Deluxe Room – 4 Nights
🍽️ Breakfast & Dinner Included

💰 PACKAGE PRICE
₹15,000 /- Per Person

📅 TRAVEL DETAILS
Travel Dates: Year Round
Number Of Person: Group (Min 10 People)
Travel Destination: Goa
No of Days And Night: 4 night / 5 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🏝🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable

⭐ WHY CHOOSE VIBES HOLIDAYS?

🌍 Trusted & Experienced
Reliable planning with verified hotels and partners.

🎯 Customized Packages
Itineraries designed exactly as per your needs.

🚗 Private Clean Transport
Comfortable vehicles with professional drivers.

💰 Best Price Guarantee
Affordable rates with transparent pricing.

📞 24×7 Support
Always available on call/WhatsApp during the trip`,

      itinerary: [
        "✈️ Day 1 | Arrival in Goa\n\n• Arrival at Goa Airport/Railway Station\n• Meet & greet by local representative\n• Transfer to resort\n• Check-in & welcome drink\n• Group orientation\n• Evening beach walk\n\n🛌 Overnight stay at Goa",
        
        "🏖️ Day 2 | North Goa Adventure\n\n🍽️ Breakfast at resort\n🚐 Full day North Goa exploration\n\n🏖️ Beach hopping:\n  • Calangute Beach\n  • Baga Beach\n  • Anjuna Beach\n  • Arambol Beach\n\n🏄‍♂️ Water sports activities\n🛕 Fort Aguada visit\n🎵 Beach shacks & live music\n🍽️ Dinner at resort\n\n🛌 Overnight stay at Goa",
        
        "🏖️ Day 3 | South Goa Serenity\n\n🍽️ Breakfast at resort\n🚐 Full day South Goa tour\n\n🏖️ Pristine beaches:\n  • Colva Beach\n  • Benaulim Beach\n  • Palolem Beach\n  • Butterfly Beach\n\n⛪ Old Goa heritage tour\n🏛️ Basilica of Bom Jesus\n⛪ Se Cathedral\n🌶️ Spice plantation with lunch\n🍽️ Dinner at resort\n\n🛌 Overnight stay at Goa",
        
        "🎉 Day 4 | Leisure & Entertainment\n\n🍽️ Breakfast at resort\n🏖️ Free time at beach\n🏊‍♂️ Resort facilities\n🛍️ Shopping at local markets\n🌅 Sunset cruise (optional)\n🎵 Group dinner with entertainment\n🎉 Beach bonfire & music\n\n🛌 Overnight stay at Goa",
        
        "✈️ Day 5 | Departure\n\n🍽️ Breakfast at resort\n⏰ Check-out from resort\n🛍️ Last minute shopping\n📸 Group photos\n🚗 Transfer to Airport/Railway Station\n✈️ Departure with unforgettable memories"
      ],

      inclusions: [
        "4 Nights accommodation in premium beach resort",
        "Daily breakfast & dinner",
        "Complete North & South Goa sightseeing",
        "Spice plantation tour with lunch",
        "Water sports activities",
        "Airport/Railway station transfers",
        "All transportation by AC coach",
        "Professional tour guide",
        "Group activities & entertainment",
        "GST Included",
        "TCS Included"
      ],

      exclusions: [
        "Airfare/Train tickets",
        "Lunch (except spice plantation)",
        "Personal expenses",
        "Alcoholic beverages",
        "Optional activities",
        "Entry fees to monuments",
        "Anything not mentioned above"
      ],

      images: [
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
      ],
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
      category: "Goa",
      featured: true,
      active: true,
      brochureUrl: "/pdfs/goa/🏝️ GOA GROUP TOUR PACKAGE.pdf"
    };

    // Insert both packages
    const result = await packagesCollection.insertMany([goa3Night4Days, goaGroupTour]);

    console.log('\n✅ Goa packages created successfully!');
    console.log('Packages inserted:', result.insertedCount);
    console.log('Package IDs:', Object.values(result.insertedIds));
    
    console.log('\n📦 Package Details:');
    console.log('\n1. Goa Beach Paradise - 3N/4D');
    console.log('   - Price: ₹12,000');
    console.log('   - Duration: 4 days');
    console.log('   - Type: Individual/Couple');
    console.log('   - Brochure: 🏝️ GOA 3 Night 4 days.pdf');
    
    console.log('\n2. Goa Group Tour Package');
    console.log('   - Price: ₹15,000');
    console.log('   - Duration: 5 days');
    console.log('   - Type: Group (Min 10 people)');
    console.log('   - Brochure: 🏝️ GOA GROUP TOUR PACKAGE.pdf');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

createGoaPackages();