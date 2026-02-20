# How to Add Bali Package Manually via MongoDB Atlas

Since the local MongoDB connection isn't working, follow these steps to add the package directly through MongoDB Atlas web interface:

## Step 1: Access MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Login with your credentials
3. Click on your cluster: **cluster0**
4. Click **Browse Collections**

## Step 2: Delete Old Bali Packages

1. In the left sidebar, select database: **vibes-holidays**
2. Select collection: **packages**
3. In the filter box, enter: `{"destination": {"$regex": "bali", "$options": "i"}}`
4. Click **Find**
5. You'll see all Bali packages
6. Click the trash icon next to each Bali package to delete them
7. Or use the **Delete** button at the top after selecting all

## Step 3: Add New Bali Package

1. Still in the **packages** collection
2. Click **INSERT DOCUMENT** button (green button at top)
3. Switch to **{}** (JSON view) if not already
4. Copy the entire content from `BALI_LUXURY_PACKAGE_DATA.json` file
5. Paste it into the editor
6. Click **Insert**

## Alternative: Use MongoDB Compass (Desktop App)

If you have MongoDB Compass installed:

1. Open MongoDB Compass
2. Connect using: `mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays`
3. Navigate to **vibes-holidays** → **packages**
4. Delete old Bali packages (filter: `{destination: /bali/i}`)
5. Click **ADD DATA** → **Insert Document**
6. Paste the JSON from `BALI_LUXURY_PACKAGE_DATA.json`
7. Click **Insert**

## Step 4: Verify

1. Go to your website: https://www.vibesholidays.in/packages
2. You should see the new "Bali 4★ Luxury - 6N/7D" package
3. Price should show ₹55,000

## Package Details

- **Name**: Bali 4★ Luxury - 6N/7D
- **Price**: ₹55,000 per person
- **Duration**: 6 Nights / 7 Days
- **Hotels**: Fairfield by Marriott (4N) + Private Pool Villa (2N)
- **Features**: All private tours, water sports, safari, ATV, swing, floating breakfast

## Troubleshooting

If the package doesn't appear:
1. Clear browser cache
2. Check if `isActive: true` in the document
3. Verify `featured: true` if you want it on homepage
4. Check backend logs on Render for any errors
