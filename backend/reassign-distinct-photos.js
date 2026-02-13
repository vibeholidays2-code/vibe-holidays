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

// All 15 Vietnam photos - let's use them in a different order to ensure variety
const vietnamPhotos = [
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967460/1_sc4g1v.png', // Golden Bridge
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967461/2_hnnouc.png', // Halong Bay boats
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967460/3_nbyi2m.png', // Another view
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967463/4_bpqhft.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967463/5_xkfkfh.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967462/6_ceqx4z.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967461/7_zwvwnn.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967475/8_idg4fh.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967462/9_unirob.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967474/10_je237a.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967475/11_uyhcka.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967473/12_rtvxqa.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967472/13_evdjcq.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967473/14_r3j5gu.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967470/15_oqeatq.png',
];

// Manual assignment to ensure Hanoi Explorer and Phu Quoc Island get VERY different photos
const manualAssignments = {
  'Hanoi Explorer Package': vietnamPhotos[1], // Photo 2 - Halong Bay boats
  'Phu Quoc Island Paradise': vietnamPhotos[9], // Photo 10 - completely different
  'Vietnam Budget Explorer': vietnamPhotos[0], // Photo 1 - Golden Bridge
  'Hanoi - Da Nang Discovery': vietnamPhotos[3], // Photo 4
  'Hanoi & Phu Quoc Island Escape': vietnamPhotos[4], // Photo 5
  'Da Nang - Phu Quoc Beach Escape': vietnamPhotos[5], // Photo 6
  'Vietnam Grand Circuit with Halong Cruise': vietnamPhotos[6], // Photo 7
  'Hanoi - Da Nang - Saigon Grand Tour': vietnamPhotos[7], // Photo 8
  'Vietnam South to North Discovery': vietnamPhotos[11], // Photo 12
};

async function reassignDistinctPhotos() {
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
    }).sort({ _id: 1 });

    console.log(`Found ${vietnamPackages.length} Vietnam packages\n`);
    console.log('🔄 Reassigning photos with manual distinct assignments...\n');

    const timestamp = Date.now();
    let photoIndex = 0;
    const usedPhotos = new Set();

    for (const pkg of vietnamPackages) {
      let photo;
      
      // Check if this package has a manual assignment
      if (manualAssignments[pkg.name]) {
        photo = manualAssignments[pkg.name];
        console.log(`📌 ${pkg.name} - MANUAL ASSIGNMENT`);
      } else {
        // Auto-assign from remaining photos
        do {
          photo = vietnamPhotos[photoIndex % vietnamPhotos.length];
          photoIndex++;
        } while (usedPhotos.has(photo) && photoIndex < vietnamPhotos.length * 2);
        
        console.log(`🔄 ${pkg.name} - AUTO ASSIGNMENT`);
      }
      
      usedPhotos.add(photo);
      
      // Remove old cache buster if exists
      const cleanPhoto = photo.split('?')[0];
      const photoWithCache = `${cleanPhoto}?v=${timestamp}`;
      
      console.log(`   Photo: ${cleanPhoto.split('/').pop()}`);
      
      pkg.thumbnail = photoWithCache;
      pkg.images = [photoWithCache];
      
      await pkg.save();
      console.log(`   ✅ Updated\n`);
    }

    console.log('✅ All Vietnam packages reassigned with distinct photos!');
    console.log(`\n📊 Summary:`);
    console.log(`   Packages updated: ${vietnamPackages.length}`);
    console.log(`   Unique photos used: ${usedPhotos.size}`);
    console.log(`\n🎯 Key assignments:`);
    console.log(`   Hanoi Explorer Package → Photo 2 (Halong Bay boats)`);
    console.log(`   Phu Quoc Island Paradise → Photo 10 (completely different)`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('\n⚠️  Please hard refresh your browser (Ctrl+Shift+R) to see changes!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

reassignDistinctPhotos();
