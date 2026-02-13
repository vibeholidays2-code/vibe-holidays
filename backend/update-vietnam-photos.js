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

// New Vietnam photos from Cloudinary collection (correct URLs)
const vietnamPhotos = [
  'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967460/1_sc4g1v.png', // Golden Bridge - perfect thumbnail!
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

async function updateVietnamPhotos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    // Find all Vietnam packages
    const vietnamPackages = await Package.find({
      $or: [
        { destination: /vietnam/i },
        { name: /vietnam/i },
        { name: /phu quoc/i },
      ]
    });

    console.log(`\nFound ${vietnamPackages.length} Vietnam packages:`);
    vietnamPackages.forEach(pkg => {
      console.log(`- ${pkg.name} (${pkg.destination})`);
    });

    if (vietnamPackages.length === 0) {
      console.log('\nNo Vietnam packages found!');
      await mongoose.connection.close();
      return;
    }

    console.log('\n📸 Updating Vietnam package photos...\n');

    for (const pkg of vietnamPackages) {
      console.log(`Updating: ${pkg.name}`);
      
      // Set first image as thumbnail
      pkg.thumbnail = vietnamPhotos[0];
      
      // Add all photos to images array
      pkg.images = vietnamPhotos;
      
      await pkg.save();
      console.log(`✅ Updated ${pkg.name} with ${vietnamPhotos.length} new photos`);
      console.log(`   Thumbnail: ${pkg.thumbnail}`);
      console.log(`   Total images: ${pkg.images.length}\n`);
    }

    console.log('✅ All Vietnam packages updated successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Packages updated: ${vietnamPackages.length}`);
    console.log(`   Photos per package: ${vietnamPhotos.length}`);
    console.log(`   Total photos added: ${vietnamPackages.length * vietnamPhotos.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateVietnamPhotos();
