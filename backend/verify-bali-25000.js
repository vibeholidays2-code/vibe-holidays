const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  duration: Number,
  price: Number,
  description: String,
  thumbnail: String,
  images: [String],
  category: String,
  featured: Boolean,
  brochureUrl: String,
  itinerary: [
    {
      day: Number,
      title: String,
      description: String,
      activities: [String],
    },
  ],
  inclusions: [String],
  exclusions: [String],
  accommodation: [
    {
      name: String,
      location: String,
      roomType: String,
      nights: Number,
      mealPlan: String,
    },
  ],
  highlights: [String],
  cancellationPolicy: String,
});

const Package = mongoose.model('Package', packageSchema);

async function verifyBali25000() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const pkg = await Package.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    });

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log(`📦 ${pkg.name}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log(`💰 Price: ₹${pkg.price.toLocaleString()} per person + Tax`);
    console.log(`📍 Destination: ${pkg.destination}`);
    console.log(`⏱️  Duration: ${pkg.duration} Days / ${pkg.duration - 1} Nights`);
    console.log(`📝 Description: ${pkg.description}`);
    console.log(`🖼️  Images: ${pkg.images.length}`);
    console.log(`📄 Brochure: ${pkg.brochureUrl ? 'Yes' : 'No'}`);

    console.log('\n🌟 HIGHLIGHTS:');
    pkg.highlights.forEach((h, i) => console.log(`   ${i + 1}. ${h}`));

    console.log('\n🏨 ACCOMMODATION:');
    pkg.accommodation.forEach((acc, i) => {
      console.log(`   ${i + 1}. ${acc.name} - ${acc.location}`);
      console.log(`      Room: ${acc.roomType} | ${acc.nights} Nights | ${acc.mealPlan}`);
    });

    console.log('\n📅 ITINERARY:');
    pkg.itinerary.forEach((day) => {
      console.log(`\n   Day ${day.day}: ${day.title}`);
      console.log(`   ${day.description}`);
      console.log(`   Activities:`);
      day.activities.forEach(act => console.log(`      • ${act}`));
    });

    console.log('\n✅ INCLUSIONS:');
    pkg.inclusions.forEach((inc, i) => console.log(`   ${i + 1}. ${inc}`));

    console.log('\n❌ EXCLUSIONS:');
    pkg.exclusions.forEach((exc, i) => console.log(`   ${i + 1}. ${exc}`));

    console.log('\n📌 CANCELLATION POLICY:');
    console.log(pkg.cancellationPolicy);

    console.log('\n═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

verifyBali25000();
