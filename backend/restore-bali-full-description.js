const mongoose = require('mongoose');
require('dotenv').config();

async function restoreBaliDescription() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const fullDescription = `🏨 ACCOMMODATION DETAILS

NIGHT 1-4 – KUTA
🏨 Eden Hotel Kuta
🛏️ Eden Room – 4 Nights
🍽️ Bed & Breakfast

NIGHT 5-6 – UBUD
🏨 Freddies Resort & Villas Ubud
🛏️ Deluxe Room – 2 Nights
🍽️ Bed & Breakfast

💰 PACKAGE PRICE
₹25,000 /- Per Person + Tax

📅 TRAVEL DETAILS
Travel Dates: After 5 January
Number Of Person: 2 Adults
Travel Destination: Bali
No of Days And Night: 6 night / 7 Days

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🚗🌿

📌 CANCELLATION & REFUND POLICY

Refund amount is subject to the cancellation date and the departure date as mentioned below:

• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`;

    const result = await packagesCollection.updateOne(
      { 
        destination: 'Bali, Indonesia',
        price: 25000 
      },
      {
        $set: {
          description: fullDescription
        }
      }
    );

    console.log('\n✅ Restored full description!');
    console.log('Modified count:', result.modifiedCount);
    console.log('\nNew description length:', fullDescription.length);
    console.log('\nPreview:');
    console.log(fullDescription.substring(0, 200) + '...');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

restoreBaliDescription();
