# ⚠️ Email Not Working After Deployment - Fix Guide

## Problem
Emails are not being sent from the contact form or booking system after deployment.

## Root Cause
The email environment variables are NOT set on Render. The `.env.production` file is just a template - you must manually add these variables to Render's dashboard.

---

## Solution: Add Email Variables to Render

### Step 1: Go to Render Dashboard
1. Open https://render.com/dashboard
2. Click on **vibe-holidays-backend** service
3. Click **Environment** tab (left sidebar)

### Step 2: Add Email Variables
Click "Add Environment Variable" and add these **one by one**:

#### Email Configuration Variables:

1. **EMAIL_HOST**
   - Value: `smtp.gmail.com`

2. **EMAIL_PORT**
   - Value: `587`

3. **EMAIL_USER**
   - Value: `vibesholidays.9@gmail.com`

4. **EMAIL_PASSWORD**
   - Value: `lpyl agvd wogu upik`
   - (This is your Gmail App Password)

5. **EMAIL_FROM**
   - Value: `noreply@vibeholidays.com`

6. **ADMIN_EMAIL**
   - Value: `vibesholidays.9@gmail.com`

### Step 3: Save Changes
1. Click **Save Changes** button
2. Render will automatically redeploy (2-3 minutes)
3. Wait for "Live" status

---

## Verify Email Configuration

### After Render Redeploys:

1. Go to www.vibesholidays.in/contact
2. Fill out the contact form
3. Submit the form
4. Check your email: vibesholidays.9@gmail.com
5. You should receive the inquiry notification!

---

## Gmail App Password Setup

If the email password doesn't work, you may need to generate a new Gmail App Password:

### Steps to Generate Gmail App Password:

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)**
5. Enter: "Vibe Holidays Website"
6. Click **Generate**
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
8. Update **EMAIL_PASSWORD** on Render with this new password

---

## Current Email Variables in .env.production

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=vibesholidays.9@gmail.com
EMAIL_PASSWORD=lpyl agvd wogu upik
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=vibesholidays.9@gmail.com
```

**IMPORTANT**: These must be added to Render dashboard, not just in the file!

---

## How Email System Works

### When Customer Submits Contact Form:
1. **Customer receives**: Acknowledgment email ("We received your inquiry")
2. **You receive**: Notification email with customer details

### When Customer Books Package:
1. **Customer receives**: Booking confirmation with details
2. **You receive**: Booking notification with customer info

---

## Testing Email After Setup

### Test 1: Contact Form
1. Go to www.vibesholidays.in/contact
2. Fill out form with your email
3. Submit
4. Check both:
   - Your test email (should get acknowledgment)
   - vibesholidays.9@gmail.com (should get notification)

### Test 2: Booking Form
1. Go to any package page
2. Click "Book Now"
3. Fill out booking form
4. Submit
5. Check both emails

---

## Common Issues

### Issue 1: "Invalid login" Error
**Cause**: Gmail App Password is wrong or expired
**Solution**: Generate new App Password (see steps above)

### Issue 2: "Connection timeout" Error
**Cause**: EMAIL_HOST or EMAIL_PORT is wrong
**Solution**: Verify values:
- EMAIL_HOST = smtp.gmail.com
- EMAIL_PORT = 587

### Issue 3: Emails Go to Spam
**Cause**: EMAIL_FROM domain doesn't match sender
**Solution**: Change EMAIL_FROM to match EMAIL_USER:
- EMAIL_FROM = vibesholidays.9@gmail.com

### Issue 4: No Error But No Email
**Cause**: Environment variables not set on Render
**Solution**: Double-check all 6 variables are in Render dashboard

---

## Verification Checklist

After adding variables to Render:

- [ ] All 6 email variables added to Render
- [ ] Clicked "Save Changes"
- [ ] Render shows "Live" status (not "Deploying")
- [ ] Tested contact form
- [ ] Received acknowledgment email
- [ ] Received admin notification email
- [ ] Emails not in spam folder

---

## Alternative: Check Render Logs

If emails still not working:

1. Go to Render dashboard
2. Click on vibe-holidays-backend
3. Click **Logs** tab
4. Submit a contact form
5. Look for errors like:
   - "Error sending email"
   - "Invalid login"
   - "Connection timeout"
6. Share the error message with me

---

## Summary

✅ **Problem**: Email variables not set on Render
✅ **Solution**: Add 6 email variables to Render dashboard
⏳ **Time**: 5 minutes to add variables + 2-3 minutes for redeploy
🎯 **Result**: Emails will work!

---

**Next Step**: Add the 6 email variables to Render dashboard now!

**Variables to Add**:
1. EMAIL_HOST = smtp.gmail.com
2. EMAIL_PORT = 587
3. EMAIL_USER = vibesholidays.9@gmail.com
4. EMAIL_PASSWORD = lpyl agvd wogu upik
5. EMAIL_FROM = noreply@vibeholidays.com
6. ADMIN_EMAIL = vibesholidays.9@gmail.com
