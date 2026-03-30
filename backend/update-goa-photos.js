const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

// Mapping: price -> new cover photo URL
const photoUpdates = {
  10000: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967471/16_itwwkw.png', // 3N/4D Package
  15000: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967470/15_oqeatq.png'  // 4N/5D Group Tour
};

async function updatePhotos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    for (const [price, photoUrl] of Object.entries(photoUpdates)) {
      const result = await Package.findOneAndUpdate(
        { 
          destination: 'Goa',
          price: parseInt(price),
          active: true 
        },
        { 
          $set: { 
            thumbnail: photoUrl,
            images: [photoUrl]
          } 
        },
        { new: true }
      );

      if (result) {
        console.log(`✅ Updated: ${result.name}`);
        console.log(`   Price: ₹${result.price}`);
        console.log(`   New Photo: ${photoUrl}\n`);
      } else {
        console.log(`❌ Package not found for price: ₹${price}\n`);
      }
    }

    console.log('✅ All Goa package photos updated!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePhotos();
