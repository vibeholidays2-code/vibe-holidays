const http = require('http');

console.log('🧪 Testing Featured Packages API...\n');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/packages?featured=true',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('✅ API Response Status:', res.statusCode);
      console.log('✅ Success:', response.success);
      console.log('📦 Featured Packages:', response.data.length);
      console.log('\nPackages:');
      response.data.forEach((pkg, index) => {
        console.log(`${index + 1}. ${pkg.name} - ₹${pkg.price}`);
        console.log(`   Featured: ${pkg.featured}`);
        console.log(`   Destination: ${pkg.destination}`);
        console.log(`   Duration: ${pkg.duration} days\n`);
      });
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error);
});

req.end();
