const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function updateBalibudgetPackage() {
  try {
    console.log('📝 Updating Bali Budget Package with correct details from PDF...\n');

    // Find the Bali Budget Package (₹25,000)
    const budgetPackage = await Package.findOne({ price: 25000, category: 'Bali' });

    if (!budgetPackage) {
      console.error('❌ Bali Budget Package not found!');
      process.exit(1);
    }

    // Update with correct details from PDF
    const updatedData = {
      name: 'Bali Budget Package',
      destination: 'Bali, Indonesia',
      duration: 7, // 6 nights / 7 days
      price: 25000,
      description: 'Experience the magic of Bali with our 6 nights / 7 days budget package. Stay at Eden Hotel in Kuta and Freddies Resort in Ubud. Enjoy water sports, island tours, cultural visits, ATV rides, and the famous Bali Swing. Perfect for couples looking for adventure and relaxation.',
      itinerary: [
        'Day 1 – Arrival in Bali (Kuta): Arrival at Ngurah Rai Airport → meet & greet → private transfer → hotel check-in at Eden Hotel, Kuta → rest and relax',
        'Day 2 – Water Sports + Uluwatu: Jet ski, banana boat, parasailing → Padang Padang Beach → Uluwatu Temple → coastal views → back to hotel',
        'Day 3 – Nusa Penida West Island Tour: Speed boat to Nusa Penida → Kelingking Beach, Broken Beach, Angel\'s Billabong, Crystal Bay → snack lunch → return to Kuta',
        'Day 4 – North Bali Tour: Ulun Danu Beratan Temple → Handara Gate → mountain & lake views → return to hotel',
        'Day 5 – ATV + Swing → Ubud: ATV ride (1 bike for 2 persons) → Bali Swing at My Swings → transfer to Ubud → check-in at Freddies Resort & Villas',
        'Day 6 – Free Day (Ubud): Explore Ubud market → cafes/spa → relax and enjoy at your own pace',
        'Day 7 – Departure: Check-out from hotel → private transfer to Ngurah Rai Airport → fly back home'
      ],
      inclusions: [
        '6 nights accommodation in 4★ hotels (Eden Hotel Kuta + Freddies Resort Ubud)',
        'Daily breakfast at hotels',
        'All sightseeing & tours as per itinerary',
        'Water sports activities (jet ski, banana boat, parasailing)',
        'Nusa Penida island tour with speed boat',
        'ATV ride and Bali Swing experience',
        'Private airport and hotel transfers',
        'English-speaking driver throughout',
        'Local taxes (except GST)'
      ],
      exclusions: [
        'Airfare and visa charges',
        'Lunch and dinner (not included)',
        'Personal expenses and shopping',
        'Travel insurance',
        'GST + TCS (extra charges)',
        'Tips and gratuities',
        'Anything not mentioned in inclusions'
      ],
      featured: true,
      active: true,
      category: 'Bali',
      brochureUrl: 'http://localhost:5000/brochures/bali-25000.pdf'
    };

    await Package.updateOne({ _id: budgetPackage._id }, { $set: updatedData });

    console.log('✅ Bali Budget Package updated successfully!\n');
    console.log('📋 Updated Details:');
    console.log(`   Name: ${updatedData.name}`);
    console.log(`   Duration: ${updatedData.duration} days (6 nights / 7 days)`);
    console.log(`   Price: ₹${updatedData.price.toLocaleString()} per person + tax`);
    console.log(`   Hotels: Eden Hotel (Kuta) + Freddies Resort (Ubud)`);
    console.log(`   Activities: Water sports, Nusa Penida, North Bali, ATV, Bali Swing`);
    console.log('\n🌐 View at: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating package:', error);
    process.exit(1);
  }
}

updateBalibudgetPackage();
