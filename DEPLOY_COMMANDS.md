# 🚀 Quick Deployment Commands

Copy and paste these commands to deploy your website.

---

## Step 1: Push to GitHub

### 1.1 Initialize Git (if not already done)

```bash
git init
```

### 1.2 Add all files

```bash
git add .
```

### 1.3 Commit

```bash
git commit -m "Initial commit - Vibe Holidays website ready for deployment"
```

### 1.4 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `vibe-holidays`
3. Keep it Public or Private
4. **DO NOT** check any boxes (no README, no .gitignore, no license)
5. Click "Create repository"

### 1.5 Connect and Push

**Replace `YOUR_USERNAME` with your GitHub username:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/vibe-holidays.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### Go to Render.com

1. Visit: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `vibe-holidays` repository

### Configuration

**Copy these settings:**

```
Name: vibe-holidays-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Environment Variables

**Add these one by one:**

```
MONGODB_URI
mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority

JWT_SECRET
vibes-holidays-super-secret-key-2024-change-this

PORT
5000

NODE_ENV
production

FRONTEND_URL
https://your-frontend-url.vercel.app
```

**Note:** Update `FRONTEND_URL` after deploying frontend

### Deploy

Click "Create Web Service" and wait 5-10 minutes

**Save your backend URL:** `https://vibe-holidays-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### Go to Vercel.com

1. Visit: https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `vibe-holidays` repository

### Configuration

**Root Directory:**
- Click "Edit" → Select `frontend` → Continue

**Environment Variable:**

```
Name: VITE_API_URL
Value: https://vibe-holidays-backend.onrender.com
```

**Replace with your actual Render backend URL!**

### Deploy

Click "Deploy" and wait 2-5 minutes

**Save your frontend URL:** `https://vibe-holidays.vercel.app`

---

## Step 4: Update Backend CORS

1. Go to Render Dashboard
2. Click your backend service
3. Click "Environment"
4. Edit `FRONTEND_URL` variable
5. Set to your Vercel URL: `https://vibe-holidays.vercel.app`
6. Save (auto-redeploys)

---

## ✅ Done!

Visit your website: `https://vibe-holidays.vercel.app`

Admin panel: `https://vibe-holidays.vercel.app/admin/login`
- Username: `admin`
- Password: `admin123`

---

## 🆘 Quick Troubleshooting

**Packages not loading?**
- Check Vercel environment variable `VITE_API_URL`
- Check Render environment variable `FRONTEND_URL`
- Check browser console (F12) for errors

**Backend not responding?**
- Check Render logs
- Verify MongoDB connection string
- Wait 30 seconds (free tier wakes up from sleep)

**Build failed?**
- Check Render/Vercel logs
- Verify `package.json` has correct scripts
- Check Node version compatibility

---

## 📝 Important URLs

**Render Dashboard:** https://dashboard.render.com
**Vercel Dashboard:** https://vercel.com/dashboard
**MongoDB Atlas:** https://cloud.mongodb.com
**GitHub Repo:** https://github.com/YOUR_USERNAME/vibe-holidays

---

**Need detailed instructions? See `STEP_BY_STEP_DEPLOYMENT.md`**
