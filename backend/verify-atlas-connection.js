const mongoose = require('mongoose');
require('dotenv').config();

async function verifyAtlasConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...\n');
    console.log('📍 Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    // Connect to Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!\n');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections in database:\n`);

    // Show document count for each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = mongoose.connection.db.collection(collectionName);
      const count = await collection.countDocuments();
      console.log(`   ${collectionName}: ${count} documents`);
    }

    if (collections.length === 0) {
      console.log('\n⚠️  Database is empty. You need to migrate your local data.');
      console.log('   Run: node migrate-to-atlas.js');
    } else {
      console.log('\n✅ Database has data! Ready for deployment.');
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection closed');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. Your MongoDB Atlas connection string is correct');
    console.error('2. Your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Your database user has proper permissions');
    process.exit(1);
  }
}

verifyAtlasConnection();
