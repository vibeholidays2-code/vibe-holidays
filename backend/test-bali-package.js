const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function testBaliPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const pkg = await Package.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    }).lean();

    if (!pkg) {
      console.log('❌ Package not found!');
      return;
    }

    console.log('✅ Package found!');
    console.log('\nPackage Name:', pkg.name);
    console.log('Price:', pkg.price);
    console.log('Images:', pkg.images.length);
    console.log('Itinerary type:', Array.isArray(pkg.itinerary) ? 'Array' : typeof pkg.itinerary);
    console.log('Itinerary items:', pkg.itinerary ? pkg.itinerary.length : 0);
    
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      console.log('\nFirst itinerary item type:', typeof pkg.itinerary[0]);
      console.log('First 100 chars:', pkg.itinerary[0].substring(0, 100));
    }

    console.log('\nInclusions:', pkg.inclusions ? pkg.inclusions.length : 0);
    console.log('Exclusions:', pkg.exclusions ? pkg.exclusions.length : 0);
    console.log('\nDescription length:', pkg.description ? pkg.description.length : 0);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testBaliPackage();
