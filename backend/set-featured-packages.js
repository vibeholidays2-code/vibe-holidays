const mongoose = require('mongoose');
require('dotenv').config();

// Import Package model
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  featured: { type: Boolean, default: false }
});

const Package = mongoose.model('Package', packageSchema);

async function setFeaturedPackages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, remove featured flag from all packages
    await Package.updateMany({}, { featured: false });
    console.log('Removed featured flag from all packages');

    // Set featured for one package from each destination
    const destinations = ['Goa', 'Jaisalmer, Rajasthan', 'Spiti Valley', 'Bali, Indonesia'];

    for (const destination of destinations) {
      const pkg = await Package.findOne({ destination });
      
      if (pkg) {
        await Package.findByIdAndUpdate(pkg._id, { featured: true });
        console.log(`✓ Set featured: ${pkg.name} (${destination})`);
      } else {
        console.log(`✗ No packages found for ${destination}`);
      }
    }

    // Verify the changes
    const featuredCount = await Package.countDocuments({ featured: true });
    console.log(`\nTotal featured packages: ${featuredCount}`);

    const featured = await Package.find({ featured: true }).select('name destination');
    console.log('\nFeatured packages:');
    featured.forEach(pkg => {
      console.log(`  - ${pkg.name} (${pkg.destination})`);
    });

    await mongoose.connection.close();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setFeaturedPackages();
