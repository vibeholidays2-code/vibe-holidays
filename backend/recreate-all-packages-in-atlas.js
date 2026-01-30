const { execSync } = require('child_process');

console.log('🚀 Recreating all packages in MongoDB Atlas...\n');
console.log('This will take a few minutes. Please wait...\n');

const scripts = [
  // Step 1: Create admin user
  { name: 'Admin User', script: 'create-admin.js' },
  
  // Step 2: Create Bali packages
  { name: 'Bali Packages', script: 'create-bali-packages.js' },
  
  // Step 3: Create Jaisalmer packages
  { name: 'Jaisalmer Packages', script: 'create-jaisalmer-packages.js' },
  
  // Step 4: Create Vietnam packages
  { name: 'Vietnam Hanoi 24000', script: 'create-vietnam-hanoi-24000.js' },
  { name: 'Vietnam 3 Cities 32000', script: 'create-vietnam-3cities-32000.js' },
  { name: 'Vietnam Phu Quoc Island 34500', script: 'create-vietnam-phuquoc-island-34500.js' },
  { name: 'Vietnam Hanoi Danang 39200', script: 'create-vietnam-hanoi-danang-39200.js' },
  { name: 'Vietnam Hanoi Phu Quoc 46500', script: 'create-vietnam-hanoi-phuquoc-46500.js' },
  { name: 'Vietnam Danang Phu Quoc 46500', script: 'create-vietnam-danang-phuquoc-46500.js' },
  { name: 'Vietnam Saigon Danang Hanoi 47700', script: 'create-vietnam-saigon-danang-hanoi-47700.js' },
  { name: 'Vietnam Hanoi Danang Saigon 50000', script: 'create-vietnam-hanoi-danang-saigon-50000.js' },
  { name: 'Vietnam Hanoi Danang Phu Quoc 57000', script: 'create-vietnam-hanoi-danang-phuquoc-57000.js' },
  { name: 'Vietnam Grand 82000', script: 'create-vietnam-grand-82000.js' },
  
  // Step 5: Update Bali packages with complete details
  { name: 'Update Bali 25000', script: 'update-bali-25000-complete.js' },
  { name: 'Update Bali 27000', script: 'update-bali-27000-complete.js' },
  { name: 'Update Bali 30000', script: 'update-bali-30000-complete.js' },
  { name: 'Update Bali 35000', script: 'update-bali-35000-complete.js' },
  
  // Step 6: Update images
  { name: 'Update Bali Images', script: 'update-bali-images.js' },
  { name: 'Update Jaisalmer Images', script: 'update-jaisalmer-images.js' },
  { name: 'Update Vietnam Images', script: 'update-vietnam-all-images-and-sort.js' },
  
  // Step 7: Set featured packages
  { name: 'Set Featured Packages', script: 'update-featured-packages.js' },
];

let successCount = 0;
let failCount = 0;

for (const { name, script } of scripts) {
  try {
    console.log(`\n📦 Running: ${name}...`);
    execSync(`node ${script}`, { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    successCount++;
    console.log(`✅ ${name} completed`);
  } catch (error) {
    failCount++;
    console.error(`❌ ${name} failed:`, error.message);
    console.log('⚠️  Continuing with next script...');
  }
}

console.log('\n\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Successful: ${successCount}/${scripts.length}`);
console.log(`❌ Failed: ${failCount}/${scripts.length}`);
console.log('='.repeat(60));

if (failCount === 0) {
  console.log('\n🎉 All packages created successfully in MongoDB Atlas!');
  console.log('\n📋 Next steps:');
  console.log('   1. Verify data: node verify-atlas-connection.js');
  console.log('   2. Test backend: npm run dev');
  console.log('   3. Test frontend: cd ../frontend && npm run dev');
  console.log('   4. Deploy to production!');
} else {
  console.log('\n⚠️  Some scripts failed. Please check the errors above.');
  console.log('   You may need to run failed scripts manually.');
}
