# Fix: Website Not Loading on Other Devices

## The Problem
Your website works on your computer but not on other devices because:
1. Your local backend (localhost:5000) is only accessible on your computer
2. Other devices need to use the deployed backend on Render

## The Solution

### Step 1: Verify Your Deployed Backend is Running

1. Open this URL in your browser (on ANY device):
   ```
   https://vibe-holidays-backend-0vgn.onrender.com/api/health
   ```

2. You should see something like:
   ```json
   {"status":"ok","message":"Server is running"}
   ```

3. If you see an error or it takes 30+ seconds:
   - Your backend is "sleeping" (Render free tier sleeps after 15 min inactivity)
   - Wait 30 seconds for it to wake up
   - Refresh the page

### Step 2: Check Gallery Data on Production

Test if gallery data is in production database:
```
https://vibe-holidays-backend-0vgn.onrender.com/api/gallery
```

You should see 17 gallery items with your custom names (Bali, Ayodhya, Jaisalmer, etc.)

### Step 3: Update Production Gallery (If Needed)

If the gallery data is missing or wrong, run this command to update production:

```bash
cd backend
node update-gallery-with-custom-names.js
```

This updates MongoDB Atlas (which your deployed backend uses).

### Step 4: Test Your Live Website

1. Open your live website on ANY device:
   ```
   https://vibe-holidays-red.vercel.app
   ```

2. Test these pages:
   - Homepage (should show featured packages)
   - Packages page (should show all packages)
   - Gallery page (should show 17 photos/videos with custom names)
   - Contact form (should work)

### Step 5: Clear Cache (If Still Not Working)

If you still see old data:

**On Mobile:**
- Close the browser completely
- Reopen and visit the site
- Or use incognito/private mode

**On Desktop:**
- Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- This does a hard refresh

---

## Quick Test Commands

Run these to verify everything:

```bash
# Test 1: Check backend health
curl https://vibe-holidays-backend-0vgn.onrender.com/api/health

# Test 2: Check gallery data
curl https://vibe-holidays-backend-0vgn.onrender.com/api/gallery

# Test 3: Check packages
curl https://vibe-holidays-backend-0vgn.onrender.com/api/packages
```

---

## Common Issues

### Issue 1: "Cannot connect to server"
**Solution:** Backend is sleeping. Wait 30 seconds and try again.

### Issue 2: "Old gallery photos showing"
**Solution:** 
1. Run `node update-gallery-with-custom-names.js` in backend folder
2. Clear browser cache
3. Refresh page

### Issue 3: "Website works on my computer but not phone"
**Solution:** Make sure you're using the Vercel URL, not localhost:
- ✅ Correct: `https://vibe-holidays-red.vercel.app`
- ❌ Wrong: `http://localhost:5173`

### Issue 4: "Images not loading"
**Solution:** Images are on Cloudinary (cloud storage), should work everywhere. If not:
1. Check browser console for errors (F12)
2. Verify Cloudinary URLs are correct
3. Check if Cloudinary account is active

---

## Your Live URLs

**Frontend (Vercel):**
- Main: https://vibe-holidays-red.vercel.app
- Alt: https://vibe-holidays-vibeholidays2-codes-projects.vercel.app

**Backend (Render):**
- API: https://vibe-holidays-backend-0vgn.onrender.com/api

**Database:**
- MongoDB Atlas (cloud database - already configured ✅)

**Admin Panel:**
- https://vibe-holidays-red.vercel.app/admin/login
- Username: admin
- Password: admin123

---

## How to Share Your Website

Share this URL with anyone:
```
https://vibe-holidays-red.vercel.app
```

They can access it from:
- ✅ Any phone (Android/iPhone)
- ✅ Any computer (Windows/Mac/Linux)
- ✅ Any tablet
- ✅ Anywhere in the world

---

## Need to Update Something?

### Update Gallery Photos:
1. Edit `backend/update-gallery-with-custom-names.js`
2. Run: `node update-gallery-with-custom-names.js`
3. Wait 1 minute for changes to appear

### Update Packages:
1. Use admin panel: https://vibe-holidays-red.vercel.app/admin/login
2. Or run scripts in backend folder

### Update Code:
1. Make changes locally
2. Push to GitHub: `git push`
3. Vercel auto-deploys frontend (2 min)
4. Render auto-deploys backend (5 min)

---

## ✅ Checklist

- [ ] Backend health check works
- [ ] Gallery API returns 17 items
- [ ] Live website loads on your phone
- [ ] Live website loads on another device
- [ ] All images load correctly
- [ ] Contact form works
- [ ] Admin login works

If all checked, your website is working perfectly! 🎉
