# 📦 Data Migration Guide - Local MongoDB to Atlas

## Quick Start

### Step 1: Verify Atlas Connection
First, let's check if MongoDB Atlas is accessible:

```bash
cd backend
node verify-atlas-connection.js
```

**Expected Output:**
- ✅ Successfully connected to MongoDB Atlas
- Shows list of collections (if any exist)

---

## Migration Options

### Option A: Automatic Migration (Recommended)

If you have local MongoDB running with your data:

```bash
cd backend
node migrate-to-atlas.js
```

This script will:
1. Connect to your local MongoDB
2. Connect to MongoDB Atlas
3. Copy all collections and documents
4. Verify the migration
5. Show summary

**⚠️ Important:** This will clear existing data in Atlas and replace it with local data.

---

### Option B: Manual Migration (If local MongoDB is not running)

If your local MongoDB is not running or you want more control:

#### 1. Export data from local MongoDB

```bash
# Export all databases
mongodump --uri="mongodb://localhost:27017/vibes-holidays" --out=./mongodb-backup

# This creates a folder with all your data
```

#### 2. Import to MongoDB Atlas

```bash
# Import to Atlas
mongorestore --uri="mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays" ./mongodb-backup/vibes-holidays

# Or if you want to drop existing data first:
mongorestore --uri="mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays" --drop ./mongodb-backup/vibes-holidays
```

---

### Option C: Fresh Start (No Migration)

If you want to start fresh in Atlas:

1. Your backend is already configured to use Atlas
2. Just restart your backend server
3. Re-create packages using your existing scripts:
   - `node create-bali-packages.js`
   - `node create-jaisalmer-packages.js`
   - `node create-vietnam-*.js` (all Vietnam package scripts)

---

## Troubleshooting

### Error: "MongoNetworkError: connection refused"

**Problem:** Local MongoDB is not running

**Solutions:**
1. Start local MongoDB: `mongod` or `net start MongoDB`
2. Use Option B (Manual Migration) instead
3. Use Option C (Fresh Start)

---

### Error: "IP not whitelisted"

**Problem:** Your IP address is not allowed in MongoDB Atlas

**Solution:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on "Network Access" in left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (for testing)
5. Click "Confirm"
6. Wait 1-2 minutes for changes to apply

---

### Error: "Authentication failed"

**Problem:** Username or password is incorrect

**Solution:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on "Database Access" in left sidebar
3. Verify user `vibe_db_user` exists
4. If not, create new user with password `Vibe9099`
5. Give user "Read and write to any database" permission

---

## Verify Migration Success

After migration, verify your data:

```bash
cd backend
node verify-atlas-connection.js
```

**Expected Output:**
```
✅ Successfully connected to MongoDB Atlas!

📊 Found X collections in database:

   packages: 17 documents
   users: 1 documents
   bookings: X documents
   inquiries: X documents
   galleries: X documents

✅ Database has data! Ready for deployment.
```

---

## What Collections Should You Have?

After migration, you should see:

- **packages**: 17 documents (4 Bali + 2 Jaisalmer + 11 Vietnam)
- **users**: 1+ documents (admin user)
- **bookings**: X documents (customer bookings)
- **inquiries**: X documents (contact form submissions)
- **galleries**: X documents (gallery images)

---

## Next Steps After Migration

Once migration is complete:

1. ✅ Verify data in Atlas: `node verify-atlas-connection.js`
2. ✅ Test backend locally: `npm run dev`
3. ✅ Test frontend locally: `cd ../frontend && npm run dev`
4. ✅ Verify all packages display correctly
5. ✅ Push code to GitHub
6. ✅ Deploy to Render (backend) and Vercel (frontend)

---

## Need Help?

If you encounter any issues:

1. Check MongoDB Atlas dashboard for connection logs
2. Verify your `.env` file has correct connection string
3. Make sure your IP is whitelisted in Atlas
4. Check that database user has proper permissions

---

**Ready to migrate? Start with Step 1: Verify Atlas Connection** ⬆️
