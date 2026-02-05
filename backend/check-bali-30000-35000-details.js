const mongoose = require('mongoose');
require('dotenv').config();

async function checkBali30000And35000Details() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    const bali30000 = await packagesCollection.findOne({ 
      category: 'Bali',
      price: 30000
    });

    const bali35000 = await packagesCollection.findOne({ 
      category: 'Bali',
      price: 35000
    });

    console.log('\n💰 BALI ₹30,000 PACKAGE DETAILS:');
    if (bali30000) {
      console.log('Name:', bali30000.name);
      console.log('Description preview:', bali30000.description.substring(0, 200) + '...');
      console.log('Itinerary days:', bali30000.itinerary.length);
      console.log('Inclusions:', bali30000.inclusions.length);
      console.log('Exclusions:', bali30000.exclusions.length);
    } else {
      console.log('❌ Package not found');
    }

    console.log('\n💰 BALI ₹35,000 PACKAGE DETAILS:');
    if (bali35000) {
      console.log('Name:', bali35000.name);
      console.log('Description preview:', bali35000.description.substring(0, 200) + '...');
      console.log('Itinerary days:', bali35000.itinerary.length);
      console.log('Inclusions:', bali35000.inclusions.length);
      console.log('Exclusions:', bali35000.exclusions.length);
    } else {
      console.log('❌ Package not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

checkBali30000And35000Details();