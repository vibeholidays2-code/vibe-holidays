# 🔧 Fix MongoDB Authentication Error

## Error
```
MongoServerError: bad auth : authentication failed
```

## Problem
The username or password in your connection string is incorrect.

---

## Solution: Get New Connection String

### Step 1: Go to MongoDB Atlas

1. Open: https://cloud.mongodb.com
2. Log in to your account

### Step 2: Create/Verify Database User

1. Click **"Database Access"** in left sidebar
2. Check if user `vibe_db_user` exists
3. If it doesn't exist, create a new user:

**To Create New User:**
1. Click **"Add New Database User"**
2. Choose **"Password"** authentication
3. Username: `vibe_db_user` (or any name you want)
4. Password: Click **"Autogenerate Secure Password"** (copy this!)
   - Or create your own: `Vibe9099` (or any password)
5. Database User Privileges: **"Read and write to any database"**
6. Click **"Add User"**

**If User Exists but Password is Wrong:**
1. Click **"Edit"** next to the user
2. Click **"Edit Password"**
3. Enter new password or autogenerate
4. **Copy the password!**
5. Click **"Update User"**

### Step 3: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string

**It will look like:**
```
mongodb+srv://vibe_db_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 4: Update Connection String

**Replace `<password>` with your actual password:**

Example:
```
mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority
```

**Important:**
- Replace `<password>` with actual password
- Add `/vibes-holidays` before the `?` (database name)
- Keep `?retryWrites=true&w=majority` at the end

---

## Update Your .env File

### Option 1: I'll help you update it

Tell me:
1. Your new username (if different)
2. Your new password
3. Your cluster URL (the part after @)

### Option 2: You update it manually

1. Open `backend/.env` file
2. Find the line starting with `MONGODB_URI=`
3. Replace with your new connection string
4. Save the file

---

## Test Connection

After updating `.env`:

```bash
cd backend
node verify-atlas-connection.js
```

**Expected Output:**
```
✅ Successfully connected to MongoDB Atlas!
📊 Found 2 collections in database:
   packages: 16 documents
   users: 1 documents
```

---

## Common Issues

### Special Characters in Password
If your password has special characters like `@`, `#`, `$`, etc., you need to URL encode them:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`

Example:
- Password: `Pass@123`
- Encoded: `Pass%40123`

### Database Name Missing
Make sure you have `/vibes-holidays` in the connection string:
```
mongodb+srv://user:pass@cluster.mongodb.net/vibes-holidays?retryWrites=true&w=majority
                                                          ^^^^^^^^^^^^^^^^
                                                          Database name here!
```

---

## Quick Steps

1. Go to https://cloud.mongodb.com
2. Click "Database Access"
3. Create new user or reset password
4. Copy password
5. Click "Database" → "Connect" → "Connect your application"
6. Copy connection string
7. Replace `<password>` with actual password
8. Add `/vibes-holidays` before `?`
9. Update `backend/.env` file
10. Test: `node verify-atlas-connection.js`

---

**Once you have the new connection string, tell me and I'll update your .env file!**
