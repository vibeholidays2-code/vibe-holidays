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

// Jaisalmer photos from Cloudinary collection (newest uploads 35-39)
const jaisalmerPhotos = [
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969707/35_kglxfw.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969706/38_etypcc.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969705/36_gc4lnd.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969705/39_gsxitn.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969704/37_oeigww.png',
];

async function updateJaisalmerPhotos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Find all Jaisalmer packages
    const jaisalmerPackages = await Package.find({
      $or: [
        { destination: /jaisalmer/i },
        { name: /jaisalmer/i },
      ]
    }).sort({ _id: 1 });

    console.log(`Found ${jaisalmerPackages.length} Jaisalmer packages:\n`);
    jaisalmerPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} (${pkg.destination})`);
    });

    if (jaisalmerPackages.length === 0) {
      console.log('\nNo Jaisalmer packages found!');
      await mongoose.connection.close();
      return;
    }

    console.log('\n📸 Updating Jaisalmer packages with ONE unique photo each...\n');

    const timestamp = Date.now();

    for (let i = 0; i < jaisalmerPackages.length; i++) {
      const pkg = jaisalmerPackages[i];
      // Assign a unique photo to each package
      const photoIndex = i % jaisalmerPhotos.length;
      const uniquePhoto = jaisalmerPhotos[photoIndex];
      const photoWithCache = `${uniquePhoto}?v=${timestamp}`;
      
      console.log(`Updating: ${pkg.name}`);
      console.log(`  Assigning photo ${photoIndex + 1}: ${uniquePhoto.split('/').pop()}`);
      
      // Set both thumbnail and images to the same single photo
      pkg.thumbnail = photoWithCache;
      pkg.images = [photoWithCache]; // Only ONE photo in array
      
      await pkg.save();
      console.log(`  ✅ Updated with 1 unique photo\n`);
    }

    console.log('✅ All Jaisalmer packages updated successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Packages updated: ${jaisalmerPackages.length}`);
    console.log(`   Photos per package: 1 (unique)`);
    console.log(`   Total unique photos used: ${Math.min(jaisalmerPackages.length, jaisalmerPhotos.length)}`);
    console.log(`   Cache-buster timestamp: ${timestamp}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('\n⚠️  Please hard refresh your browser (Ctrl+Shift+R) to see changes!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateJaisalmerPhotos();
