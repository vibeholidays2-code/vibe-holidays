# 🚀 Quick PDF Setup - 3 Simple Steps

## Step 1: Copy Your PDFs (2 minutes)

Copy all your PDF brochures to the `backend/brochures/` folder:

```bash
# Example on Windows:
copy "C:\path\to\your\pdfs\*.pdf" "backend\brochures\"

# Or just drag and drop the PDFs into the backend/brochures/ folder
```

**Important:** Rename your PDFs to be web-friendly:
- Use lowercase letters
- Replace spaces with hyphens
- Example: `Bali Adventure 2024.pdf` → `bali-adventure-2024.pdf`

---

## Step 2: Link PDFs to Packages (5 minutes)

### Option A: Using the Admin Dashboard (Easiest)

1. Open http://localhost:5173/admin/login
2. Login with your admin credentials
3. Go to "Package Management"
4. Click "Edit" on any package
5. In the "Brochure URL" field, enter:
   ```
   http://localhost:5000/brochures/your-pdf-name.pdf
   ```
6. Click "Save"

### Option B: Using the Script (Faster for multiple packages)

1. Edit `backend/add-brochures.js`
2. Update the `updates` array with your package names and PDF files:
   ```javascript
   const updates = [
     {
       packageName: 'Your Package Name',  // Must match exactly
       pdfFile: 'your-pdf-file.pdf'
     },
     // Add more...
   ];
   ```
3. Run the script:
   ```bash
   cd backend
   node add-brochures.js
   ```

---

## Step 3: Test It! (1 minute)

1. Go to http://localhost:5173/packages
2. Click on any package that has a PDF
3. You should see a "Download Brochure" button
4. Click it to download the PDF

---

## 📁 Folder Structure

After setup, your structure should look like:

```
backend/
  brochures/
    bali-adventure.pdf
    maldives-luxury.pdf
    dubai-shopping.pdf
    thailand-tour.pdf
    ... (all your PDFs)
```

---

## 🔍 Verify PDFs Are Accessible

Test if your PDFs are accessible by visiting:

```
http://localhost:5000/brochures/your-pdf-name.pdf
```

If you see the PDF, it's working! ✅

---

## 🎨 Where PDFs Appear

PDFs will automatically appear on:
1. **Package Detail Pages** - Download button below package info
2. **Admin Dashboard** - Brochure URL field when editing packages

---

## 🆘 Troubleshooting

**PDF not showing?**
- Check the filename matches exactly (case-sensitive)
- Make sure the PDF is in `backend/brochures/` folder
- Restart the backend server

**Can't access PDF URL?**
- Make sure backend server is running
- Check the URL format: `http://localhost:5000/brochures/filename.pdf`

**Package not found in script?**
- Run `node add-brochures.js` to see list of all packages
- Copy the exact package name from the list

---

## 📞 Need Help?

Just ask! I can help you:
- Add PDFs to specific packages
- Create a custom brochures page
- Set up bulk PDF uploads
- Configure for production deployment

---

**That's it! Your PDFs are now integrated into the website! 🎉**
