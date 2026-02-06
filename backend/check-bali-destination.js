const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  featured: { type: Boolean, default: false }
});

const Package = mongoose.model('Package', packageSchema);

async function checkBaliPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all packages with "Bali" in the name or destination
    const baliPackages = await Package.find({
      $or: [
        { name: { $regex: 'Bali', $options: 'i' } },
        { destination: { $regex: 'Bali', $options: 'i' } }
      ]
    }).select('name destination');

    console.log(`\nFound ${baliPackages.length} Bali packages:`);
    baliPackages.forEach(pkg => {
      console.log(`  - ${pkg.name}`);
      console.log(`    Destination: "${pkg.destination}"`);
      console.log(`    ID: ${pkg._id}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBaliPackages();
