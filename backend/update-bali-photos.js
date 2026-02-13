const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority';

// Package Schema
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  thumbnail: String,
  images: [String],
});

const Package = mongoose.model('Package', packageSchema);

// Bali photos from Cloudinary (using the newest 1800x1200 photos)
const baliPhotos = [
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969372/27_ykwu9i.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969369/25_xtizam.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969369/30_pphvcb.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969369/26_pvedg0.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969368/29_eu4myp.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969367/28_rfhhes.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969367/31_tmu05r.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969367/33_h2h4pl.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969366/32_azqf79.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969366/35_tbji6b.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969366/34_y6nwgl.png',
];

async function updateBaliPhotos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Find all Bali packages
    const baliPackages = await Package.find({
      $or: [
        { destination: /bali/i },
        { name: /bali/i },
      ]
    }).sort({ _id: 1 });

    console.log(`Found ${baliPackages.length} Bali packages:\n`);
    baliPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} (${pkg.destination})`);
    });

    if (baliPackages.length === 0) {
      console.log('\nNo Bali packages found!');
      await mongoose.connection.close();
      return;
    }

    console.log('\n📸 Updating Bali packages with ONE unique photo each...\n');

    const timestamp = Date.now();

    for (let i = 0; i < baliPackages.length; i++) {
      const pkg = baliPackages[i];
      // Assign a unique photo to each package
      const photoIndex = i % baliPhotos.length;
      const uniquePhoto = baliPhotos[photoIndex];
      const photoWithCache = `${uniquePhoto}?v=${timestamp}`;
      
      console.log(`Updating: ${pkg.name}`);
      console.log(`  Assigning photo ${photoIndex + 1}: ${uniquePhoto.split('/').pop()}`);
      
      // Set both thumbnail and images to the same single photo
      pkg.thumbnail = photoWithCache;
      pkg.images = [photoWithCache]; // Only ONE photo in array
      
      await pkg.save();
      console.log(`  ✅ Updated with 1 unique photo\n`);
    }

    console.log('✅ All Bali packages updated successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Packages updated: ${baliPackages.length}`);
    console.log(`   Photos per package: 1 (unique)`);
    console.log(`   Total unique photos used: ${Math.min(baliPackages.length, baliPhotos.length)}`);
    console.log(`   Cache-buster timestamp: ${timestamp}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('\n⚠️  Please hard refresh your browser (Ctrl+Shift+R) to see changes!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateBaliPhotos();
