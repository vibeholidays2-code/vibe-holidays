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

async function verifySinglePhoto() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Find all Vietnam packages
    const vietnamPackages = await Package.find({
      $or: [
        { destination: /vietnam/i },
        { name: /vietnam/i },
        { name: /phu quoc/i },
      ]
    }).sort({ name: 1 });

    console.log('📊 Vietnam Package Photo Verification\n');
    console.log('='.repeat(80));

    let allCorrect = true;

    for (let i = 0; i < vietnamPackages.length; i++) {
      const pkg = vietnamPackages[i];
      const photoCount = pkg.images ? pkg.images.length : 0;
      const status = photoCount === 1 ? '✅' : '❌';
      
      if (photoCount !== 1) allCorrect = false;

      console.log(`\n${i + 1}. ${pkg.name}`);
      console.log(`   Status: ${status} ${photoCount} photo(s)`);
      console.log(`   Thumbnail: ${pkg.thumbnail ? pkg.thumbnail.split('/').pop() : 'NONE'}`);
      
      if (pkg.images && pkg.images.length > 0) {
        console.log(`   Image: ${pkg.images[0].split('/').pop()}`);
      } else {
        console.log(`   Image: NONE`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Total Vietnam packages: ${vietnamPackages.length}`);
    console.log(`   Status: ${allCorrect ? '✅ All packages have exactly 1 photo' : '❌ Some packages have incorrect photo count'}`);

    await mongoose.connection.close();
    console.log('\n✅ Verification complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifySinglePhoto();
