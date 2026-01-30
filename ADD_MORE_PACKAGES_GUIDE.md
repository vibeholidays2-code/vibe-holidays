# 📦 How to Add More Destination Packages

## ✅ Current Setup

Your Bali packages are now organized in the **"Bali"** category:
- ✅ Bali Budget Package (₹25,000)
- ✅ Bali Standard Package (₹27,000)
- ✅ Bali Deluxe Package (₹30,000)
- ✅ Bali Premium Luxury Package (₹35,000)

---

## 🎯 How to Add New Destinations

### Method 1: Using the Script (Recommended)

1. **Open the file:** `backend/add-new-destination-packages.js`

2. **Edit the `newPackages` array** - Add your packages:

```javascript
const newPackages = [
  {
    name: 'Your Package Name',
    destination: 'City, Country',
    duration: 5, // number of days
    price: 35000, // in rupees
    description: 'Package description...',
    itinerary: [
      'Day 1: ...',
      'Day 2: ...',
      // Add more days
    ],
    inclusions: [
      'Item 1',
      'Item 2',
      // Add more
    ],
    exclusions: [
      'Item 1',
      'Item 2',
      // Add more
    ],
    images: [
      'https://images.unsplash.com/photo-xxx?w=1200&q=80',
      // Add 3-4 images
    ],
    thumbnail: 'https://images.unsplash.com/photo-xxx?w=600&q=80',
    featured: true,
    active: true,
    category: 'Dubai' // IMPORTANT: Set category for grouping
  },
  // Add more packages...
];
```

3. **Run the script:**
```bash
cd backend
node add-new-destination-packages.js
```

---

### Method 2: Using Admin Dashboard

1. Go to http://localhost:5173/admin/login
2. Navigate to "Package Management"
3. Click "Add New Package"
4. Fill in all details
5. **Important:** Set the "Category" field to group packages:
   - For Dubai packages: `Dubai`
   - For Thailand packages: `Thailand`
   - For Maldives packages: `Maldives`
   - etc.

---

## 🏷️ Category Organization

Packages are grouped by the **category** field:

| Category | Destination Examples |
|----------|---------------------|
| Bali | Bali, Indonesia |
| Dubai | Dubai, UAE |
| Thailand | Phuket, Bangkok, Krabi |
| Maldives | Maldives Islands |
| Singapore | Singapore |
| Malaysia | Kuala Lumpur, Langkawi |
| Europe | Paris, London, Rome |
| USA | New York, Los Angeles |

---

## 📸 Finding Images

### Option 1: Unsplash (Free)
1. Go to https://unsplash.com
2. Search for your destination (e.g., "Dubai skyline")
3. Click on image
4. Right-click → Copy image address
5. Add `?w=1200&q=80` to the URL for main images
6. Add `?w=600&q=80` for thumbnails

**Example URLs:**
```
Main: https://images.unsplash.com/photo-xxx?w=1200&q=80
Thumbnail: https://images.unsplash.com/photo-xxx?w=600&q=80
```

### Option 2: Your Own Photos
1. Place photos in `backend/uploads/` folder
2. Use URL: `http://localhost:5000/uploads/your-photo.jpg`

---

## 🎨 Package Template

Here's a complete template you can copy and modify:

```javascript
{
  name: 'Dubai Luxury Experience',
  destination: 'Dubai, UAE',
  duration: 5,
  price: 55000,
  description: 'Experience the luxury and grandeur of Dubai with this exclusive package featuring 5-star accommodations, desert safari, and iconic attractions.',
  itinerary: [
    'Day 1: Arrival in Dubai - VIP airport pickup and luxury hotel check-in',
    'Day 2: Burj Khalifa & Dubai Mall - Observation deck and shopping',
    'Day 3: Desert Safari - Dune bashing, camel ride, BBQ dinner',
    'Day 4: Palm Jumeirah & Atlantis - Beach day and aquarium visit',
    'Day 5: Departure - Hotel checkout and airport drop-off'
  ],
  inclusions: [
    'Round-trip airport transfers in luxury vehicle',
    '4 nights accommodation in 5-star hotel',
    'Daily breakfast and 2 dinners',
    'Burj Khalifa tickets (148th floor)',
    'Desert safari with BBQ dinner',
    'Atlantis Aquarium tickets',
    'All entrance fees and transportation'
  ],
  exclusions: [
    'International flights',
    'Visa fees (available on arrival)',
    'Travel insurance',
    'Lunches (except mentioned)',
    'Personal shopping',
    'Optional activities',
    'Tips and gratuities'
  ],
  images: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
    'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200&q=80'
  ],
  thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
  featured: true,
  active: true,
  category: 'Dubai'
}
```

---

## 🚀 Quick Start Examples

### Example 1: Add Dubai Packages

```bash
cd backend
# Edit add-new-destination-packages.js
# Add Dubai packages to newPackages array
node add-new-destination-packages.js
```

### Example 2: Add Thailand Packages

```bash
cd backend
# Edit add-new-destination-packages.js
# Add Thailand packages to newPackages array
node add-new-destination-packages.js
```

---

## 📋 Checklist for New Packages

When adding a new package, make sure you have:

- [ ] Package name (unique and descriptive)
- [ ] Destination (City, Country format)
- [ ] Duration (number of days)
- [ ] Price (in rupees)
- [ ] Description (2-3 sentences)
- [ ] Day-by-day itinerary
- [ ] List of inclusions
- [ ] List of exclusions
- [ ] 3-4 high-quality images
- [ ] Thumbnail image
- [ ] Category (for grouping)

---

## 🌐 How Packages Appear on Website

### Packages Page
Packages are displayed in a grid, grouped by category:

```
🏷️ Bali (4 packages)
[Bali Budget] [Bali Standard] [Bali Deluxe] [Bali Premium]

🏷️ Dubai (2 packages)
[Dubai Shopping] [Dubai Luxury]

🏷️ Thailand (3 packages)
[Thailand Beach] [Thailand Culture] [Thailand Adventure]
```

### Filtering
Users can filter by:
- Destination/Category
- Price range
- Duration
- Search keywords

---

## 💡 Tips for Great Packages

1. **Clear Names:** Use descriptive names like "Dubai Luxury Experience" not just "Dubai Package"

2. **Competitive Pricing:** Research market rates for similar packages

3. **Detailed Itinerary:** Be specific about what happens each day

4. **High-Quality Images:** Use professional photos that showcase the destination

5. **Complete Information:** Include all inclusions and exclusions clearly

6. **Consistent Categories:** Use the same category name for packages in the same destination

---

## 🎯 Popular Destinations to Add

Consider adding packages for:
- ✈️ Dubai, UAE
- ✈️ Thailand (Phuket, Bangkok, Krabi)
- ✈️ Maldives
- ✈️ Singapore
- ✈️ Malaysia (Kuala Lumpur, Langkawi)
- ✈️ Sri Lanka
- ✈️ Vietnam
- ✈️ Europe (Paris, London, Switzerland)
- ✈️ USA (New York, Los Angeles, Las Vegas)
- ✈️ Australia

---

## 🆘 Need Help?

If you need help:
1. Use the template provided above
2. Copy an existing package and modify it
3. Use the admin dashboard for a visual interface
4. Check the example packages in `add-new-destination-packages.js`

---

**Ready to add more destinations? Edit `backend/add-new-destination-packages.js` and run it!** 🚀
