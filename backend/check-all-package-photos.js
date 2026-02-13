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

async function checkAllPackagePhotos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Get ALL packages
    const allPackages = await Package.find({}).sort({ destination: 1, name: 1 });

    console.log('📊 ALL PACKAGES - Photo Check\n');
    console.log('='.repeat(100));

    // Track photo usage
    const photoUsage = {};

    allPackages.forEach((pkg, index) => {
      const thumbnail = pkg.thumbnail || 'NONE';
      const photoName = thumbnail !== 'NONE' ? thumbnail.split('/').pop() : 'NONE';
      const imageCount = pkg.images ? pkg.images.length : 0;

      console.log(`\n${index + 1}. ${pkg.name}`);
      console.log(`   Destination: ${pkg.destination}`);
      console.log(`   Thumbnail: ${photoName}`);
      console.log(`   Image count: ${imageCount}`);

      // Track usage
      if (thumbnail !== 'NONE') {
        if (!photoUsage[thumbnail]) {
          photoUsage[thumbnail] = [];
        }
        photoUsage[thumbnail].push(pkg.name);
      }
    });

    console.log('\n' + '='.repeat(100));
    console.log('\n🔍 DUPLICATE PHOTO ANALYSIS:\n');

    const duplicates = Object.entries(photoUsage).filter(([photo, packages]) => packages.length > 1);

    if (duplicates.length > 0) {
      console.log('❌ Found duplicate photos:\n');
      duplicates.forEach(([photo, packages]) => {
        console.log(`Photo: ${photo.split('/').pop()}`);
        console.log(`Used by ${packages.length} packages:`);
        packages.forEach(name => console.log(`  - ${name}`));
        console.log('');
      });
    } else {
      console.log('✅ All photos are unique!');
    }

    console.log('\n📊 Summary:');
    console.log(`   Total packages: ${allPackages.length}`);
    console.log(`   Unique photos: ${Object.keys(photoUsage).length}`);
    console.log(`   Duplicate photos: ${duplicates.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Check complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAllPackagePhotos();
