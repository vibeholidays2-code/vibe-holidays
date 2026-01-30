# 🚀 Vibes Holidays Deployment Guide

## Prerequisites
- MongoDB Atlas connection string: ✅ Already have it
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)

---

## 📋 Deployment Steps

### 1️⃣ Deploy Backend to Render

1. **Go to [Render.com](https://render.com)** and sign up with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service:**
   - **Name**: `vibe-holidays-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   MONGODB_URI=mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority
   JWT_SECRET=vibes-holidays-super-secret-key-2024
   PORT=5000
   NODE_ENV=production
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (5-10 minutes)

8. **Copy your backend URL** (e.g., `https://vibe-holidays-backend.onrender.com`)

---

### 2️⃣ Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable:**
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from step 1.8)
   - Example: `https://vibe-holidays-backend.onrender.com`

6. **Click "Deploy"**

7. **Wait for deployment** (2-5 minutes)

8. **Your website is live!** 🎉

---

### 3️⃣ Update Backend CORS Settings

After deploying frontend, update your backend to allow requests from your Vercel URL:

1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add new environment variable:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
5. Save and redeploy

---

## 🔧 Post-Deployment Checklist

- [ ] Backend is running on Render
- [ ] Frontend is running on Vercel
- [ ] MongoDB Atlas is connected
- [ ] All packages are displaying correctly
- [ ] Images are loading
- [ ] Contact forms are working
- [ ] Admin login is working

---

## 🌐 Your Live URLs

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://vibe-holidays-backend.onrender.com`
- **Database**: MongoDB Atlas (already configured)

---

## 💡 Tips

1. **Free Tier Limitations:**
   - Render free tier: Backend sleeps after 15 min of inactivity (first request takes ~30 seconds)
   - Vercel free tier: Unlimited bandwidth for personal projects
   - MongoDB Atlas free tier: 512MB storage

2. **Custom Domain:**
   - You can add a custom domain (like vibesholidays.com) in Vercel settings
   - Cost: ~$10-15/year for domain registration

3. **Monitoring:**
   - Check Render logs for backend errors
   - Check Vercel logs for frontend errors

---

## 🆘 Troubleshooting

**Backend not responding:**
- Check Render logs
- Verify MongoDB connection string
- Check environment variables

**Frontend can't connect to backend:**
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running

**Images not loading:**
- Check if image URLs are correct
- Verify backend uploads folder is accessible

---

## 📞 Need Help?

If you encounter any issues during deployment, check:
1. Render logs (for backend errors)
2. Vercel logs (for frontend errors)
3. Browser console (for client-side errors)

---

**Ready to deploy? Follow the steps above and your website will be live in ~15 minutes!** 🚀
