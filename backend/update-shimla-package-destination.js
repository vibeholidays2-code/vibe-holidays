const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function updateShimlaPackageDestination() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Update the Shimla-Manali package destination to "Shimla"
    const result = await Package.updateOne(
      { _id: new mongoose.Types.ObjectId('69ca4184b0f1af59c16baca2') },
      { $set: { destination: 'Shimla' } }
    );
    
    console.log('✅ Updated Shimla-Manali package destination to "Shimla"');
    console.log('Modified count:', result.modifiedCount);

    // Verify the update
    const pkg = await Package.findById('69ca4184b0f1af59c16baca2').select('name destination duration price');
    console.log('\nVerification:');
    console.log('Name:', pkg.name);
    console.log('Destination:', pkg.destination);
    console.log('Duration:', pkg.duration);
    console.log('Price: ₹' + pkg.price);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateShimlaPackageDestination();
