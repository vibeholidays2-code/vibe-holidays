# Populate Database via Render Shell

Since your local machine has DNS resolution issues with MongoDB Atlas, we'll populate the database directly from Render (where your backend is hosted).

## Step 1: Check Network Access in MongoDB Atlas

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Network Access" in the left sidebar
3. Check if you have an entry for `0.0.0.0/0`

**If you DON'T see `0.0.0.0/0`:**
1. Click "Add IP Address"
2. Click "Allow Access from Anywhere"
3. Click "Confirm"
4. Wait 1-2 minutes for it to take effect

## Step 2: Update Render Environment Variables

1. Go to https://dashboard.render.com
2. Select your backend service: `vibe-holidays-backend`
3. Click "Environment" tab
4. Find `MONGODB_URI` and click "Edit"
5. Update the value to:
   ```
   mongodb+srv://vh2:vibe9099@vibesholiday.nth8j05.mongodb.net/vibes-holidays?retryWrites=true&w=majority&appName=vibesholiday
   ```
6. Click "Save Changes"

## Step 3: Manually Deploy (to apply new environment variables)

1. Still in Render dashboard
2. Click "Manual Deploy" tab
3. Click "Deploy latest commit"
4. Wait for deployment to complete (2-3 minutes)

## Step 4: Open Render Shell

1. In Render dashboard, click "Shell" tab
2. Wait for shell to connect
3. You'll see a command prompt

## Step 5: Populate Database via Shell

In the Render shell, run these commands one by one:

```bash
# Test connection first
node test-mongodb-connection.js

# If connection works, populate database
node recreate-all-packages-in-atlas.js
```

This will take 3-5 minutes to complete.

## Step 6: Verify Packages

After the script completes, test the API:

```bash
curl https://vibe-holidays-backend-0vgn.onrender.com/api/packages
```

You should see packages in the response!

## Step 7: Check Your Website

Visit: https://www.vibesholidays.in/packages

Packages should now be visible!

---

## Alternative: Use MongoDB Compass

If Render shell doesn't work, you can use MongoDB Compass to import data:

### 1. Install MongoDB Compass
Download from: https://www.mongodb.com/try/download/compass

### 2. Connect to Your Cluster
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste connection string:
   ```
   mongodb+srv://vh2:vibe9099@vibesholiday.nth8j05.mongodb.net/vibes-holidays
   ```
4. Click "Connect"

### 3. Create Collections
1. Select database `vibes-holidays`
2. Create collection: `packages`
3. Create collection: `users`
4. Create collection: `inquiries`

### 4. Import Sample Package
1. Click on `packages` collection
2. Click "Add Data" → "Insert Document"
3. Paste this sample package:

```json
{
  "name": "Bali Budget Package",
  "destination": "Bali",
  "duration": 7,
  "price": 25000,
  "description": "Experience the magic of Bali with our budget-friendly package",
  "highlights": [
    "Visit Tanah Lot Temple",
    "Ubud Monkey Forest",
    "Tegalalang Rice Terraces",
    "Water Temple Tour"
  ],
  "inclusions": [
    "6 Nights Accommodation",
    "Daily Breakfast",
    "Airport Transfers",
    "Sightseeing Tours"
  ],
  "exclusions": [
    "International Flights",
    "Travel Insurance",
    "Personal Expenses"
  ],
  "images": [
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
  ],
  "thumbnail": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
  "featured": true,
  "active": true,
  "category": "Bali"
}
```

5. Click "Insert"

### 5. Test API
Visit: https://vibe-holidays-backend-0vgn.onrender.com/api/packages

You should see the package!

### 6. Add More Packages
Repeat step 4 for more packages, or run the population script from Render shell.

---

## Troubleshooting

### "Connection timeout" in Render Shell
- Check Network Access in MongoDB Atlas
- Ensure `0.0.0.0/0` is added
- Wait 2-3 minutes after adding IP

### "Authentication failed"
- Verify username is `vh2`
- Verify password is `vibe9099`
- Check Database Access in MongoDB Atlas

### Render Shell not loading
- Try refreshing the page
- Or use MongoDB Compass method instead

### Packages still not showing
- Check Render logs for errors
- Verify MONGODB_URI environment variable
- Test API endpoint directly

---

## Quick Summary

1. ✅ Add `0.0.0.0/0` to Network Access in MongoDB Atlas
2. ✅ Update `MONGODB_URI` in Render environment variables
3. ✅ Deploy latest commit in Render
4. ✅ Open Render Shell and run: `node recreate-all-packages-in-atlas.js`
5. ✅ Test API: `https://vibe-holidays-backend-0vgn.onrender.com/api/packages`
6. ✅ Check website: `https://www.vibesholidays.in/packages`

That's it! Your packages will be live!
