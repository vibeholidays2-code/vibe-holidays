const mongoose = require('mongoose');
require('dotenv').config();

async function updateVietnamImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Different Vietnam images for each package
    const updates = [
      {
        name: "Hanoi Explorer Package",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80" // Hanoi Old Quarter
      },
      {
        name: "Hanoi - Da Nang Discovery",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80" // Halong Bay
      },
      {
        name: "Hanoi & Phu Quoc Island Escape",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80" // Phu Quoc Beach
      }
    ];

    for (const update of updates) {
      const result = await packagesCollection.updateOne(
        { name: update.name, category: "Vietnam" },
        { 
          $set: { 
            images: [update.image],
            thumbnail: update.image
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated ${update.name}`);
      } else {
        console.log(`⚠️ Package not found: ${update.name}`);
      }
    }

    console.log('\n✅ All Vietnam package images updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateVietnamImages();
