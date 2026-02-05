const mongoose = require('mongoose');
require('dotenv').config();

async function removeDuplicateGoaPackages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Get all Goa packages
    const goaPackages = await packagesCollection.find({ category: 'Goa' }).toArray();
    
    console.log('\n📦 Current Goa Packages:');
    goaPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} - ₹${pkg.price} (${pkg.duration} days) - ID: ${pkg._id}`);
    });

    // Identify duplicates to remove
    const packagesToRemove = [
      // Remove the older/less detailed 3N/4D package (₹10,000)
      '69843aa8ecc5c8ec0a504807', // Goa Tour Package - 3N/4D (₹10,000)
      
      // Remove one of the duplicate Group Tour packages (keep the newer one)
      '69843aa8ecc5c8ec0a504808'  // Goa Group Tour Package (older duplicate)
    ];

    console.log('\n🗑️ Removing duplicate packages:');
    
    for (const packageId of packagesToRemove) {
      const packageToRemove = goaPackages.find(pkg => pkg._id.toString() === packageId);
      if (packageToRemove) {
        console.log(`- Removing: ${packageToRemove.name} (₹${packageToRemove.price}) - ID: ${packageId}`);
        
        const result = await packagesCollection.deleteOne({ _id: new mongoose.Types.ObjectId(packageId) });
        
        if (result.deletedCount === 1) {
          console.log(`  ✅ Successfully removed`);
        } else {
          console.log(`  ❌ Failed to remove`);
        }
      } else {
        console.log(`- Package with ID ${packageId} not found`);
      }
    }

    // Verify remaining packages
    const remainingGoaPackages = await packagesCollection.find({ category: 'Goa' }).toArray();
    
    console.log('\n✅ Remaining Goa Packages:');
    remainingGoaPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} - ₹${pkg.price} (${pkg.duration} days)`);
    });

    console.log(`\n📊 Summary:`);
    console.log(`- Before: ${goaPackages.length} Goa packages`);
    console.log(`- After: ${remainingGoaPackages.length} Goa packages`);
    console.log(`- Removed: ${goaPackages.length - remainingGoaPackages.length} duplicate packages`);

    if (remainingGoaPackages.length === 2) {
      console.log('\n🎯 Perfect! Now you have exactly 2 unique Goa packages:');
      console.log('1. Goa Beach Paradise - 3N/4D (₹12,000) - Individual/Couple package');
      console.log('2. Goa Group Tour Package (₹15,000) - Group package');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

removeDuplicateGoaPackages();