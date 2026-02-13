# 📋 Step-by-Step: Update Render Environment Variable

## What You're Fixing
Adding your custom domain `www.vibesholidays.in` to the backend's CORS whitelist so packages can load.

---

## Steps (5 minutes)

### 1. Open Render Dashboard

Go to: https://render.com/dashboard

### 2. Find Your Backend Service

Look for: **vibe-holidays-backend** (or similar name)
- It should show as a "Web Service"
- Status should be "Live" (green)

Click on it to open the service details.

### 3. Go to Environment Tab

On the left sidebar, click: **Environment**

### 4. Find FRONTEND_URL Variable

Scroll through the environment variables list to find:
```
FRONTEND_URL
```

Current value should be:
```
https://vibe-holidays-red.vercel.app,https://vibe-holidays-vibeholidays2-codes-projects.vercel.app
```

### 5. Edit the Variable

Click the **Edit** button (pencil icon) next to FRONTEND_URL

### 6. Update the Value

Change the value to:
```
https://vibe-holidays-red.vercel.app,https://vibe-holidays-vibeholidays2-codes-projects.vercel.app,https://www.vibesholidays.in
```

**Important**: 
- Add `,https://www.vibesholidays.in` at the end
- No spaces between URLs
- Comma-separated list
- Include `https://` prefix

### 7. Save Changes

Click **Save Changes** button

### 8. Wait for Redeployment

Render will automatically:
- Trigger a new deployment
- Show "Deploying..." status
- Take 2-3 minutes to complete

You'll see:
```
Deploying...
Building...
Starting...
Live ✓
```

### 9. Test Your Website

Once deployment is complete (shows "Live" status):

1. Open: https://www.vibesholidays.in/packages
2. Wait 30-60 seconds (backend waking up from sleep)
3. Packages should load! 🎉

---

## Visual Reference

```
┌─────────────────────────────────────────────────┐
│  Render Dashboard                               │
│  ┌───────────────────────────────────────────┐  │
│  │  vibe-holidays-backend                    │  │
│  │  Status: Live ✓                           │  │
│  │                                           │  │
│  │  Sidebar:                                 │  │
│  │  - Overview                               │  │
│  │  - Logs                                   │  │
│  │  → Environment  ← Click here              │  │
│  │  - Settings                               │  │
│  │                                           │  │
│  │  Environment Variables:                   │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ MONGODB_URI                         │  │  │
│  │  │ JWT_SECRET                          │  │  │
│  │  │ FRONTEND_URL  [Edit] ← Click here   │  │  │
│  │  │ PORT                                │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Troubleshooting

### If you don't see FRONTEND_URL variable:

1. Click **Add Environment Variable**
2. Key: `FRONTEND_URL`
3. Value: `https://vibe-holidays-red.vercel.app,https://vibe-holidays-vibeholidays2-codes-projects.vercel.app,https://www.vibesholidays.in`
4. Click **Save**

### If packages still don't load after update:

1. **Wait longer**: Backend may take 60 seconds to wake up (Render free tier)
2. **Check deployment**: Ensure status shows "Live" not "Deploying"
3. **Clear browser cache**: Ctrl+Shift+Delete → Clear cached images and files
4. **Check browser console**: F12 → Console tab → Look for errors
5. **Try old URL**: Test if https://vibe-holidays-red.vercel.app/packages works

### If you see CORS errors in browser console:

```
Access to fetch at 'https://vibe-holidays-backend-0vgn.onrender.com/api/packages' 
from origin 'https://www.vibesholidays.in' has been blocked by CORS policy
```

This means:
- Environment variable not saved correctly
- Backend hasn't redeployed yet
- Wait a few more minutes and try again

---

## What This Does

Before fix:
```
www.vibesholidays.in → Backend
                       ↓
                    ❌ CORS blocks request
                       ↓
                    No packages load
```

After fix:
```
www.vibesholidays.in → Backend
                       ↓
                    ✅ CORS allows request
                       ↓
                    Packages load successfully
```

---

## Verification Checklist

After completing the steps:

- [ ] Opened Render dashboard
- [ ] Found vibe-holidays-backend service
- [ ] Clicked Environment tab
- [ ] Found FRONTEND_URL variable
- [ ] Added `,https://www.vibesholidays.in` to the end
- [ ] Clicked Save Changes
- [ ] Waited for "Live" status
- [ ] Tested www.vibesholidays.in/packages
- [ ] Packages loading successfully ✓

---

## Need Help?

If you're stuck:

1. Take a screenshot of your Render Environment tab
2. Check if the variable was saved correctly
3. Look at the deployment logs for errors
4. Verify the backend URL is correct in frontend config

---

**Expected Time**: 5 minutes
**Difficulty**: Easy
**Result**: Packages will load on your custom domain! 🚀
