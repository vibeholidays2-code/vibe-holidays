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

async function checkJaisalmerFormat() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const pkg = await Package.findOne({ 
      destination: 'Jaisalmer, Rajasthan',
      price: 7000
    });

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log('JAISALMER PACKAGE FORMAT:\n');
    console.log('Name:', pkg.name);
    console.log('Price:', pkg.price);
    console.log('\nItinerary format:');
    pkg.itinerary.forEach((day) => {
      console.log(`\nDay ${day.day}: ${day.title}`);
      console.log('Activities:');
      day.activities.forEach(act => console.log(`  ${act}`));
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkJaisalmerFormat();
