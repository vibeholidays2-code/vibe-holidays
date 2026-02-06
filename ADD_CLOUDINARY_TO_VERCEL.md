# Add Cloudinary to Vercel Backend

## ✅ Local Upload Complete!
Your gallery files are now on Cloudinary and saved to your database.

## 🚀 Final Step: Add to Vercel Production

### Option 1: Via Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/dashboard
2. Click on your **backend** project (vibe-holidays-backend)
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add these 3 variables:

   **Variable 1:**
   - Name: `CLOUDINARY_CLOUD_NAME`
   - Value: `dpsytvwmh`
   - Environment: Production ✓

   **Variable 2:**
   - Name: `CLOUDINARY_API_KEY`
   - Value: `298881913228449`
   - Environment: Production ✓

   **Variable 3:**
   - Name: `CLOUDINARY_API_SECRET`
   - Value: `fWxgsbCBB_AUZY5wlJNGPIgC1W4`
   - Environment: Production ✓

6. Click **Save** for each variable

7. **Redeploy** your backend:
   - Go to **Deployments** tab
   - Click the **...** menu on the latest deployment
   - Click **Redeploy**

### Option 2: Via Vercel CLI (Alternative)

```bash
vercel env add CLOUDINARY_CLOUD_NAME production
# Enter: dpsytvwmh

vercel env add CLOUDINARY_API_KEY production
# Enter: 298881913228449

vercel env add CLOUDINARY_API_SECRET production
# Enter: fWxgsbCBB_AUZY5wlJNGPIgC1W4

# Redeploy
vercel --prod
```

## ✅ Verification

After redeployment:
1. Visit your production gallery page
2. Images and videos should now load from Cloudinary!
3. Check browser console - no 404 errors

## 🎉 Done!

Your gallery is now:
- ✅ Uploaded to Cloudinary (cloud storage)
- ✅ Saved to MongoDB (database)
- ✅ Ready for production (after Vercel env vars added)

All images and videos will load fast from Cloudinary's CDN worldwide!
