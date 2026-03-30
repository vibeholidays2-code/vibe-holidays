const { MongoClient } = require('mongodb');

const OLD_URI = 'mongodb://vibe_db_user:vibe9099@ac-vcsokon-shard-00-00.6c6k7zt.mongodb.net:27017,ac-vcsokon-shard-00-01.6c6k7zt.mongodb.net:27017,ac-vcsokon-shard-00-02.6c6k7zt.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-9k0a12-shard-0&authSource=admin&retryWrites=true&w=majority';
const NEW_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

async function migrate() {
  console.log('Connecting to old cluster...');
  const oldClient = new MongoClient(OLD_URI);
  
  console.log('Connecting to new cluster...');
  const newClient = new MongoClient(NEW_URI);

  try {
    await oldClient.connect();
    console.log('✅ Connected to old cluster');
    
    await newClient.connect();
    console.log('✅ Connected to new cluster');

    const oldDb = oldClient.db('vibes-holidays');
    const newDb = newClient.db('vibes-holidays');

    // Migrate packages
    const packages = await oldDb.collection('packages').find({}).toArray();
    console.log(`Found ${packages.length} packages in old cluster`);

    if (packages.length > 0) {
      // Remove _id to avoid conflicts, let MongoDB generate new ones
      const cleanPackages = packages.map(({ _id, ...rest }) => rest);
      await newDb.collection('packages').insertMany(cleanPackages);
      console.log(`✅ Migrated ${packages.length} packages to new cluster`);
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

migrate();
