const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  thumbnail: String,
  images: [String],
  featured: Boolean
});

const Package = mongoose.model('Package', packageSchema);

async function checkPackageImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all featured packages
    const featuredPackages = await Package.find({ featured: true }).select('name destination thumbnail images');

    console.log(`\nFound ${featuredPackages.length} featured packages:\n`);
    featuredPackages.forEach(pkg => {
      console.log(`Package: ${pkg.name}`);
      console.log(`  Destination: ${pkg.destination}`);
      console.log(`  Thumbnail: ${pkg.thumbnail || 'NOT SET'}`);
      console.log(`  Images: ${pkg.images && pkg.images.length > 0 ? pkg.images.join(', ') : 'NOT SET'}`);
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPackageImages();
