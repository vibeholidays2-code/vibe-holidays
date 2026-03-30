const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function verifyManaliPackages() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const manaliPackages = await Package.find({ destination: 'Manali' }).select('name destination duration price active');
    
    console.log(`📦 Found ${manaliPackages.length} Manali package(s):\n`);
    manaliPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name}`);
      console.log(`   Destination: ${pkg.destination}`);
      console.log(`   Duration: ${pkg.duration}`);
      console.log(`   Price: ₹${pkg.price}`);
      console.log(`   Active: ${pkg.active}`);
      console.log(`   ID: ${pkg._id}\n`);
    });

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyManaliPackages();
