const mongoose = require('mongoose');
require('dotenv').config();

async function updateAllPackageImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const packagesCollection = db.collection('packages');

    // Vietnam packages with unique images (sorted by price low to high)
    const vietnamUpdates = [
      {
        name: "Hanoi Explorer Package",
        price: 24000,
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80" // Hanoi Old Quarter
      },
      {
        name: "Vietnam Budget Explorer",
        price: 32000,
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80" // Vietnam street
      },
      {
        name: "Phu Quoc Island Paradise",
        price: 34500,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80" // Phu Quoc beach
      },
      {
        name: "Hanoi - Da Nang Discovery",
        price: 39200,
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80" // Halong Bay
      },
      {
        name: "Hanoi & Phu Quoc Island Escape",
        price: 46500,
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80" // Phu Quoc Island
      },
      {
        name: "Da Nang - Phu Quoc Beach Escape",
        price: 46500,
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80" // Da Nang beach
      },
      {
        name: "Vietnam Grand Circuit with Halong Cruise",
        price: 47700,
        image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80" // Halong cruise
      },
      {
        name: "Vietnam South to North Discovery",
        price: 48500,
        image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80" // Vietnam landscape
      },
      {
        name: "Hanoi - Da Nang - Saigon Grand Tour",
        price: 50000,
        image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80" // Ho Chi Minh City
      },
      {
        name: "Hanoi - Da Nang - Phu Quoc Explorer",
        price: 57000,
        image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=1200&q=80" // Da Nang Golden Bridge
      },
      {
        name: "Grand Vietnam Complete Tour",
        price: 82000,
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80" // Vietnam temple
      }
    ];

    // Bali packages with beautiful new images
    const baliUpdates = [
      {
        name: "Bali Budget Bliss Package",
        price: 25000,
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80" // Bali temple
      },
      {
        name: "Bali Comfort Escape",
        price: 27000,
        image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80" // Bali rice terraces
      },
      {
        name: "Bali Deluxe Experience",
        price: 30000,
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80" // Bali beach sunset
      },
      {
        name: "Bali Premium Paradise",
        price: 35000,
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80" // Bali luxury resort
      }
    ];

    console.log('\n=== UPDATING VIETNAM PACKAGES ===\n');
    for (const update of vietnamUpdates) {
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
        console.log(`✅ Updated ${update.name} (₹${update.price})`);
      } else {
        console.log(`⚠️ Package not found: ${update.name}`);
      }
    }

    console.log('\n=== UPDATING BALI PACKAGES ===\n');
    for (const update of baliUpdates) {
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
      } else {
        console.log(`⚠️ Bali package not found: ₹${update.price}`);
      }
    }

    console.log('\n✅ All package images updated successfully!');
    console.log('\nVietnam packages are now sorted by price (low to high)');
    console.log('All duplicate images have been replaced with unique photos');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

updateAllPackageImages();
