# 🚀 Deployment Configuration Guide

## Quick Reference

Your GitHub Repository: `https://github.com/vibe-pixel/Vibe-Holidays`

---

## 📦 STEP 2: Backend Deployment on Render

### 2.1 Create Web Service

1. Go to **[Render.com](https://render.com)** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect repository: `vibe-pixel/Vibe-Holidays`

### 2.2 Basic Configuration

```
Name: vibe-holidays-backend
Region: Singapore (or closest to you)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
Instance Type: Free
```

### 2.3 Environment Variables

Click **"Advanced"** → Add these environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://vibe_db_user:Vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority

# JWT
JWT_SECRET=vibes-holidays-super-secret-key-2024-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production

# CORS (Update after frontend deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (Optional - can configure later)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=admin@vibeholidays.com
```

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. **SAVE YOUR BACKEND URL**: `https://vibe-holidays-backend.onrender.com`

### 2.5 Verify Backend

Once deployed, visit: `https://your-backend-url.onrender.com/api/packages`

You should see JSON response with your packages.

---

## 🎨 STEP 3: Frontend Deployment on Vercel

### 3.1 Import Project

1. Go to **[Vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import: `vibe-pixel/Vibe-Holidays`

### 3.2 Configure Project

```
Framework Preset: Vite (auto-detected)
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Environment Variables

Add this ONE environment variable:

```bash
VITE_API_URL=https://your-render-backend-url.onrender.com
```

**IMPORTANT:** 
- Replace `your-render-backend-url` with your actual Render URL from Step 2.4
- Do NOT include `/api` at the end
- Example: `https://vibe-holidays-backend.onrender.com`

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes
3. **SAVE YOUR FRONTEND URL**: `https://vibe-holidays.vercel.app`

---

## 🔄 STEP 4: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to **Render Dashboard** → Your backend service
2. Click **"Environment"** in sidebar
3. Find `FRONTEND_URL` variable
4. Click **"Edit"**
5. Update to: `https://your-actual-vercel-url.vercel.app`
6. Click **"Save Changes"**
7. Wait for automatic redeploy (~2 minutes)

---

## ✅ Verification Checklist

### Test Backend
- [ ] Visit: `https://your-backend-url.onrender.com/api/packages`
- [ ] Should return JSON with 16 packages

### Test Frontend
- [ ] Visit: `https://your-frontend-url.vercel.app`
- [ ] Homepage loads with hero section
- [ ] Featured packages display (Bali ₹25,000 and Jaisalmer ₹8,500)
- [ ] Click "View All Packages" → Shows destination cards
- [ ] Click on Bali → Shows Bali packages
- [ ] Click on a package → Shows package details with itinerary
- [ ] Contact form loads

### Test Admin Panel
- [ ] Visit: `https://your-frontend-url.vercel.app/admin/login`
- [ ] Login with:
  - Username: `admin`
  - Password: `admin123`
- [ ] Dashboard loads with statistics
- [ ] Can view packages, bookings, inquiries

---

## 🐛 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

**"MongoDB connection failed"**
- Verify MongoDB Atlas is accessible
- Check Network Access in Atlas (should allow 0.0.0.0/0)
- Verify connection string is correct

### Frontend Issues

**"Failed to fetch packages"**
- Open browser console (F12)
- Check if CORS error → Update FRONTEND_URL in Render
- Verify VITE_API_URL in Vercel settings
- Ensure backend URL doesn't have `/api` at the end

**"Blank page"**
- Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors

### Render Free Tier Note

⚠️ **Important:** Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- This is normal behavior
- Upgrade to paid plan ($7/month) for always-on service

---

## 📝 Post-Deployment Tasks

### Immediate (Required)

1. **Change Admin Password**
   - Login to admin panel
   - Go to settings (if available) or create new admin user
   - Change from `admin123` to secure password

2. **Test All Features**
   - Browse all packages
   - Submit test contact form
   - Test admin CRUD operations

### Optional (Later)

1. **Custom Domain**
   - Buy domain (e.g., vibeholidays.com)
   - Add to Vercel: Settings → Domains
   - Update DNS records as instructed

2. **Email Service**
   - Get Gmail App Password or SendGrid API key
   - Update backend environment variables in Render
   - Test contact form emails

3. **SSL Certificate**
   - Vercel provides automatic HTTPS ✅
   - Render provides automatic HTTPS ✅
   - No action needed!

---

## 🎉 Your Live URLs

After deployment, you'll have:

**Website:** `https://vibe-holidays.vercel.app`
**API:** `https://vibe-holidays-backend.onrender.com`
**Admin:** `https://vibe-holidays.vercel.app/admin/login`

---

## 📞 Need Help?

**Check Logs:**
- Render: Dashboard → Service → Logs tab
- Vercel: Dashboard → Project → Deployments → View Function Logs
- Browser: F12 → Console tab

**Common Error Solutions:**

| Error | Solution |
|-------|----------|
| CORS error | Update FRONTEND_URL in Render |
| 404 on API calls | Check VITE_API_URL in Vercel |
| Backend timeout | Wait 30s (free tier waking up) |
| Build failed | Check package.json scripts |
| MongoDB error | Verify connection string |

---

## 🔐 Security Notes

**Before going live:**
- [ ] Change JWT_SECRET to a strong random string
- [ ] Change admin password from `admin123`
- [ ] Configure email service for contact forms
- [ ] Review MongoDB Atlas security settings
- [ ] Enable 2FA on Render and Vercel accounts

**Generate secure JWT secret:**
```bash
# Run this in terminal to generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

**Ready to deploy? Follow the steps above and you'll be live in 20-30 minutes!** 🚀
