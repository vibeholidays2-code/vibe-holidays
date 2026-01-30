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

async function organizeBaliPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all Bali packages
    const baliPackages = await Package.find({ destination: 'Bali, Indonesia' });
    console.log(`\nFound ${baliPackages.length} Bali packages`);

    for (const pkg of baliPackages) {
      console.log(`\n--- Processing: ${pkg.name} ---`);
      console.log(`Current images count: ${pkg.images.length}`);
      
      // Keep only the first image (cover photo)
      const coverPhoto = pkg.images[0] || pkg.thumbnail;
      
      // Update package
      pkg.thumbnail = coverPhoto;
      pkg.images = [coverPhoto];
      
      // Ensure it has a category
      if (!pkg.category) {
        pkg.category = 'International';
      }
      
      await pkg.save();
      console.log(`✓ Updated: ${pkg.name}`);
      console.log(`  - Thumbnail: ${pkg.thumbnail}`);
      console.log(`  - Images: ${pkg.images.length} (cover only)`);
      console.log(`  - Category: ${pkg.category}`);
    }

    console.log('\n✅ All Bali packages organized successfully!');
    console.log('\nBali Packages Summary:');
    
    const updatedPackages = await Package.find({ destination: 'Bali, Indonesia' }).sort({ price: 1 });
    updatedPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} - ₹${pkg.price.toLocaleString()}`);
      console.log(`   Images: ${pkg.images.length}, Category: ${pkg.category}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

organizeBaliPackages();
