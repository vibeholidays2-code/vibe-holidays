const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function fixImage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.updateOne(
      { price: 55000, destination: 'Bali, Indonesia' },
      { $set: { images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969368/29_eu4myp.jpg'] } }
    );

    console.log(`\n✅ Updated Bali 4★ Luxury image`);
    console.log(`Modified: ${result.modifiedCount}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixImage();
