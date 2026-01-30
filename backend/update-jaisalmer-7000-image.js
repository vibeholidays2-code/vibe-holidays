const mongoose = require('mongoose');
require('dotenv').config();

async function updateJaisalmer7000Image() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Update Jaisalmer ₹7,000 package with beautiful fort view image
    const result = await packagesCollection.updateOne(
      { price: 7000, category: "Jaisalmer" },
      { 
        $set: { 
          images: ["https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80"],
          thumbnail: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80"
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Updated Jaisalmer ₹7,000 package with beautiful fort view image');
    } else {
      console.log('⚠️ Package already has this image or not found');
    }

    // Verify the update
    const package7000 = await packagesCollection.findOne({ price: 7000, category: "Jaisalmer" });
    if (package7000) {
      console.log('\nPackage Details:');
      console.log('Name:', package7000.name);
      console.log('Price: ₹7,000');
      console.log('Image:', package7000.images[0]);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateJaisalmer7000Image();
