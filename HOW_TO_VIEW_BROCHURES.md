# How to View PDF Brochures on Your Website 📄

## ✅ Feature is Now Live!

Your website now has a "View Full Brochure" feature that lets visitors see complete PDF details for each package.

## How to Test It

### Step 1: Open Your Website
Visit: **http://localhost:5173**

### Step 2: Go to Packages Page
Click on "Packages" in the navigation menu or visit: **http://localhost:5173/packages**

### Step 3: Select Any Package
You'll see packages grouped by destination:
- **Bali** (4 packages)
- **Jaisalmer** (2 packages)

Click on any package to view its details.

### Step 4: View the Brochure
On the package detail page, you'll see TWO ways to access the PDF:

**Option 1: In the Main Content Area**
- Look below the "About This Package" description
- You'll see a blue link: "Read More - View Full Brochure (PDF)" with a PDF icon
- Click it to open the PDF in a new tab

**Option 2: In the Sidebar**
- Look at the booking card on the right side
- Below the "Book Now" button, you'll see "View Full Brochure (PDF)" button
- Click it to open the PDF in a new tab

## What Packages Have Brochures?

All 6 packages now have PDF brochures:

### Bali Packages (4)
1. **Bali Budget Package** (₹25,000)
   - PDF: bali-25000.pdf
   
2. **Bali Standard Package** (₹27,000)
   - PDF: bali-27000.pdf
   
3. **Bali Deluxe Package** (₹30,000)
   - PDF: bali-30000.pdf
   
4. **Bali Premium Luxury Package** (₹35,000)
   - PDF: bali-35000.pdf

### Jaisalmer Packages (2)
1. **Jaisalmer Desert Group Tour** (₹8,500)
   - PDF: jaisalmer-group-tour.pdf
   
2. **Jaisalmer Private Desert Tour** (₹15,000)
   - PDF: jaisalmer-private-tour.pdf

## How It Looks

### On Package Detail Page:
```
┌─────────────────────────────────────────┐
│  Package Name                           │
│  Description text...                    │
│                                         │
│  📄 Read More - View Full Brochure (PDF)│  ← Click here
└─────────────────────────────────────────┘

┌─────────────────┐
│  ₹XX,XXX        │
│  per person     │
│                 │
│  [Book Now]     │  ← Main booking button
│                 │
│  [View Full     │  ← Or click here
│   Brochure]     │
└─────────────────┘
```

## Adding Brochures to New Packages

When you add new packages in the future, include the `brochureUrl` field:

```javascript
{
  name: 'Package Name',
  price: 10000,
  // ... other fields ...
  brochureUrl: 'http://localhost:5000/brochures/your-package.pdf'
}
```

### Steps:
1. Copy your PDF to `backend/brochures/` folder
2. Give it a simple name (e.g., `goa-package.pdf`)
3. Add the `brochureUrl` field when creating the package
4. The button will automatically appear on the package detail page

## Troubleshooting

### PDF Not Opening?
- Make sure the backend server is running (http://localhost:5000)
- Check that the PDF file exists in `backend/brochures/` folder
- Verify the filename matches the URL in the database

### Button Not Showing?
- The button only appears if the package has a `brochureUrl` field
- Check the database to ensure the field is set
- Refresh the page after updating the database

## Current Status

✅ All 6 packages have PDF brochures
✅ PDFs are accessible at http://localhost:5000/brochures/
✅ Frontend displays "View Full Brochure" buttons
✅ PDFs open in new tab (users don't lose their place)
✅ Works on all package detail pages

## Next Steps

You can now:
1. Test the feature by clicking through packages
2. Add more packages with their PDF brochures
3. Update existing PDFs by replacing files in `backend/brochures/`
4. Customize the button text or styling if needed

Enjoy your new PDF brochure feature! 🎉
