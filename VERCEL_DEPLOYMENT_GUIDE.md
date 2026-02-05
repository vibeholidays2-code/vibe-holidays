# 🚀 Deploy Frontend to Vercel

## Your Backend URL
```
https://vibe-holidays-backend.onrender.com
```

---

## Step-by-Step Instructions

### Step 1: Go to Vercel

1. Open: https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Project

1. Click **"Add New..."** (top right)
2. Select **"Project"**
3. Find your repository: **"Vibe-Holidays"**
4. Click **"Import"**

### Step 3: Configure Project

**Framework Preset:**
- Vercel should auto-detect: **"Vite"** ✅
- If not, select "Vite" from dropdown

**Root Directory:**
1. Click **"Edit"** next to Root Directory
2. Select **"frontend"** folder
3. Click **"Continue"**

**Build Settings** (should be auto-filled):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Add Environment Variable

Click **"Environment Variables"** section:

**Add this variable:**

**Name:**
```
VITE_API_URL
```

**Value:**
```
https://vibe-holidays-backend.onrender.com
```

**Important:** 
- Do NOT add `/api` at the end
- Just the base URL

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 2-5 minutes
3. Watch the build logs

### Step 6: Get Your Frontend URL

Once deployed, you'll see:
- **"Congratulations!"** message
- Your frontend URL (e.g., `https://vibe-holidays.vercel.app`)

**Copy this URL!** You'll need it for the next step.

---

## After Deployment

### Test Your Website

Visit your Vercel URL and check:
- [ ] Homepage loads
- [ ] Featured packages display
- [ ] Click "View All Packages"
- [ ] Packages load correctly
- [ ] Click on a package
- [ ] Package details show
- [ ] Contact form works
- [ ] Admin login works

---

## Next Step: Update Backend CORS

After frontend is deployed, you need to update the backend to allow requests from your Vercel URL.

**I'll help you with this once you give me your Vercel URL!**

---

## Quick Summary

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import "Vibe-Holidays" repository
4. Root Directory: **frontend**
5. Environment Variable: 
   - Name: `VITE_API_URL`
   - Value: `https://vibe-holidays-backend.onrender.com`
6. Click Deploy
7. Copy your Vercel URL
8. Tell me the URL!

---

**Ready? Go to Vercel and start the deployment!**
