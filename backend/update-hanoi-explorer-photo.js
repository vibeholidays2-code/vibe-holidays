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

// New main cover photo for Vietnam
const mainVietnamPhoto = 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967468/19_pw2che.png';

async function updateHanoiExplorerPhoto() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!\n');

    // Find Hanoi Explorer Package (main Vietnam package)
    const hanoiPackage = await Package.findOne({ name: 'Hanoi Explorer Package' });

    if (!hanoiPackage) {
      console.log('❌ Hanoi Explorer Package not found!');
      await mongoose.connection.close();
      return;
    }

    console.log('📦 Found: Hanoi Explorer Package');
    console.log(`   Current photo: ${hanoiPackage.thumbnail ? hanoiPackage.thumbnail.split('/').pop() : 'NONE'}`);
    
    const timestamp = Date.now();
    const photoWithCache = `${mainVietnamPhoto}?v=${timestamp}`;
    
    console.log(`\n🔄 Updating to new main cover photo...`);
    console.log(`   New photo: 19_pw2che.png`);
    
    hanoiPackage.thumbnail = photoWithCache;
    hanoiPackage.images = [photoWithCache];
    
    await hanoiPackage.save();
    
    console.log('\n✅ Hanoi Explorer Package updated successfully!');
    console.log(`   Photo URL: ${mainVietnamPhoto}`);
    console.log(`   Cache-buster: v=${timestamp}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('\n⚠️  Please hard refresh your browser (Ctrl+Shift+R) to see changes!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateHanoiExplorerPhoto();
