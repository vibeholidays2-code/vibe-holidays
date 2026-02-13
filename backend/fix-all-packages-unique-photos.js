const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority';

// Package Schema
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  duration: String,
  price: Number,
  description: String,
  thumbnail: String,
  images: [String],
  itinerary: Array,
  inclusions: [String],
  exclusions: [String],
  category: String,
  featured: Boolean,
  brochureUrl: String,
});

const Package = mongoose.model('Package', packageSchema);

// All 15 Vietnam photos from Cloudinary
const vietnamPhotos = [
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967460/1_sc4g1v.png', // Golden Bridge
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967461/2_hnnouc.png',
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967460/3_nbyi2m.png',
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

async function fixAllPackagesUniquePhotos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    // Get ALL packages to check for duplicates
    const allPackages = await Package.find({});
    console.log(`\nTotal packages in database: ${allPackages.length}`);

    // Find all Vietnam packages (using _id to ensure uniqueness)
    const vietnamPackages = await Package.find({
      $or: [
        { destination: /vietnam/i },
        { name: /vietnam/i },
        { name: /phu quoc/i },
      ]
    }).sort({ _id: 1 }); // Sort by MongoDB _id for true uniqueness

    console.log(`\nFound ${vietnamPackages.length} Vietnam packages (by unique _id):`);
    
    // Track used photos to ensure no duplicates
    const usedPhotos = new Set();
    const photoAssignments = [];

    vietnamPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} (ID: ${pkg._id})`);
      
      // Assign unique photo
      const photoIndex = index % vietnamPhotos.length;
      const uniquePhoto = vietnamPhotos[photoIndex];
      
      photoAssignments.push({
        pkg,
        photo: uniquePhoto,
        photoIndex: photoIndex + 1
      });
      
      usedPhotos.add(uniquePhoto);
    });

    console.log(`\n📸 Updating ${vietnamPackages.length} Vietnam packages with unique photos...\n`);

    for (const assignment of photoAssignments) {
      const { pkg, photo, photoIndex } = assignment;
      
      console.log(`Updating: ${pkg.name}`);
      console.log(`  Package ID: ${pkg._id}`);
      console.log(`  Assigning photo ${photoIndex}: ${photo.split('/').pop()}`);
      
      // Set both thumbnail and images to the same single photo
      pkg.thumbnail = photo;
      pkg.images = [photo]; // Only ONE photo in array
      
      await pkg.save();
      console.log(`  ✅ Updated\n`);
    }

    console.log('✅ All Vietnam packages updated successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Packages updated: ${vietnamPackages.length}`);
    console.log(`   Unique photos used: ${usedPhotos.size}`);
    console.log(`   Photos per package: 1`);

    // Verify no duplicates
    console.log('\n🔍 Verifying uniqueness...');
    const updatedPackages = await Package.find({
      $or: [
        { destination: /vietnam/i },
        { name: /vietnam/i },
        { name: /phu quoc/i },
      ]
    });

    const photoCount = {};
    updatedPackages.forEach(pkg => {
      if (pkg.thumbnail) {
        photoCount[pkg.thumbnail] = (photoCount[pkg.thumbnail] || 0) + 1;
      }
    });

    const duplicates = Object.entries(photoCount).filter(([photo, count]) => count > 1);
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  Found duplicate photos:');
      duplicates.forEach(([photo, count]) => {
        console.log(`   ${photo.split('/').pop()}: used ${count} times`);
      });
    } else {
      console.log('✅ All photos are unique!');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAllPackagesUniquePhotos();
