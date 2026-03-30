const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

// Vietnam packages mapped to unique Cloudinary images (sorted by price)
const vietnamPackages = [
  {
    price: 24000,
    name: 'Hanoi Holiday Package',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967474/10_je237a.png'
  },
  {
    price: 39200,
    name: 'Hanoi + Da Nang Package',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967473/14_r3j5gu.png'
  },
  {
    price: 46500,
    name: 'Hanoi & Phu Quoc Package',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967473/12_rtvxqa.png'
  },
  {
    price: 46500,
    name: 'Da Nang – Phu Quoc Package',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967472/13_evdjcq.png'
  },
  {
    price: 50000,
    name: 'Hanoi – Da Nang – Ho Chi Minh Grand Tour',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967469/18_olegho.png'
  },
  {
    price: 57000,
    name: 'Hanoi – Da Nang – Phu Quoc Package',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967468/19_pw2che.png'
  },
  {
    price: 82000,
    name: 'Grand Vietnam Tour',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967462/6_ceqx4z.png'
  }
];

async function updateVietnamPhotos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    for (const pkg of vietnamPackages) {
      const result = await Package.findOneAndUpdate(
        { 
          destination: { $regex: 'Vietnam', $options: 'i' },
          price: pkg.price,
          name: { $regex: pkg.name.split(' ')[0], $options: 'i' }
        },
        { 
          $set: { 
            thumbnail: pkg.image,
            images: [pkg.image]
          } 
        },
        { new: true }
      );

      if (result) {
        console.log(`✅ Updated: ${result.name} (₹${result.price})`);
        console.log(`   Image: ${pkg.image.substring(0, 80)}...\n`);
      } else {
        console.log(`❌ Package not found: ${pkg.name} (₹${pkg.price})\n`);
      }
    }

    console.log('✅ All Vietnam packages updated with unique cover photos!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateVietnamPhotos();
