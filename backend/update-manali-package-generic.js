const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function updatePackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.findByIdAndUpdate(
      '69c68316f04b113c43ec7ce0',
      {
        $set: {
          name: 'Manali - Kasol - Sissu Complete Tour',
          category: 'Adventure & Mountains',
          idealFor: 'Couples, Friends, Families',
          description: `Experience the complete Himalayan adventure with our 5 Nights / 6 Days Manali-Kasol-Sissu tour package. Stay in luxury mountain-view rooms, explore the stunning Solang Valley, drive through the magnificent Atal Tunnel to Sissu, discover the hippie paradise of Kasol, and visit the sacred Manikaran Sahib. This all-inclusive package features private cab, breakfast & dinner, and complete sightseeing - perfect for couples, friends, and families seeking adventure and serenity in the mountains.

We focus on value + comfort + unforgettable memories, not just another package.`
        }
      },
      { new: true }
    );

    console.log(`\n✅ Package updated successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`New Name: ${result.name}`);
    console.log(`New Category: ${result.category}`);
    console.log(`Ideal For: ${result.idealFor}`);
    console.log(`Price: ₹${result.price}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePackage();
