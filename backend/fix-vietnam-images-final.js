const mongoose = require('mongoose');
require('dotenv').config();

async function fixVietnamImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Get all Vietnam packages sorted by price
    const packages = await packagesCollection
      .find({ category: "Vietnam" })
      .sort({ price: 1 })
      .toArray();

    console.log(`\n📋 Found ${packages.length} Vietnam packages\n`);

    // 13 unique Vietnam-themed images (we have 13 packages including duplicates)
    const uniqueImages = [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80", // Hanoi Old Quarter
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80", // Phu Quoc Beach
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80", // Halong Bay
      "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=1200&q=80", // Da Nang Beach
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80", // Ho Chi Minh City
      "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80", // Halong Bay Cruise
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80", // Vietnam Beach
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80", // Vietnam Landscape
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80", // Vietnam Street
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80", // Phu Quoc Island
      "https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=1200&q=80", // Vietnam Temple
      "https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?w=1200&q=80", // Vietnam Rice Fields
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80"  // Vietnam City
    ];

    // Update each package with unique image
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      const newImage = uniqueImages[i % uniqueImages.length];
      
      await packagesCollection.updateOne(
        { _id: pkg._id },
        { 
          $set: { 
            images: [newImage],
            thumbnail: newImage
          } 
        }
      );
      
      console.log(`✅ ${i + 1}. ${pkg.name} - ₹${pkg.price.toLocaleString()}`);
    }

    console.log('\n✅ All images updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

fixVietnamImages();
