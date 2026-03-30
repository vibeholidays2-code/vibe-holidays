const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function checkAllManaliRelated() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Search for any package with Manali, Kasol, Shimla in name or destination
    const packages = await Package.find({
      $or: [
        { name: /manali/i },
        { name: /kasol/i },
        { name: /shimla/i },
        { destination: /manali/i }
      ]
    }).select('name destination duration price active');
    
    console.log(`📦 Found ${packages.length} Manali/Shimla/Kasol related package(s):\n`);
    packages.forEach((pkg, index) => {
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

checkAllManaliRelated();
