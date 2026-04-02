require('dotenv').config({ path: '.env.production' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Connection String:', MONGODB_URI?.substring(0, 50) + '...\n');

async function testConnection() {
  try {
    console.log('📡 Attempting to connect...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!\n');
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Count packages
    const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
    const count = await Package.countDocuments();
    console.log(`\n📦 Total packages in database: ${count}`);
    
    if (count === 0) {
      console.log('\n⚠️  Database is empty! You need to populate it with packages.');
      console.log('   Run: node recreate-all-packages-in-atlas.js');
    } else {
      console.log('\n✅ Database has packages!');
      const packages = await Package.find({}).limit(5).select('name destination price');
      console.log('\n📋 Sample packages:');
      packages.forEach(pkg => {
        console.log(`   - ${pkg.name} (${pkg.destination}) - ₹${pkg.price}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test complete!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('querySrv')) {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Check if the cluster hostname is correct');
      console.log('   2. Verify the cluster exists in MongoDB Atlas');
      console.log('   3. Check your internet connection');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Verify username and password are correct');
      console.log('   2. Check database user permissions in MongoDB Atlas');
    } else if (error.message.includes('IP')) {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
      console.log('   2. Or add your current IP address');
    }
    
    process.exit(1);
  }
}

testConnection();
