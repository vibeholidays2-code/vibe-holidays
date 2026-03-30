const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

// Vietnam package IDs and their corresponding Cloudinary images
const vietnamPackages = [
  {
    id: '69c51bd745a4977ba489c34c',
    name: 'Hanoi Holiday Package',
    price: 24000,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/1_iqwqxe.jpg'
  },
  {
    id: '69c51c4f235dc9b008361990',
    name: 'Hanoi + Da Nang Package',
    price: 39200,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/2_aqvqxe.jpg'
  },
  {
    id: '69c65eaa34f51123a2026f6c',
    name: 'Hanoi & Phu Quoc Package',
    price: 46500,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/3_bqwqxe.jpg'
  },
  {
    id: '69c65fa2cd10ed16128e666d',
    name: 'Hanoi – Da Nang – Ho Chi Minh Grand Tour',
    price: 50000,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/4_cqwqxe.jpg'
  },
  {
    id: '69c660324b1aa5ce83aebbff',
    name: 'Hanoi – Da Nang – Phu Quoc Package',
    price: 57000,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/5_dqwqxe.jpg'
  },
  {
    id: '69c660ccef730320f95aa470',
    name: 'Da Nang – Phu Quoc Package',
    price: 46500,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/6_eqwqxe.jpg'
  },
  {
    id: '69c6612c0fe2bce3db6e3870',
    name: 'Grand Vietnam Tour',
    price: 82000,
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1738237838/7_fqwqxe.jpg'
  }
];

async function updateVietnamPhotos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    for (const pkg of vietnamPackages) {
      const result = await Package.findByIdAndUpdate(
        pkg.id,
        { 
          $set: { 
            thumbnail: pkg.image,
            images: [pkg.image]
          } 
        },
        { new: true }
      );

      if (result) {
        console.log(`✅ Updated: ${pkg.name} (₹${pkg.price})`);
        console.log(`   Image: ${pkg.image}\n`);
      } else {
        console.log(`❌ Package not found: ${pkg.name} (ID: ${pkg.id})\n`);
      }
    }

    console.log('✅ All Vietnam packages updated with cover photos!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateVietnamPhotos();
