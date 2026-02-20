require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false, collection: 'packages' });
const Package = mongoose.model('Package', packageSchema);

async function deleteOldBaliPackages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Find all Bali packages
    const baliPackages = await Package.find({
      destination: { $regex: /bali/i }
    });

    console.log(`\nFound ${baliPackages.length} Bali packages:`);
    baliPackages.forEach(pkg => {
      console.log(`- ${pkg.name} (ID: ${pkg._id})`);
    });

    // Delete all Bali packages
    const result = await Package.deleteMany({
      destination: { $regex: /bali/i }
    });

    console.log(`\n✅ Successfully deleted ${result.deletedCount} Bali packages`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteOldBaliPackages();
