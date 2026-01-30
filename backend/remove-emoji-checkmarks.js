const mongoose = require('mongoose');
require('dotenv').config();

async function removeEmojiCheckmarks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Get Bali package
    const pkg = await packagesCollection.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    });

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log('Current inclusions:', pkg.inclusions);
    console.log('\nCurrent exclusions:', pkg.exclusions);

    // Remove emoji checkmarks and X marks from inclusions and exclusions
    const cleanedInclusions = pkg.inclusions.map(item => 
      item.replace(/✔️|✅|☑️|✓/g, '').trim()
    );

    const cleanedExclusions = pkg.exclusions.map(item => 
      item.replace(/✖️|❌|✗|✘/g, '').trim()
    );

    await packagesCollection.updateOne(
      { _id: pkg._id },
      {
        $set: {
          inclusions: cleanedInclusions,
          exclusions: cleanedExclusions
        }
      }
    );

    console.log('\n✅ Removed emoji checkmarks!');
    console.log('\nNew inclusions:', cleanedInclusions);
    console.log('\nNew exclusions:', cleanedExclusions);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

removeEmojiCheckmarks();
