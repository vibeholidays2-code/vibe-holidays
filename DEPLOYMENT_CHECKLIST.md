# ✅ Deployment Checklist

## Pre-Deployment Status

- [x] Code pushed to GitHub: `https://github.com/vibe-pixel/Vibe-Holidays`
- [x] MongoDB Atlas configured with 16 packages
- [x] Admin user created (username: `admin`, password: `admin123`)
- [x] Backend tested locally
- [x] Frontend tested locally

---

## 🎯 Deployment Steps

### STEP 1: Backend on Render ⏱️ ~10 minutes

- [ ] Go to [Render.com](https://render.com)
- [ ] Sign up with GitHub account
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `vibe-pixel/Vibe-Holidays`
- [ ] Configure:
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
- [ ] Add environment variables (copy from DEPLOYMENT_CONFIG.md)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] **SAVE BACKEND URL**: `_______________________________`
- [ ] Test: Visit `https://your-backend-url/api/packages`

### STEP 2: Frontend on Vercel ⏱️ ~5 minutes

- [ ] Go to [Vercel.com](https://vercel.com)
- [ ] Sign up with GitHub account
- [ ] Click "Add New..." → "Project"
- [ ] Import: `vibe-pixel/Vibe-Holidays`
- [ ] Configure:
  - Root Directory: `frontend`
  - Framework: Vite (auto-detected)
- [ ] Add environment variable:
  - `VITE_API_URL` = Your Render backend URL
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] **SAVE FRONTEND URL**: `_______________________________`
- [ ] Test: Visit your frontend URL

### STEP 3: Update CORS ⏱️ ~2 minutes

- [ ] Go back to Render Dashboard
- [ ] Click on your backend service
- [ ] Click "Environment" in sidebar
- [ ] Edit `FRONTEND_URL` variable
- [ ] Set to your Vercel URL
- [ ] Save and wait for redeploy

---

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Homepage loads
- [ ] Hero section displays
- [ ] Featured packages show (Bali ₹25,000 & Jaisalmer ₹8,500)
- [ ] "View All Packages" button works
- [ ] Destination cards display (Bali, Jaisalmer, Vietnam)
- [ ] Click Bali → Shows 4 Bali packages
- [ ] Click Jaisalmer → Shows 2 Jaisalmer packages
- [ ] Click Vietnam → Shows 10 Vietnam packages
- [ ] Click on any package → Details page loads
- [ ] Package details show:
  - [ ] Title and price
  - [ ] Description
  - [ ] Itinerary (day-by-day)
  - [ ] Inclusions
  - [ ] Exclusions
  - [ ] Images
  - [ ] PDF brochure download button
- [ ] Contact page loads
- [ ] Contact form can be filled
- [ ] Gallery page loads (if implemented)

### Admin Panel Tests
- [ ] Visit `/admin/login`
- [ ] Login with `admin` / `admin123`
- [ ] Dashboard loads
- [ ] Statistics display correctly
- [ ] Packages page shows all 16 packages
- [ ] Can view package details
- [ ] Can edit a package (test only, don't save)
- [ ] Bookings page loads
- [ ] Inquiries page loads
- [ ] Can logout

### API Tests
- [ ] `GET /api/packages` returns all packages
- [ ] `GET /api/packages/featured` returns 2 featured packages
- [ ] `GET /api/packages/:id` returns single package
- [ ] `POST /api/inquiries` accepts contact form (test in browser)

---

## 🐛 Common Issues & Solutions

### Issue: Backend shows "Application failed to respond"
**Solution:** 
- Check Render logs for errors
- Verify all environment variables are set
- Wait 30 seconds (free tier waking up)

### Issue: Frontend shows "Failed to fetch"
**Solution:**
- Check browser console (F12)
- Verify `VITE_API_URL` in Vercel settings
- Ensure backend URL doesn't end with `/api`
- Update `FRONTEND_URL` in Render

### Issue: CORS error in browser console
**Solution:**
- Update `FRONTEND_URL` in Render environment variables
- Must match your exact Vercel URL
- Wait for Render to redeploy

### Issue: Packages not loading
**Solution:**
- Check if backend is responding: Visit `/api/packages` directly
- Check browser Network tab for failed requests
- Verify MongoDB connection in Render logs

### Issue: Images not loading
**Solution:**
- Images are from Unsplash (external)
- Check browser console for blocked requests
- Verify image URLs in database

---

## 📝 Post-Deployment Tasks

### Immediate (Do Today)
- [ ] Change admin password from `admin123`
- [ ] Test all features thoroughly
- [ ] Share website URL with stakeholders
- [ ] Monitor Render logs for errors

### This Week
- [ ] Set up email service (Gmail/SendGrid)
- [ ] Test contact form email delivery
- [ ] Add Google Analytics (optional)
- [ ] Set up error monitoring (Sentry - optional)

### Later
- [ ] Purchase custom domain
- [ ] Configure custom domain on Vercel
- [ ] Update social media links
- [ ] Add more packages
- [ ] Collect user feedback

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Website loads at your Vercel URL
✅ All 16 packages display correctly
✅ Package details pages work
✅ Contact form submits successfully
✅ Admin panel is accessible
✅ No console errors in browser
✅ Backend responds within 2 seconds (after wake-up)

---

## 📞 Your Deployment URLs

**Frontend (Website):**
```
https://_________________________________.vercel.app
```

**Backend (API):**
```
https://_________________________________.onrender.com
```

**Admin Panel:**
```
https://_________________________________.vercel.app/admin/login
```

**GitHub Repository:**
```
https://github.com/vibe-pixel/Vibe-Holidays
```

---

## 🔐 Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123` (⚠️ CHANGE THIS IMMEDIATELY)

**MongoDB Atlas:**
- Connection string is in Render environment variables
- Access via MongoDB Atlas dashboard

**Render Account:**
- Login with GitHub

**Vercel Account:**
- Login with GitHub

---

## 📊 Monitoring

**Check these regularly:**

1. **Render Dashboard**
   - Service status
   - Deployment logs
   - Error logs
   - Resource usage

2. **Vercel Dashboard**
   - Deployment status
   - Function logs
   - Analytics (if enabled)

3. **MongoDB Atlas**
   - Database size
   - Connection count
   - Query performance

---

**Ready to deploy? Start with STEP 1 above!** 🚀

**Estimated Total Time:** 20-30 minutes
