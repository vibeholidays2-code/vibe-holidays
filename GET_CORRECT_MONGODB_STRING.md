# How to Get Your Correct MongoDB Connection String

## The Problem
Your current connection string points to a cluster that doesn't exist or can't be reached:
```
mongodb+srv://vh2:vibe9099@vibesholiday.nth8j05.mongodb.net/
```

The error `querySrv ECONNREFUSED` means the DNS lookup for `vibesholiday.nth8j05.mongodb.net` is failing.

## Solution: Get the Correct Connection String

### Step 1: Log in to MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Log in with your MongoDB Atlas account

### Step 2: Check Your Clusters
1. Click on "Database" in the left sidebar
2. You should see your cluster(s) listed

**If you see NO clusters:**
- Your cluster was deleted or never created
- You need to create a new cluster (see "Create New Cluster" section below)

**If you see a cluster:**
- Note the cluster name (it might be different from "vibesholiday")
- Continue to Step 3

### Step 3: Get the Connection String
1. Click the "Connect" button on your cluster
2. Choose "Connect your application"
3. Select "Driver: Node.js" and "Version: 5.5 or later"
4. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Step 4: Update Your Configuration

1. **Replace the placeholders:**
   - `<username>` → `vh2` (or your actual username)
   - `<password>` → `vibe9099` (or your actual password)
   - Add `/vibes-holidays` before the `?` to specify the database name

   Final format:
   ```
   mongodb+srv://vh2:vibe9099@cluster0.xxxxx.mongodb.net/vibes-holidays?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Update backend/.env.production:**
   ```env
   MONGODB_URI=mongodb+srv://vh2:vibe9099@cluster0.xxxxx.mongodb.net/vibes-holidays?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Update Render Environment Variables:**
   - Go to https://dashboard.render.com
   - Select your backend service
   - Go to "Environment" tab
   - Update `MONGODB_URI` with the new connection string
   - Click "Save Changes"

### Step 5: Verify Network Access
1. In MongoDB Atlas, click "Network Access" in the left sidebar
2. Make sure you have one of these:
   - IP Address: `0.0.0.0/0` (allows access from anywhere) - RECOMMENDED for Render
   - Or add Render's IP addresses

3. If not, click "Add IP Address"
   - Choose "Allow Access from Anywhere"
   - Click "Confirm"

### Step 6: Verify Database User
1. Click "Database Access" in the left sidebar
2. Make sure user `vh2` exists
3. Check that it has "Read and write to any database" permissions
4. If password is wrong, click "Edit" and update it

### Step 7: Test the Connection
```bash
cd backend
node test-production-connection.js
```

You should see:
```
✅ Successfully connected to MongoDB Atlas!
```

### Step 8: Populate the Database
Once connection works:
```bash
cd backend
node recreate-all-packages-in-atlas.js
```

---

## Create New Cluster (If Needed)

If you don't have a cluster or want to create a new one:

### 1. Create Cluster
1. In MongoDB Atlas, click "Build a Database"
2. Choose "M0 FREE" tier
3. Choose a cloud provider and region (closest to your users)
4. Name your cluster (e.g., "vibes-holidays-prod")
5. Click "Create"

### 2. Create Database User
1. Create username: `vibesadmin`
2. Create a strong password (save it!)
3. Select "Built-in Role: Atlas Admin"
4. Click "Create User"

### 3. Set Up Network Access
1. Click "Add IP Address"
2. Choose "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### 4. Get Connection String
1. Wait for cluster to finish creating (2-3 minutes)
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add `/vibes-holidays` before the `?`

### 5. Update All Configurations
- Update `backend/.env.production`
- Update Render environment variables
- Test connection
- Populate database

---

## Quick Commands After Fix

```bash
# Test connection
cd backend
node test-production-connection.js

# Populate database
node recreate-all-packages-in-atlas.js

# Test API
curl https://vibe-holidays-backend-0vgn.onrender.com/api/packages

# Check website
# Visit: https://www.vibesholidays.in/packages
```

---

## Still Having Issues?

### Check Render Logs
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Logs" tab
4. Look for MongoDB connection errors

### Common Error Messages

**"Authentication failed"**
- Wrong username or password
- Update database user credentials in MongoDB Atlas

**"IP not whitelisted"**
- Add 0.0.0.0/0 to Network Access in MongoDB Atlas

**"querySrv ECONNREFUSED"**
- Cluster hostname is wrong
- Get the correct connection string from MongoDB Atlas

**"Timeout"**
- Network issue or cluster is paused
- Check if cluster is running in MongoDB Atlas

---

## Contact Information

If you need help:
1. Share the cluster name from MongoDB Atlas
2. Share any error messages from Render logs
3. Confirm network access settings in MongoDB Atlas

The main issue is getting the correct connection string from your actual MongoDB Atlas cluster!
