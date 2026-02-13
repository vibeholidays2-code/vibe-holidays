const axios = require('axios');

const BACKEND_URL = 'https://vibe-holidays-backend-0vgn.onrender.com';

async function testBackend() {
  console.log('🔍 Testing Backend Connection...\n');
  console.log('Backend URL:', BACKEND_URL);
  console.log('─'.repeat(60));

  // Test 1: Health check
  console.log('\nTest 1: Health Check');
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 30000
    });
    console.log('✅ Health check passed');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
  } catch (error) {
    console.log('❌ Health check failed');
    console.log('   Error:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }

  // Test 2: Root endpoint
  console.log('\nTest 2: Root Endpoint');
  try {
    const response = await axios.get(`${BACKEND_URL}/`, {
      timeout: 30000
    });
    console.log('✅ Root endpoint passed');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
  } catch (error) {
    console.log('❌ Root endpoint failed');
    console.log('   Error:', error.message);
  }

  // Test 3: Packages API
  console.log('\nTest 3: Packages API');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/packages`, {
      timeout: 30000
    });
    console.log('✅ Packages API passed');
    console.log('   Status:', response.status);
    console.log('   Package count:', response.data.data?.length || 0);
  } catch (error) {
    console.log('❌ Packages API failed');
    console.log('   Error:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }

  // Test 4: CORS check
  console.log('\nTest 4: CORS Headers');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/packages`, {
      timeout: 30000,
      headers: {
        'Origin': 'https://www.vibesholidays.in'
      }
    });
    console.log('✅ CORS headers present:');
    console.log('   Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('   Access-Control-Allow-Methods:', response.headers['access-control-allow-methods']);
  } catch (error) {
    console.log('❌ Could not check CORS headers');
    console.log('   Error:', error.message);
  }

  console.log('\n' + '─'.repeat(60));
  console.log('Test complete!');
}

testBackend().catch(console.error);
