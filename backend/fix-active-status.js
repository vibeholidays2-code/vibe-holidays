const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function fixActive() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.updateOne(
      { _id: '69c51232da6505697bbcfd0f' },
      { $set: { active: true } }
    );

    console.log(`\n✅ Updated package active status`);
    console.log(`Modified: ${result.modifiedCount}`);

    // Verify
    const pkg = await Package.findById('69c51232da6505697bbcfd0f');
    console.log(`\nVerification:`);
    console.log(`Name: ${pkg.name}`);
    console.log(`Active: ${pkg.active}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixActive();
