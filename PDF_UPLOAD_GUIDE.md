# 📄 How to Add PDF Brochures to Vibe Holidays Website

## Quick Overview

I've updated your website to support PDF brochures for holiday packages. Here are your options:

---

## 🎯 Option 1: Add PDFs to Individual Packages (Recommended)

Each holiday package can have its own downloadable PDF brochure.

### Step 1: Place Your PDF Files

1. Copy your PDF files to the `backend/brochures/` folder
2. Name them clearly, e.g., `bali-adventure.pdf`, `maldives-luxury.pdf`

Example:
```
backend/
  brochures/
    bali-adventure.pdf
    maldives-luxury.pdf
    dubai-shopping.pdf
```

### Step 2: Add PDF to Package via Admin Dashboard

1. Go to http://localhost:5173/admin/login
2. Login with your admin credentials
3. Go to "Package Management"
4. When creating or editing a package, add the PDF URL in the "Brochure URL" field:
   - Format: `http://localhost:5000/brochures/bali-adventure.pdf`
   - Or for production: `https://yourdomain.com/brochures/bali-adventure.pdf`

### Step 3: The PDF Will Appear on Package Detail Page

Users will see a "Download Brochure" button on the package detail page.

---

## 🎯 Option 2: Manual Database Entry (Quick Method)

If you want to add PDFs to existing packages quickly:

### Step 1: Place PDFs in the brochures folder

```bash
# Copy your PDFs
cp /path/to/your/pdfs/*.pdf backend/brochures/
```

### Step 2: Update Packages in Database

Create a script `backend/add-brochures.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function addBrochures() {
  try {
    // Example: Add brochure to a specific package
    await Package.updateOne(
      { name: 'Bali Adventure' }, // Find package by name
      { $set: { brochureUrl: 'http://localhost:5000/brochures/bali-adventure.pdf' } }
    );

    // Add more packages as needed
    await Package.updateOne(
      { name: 'Maldives Luxury' },
      { $set: { brochureUrl: 'http://localhost:5000/brochures/maldives-luxury.pdf' } }
    );

    console.log('✅ Brochures added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addBrochures();
```

Run it:
```bash
cd backend
node add-brochures.js
```

---

## 🎯 Option 3: Create a Dedicated Brochures Page

Create a page that lists all available brochures.

### Step 1: Create Brochures Page Component

Create `frontend/src/pages/BrochuresPage.tsx`:

```typescript
import { useState, useEffect } from 'react';

interface Brochure {
  name: string;
  description: string;
  url: string;
  thumbnail?: string;
}

const BrochuresPage = () => {
  const brochures: Brochure[] = [
    {
      name: 'Bali Adventure Package',
      description: 'Explore the beautiful island of Bali',
      url: 'http://localhost:5000/brochures/bali-adventure.pdf',
      thumbnail: '/images/bali-thumb.jpg'
    },
    {
      name: 'Maldives Luxury Package',
      description: 'Experience luxury in the Maldives',
      url: 'http://localhost:5000/brochures/maldives-luxury.pdf',
      thumbnail: '/images/maldives-thumb.jpg'
    },
    // Add more brochures here
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Download Our Brochures
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brochures.map((brochure, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            {brochure.thumbnail && (
              <img 
                src={brochure.thumbnail} 
                alt={brochure.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{brochure.name}</h3>
            <p className="text-gray-600 mb-4">{brochure.description}</p>
            <a
              href={brochure.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrochuresPage;
```

### Step 2: Add Route

Update `frontend/src/App.tsx` to add the brochures route:

```typescript
import BrochuresPage from './pages/BrochuresPage';

// In your routes:
<Route path="/brochures" element={<BrochuresPage />} />
```

### Step 3: Add to Navigation

Update `frontend/src/components/Navbar.tsx` to add a "Brochures" link.

---

## 🎯 Option 4: Add Download Button to Package Detail Page

Update the package detail page to show a download button if a brochure exists.

### Update PackageDetailPage.tsx

Find the section where package details are displayed and add:

```typescript
{pkg.brochureUrl && (
  <div className="mt-6">
    <a
      href={pkg.brochureUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download Brochure (PDF)
    </a>
  </div>
)}
```

---

## 📋 Quick Start Checklist

- [ ] Copy your PDF files to `backend/brochures/` folder
- [ ] Restart the backend server (it's already serving the brochures folder)
- [ ] Choose one of the options above
- [ ] Test by accessing: http://localhost:5000/brochures/your-file.pdf

---

## 🔒 Security Notes

1. **File Size**: Keep PDFs under 10MB for better performance
2. **File Names**: Use lowercase, no spaces (use hyphens instead)
   - ✅ Good: `bali-adventure-2024.pdf`
   - ❌ Bad: `Bali Adventure 2024.pdf`
3. **Production**: When deploying, make sure the brochures folder is included

---

## 🚀 Production Deployment

When deploying to production:

1. Upload PDFs to your server's `backend/brochures/` folder
2. Update URLs to use your production domain:
   - `https://api.yourdomain.com/brochures/filename.pdf`
3. Consider using a CDN for better performance (optional)

---

## 💡 Alternative: Use Cloud Storage

For better scalability, you can store PDFs in cloud storage:

1. **AWS S3** - Upload PDFs to S3 bucket
2. **Google Cloud Storage** - Upload to GCS bucket
3. **Cloudinary** - Supports PDF hosting

Then just use the cloud URL in the brochureUrl field.

---

## 🆘 Need Help?

If you need help implementing any of these options, just let me know which approach you prefer!

**Recommended for beginners:** Option 1 (Add PDFs to individual packages via admin dashboard)
**Quickest:** Option 2 (Manual database entry)
**Most flexible:** Option 3 (Dedicated brochures page)
