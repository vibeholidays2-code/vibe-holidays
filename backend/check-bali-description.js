const mongoose = require('mongoose');
require('dotenv').config();

async function checkBaliDescription() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const pkg = await packagesCollection.findOne({ 
      destination: 'Bali, Indonesia',
      price: 25000 
    });

    if (!pkg) {
      console.log('Package not found!');
      return;
    }

    console.log('Current Description:');
    console.log('═══════════════════════════════════════');
    console.log(pkg.description);
    console.log('═══════════════════════════════════════');
    console.log('\nDescription length:', pkg.description.length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkBaliDescription();
