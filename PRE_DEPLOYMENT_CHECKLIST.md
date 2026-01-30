# ✅ Pre-Deployment Checklist

Run through this checklist before deploying to ensure everything is ready.

---

## 1. Database Check

### Verify MongoDB Atlas Connection

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
✅ Database has data! Ready for deployment.
```

✅ **Status:** MongoDB Atlas is ready

---

## 2. Backend Check

### Verify Backend Configuration

**Check `.env` file:**
```bash
cd backend
type .env
```

**Should contain:**
- ✅ `MONGODB_URI` pointing to Atlas
- ✅ `JWT_SECRET` set
- ✅ `PORT=5000`
- ✅ `NODE_ENV=development`

**Check `package.json` scripts:**
- ✅ `"start": "node dist/server.js"`
- ✅ `"build": "tsc"`

### Test Backend Build

```bash
cd backend
npm run build
```

**Expected:** Creates `dist/` folder with compiled JavaScript

---

## 3. Frontend Check

### Verify Frontend Configuration

**Check `.env` file:**
```bash
cd frontend
type .env
```

**Should contain:**
- ✅ `VITE_API_URL=http://localhost:5000`

**Check `package.json` scripts:**
- ✅ `"build": "vite build"`
- ✅ `"preview": "vite preview"`

### Test Frontend Build

```bash
cd frontend
npm run build
```

**Expected:** Creates `dist/` folder with optimized files

---

## 4. Git Check

### Verify .gitignore

**Root `.gitignore` should exclude:**
- ✅ `node_modules/`
- ✅ `.env` files
- ✅ `dist/` folders
- ✅ `backend/uploads/*`
- ✅ `.localstorage` files

### Check Git Status

```bash
git status
```

**Should show:**
- Untracked files (if first time)
- Or clean working tree (if already committed)

---

## 5. Environment Variables Ready

### Backend Environment Variables (for Render)

```
MONGODB_URI=mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority
JWT_SECRET=vibes-holidays-super-secret-key-2024-change-this
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

✅ **Copy these** - you'll need them for Render

### Frontend Environment Variables (for Vercel)

```
VITE_API_URL=https://your-backend-url.onrender.com
```

✅ **You'll set this** after deploying backend

---

## 6. Accounts Ready

### Create Accounts (if you haven't already)

- [ ] GitHub account: https://github.com
- [ ] Render account: https://render.com (sign up with GitHub)
- [ ] Vercel account: https://vercel.com (sign up with GitHub)

---

## 7. Final Local Test

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Test Website

Visit: `http://localhost:5173` (or the port shown)

**Verify:**
- [ ] Homepage loads
- [ ] Featured packages show (Bali ₹25,000 and Jaisalmer ₹8,500)
- [ ] Click "View All Packages"
- [ ] Destination cards display
- [ ] Click on a destination
- [ ] Packages load
- [ ] Click on a package
- [ ] Package details show
- [ ] Admin login works (`/admin/login`)

---

## 8. Data Verification

### Check Featured Packages

```bash
cd backend
node check-featured-packages.js
```

**Expected:**
```
⭐ Featured Packages: 2
   - Bali Budget Package - ₹25000
   - Jaisalmer Desert Group Tour - ₹8500
```

### Check All Packages

```bash
cd backend
node verify-atlas-connection.js
```

**Expected:** 16 packages total

---

## 9. Clean Up (Optional)

### Remove Unnecessary Files

These files are not needed for deployment:

```bash
# Optional: Remove test/script files (they won't be deployed anyway due to .gitignore)
# Only do this if you want a cleaner repository
```

**Files you can keep:**
- All `.md` documentation files
- All package creation scripts (for reference)
- All test files

---

## 10. Ready to Deploy!

### Final Checklist

- [x] MongoDB Atlas has data (16 packages + 1 admin)
- [x] Backend connects to Atlas
- [x] Frontend connects to backend
- [x] Featured packages work
- [x] All packages display correctly
- [x] Admin login works
- [ ] Git repository initialized
- [ ] Code committed
- [ ] GitHub account ready
- [ ] Render account ready
- [ ] Vercel account ready
- [ ] Environment variables copied

---

## 🚀 Next Steps

You're ready to deploy! Follow these guides:

1. **Quick Commands:** `DEPLOY_COMMANDS.md`
2. **Detailed Guide:** `STEP_BY_STEP_DEPLOYMENT.md`

---

## 📝 Deployment Order

1. **Push to GitHub** (5 minutes)
2. **Deploy Backend to Render** (10 minutes)
3. **Deploy Frontend to Vercel** (5 minutes)
4. **Update Backend CORS** (2 minutes)
5. **Test Live Website** (5 minutes)

**Total Time:** ~30 minutes

---

## 🆘 If Something's Not Ready

### MongoDB Atlas Not Connected
```bash
cd backend
node verify-atlas-connection.js
```
Fix: Check connection string in `.env`

### Backend Build Fails
```bash
cd backend
npm run build
```
Fix: Check for TypeScript errors

### Frontend Build Fails
```bash
cd frontend
npm run build
```
Fix: Check for TypeScript/React errors

### Featured Packages Not Showing
```bash
cd backend
node fix-featured-packages.js
```
Fix: Re-run featured packages script

---

**✅ Everything checked? Let's deploy!**

**Start here:** `DEPLOY_COMMANDS.md`
