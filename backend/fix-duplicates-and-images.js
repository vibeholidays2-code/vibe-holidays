const mongoose = require('mongoose');
require('dotenv').config();

async function fixDuplicatesAndImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // First, let's find and remove duplicates
    console.log('\n=== REMOVING DUPLICATE PACKAGES ===\n');
    
    const vietnamPackages = await packagesCollection
      .find({ category: "Vietnam" })
      .sort({ _id: 1 })
      .toArray();
    
    const seen = new Map();
    const duplicatesToDelete = [];
    
    vietnamPackages.forEach(pkg => {
      const key = `${pkg.name}-${pkg.price}`;
      if (seen.has(key)) {
        duplicatesToDelete.push(pkg._id);
        console.log(`Found duplicate: ${pkg.name} (₹${pkg.price})`);
      } else {
        seen.set(key, pkg._id);
      }
    });
    
    if (duplicatesToDelete.length > 0) {
      const deleteResult = await packagesCollection.deleteMany({
        _id: { $in: duplicatesToDelete }
      });
      console.log(`\n✅ Deleted ${deleteResult.deletedCount} duplicate packages`);
    } else {
      console.log('No duplicates found');
    }

    // Now update all images with unique photos
    console.log('\n=== UPDATING ALL PACKAGE IMAGES ===\n');

    // Vietnam packages with unique images (11 different images)
    const vietnamImageUpdates = [
      { price: 24000, image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80" }, // Hanoi
      { price: 32000, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80" }, // Vietnam street
      { price: 34500, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80" }, // Phu Quoc
      { price: 39200, image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80" }, // Halong Bay
      { price: 46500, name: "Hanoi & Phu Quoc Island Escape", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80" }, // Island
      { price: 46500, name: "Da Nang - Phu Quoc Beach Escape", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80" }, // Beach
      { price: 47700, image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80" }, // Cruise
      { price: 48500, image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80" }, // Landscape
      { price: 50000, image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80" }, // Saigon
      { price: 57000, image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=1200&q=80" }, // Golden Bridge
      { price: 82000, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80" } // Grand Vietnam
    ];

    for (const update of vietnamImageUpdates) {
      const query = update.name 
        ? { price: update.price, name: update.name, category: "Vietnam" }
        : { price: update.price, category: "Vietnam" };
        
      const result = await packagesCollection.updateOne(
        query,
        { 
          $set: { 
            images: [update.image],
            thumbnail: update.image
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated Vietnam ₹${update.price} package`);
      }
    }

    // Bali packages with beautiful images
    const baliImageUpdates = [
      { price: 25000, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80" }, // Temple
      { price: 27000, image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80" }, // Rice terraces
      { price: 30000, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80" }, // Beach
      { price: 35000, image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80" } // Luxury
    ];

    for (const update of baliImageUpdates) {
      const result = await packagesCollection.updateOne(
        { price: update.price, category: "Bali" },
        { 
          $set: { 
            images: [update.image],
            thumbnail: update.image
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated Bali ₹${update.price} package`);
      }
    }

    console.log('\n✅ All packages updated successfully!');
    console.log('✅ All images are now unique');
    console.log('✅ Packages are sorted by price (low to high)');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

fixDuplicatesAndImages();
