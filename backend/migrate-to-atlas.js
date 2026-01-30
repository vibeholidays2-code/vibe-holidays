const mongoose = require('mongoose');
require('dotenv').config();

// Your MongoDB Atlas connection string
const ATLAS_URI = process.env.MONGODB_URI;

// Local MongoDB connection string (update if different)
const LOCAL_URI = 'mongodb://localhost:27017/vibes-holidays';

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...\n');

    // Connect to local MongoDB
    console.log('📦 Connecting to local MongoDB...');
    const localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to local MongoDB\n');

    // Connect to Atlas
    console.log('☁️  Connecting to MongoDB Atlas...');
    const atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to MongoDB Atlas\n');

    // Get all collections from local database
    const collections = await localConnection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections to migrate:\n`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n🔄 Migrating collection: ${collectionName}`);

      // Get data from local collection
      const localCollection = localConnection.db.collection(collectionName);
      const documents = await localCollection.find({}).toArray();

      console.log(`   📄 Found ${documents.length} documents`);

      if (documents.length > 0) {
        // Insert into Atlas collection
        const atlasCollection = atlasConnection.db.collection(collectionName);
        
        // Clear existing data in Atlas (optional - comment out if you want to keep existing data)
        await atlasCollection.deleteMany({});
        console.log(`   🗑️  Cleared existing data in Atlas`);

        // Insert documents
        await atlasCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${documents.length} documents to Atlas`);
      } else {
        console.log(`   ⚠️  No documents to migrate`);
      }
    }

    console.log('\n\n🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total collections migrated: ${collections.length}`);
    
    // Verify data in Atlas
    console.log('\n🔍 Verifying data in Atlas...');
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const atlasCollection = atlasConnection.db.collection(collectionName);
      const count = await atlasCollection.countDocuments();
      console.log(`   ${collectionName}: ${count} documents`);
    }

    // Close connections
    await localConnection.close();
    await atlasConnection.close();
    console.log('\n✅ All connections closed');
    console.log('\n🚀 Your data is now in MongoDB Atlas!');
    console.log('   You can now deploy your application.');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
