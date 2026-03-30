const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

async function verifyPackage() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('vibes-holidays');
    const packages = db.collection('packages');
    
    const ujjainPackages = await packages.find({ destination: 'Ujjain' }).toArray();
    
    console.log(`Found ${ujjainPackages.length} Ujjain package(s):\n`);
    
    ujjainPackages.forEach((pkg, index) => {
      console.log(`Package ${index + 1}:`);
      console.log(`  ID: ${pkg._id}`);
      console.log(`  Name: ${pkg.name}`);
      console.log(`  Destination: ${pkg.destination}`);
      console.log(`  Duration: ${pkg.duration}N/${pkg.duration + 1}D`);
      console.log(`  Price: ₹${pkg.price} (Double Sharing)`);
      console.log(`  Tour Type: ${pkg.tourType}`);
      console.log(`  Active: ${pkg.active}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('✅ Database connection closed');
  }
}

verifyPackage();
