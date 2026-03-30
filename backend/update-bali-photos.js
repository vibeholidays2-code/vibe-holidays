const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

// Cloudinary images from the collection
const cloudinaryImages = [
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969369/25_xtizam.jpg',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969369/26_pvedg0.jpg',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969367/28_rfhhes.jpg',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969368/29_eu4myp.jpg',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969367/33_h2h4pl.jpg',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969366/35_tbji6b.jpg'
];

async function updatePhotos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all Bali packages sorted by price
    const packages = await Package.find({ 
      destination: 'Bali, Indonesia' 
    }).sort({ price: 1 });

    console.log(`\nFound ${packages.length} Bali packages\n`);

    // Update each package with a different image
    for (let i = 0; i < packages.length && i < cloudinaryImages.length; i++) {
      const pkg = packages[i];
      const imageUrl = cloudinaryImages[i];
      
      await Package.updateOne(
        { _id: pkg._id },
        { $set: { images: [imageUrl] } }
      );

      console.log(`✅ Updated: ${pkg.name} (₹${pkg.price})`);
      console.log(`   Image: ${imageUrl}`);
      console.log('');
    }

    console.log('✅ All packages updated with Cloudinary photos!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePhotos();
