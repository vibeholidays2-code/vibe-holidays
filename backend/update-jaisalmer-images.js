const mongoose = require('mongoose');
require('dotenv').config();

async function updateJaisalmerImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // First, let's check what Jaisalmer packages we have
    const jaisalmerPackages = await packagesCollection
      .find({ category: "Jaisalmer" })
      .sort({ price: 1 })
      .toArray();

    console.log('\n=== CURRENT JAISALMER PACKAGES ===\n');
    jaisalmerPackages.forEach(pkg => {
      console.log(`Name: ${pkg.name}`);
      console.log(`Price: ₹${pkg.price}`);
      console.log(`Current Image: ${pkg.images[0]}`);
      console.log('---');
    });

    // Update with beautiful Jaisalmer desert and fort images
    const updates = [
      {
        // Lower price package (likely group tour)
        price: jaisalmerPackages[0]?.price,
        image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80" // Jaisalmer Fort
      },
      {
        // Higher price package (likely private tour)
        price: jaisalmerPackages[1]?.price,
        image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80" // Jaisalmer Desert
      }
    ];

    console.log('\n=== UPDATING JAISALMER IMAGES ===\n');

    for (let i = 0; i < updates.length; i++) {
      if (updates[i].price) {
        const result = await packagesCollection.updateOne(
          { price: updates[i].price, category: "Jaisalmer" },
          { 
            $set: { 
              images: [updates[i].image],
              thumbnail: updates[i].image
            } 
          }
        );

        if (result.modifiedCount > 0) {
          console.log(`✅ Updated Jaisalmer ₹${updates[i].price} package`);
        } else {
          console.log(`⚠️ No changes for Jaisalmer ₹${updates[i].price} package`);
        }
      }
    }

    console.log('\n✅ Jaisalmer package images updated successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateJaisalmerImages();
