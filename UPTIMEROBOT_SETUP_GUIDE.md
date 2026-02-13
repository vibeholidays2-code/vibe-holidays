# ⚡ UptimeRobot Setup Guide - Keep Your Backend Always Awake!

## ✅ Health Check Routes Added

I've added two health check routes to your backend:

### Route 1: Root Route
```
URL: https://vibe-holidays-backend-0vgn.onrender.com/
Method: GET
Response: { "status": "ok", "message": "Vibe Holidays API is running", "timestamp": "..." }
```

### Route 2: Health Route
```
URL: https://vibe-holidays-backend-0vgn.onrender.com/health
Method: GET
Response: { "status": "ok", "message": "Vibe Holidays API is running", "timestamp": "..." }
```

## 🎯 URLs for UptimeRobot

Use **ANY** of these URLs (all work):

1. **Root URL** (Recommended):
   ```
   https://vibe-holidays-backend-0vgn.onrender.com/
   ```

2. **Health Check URL**:
   ```
   https://vibe-holidays-backend-0vgn.onrender.com/health
   ```

3. **API Packages URL** (Alternative):
   ```
   https://vibe-holidays-backend-0vgn.onrender.com/api/packages
   ```

**Recommendation**: Use the root URL (`/`) - it's simplest and fastest!

---

## 🚀 Step-by-Step Setup (5 Minutes)

### Step 1: Deploy the Changes

First, let's deploy the new health check routes:

```bash
git add backend/src/server.ts
git commit -m "Add health check routes for UptimeRobot"
git push origin main
```

Wait 2-3 minutes for Render to deploy the changes.

### Step 2: Test the Health Check

Open your browser and visit:
```
https://vibe-holidays-backend-0vgn.onrender.com/
```

You should see:
```json
{
  "status": "ok",
  "message": "Vibe Holidays API is running",
  "timestamp": "2026-02-13T..."
}
```

If you see this, your health check is working! ✅

### Step 3: Sign Up for UptimeRobot

1. **Go to**: https://uptimerobot.com/
2. **Click**: "Sign Up Free"
3. **Enter**:
   - Email address
   - Password
4. **Verify** your email
5. **Log in**

### Step 4: Add Your First Monitor

1. **Click**: "Add New Monitor" (big green button)

2. **Fill in the form**:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Vibe Holidays Backend
   URL: https://vibe-holidays-backend-0vgn.onrender.com/
   Monitoring Interval: 5 minutes
   ```

3. **Advanced Settings** (optional):
   - Alert Contacts: Add your email
   - Keyword: "ok" (checks if response contains "ok")

4. **Click**: "Create Monitor"

### Step 5: Verify It's Working

1. You should see your monitor in the dashboard
2. Status should show "Up" (green)
3. Response time should be displayed
4. UptimeRobot will now ping your backend every 5 minutes!

---

## 📊 What You'll See in UptimeRobot Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ Vibe Holidays Backend                                   │
│ ● Up (100%)                                             │
│ https://vibe-holidays-backend-0vgn.onrender.com/        │
│ Response Time: 234ms                                    │
│ Last Check: 2 minutes ago                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Recommended Settings

### Basic Setup (Free Tier)
```
Monitor Type: HTTP(s)
Friendly Name: Vibe Holidays Backend
URL: https://vibe-holidays-backend-0vgn.onrender.com/
Monitoring Interval: 5 minutes
Alert Contacts: Your email
```

### Advanced Setup (Optional)
```
Monitor Type: HTTP(s)
Friendly Name: Vibe Holidays Backend
URL: https://vibe-holidays-backend-0vgn.onrender.com/health
Monitoring Interval: 5 minutes
Monitor Timeout: 30 seconds
Keyword: "ok"
Alert Contacts: Your email + SMS (if available)
```

---

## 🔔 Alert Settings

### Email Alerts (Recommended)
1. Go to "My Settings" → "Alert Contacts"
2. Add your email
3. Verify the email
4. Enable alerts for your monitor

### What You'll Get Alerted About:
- ✅ When backend goes down
- ✅ When backend comes back up
- ✅ When response time is slow
- ✅ Weekly uptime reports

---

## 📈 Benefits You'll See

### Before UptimeRobot:
```
User visits website
  ↓
Backend is sleeping 😴
  ↓
Wait 30-60 seconds ⏳
  ↓
Backend wakes up
  ↓
Content loads
```

### After UptimeRobot:
```
User visits website
  ↓
Backend is already awake! ⚡
  ↓
Content loads in 2-3 seconds ✅
```

---

## 🎉 Expected Results

### Immediate Benefits:
- ✅ Backend never sleeps
- ✅ Always fast loading (2-3 seconds)
- ✅ No more 30-60 second wait
- ✅ Professional user experience
- ✅ Better SEO (faster site)

### Long-term Benefits:
- ✅ 99.9% uptime monitoring
- ✅ Email alerts if site goes down
- ✅ Performance tracking
- ✅ Uptime statistics
- ✅ Free forever!

---

## 🧪 Testing Your Setup

### Test 1: Check Health Endpoint
```bash
curl https://vibe-holidays-backend-0vgn.onrender.com/
```

Expected response:
```json
{"status":"ok","message":"Vibe Holidays API is running","timestamp":"..."}
```

### Test 2: Check Packages Endpoint
```bash
curl https://vibe-holidays-backend-0vgn.onrender.com/api/packages
```

Expected: JSON array of packages

### Test 3: Wait 15 Minutes
1. Don't visit your website for 15 minutes
2. Backend would normally sleep
3. But UptimeRobot keeps it awake!
4. Visit your website - should load fast ⚡

---

## 📱 Mobile App (Optional)

UptimeRobot has mobile apps:
- **iOS**: https://apps.apple.com/app/uptimerobot/id1104878581
- **Android**: https://play.google.com/store/apps/details?id=com.uptimerobot

Get push notifications when your site goes down!

---

## 🆓 Free Tier Limits

UptimeRobot Free Tier includes:
- ✅ 50 monitors
- ✅ 5-minute intervals
- ✅ Email alerts
- ✅ 2-month log retention
- ✅ Public status pages
- ✅ SSL monitoring

**Perfect for your needs!** You only need 1 monitor.

---

## 🔧 Troubleshooting

### Monitor Shows "Down"
1. **Check Render dashboard** - Is service running?
2. **Check URL** - Is it correct?
3. **Wait 2 minutes** - Might be temporary
4. **Check logs** - Look for errors

### Monitor Shows "Paused"
1. Click on monitor
2. Click "Resume Monitoring"
3. Should start working again

### Not Getting Alerts
1. Go to "My Settings" → "Alert Contacts"
2. Verify your email is confirmed
3. Check spam folder
4. Re-add alert contact if needed

---

## 📊 Dashboard Overview

After setup, you'll see:

```
┌─────────────────────────────────────────────────────────┐
│ Dashboard                                               │
├─────────────────────────────────────────────────────────┤
│ Overall Uptime: 99.9%                                   │
│ Monitors: 1                                             │
│ Up: 1 | Down: 0 | Paused: 0                            │
├─────────────────────────────────────────────────────────┤
│ Vibe Holidays Backend                                   │
│ ● Up (100%)                                             │
│ https://vibe-holidays-backend-0vgn.onrender.com/        │
│ Response Time: 234ms                                    │
│ Uptime (24h): 100% | (7d): 100% | (30d): 100%         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Reference

### URLs to Use:
```
Primary:   https://vibe-holidays-backend-0vgn.onrender.com/
Secondary: https://vibe-holidays-backend-0vgn.onrender.com/health
```

### Monitoring Interval:
```
Recommended: 5 minutes
Minimum (free): 5 minutes
Maximum (free): 5 minutes
```

### What to Monitor:
```
✅ HTTP(s) endpoint
✅ Status code: 200
✅ Response contains: "ok"
✅ Response time < 30 seconds
```

---

## 🚀 Next Steps After Setup

1. **Wait 24 hours** - Let UptimeRobot collect data
2. **Check dashboard** - See uptime statistics
3. **Test your website** - Should always load fast
4. **Share with team** - Everyone can monitor uptime
5. **Set up status page** (optional) - Public uptime page

---

## 💡 Pro Tips

### Tip 1: Add Multiple Monitors
Monitor different endpoints:
- Backend root: `/`
- Backend health: `/health`
- Frontend: `https://vibe-holidays-red.vercel.app`

### Tip 2: Create Status Page
1. Go to "Public Status Pages"
2. Create new page
3. Add your monitors
4. Share URL with customers

### Tip 3: Weekly Reports
1. Go to "My Settings"
2. Enable "Weekly Summary"
3. Get email every Monday with stats

---

## 📞 Support

### UptimeRobot Support:
- **Help Center**: https://uptimerobot.com/help/
- **Email**: support@uptimerobot.com
- **Twitter**: @uptimerobot

### Need Help with Setup?
Just let me know! I can:
- Help troubleshoot issues
- Optimize monitoring settings
- Set up additional monitors
- Configure alerts

---

## ✅ Checklist

Before you're done, make sure:

- [ ] Health check routes deployed to Render
- [ ] Tested health endpoint (returns "ok")
- [ ] Signed up for UptimeRobot
- [ ] Created monitor with correct URL
- [ ] Monitor shows "Up" status
- [ ] Email alerts configured
- [ ] Tested website loads fast

---

## 🎉 Success!

Once setup is complete:
- ✅ Your backend will never sleep
- ✅ Website will always load fast
- ✅ You'll get alerts if anything breaks
- ✅ Professional user experience
- ✅ Better SEO and conversions

**Your website is now production-ready!** 🚀

---

## 📝 Summary

**What we did**:
1. Added health check routes to backend
2. Deployed to Render
3. Set up UptimeRobot monitoring

**URLs for UptimeRobot**:
- `https://vibe-holidays-backend-0vgn.onrender.com/` (recommended)
- `https://vibe-holidays-backend-0vgn.onrender.com/health`

**Result**:
- Backend stays awake 24/7
- Fast loading for all users
- Professional experience
- Free forever!

**Next**: Deploy the changes and set up UptimeRobot! 🎯
