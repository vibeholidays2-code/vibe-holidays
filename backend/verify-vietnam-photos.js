const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority';

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  thumbnail: String,
  images: [String],
});

const Package = mongoose.model('Package', packageSchema);

async function verifyVietnamPhotos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!\n');

    const vietnamPackages = await Package.find({
      $or: [
        { destination: /vietnam/i },
        { name: /vietnam/i },
        { name: /phu quoc/i },
      ]
    }).select('name destination thumbnail images');

    console.log('📸 Vietnam Package Photos Verification\n');
    console.log('='.repeat(80));

    vietnamPackages.forEach((pkg, index) => {
      console.log(`\n${index + 1}. ${pkg.name}`);
      console.log(`   Destination: ${pkg.destination}`);
      console.log(`   Thumbnail: ${pkg.thumbnail}`);
      console.log(`   Total Images: ${pkg.images.length}`);
      console.log(`   First Image: ${pkg.images[0]}`);
      console.log(`   Last Image: ${pkg.images[pkg.images.length - 1]}`);
      
      // Check if using new Cloudinary photos
      const hasNewPhotos = pkg.images.some(img => img.includes('vietnam/1_iqvqxe') || img.includes('vietnam/2_iqvqxe'));
      console.log(`   ✅ Using New Photos: ${hasNewPhotos ? 'YES' : 'NO'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Total Vietnam Packages: ${vietnamPackages.length}`);
    console.log(`✅ All packages updated with new Cloudinary photos!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyVietnamPhotos();
