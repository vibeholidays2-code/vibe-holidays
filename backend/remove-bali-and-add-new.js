require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false, collection: 'packages' });
const Package = mongoose.model('Package', packageSchema);

async function removeBaliAndAddNew() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully!\n');

    // Step 1: Find and display all Bali packages
    console.log('📋 Finding all Bali packages...');
    const baliPackages = await Package.find({
      destination: { $regex: /bali/i }
    });

    console.log(`Found ${baliPackages.length} Bali packages:\n`);
    baliPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   ID: ${pkg._id}`);
      console.log(`   Price: ₹${pkg.price}`);
      console.log(`   Duration: ${pkg.duration}`);
      console.log('');
    });

    // Step 2: Delete all Bali packages
    console.log('🗑️  Deleting all Bali packages...');
    const deleteResult = await Package.deleteMany({
      destination: { $regex: /bali/i }
    });

    console.log(`✅ Successfully deleted ${deleteResult.deletedCount} Bali packages\n`);

    // Step 3: Add new Bali packages (you'll provide the details)
    console.log('📝 Ready to add new Bali packages');
    console.log('Please provide the new package details and I will add them.\n');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeBaliAndAddNew();
