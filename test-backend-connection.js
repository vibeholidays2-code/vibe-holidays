// Test Backend Connection
const axios = require('axios');

const BACKEND_URL = 'https://vibe-holidays-backend-0vgn.onrender.com/api';

async function testConnection() {
  console.log('🔍 Testing backend connection...\n');
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  // Test 1: Health check
  console.log('Test 1: Health Check');
  try {
    const response = await axios.get(`${BACKEND_URL.replace('/api', '')}/health`, {
      timeout: 10000
    });
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Packages endpoint
  console.log('\nTest 2: Packages Endpoint');
  try {
    const response = await axios.get(`${BACKEND_URL}/packages`, {
      timeout: 10000
    });
    console.log('✅ Packages endpoint working');
    console.log(`   Found ${response.data.data?.length || 0} packages`);
  } catch (error) {
    console.log('❌ Packages endpoint failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }

  // Test 3: Gallery endpoint
  console.log('\nTest 3: Gallery Endpoint');
  try {
    const response = await axios.get(`${BACKEND_URL}/gallery`, {
      timeout: 10000
    });
    console.log('✅ Gallery endpoint working');
    console.log(`   Found ${response.data.data?.length || 0} gallery items`);
  } catch (error) {
    console.log('❌ Gallery endpoint failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }

  // Test 4: CORS check
  console.log('\nTest 4: CORS Headers');
  try {
    const response = await axios.get(`${BACKEND_URL}/packages`, {
      timeout: 10000
    });
    console.log('✅ CORS headers present:');
    console.log('   Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('   Access-Control-Allow-Methods:', response.headers['access-control-allow-methods']);
  } catch (error) {
    console.log('❌ Could not check CORS headers');
  }
}

testConnection().catch(console.error);
