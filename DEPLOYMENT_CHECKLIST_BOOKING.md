# ✅ Booking System Deployment Checklist

## Pre-Deployment Checklist

### 1. Razorpay Account Setup
- [ ] Razorpay account created
- [ ] Email verified
- [ ] Phone verified
- [ ] Test API keys obtained
- [ ] Test mode working locally

### 2. Local Testing (Development)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can create test booking
- [ ] Payment form appears (Step 3)
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Booking status updates to "confirmed"
- [ ] Payment status updates to "completed"
- [ ] Confirmation email received
- [ ] Payment receipt email received
- [ ] Admin notification email received
- [ ] Invoice downloads successfully
- [ ] Invoice contains correct information

### 3. Code Quality
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All new files committed to Git
- [ ] Environment variables not committed
- [ ] Code reviewed and tested

---

## Production Deployment Checklist

### 1. Razorpay Production Setup
- [ ] KYC documents submitted
- [ ] KYC verification completed (wait 1-2 days)
- [ ] Bank account added
- [ ] Bank account verified
- [ ] Live API keys generated
- [ ] Settlement account configured

### 2. Backend Deployment (Render)

#### Environment Variables
Add these to Render dashboard:

- [ ] `RAZORPAY_KEY_ID` = rzp_live_xxxxxxxxxxxxx
- [ ] `RAZORPAY_KEY_SECRET` = xxxxxxxxxxxxxxxxxxxxx
- [ ] `EMAIL_USER` = vibesholidays.9@gmail.com
- [ ] `EMAIL_PASSWORD` = (existing value)
- [ ] `ADMIN_EMAIL` = vibesholidays.9@gmail.com
- [ ] `MONGODB_URI` = (existing value)
- [ ] `JWT_SECRET` = (existing value)
- [ ] `FRONTEND_URL` = https://vibe-holidays-red.vercel.app

#### Deployment
- [ ] Push code to GitHub
- [ ] Render auto-deploys
- [ ] Check deployment logs for errors
- [ ] Verify backend is running
- [ ] Test health endpoint: `https://your-backend.onrender.com/health`

### 3. Frontend Deployment (Vercel)

- [ ] Push code to GitHub
- [ ] Vercel auto-deploys
- [ ] Check deployment logs
- [ ] Verify frontend is accessible
- [ ] No console errors in browser

### 4. Production Testing

#### Test Booking Flow
- [ ] Go to production website
- [ ] Select a package
- [ ] Click "Book Now"
- [ ] Fill Step 1: Personal Info
- [ ] Fill Step 2: Travel Details
- [ ] Verify total price calculation
- [ ] Click "Continue to Payment"
- [ ] Razorpay checkout opens
- [ ] Payment methods visible

#### Test Payment (Small Amount)
- [ ] Create real booking with small amount
- [ ] Complete real payment
- [ ] Payment succeeds
- [ ] Booking confirmed
- [ ] Emails received (check all 3)
- [ ] Invoice downloads
- [ ] Payment appears in Razorpay dashboard
- [ ] Booking appears in MongoDB

#### Verify Emails
- [ ] Customer receives booking confirmation
- [ ] Customer receives payment receipt
- [ ] Admin receives booking notification
- [ ] Admin receives payment notification
- [ ] Emails not in spam folder
- [ ] Email formatting looks good
- [ ] All links work

#### Verify Invoice
- [ ] Invoice downloads as PDF
- [ ] Company details correct
- [ ] Customer details correct
- [ ] Booking details correct
- [ ] Payment details correct
- [ ] QR code present
- [ ] Total amount correct
- [ ] Professional appearance

### 5. Razorpay Dashboard Verification

- [ ] Login to Razorpay dashboard
- [ ] Switch to Live mode
- [ ] Check Payments section
- [ ] Test payment visible
- [ ] Payment status: Captured
- [ ] Amount correct
- [ ] Customer details visible
- [ ] Settlement scheduled

### 6. Database Verification

- [ ] Login to MongoDB Atlas
- [ ] Check bookings collection
- [ ] Test booking present
- [ ] All fields populated correctly
- [ ] Payment ID saved
- [ ] Payment status: completed
- [ ] Booking status: confirmed

---

## Post-Deployment Checklist

### 1. Monitoring Setup

- [ ] Razorpay dashboard bookmarked
- [ ] MongoDB Atlas bookmarked
- [ ] Render dashboard bookmarked
- [ ] Vercel dashboard bookmarked
- [ ] Email notifications working

### 2. Documentation

- [ ] Team knows how to check bookings
- [ ] Team knows how to check payments
- [ ] Team knows how to handle issues
- [ ] Support email set up
- [ ] Phone support ready

### 3. Customer Communication

- [ ] Test booking confirmation email looks professional
- [ ] Payment receipt email looks professional
- [ ] Contact information correct in emails
- [ ] Website contact info updated
- [ ] Terms and conditions updated

### 4. Admin Training

- [ ] Admin can access Razorpay dashboard
- [ ] Admin can check bookings in MongoDB
- [ ] Admin knows how to handle payment issues
- [ ] Admin knows how to handle refunds
- [ ] Admin knows how to contact Razorpay support

---

## First Week Monitoring

### Daily Checks (First 7 Days)

- [ ] Check Razorpay dashboard for new payments
- [ ] Check MongoDB for new bookings
- [ ] Verify emails are being sent
- [ ] Check for any error logs in Render
- [ ] Monitor customer feedback
- [ ] Check settlement status

### Weekly Checks

- [ ] Review all bookings
- [ ] Verify all payments captured
- [ ] Check settlement amounts
- [ ] Review any failed payments
- [ ] Customer satisfaction check
- [ ] System performance check

---

## Troubleshooting Checklist

### Payment Not Working

- [ ] Check Razorpay API keys in Render
- [ ] Verify keys are live keys (not test)
- [ ] Check Razorpay dashboard for errors
- [ ] Check browser console for errors
- [ ] Check backend logs in Render
- [ ] Verify KYC is approved
- [ ] Check if Razorpay account is active

### Emails Not Sending

- [ ] Check email credentials in Render
- [ ] Verify Gmail app password is correct
- [ ] Check spam folder
- [ ] Check backend logs for email errors
- [ ] Test email service separately
- [ ] Verify SMTP settings

### Invoice Not Generating

- [ ] Check backend logs for PDF errors
- [ ] Verify pdfkit is installed
- [ ] Check booking ID is valid
- [ ] Test invoice endpoint directly
- [ ] Check file permissions

### Booking Not Saving

- [ ] Check MongoDB connection
- [ ] Verify MongoDB URI in Render
- [ ] Check database permissions
- [ ] Check backend logs
- [ ] Verify booking model schema

---

## Emergency Contacts

### Technical Support
- **Razorpay Support**: 1800-102-0480
- **Razorpay Email**: support@razorpay.com
- **MongoDB Support**: https://support.mongodb.com/

### Internal
- **Admin Email**: vibesholidays.9@gmail.com
- **Admin Phone**: +91 7048505128
- **Backup Email**: vibeholidays2@gmail.com

---

## Success Criteria

### System is Live When:

✅ **Payments Working**
- Customers can complete payments
- Payments appear in Razorpay dashboard
- Money settles to bank account

✅ **Emails Working**
- Customers receive confirmations
- Admin receives notifications
- Emails look professional

✅ **Invoices Working**
- Invoices generate correctly
- Invoices download successfully
- Invoices contain correct info

✅ **Bookings Working**
- Bookings save to database
- Status updates correctly
- Admin can view bookings

✅ **User Experience**
- Smooth booking flow
- Clear error messages
- Professional appearance
- Mobile responsive

---

## Rollback Plan

### If Critical Issues Occur:

1. **Disable Payment Step**
   - Comment out Step 3 in BookingForm
   - Revert to 2-step booking
   - Collect payments manually

2. **Revert Code**
   - Git revert to previous version
   - Redeploy backend and frontend
   - Notify customers of temporary issue

3. **Contact Support**
   - Razorpay support for payment issues
   - MongoDB support for database issues
   - Email service support for email issues

---

## Final Sign-Off

### Before Going Live:

- [ ] All tests passed
- [ ] All emails working
- [ ] All payments working
- [ ] All invoices working
- [ ] Team trained
- [ ] Documentation complete
- [ ] Monitoring set up
- [ ] Emergency plan ready

### Sign-Off:

- [ ] Technical Lead Approval: _______________
- [ ] Business Owner Approval: _______________
- [ ] Date: _______________

---

## 🎉 Congratulations!

Once all items are checked, your booking system is **LIVE** and ready to accept real bookings!

**Next Steps:**
1. Monitor first few bookings closely
2. Gather customer feedback
3. Make improvements as needed
4. Celebrate your success! 🎊

---

**Questions?** Check the documentation or contact support!

