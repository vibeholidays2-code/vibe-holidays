const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function updateKasolPackageDestination() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const result = await Package.updateOne(
      { _id: new mongoose.Types.ObjectId('69c68316f04b113c43ec7ce0') },
      { $set: { destination: 'Manali' } }
    );
    
    console.log('✅ Updated Manali-Kasol-Sissu package destination to "Manali"');
    console.log('Modified count:', result.modifiedCount);

    // Verify the update
    const pkg = await Package.findById('69c68316f04b113c43ec7ce0').select('name destination');
    console.log('\nVerification:');
    console.log('Name:', pkg.name);
    console.log('Destination:', pkg.destination);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateKasolPackageDestination();
