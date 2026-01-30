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
});

const Package = mongoose.model('Package', packageSchema);

async function checkAllPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const allPackages = await Package.find({}).sort({ destination: 1, price: 1 });
    console.log(`\nTotal packages: ${allPackages.length}\n`);

    const byDestination = {};
    allPackages.forEach(pkg => {
      if (!byDestination[pkg.destination]) {
        byDestination[pkg.destination] = [];
      }
      byDestination[pkg.destination].push(pkg);
    });

    Object.keys(byDestination).forEach(dest => {
      console.log(`\n=== ${dest} (${byDestination[dest].length} packages) ===`);
      byDestination[dest].forEach((pkg, index) => {
        console.log(`${index + 1}. ${pkg.name}`);
        console.log(`   Price: ₹${pkg.price.toLocaleString()}`);
        console.log(`   Images: ${pkg.images.length}`);
        console.log(`   Category: ${pkg.category || 'Not set'}`);
        console.log(`   Brochure: ${pkg.brochureUrl ? 'Yes' : 'No'}`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkAllPackages();
