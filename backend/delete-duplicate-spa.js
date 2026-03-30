const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function deleteDuplicate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete the second duplicate (ID: 69c517906bb4392003493e04)
    const result = await Package.deleteOne({ _id: '69c517906bb4392003493e04' });
    
    console.log(`\n✅ Deleted duplicate Spa package`);
    console.log(`Deleted count: ${result.deletedCount}`);

    // Verify remaining packages
    const remaining = await Package.find({ 
      destination: 'Bali, Indonesia' 
    }).sort({ price: 1 });

    console.log(`\nRemaining ${remaining.length} Bali packages:`);
    remaining.forEach(pkg => {
      console.log(`- ${pkg.name} (₹${pkg.price})`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteDuplicate();
