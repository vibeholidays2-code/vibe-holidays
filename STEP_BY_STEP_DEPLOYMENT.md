# 🚀 Step-by-Step Deployment Guide

## Overview
We'll deploy your Vibe Holidays website in 3 main steps:
1. Push code to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel

**Total Time:** ~20-30 minutes

---

## ✅ Pre-Deployment Checklist

Before we start, verify:
- [x] MongoDB Atlas has your data (16 packages + 1 admin user)
- [x] Backend runs locally and connects to Atlas
- [x] Frontend runs locally and shows packages
- [x] Featured packages display on homepage
- [ ] Code is ready to push to GitHub

---

## 📋 Step 1: Push Code to GitHub

### 1.1 Create .gitignore files (if not already present)

**Backend .gitignore** (already exists at `backend/.gitignore`)
**Frontend .gitignore** (already exists at `frontend/.gitignore`)

### 1.2 Initialize Git Repository

```bash
# In the root directory (vibe holidays)
git init
git add .
git commit -m "Initial commit - Vibe Holidays website ready for deployment"
```

### 1.3 Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `vibe-holidays` (or any name you prefer)
4. Description: `Travel package booking website`
5. Keep it **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.4 Push to GitHub

```bash
# Copy the commands from GitHub (they'll look like this):
git remote add origin https://github.com/YOUR_USERNAME/vibe-holidays.git
git branch -M main
git push -u origin main
```

**✅ Checkpoint:** Your code is now on GitHub!

---

## 📋 Step 2: Deploy Backend to Render

### 2.1 Sign Up for Render

1. Go to [Render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub repositories

### 2.2 Create New Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select your `vibe-holidays` repository
5. Click **"Connect"**

### 2.3 Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name**: `vibe-holidays-backend` (or any name)
- **Region**: Choose closest to you (e.g., Singapore, Frankfurt)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (0$/month)

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

```
MONGODB_URI=mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority

JWT_SECRET=vibes-holidays-super-secret-key-2024-change-this-in-production

PORT=5000

NODE_ENV=production

FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Note:** We'll update `FRONTEND_URL` after deploying the frontend in Step 3.

### 2.5 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the logs - you should see:
   ```
   MongoDB connected successfully
   Server running on port 5000
   ```

### 2.6 Copy Backend URL

Once deployed, copy your backend URL from the top of the page:
- Example: `https://vibe-holidays-backend.onrender.com`
- **Save this URL** - you'll need it for frontend deployment!

**✅ Checkpoint:** Backend is live on Render!

---

## 📋 Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up for Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)
4. Authorize Vercel to access your GitHub repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `vibe-holidays` repository
3. Click **"Import"**

### 3.3 Configure Project

**Framework Preset:**
- Vercel should auto-detect **"Vite"** ✅

**Root Directory:**
- Click **"Edit"**
- Select `frontend` folder
- Click **"Continue"**

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

### 3.4 Add Environment Variable

Click **"Environment Variables"** section:

**Variable Name:** `VITE_API_URL`
**Value:** Your Render backend URL (from Step 2.6)
- Example: `https://vibe-holidays-backend.onrender.com`
- **Important:** Do NOT include `/api` at the end!

### 3.5 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Watch the build logs

### 3.6 Copy Frontend URL

Once deployed, you'll see:
- **"Congratulations! Your project has been deployed"**
- Copy your frontend URL:
  - Example: `https://vibe-holidays.vercel.app`

**✅ Checkpoint:** Frontend is live on Vercel!

---

## 📋 Step 4: Update Backend CORS Settings

Now that frontend is deployed, update the backend to allow requests from Vercel:

### 4.1 Update FRONTEND_URL in Render

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service (`vibe-holidays-backend`)
3. Click **"Environment"** in left sidebar
4. Find `FRONTEND_URL` variable
5. Click **"Edit"**
6. Update value to your Vercel URL:
   ```
   https://vibe-holidays.vercel.app
   ```
7. Click **"Save Changes"**
8. Wait for automatic redeploy (~2 minutes)

**✅ Checkpoint:** Backend now accepts requests from your frontend!

---

## 📋 Step 5: Test Your Live Website

### 5.1 Open Your Website

Visit your Vercel URL: `https://vibe-holidays.vercel.app`

### 5.2 Test These Features

- [ ] Homepage loads
- [ ] Featured packages display (Bali ₹25,000 and Jaisalmer ₹8,500)
- [ ] Click "View All Packages"
- [ ] Destination cards show (Bali, Jaisalmer, Vietnam)
- [ ] Click on a destination
- [ ] Packages display for that destination
- [ ] Click on a package
- [ ] Package details page loads with full information
- [ ] Contact form works
- [ ] Admin login works at `/admin/login`
  - Username: `admin`
  - Password: `admin123`

### 5.3 Check for Issues

**If homepage loads but no packages:**
- Open browser console (F12)
- Check for CORS errors
- Verify backend URL in Vercel environment variables
- Check Render logs for backend errors

**If images don't load:**
- Images are from Unsplash - should work automatically
- Check browser console for errors

**If contact form doesn't work:**
- Email service is not configured yet (optional)
- Form will still save to database

---

## 🎉 Deployment Complete!

### Your Live URLs

**Frontend (Website):**
- `https://vibe-holidays.vercel.app`

**Backend (API):**
- `https://vibe-holidays-backend.onrender.com`

**Admin Panel:**
- `https://vibe-holidays.vercel.app/admin/login`
- Username: `admin`
- Password: `admin123`

**Database:**
- MongoDB Atlas (already configured)

---

## 📝 Post-Deployment Tasks

### Immediate Tasks

1. **Change Admin Password**
   - Login to admin panel
   - Change password from `admin123` to something secure

2. **Test All Features**
   - Browse packages
   - Submit contact form
   - Test admin panel

### Optional Tasks

1. **Custom Domain** (Optional)
   - Buy domain (e.g., vibesholidays.com)
   - Add to Vercel settings
   - Update DNS records

2. **Email Service** (Optional)
   - Configure Gmail SMTP or SendGrid
   - Update backend environment variables
   - Test contact form emails

3. **Analytics** (Optional)
   - Add Google Analytics
   - Track visitor behavior

---

## 🆘 Troubleshooting

### Backend Issues

**Backend not responding:**
1. Check Render logs
2. Verify MongoDB connection string
3. Check environment variables

**MongoDB connection failed:**
1. Verify connection string is correct
2. Check MongoDB Atlas Network Access
3. Ensure IP whitelist includes `0.0.0.0/0`

### Frontend Issues

**Can't connect to backend:**
1. Verify `VITE_API_URL` in Vercel
2. Check CORS settings in backend
3. Ensure backend is running

**Packages not loading:**
1. Check browser console
2. Verify API endpoint
3. Check network tab in DevTools

### Render Free Tier Note

- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- This is normal for free tier
- Upgrade to paid plan for always-on service

---

## 📞 Need Help?

If you encounter issues:

1. **Check Logs:**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Logs
   - Browser: F12 → Console tab

2. **Common Issues:**
   - CORS errors: Update `FRONTEND_URL` in Render
   - 404 errors: Check API endpoint URLs
   - Build errors: Check package.json scripts

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Backend CORS updated with frontend URL
- [ ] Website loads successfully
- [ ] Packages display correctly
- [ ] Admin login works
- [ ] Contact form works
- [ ] All features tested

---

**🎊 Congratulations! Your Vibe Holidays website is now live!**

Share your website URL with the world: `https://vibe-holidays.vercel.app`
