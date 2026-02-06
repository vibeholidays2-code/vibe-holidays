# Fix Gallery Images - Step by Step

## Problem
All gallery images showing the same photo because Cloudinary URLs are not correct in database.

## Solution (5 minutes)

### Step 1: Get Your Cloudinary URLs

1. **Login to Cloudinary**: https://cloudinary.com/console

2. **Click "Media Library"** (left sidebar)

3. **Open the folder**: `vibe-holidays/gallery`

4. **For EACH image/video**:
   - Click on the thumbnail
   - Look for the **URL** field (it will look like: `https://res.cloudinary.com/dpsytvwmh/image/upload/v123456/vibe-holidays/gallery/filename.jpg`)
   - **Copy the URL**
   - Save it in a text file

5. You should have **16 URLs total**:
   - 6 for Destinations
   - 6 for Experiences  
   - 4 for Videos (.mp4 files)

### Step 2: Update the Script

1. **Open file**: `backend/update-gallery-with-cloudinary-urls.js`

2. **Replace** each `PASTE_YOUR_CLOUDINARY_URL_HERE_X` with the actual URL from Cloudinary

   Example:
   ```javascript
   // BEFORE:
   url: 'PASTE_YOUR_CLOUDINARY_URL_HERE_1',
   
   // AFTER:
   url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770374865/vibe-holidays/gallery/bali-beach.jpg',
   ```

3. **Save the file**

### Step 3: Run the Script

Open terminal and run:
```bash
cd backend
node update-gallery-with-cloudinary-urls.js
```

### Step 4: Verify

1. Refresh your production gallery page
2. Images should now be different!

---

## Alternative: Use Existing URLs

If you want to use the URLs that were already uploaded, I can create a script that uses those. The issue is they all have similar filenames (WhatsApp Image/Video), so they might be showing the same image.

Let me know if you need help!
