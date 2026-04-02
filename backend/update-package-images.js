const fs = require('fs');
const path = require('path');

// Read the packages file
const packagesPath = path.join(__dirname, 'data/packages.json');
const packages = JSON.parse(fs.readFileSync(packagesPath, 'utf-8'));

// Unique image URLs for each package
const imageMap = {
  // Bali packages (6 different images)
  "Bali Holiday Package - 5N6D": {
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80"
  },
  "Bali Escape - 6N7D Budget": {
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"
  },
  "Bali 4★ Luxury Package": {
    images: ["https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80"
  },
  "Bali Luxury Honeymoon Escape": {
    images: ["https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&q=80"
  },
  "Bali Safari Package": {
    images: ["https://images.unsplash.com/photo-1558005530-a7958896ec60?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1558005530-a7958896ec60?w=600&q=80"
  },
  "Bali Spa Package": {
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80"
  },
  
  // Goa packages (2 different images)
  "Goa 3N4D Beach Package": {
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80"
  },
  "Goa Group Tour Package": {
    images: ["https://images.unsplash.com/photo-1587922546307-776227941871?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1587922546307-776227941871?w=600&q=80"
  },
  
  // Jaisalmer packages (2 different images)
  "Jaisalmer Desert Group Tour": {
    images: ["https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&q=80"
  },
  "Jaisalmer Private Tour": {
    images: ["https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80"
  },
  
  // Manali packages (4 different images)
  "Manali-Kasol-Sissu Complete Tour": {
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
  },
  "Manali-Kasol-Sissu Honeymoon Package": {
    images: ["https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=600&q=80"
  },
  "Shimla-Manali Tour Package (Exclusive)": {
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80"
  },
  "Shimla-Manali Tour Package": {
    images: ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80"
  },
  
  // Kerala
  "Kerala Premium Holiday Package": {
    images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80"
  },
  
  // Kedarnath
  "Kedarnath Yatra Package": {
    images: ["https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=600&q=80"
  },
  
  // Char Dham
  "Char Dham Group Tour": {
    images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80"
  },
  
  // Udaipur packages (3 different images)
  "Udaipur Lake City Package": {
    images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80"
  },
  "Udaipur-Kumbhalgarh Tour": {
    images: ["https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80"
  },
  "Udaipur-Nathdwara-Kumbhalgarh Group Tour": {
    images: ["https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80"
  },
  
  // Rajasthan
  "Royal Rajasthan Tour Package": {
    images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80"
  },
  
  // Spiti Valley packages (2 different images)
  "Spiti Valley Complete Tour": {
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80"
  },
  "Spiti Valley Group Tour": {
    images: ["https://images.unsplash.com/photo-1562979314-bee7453e911c?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=600&q=80"
  },
  
  // Singapore
  "Singapore + Malaysia Package": {
    images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80"
  },
  
  // Vietnam packages (11 different images)
  "Vietnam Group Tour": {
    images: ["https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80"
  },
  "Vietnam @ 32000": {
    images: ["https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80"
  },
  "Phu Quoc Island Package": {
    images: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80"
  },
  "Hanoi @ 24000": {
    images: ["https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&q=80"
  },
  "Hanoi - Da Nang Tour": {
    images: ["https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80"
  },
  "Hanoi & Phu Quoc Combo": {
    images: ["https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80"
  },
  "Hanoi - Da Nang - Ho Chi Minh": {
    images: ["https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80"
  },
  "Hanoi - Da Nang - Phu Quoc": {
    images: ["https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=600&q=80"
  },
  "Vietnam @ 48000 Premium": {
    images: ["https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600&q=80"
  },
  "Da Nang - Phu Quoc Beach Tour": {
    images: ["https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=600&q=80"
  },
  "Grand Vietnam Tour": {
    images: ["https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"],
    thumbnail: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80"
  }
};

// Update each package with unique images
packages.forEach(pkg => {
  if (imageMap[pkg.name]) {
    pkg.images = imageMap[pkg.name].images;
    pkg.thumbnail = imageMap[pkg.name].thumbnail;
  }
});

// Write back to file
fs.writeFileSync(packagesPath, JSON.stringify(packages, null, 2));
console.log('✅ Successfully updated all package images with unique photos!');
console.log(`Total packages updated: ${packages.length}`);
