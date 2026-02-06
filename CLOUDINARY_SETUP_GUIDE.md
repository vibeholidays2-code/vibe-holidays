# Cloudinary Setup Guide for Gallery Media

## Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up (free, no credit card needed)
3. Verify your email

### Step 2: Get Your Credentials

After login, you'll see your dashboard with:
- **Cloud Name**: (e.g., `dxxxxx`)
- **API Key**: (e.g., `123456789012345`)
- **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz`)

### Step 3: Update .env File

Open `backend/.env` and replace these values:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here    # Replace with your Cloud Name
CLOUDINARY_API_KEY=your_api_key_here          # Replace with your API Key
CLOUDINARY_API_SECRET=your_api_secret_here    # Replace with your API Secret
```

### Step 4: Run Upload Script

Open terminal in the project folder and run:

```bash
cd backend
node upload-to-cloudinary.js
```

This will:
- Upload all images and videos from `backend/uploads/gallery/` to Cloudinary
- Save the Cloudinary URLs to your MongoDB database
- Your gallery will work in production!

### Step 5: Update Production Environment

Add the same Cloudinary credentials to your production environment:

**For Vercel Backend:**
1. Go to your Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add these three variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Step 6: Verify

1. Check your Cloudinary dashboard → Media Library
2. You should see all your images and videos in the `vibe-holidays/gallery` folder
3. Visit your deployed website gallery page - images should now load!

## Troubleshooting

**Error: "Invalid credentials"**
- Double-check your Cloud Name, API Key, and API Secret
- Make sure there are no extra spaces in the .env file

**Error: "File not found"**
- Make sure your gallery files are in `backend/uploads/gallery/`
- Check that the folder exists and has files

**Upload is slow**
- This is normal for videos (they're large files)
- Be patient, it can take 1-2 minutes per video

## Benefits of Cloudinary

✅ Free tier: 25 GB storage + 25 GB bandwidth/month
✅ Automatic image optimization
✅ Video hosting and streaming
✅ CDN delivery (fast loading worldwide)
✅ No server storage needed
✅ Works perfectly with Vercel deployment

## Next Steps

After successful upload:
1. Your gallery will work in production
2. You can add more media anytime through Cloudinary dashboard
3. All URLs are permanent and won't break

Need help? Check Cloudinary docs: https://cloudinary.com/documentation
