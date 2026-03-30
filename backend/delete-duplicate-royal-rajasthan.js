const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function deleteDuplicate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete the first duplicate (keeping the second one from the summary: 69c678fbd08915000931c798)
    const result = await Package.deleteOne({ 
      _id: new mongoose.Types.ObjectId('69c678d5a5587adf9dcb8750')
    });

    console.log(`\n✅ Deleted ${result.deletedCount} duplicate package`);
    console.log(`Kept package ID: 69c678fbd08915000931c798`);

    // Verify only one remains
    const remaining = await Package.find({ 
      name: { $regex: /royal rajasthan/i }
    });

    console.log(`\n📦 Remaining Royal Rajasthan packages: ${remaining.length}`);
    remaining.forEach(pkg => {
      console.log(`  - ID: ${pkg._id}`);
      console.log(`    Name: ${pkg.name}`);
      console.log(`    Price: ₹${pkg.price}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteDuplicate();
