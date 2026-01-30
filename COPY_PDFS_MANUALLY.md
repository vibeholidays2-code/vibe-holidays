# 📄 How to Add PDF Downloads (Manual Method)

Since the PDF filenames have special characters (✨), here's the easiest way to add them:

## 🎯 Quick Steps

### Step 1: Open File Explorer
Navigate to your project folder:
```
C:\Users\ASHUS VIVOBOOK\OneDrive\Desktop\vibe holidays
```

### Step 2: Copy PDFs
1. Open the `pdfs` folder
2. Select all 4 PDF files
3. Copy them (Ctrl+C)
4. Navigate to `backend\brochures` folder
5. Paste them (Ctrl+V)

### Step 3: Rename PDFs
Rename the files to remove special characters:

| Old Name | New Name |
|----------|----------|
| ✨ Bali @ 25000 ✨.pdf | bali-budget-25000.pdf |
| ✨ Bali @ 27000 ✨.pdf | bali-standard-27000.pdf |
| ✨ Bali @ 30000 ✨.pdf | bali-deluxe-30000.pdf |
| ✨ Bali @ 35000 ✨.pdf | bali-premium-35000.pdf |

### Step 4: Test
Open in browser:
- http://localhost:5000/brochures/bali-budget-25000.pdf
- http://localhost:5000/brochures/bali-standard-27000.pdf
- http://localhost:5000/brochures/bali-deluxe-30000.pdf
- http://localhost:5000/brochures/bali-premium-35000.pdf

### Step 5: View on Website
1. Go to http://localhost:5173/packages
2. Click on any Bali package
3. You'll see a "Download Brochure" button
4. Click it to download the PDF

---

## ✅ That's It!

The PDFs are now linked to your packages and users can download them!

---

## 🎨 Alternative: Keep HTML Only

**Recommendation:** You don't actually need the PDFs!

The HTML packages on your website are:
- ✅ More user-friendly
- ✅ Better for SEO
- ✅ Mobile responsive
- ✅ Easier to update
- ✅ Faster to load

Users can see all the information directly on the website without downloading anything.

---

**Your choice:** Add PDFs for download, or keep the beautiful HTML packages! 🚀
