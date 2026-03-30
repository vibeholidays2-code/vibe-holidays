const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

// Using the Vietnam Halong Bay image from your Cloudinary gallery
const vietnamImage = 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376000/867a6b73-6d89-4500-9232-5a35d3cc64c0_yjfmtf.jpg';

async function fixVietnamPhotos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const vietnamPackages = await Package.find({ 
      destination: { $regex: 'Vietnam', $options: 'i' },
      active: true 
    });

    console.log(`Found ${vietnamPackages.length} Vietnam packages\n`);

    for (const pkg of vietnamPackages) {
      await Package.findByIdAndUpdate(
        pkg._id,
        { 
          $set: { 
            thumbnail: vietnamImage,
            images: [vietnamImage]
          } 
        }
      );
      console.log(`✅ Updated: ${pkg.name} (₹${pkg.price})`);
    }

    console.log(`\n✅ All Vietnam packages updated with Halong Bay image!`);
    console.log(`Image URL: ${vietnamImage}`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixVietnamPhotos();
