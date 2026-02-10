# How to Wake Up the Backend

## The Issue
Your backend on Render (free tier) goes to sleep after 15 minutes of inactivity. When someone visits your website after the backend has been asleep, it takes 30-60 seconds to wake up.

## Solution 1: Manual Wake-Up (Quick Fix)

### Option A: Visit Backend URL Directly
1. Open your browser
2. Go to: `https://vibe-holidays-backend-0vgn.onrender.com/api/packages`
3. Wait 30-60 seconds
4. You should see JSON data with packages
5. Now your website will load fast!

### Option B: Use Render Dashboard
1. Go to https://dashboard.render.com
2. Find your "vibe-holidays-backend" service
3. Click on it
4. The dashboard will show if it's sleeping
5. It will wake up automatically when you view it

## Solution 2: Automatic Keep-Alive (Recommended)

### Using UptimeRobot (Free)
1. Go to https://uptimerobot.com
2. Sign up for free account
3. Click "Add New Monitor"
4. Settings:
   - Monitor Type: HTTP(s)
   - Friendly Name: Vibe Holidays Backend
   - URL: `https://vibe-holidays-backend-0vgn.onrender.com/api/packages`
   - Monitoring Interval: 5 minutes
5. Click "Create Monitor"

**Result**: Your backend will never sleep! UptimeRobot pings it every 5 minutes.

### Using Cron-Job.org (Free Alternative)
1. Go to https://cron-job.org
2. Sign up for free account
3. Create new cron job:
   - Title: Wake Vibe Holidays Backend
   - URL: `https://vibe-holidays-backend-0vgn.onrender.com/api/packages`
   - Schedule: Every 10 minutes
4. Save

## Solution 3: Upgrade Render Plan

### Paid Plan Benefits ($7/month)
- Backend NEVER sleeps
- Always instant loading
- Better performance
- More resources

To upgrade:
1. Go to Render dashboard
2. Select your service
3. Click "Upgrade" button
4. Choose "Starter" plan ($7/month)

## Current Status

✅ **Website is FIXED** - It will work, just needs patience on first load
✅ **Retry logic added** - Automatically retries if timeout
✅ **User messaging** - Shows "waking up server" message

## What Users Will Experience

### First Visit (Backend Asleep)
1. User visits packages or gallery page
2. Sees: "⏳ First load may take 30-60 seconds as the server wakes up"
3. Waits 30-60 seconds
4. Content loads successfully
5. Backend stays awake for 15 minutes

### Subsequent Visits (Backend Awake)
1. User visits any page
2. Content loads in 2-3 seconds
3. Fast and smooth experience

## Recommended Action

**Set up UptimeRobot** (5 minutes, free, permanent solution)
- Keeps backend always awake
- No more waiting
- Professional experience for users

## Need Help?

If backend still not loading after 60 seconds:
1. Check Render dashboard for errors
2. Check browser console (F12) for error messages
3. Try clearing browser cache
4. Contact Render support if service is down
