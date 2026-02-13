# ⚡ Quick Start - Booking System

## 🎯 What's Been Done

✅ Payment gateway integrated (Razorpay)
✅ Email notifications automated
✅ PDF invoices generated
✅ 3-step booking flow implemented

---

## 🚀 Get Started in 3 Steps

### Step 1: Get Razorpay Keys (5 minutes)

1. Go to https://razorpay.com/ and sign up
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy both keys (Key ID and Key Secret)

### Step 2: Add Keys to Environment (2 minutes)

Update `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Test It! (5 minutes)

```bash
# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

Then:
1. Go to http://localhost:5173
2. Click any package → "Book Now"
3. Fill the form
4. Use test card: 4111 1111 1111 1111
5. Complete payment
6. Check your email!

---

## 📧 Test Credentials

### Test Card
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Test UPI
```
UPI ID: success@razorpay
```

---

## 🎉 What Happens After Booking

1. ✅ Payment processed securely
2. ✅ Booking confirmed automatically
3. ✅ Customer receives confirmation email
4. ✅ Customer receives payment receipt
5. ✅ Admin receives notification
6. ✅ Invoice available for download

---

## 🔴 Go Live (After Testing)

### 1. Complete Razorpay KYC
- Dashboard → Account & Settings → KYC
- Upload documents
- Wait for approval (1-2 days)

### 2. Get Live Keys
- Dashboard → Settings → API Keys
- Switch to Live Mode
- Generate Live Key

### 3. Update Production
Add to Render environment variables:
```
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

### 4. Deploy & Test
- Deploy backend and frontend
- Test with real payment
- Start accepting bookings! 🎊

---

## 📚 Full Documentation

- `BOOKING_SYSTEM_COMPLETE.md` - Complete guide
- `RAZORPAY_SETUP_GUIDE.md` - Razorpay setup
- `BOOKING_ENHANCEMENTS_SUMMARY.md` - Implementation details

---

## 💡 Quick Tips

- Use test mode for development (free)
- Test thoroughly before going live
- Check spam folder for emails
- Monitor Razorpay dashboard
- Keep API keys secret

---

## 📞 Need Help?

- Razorpay Support: 1800-102-0480
- Email: vibesholidays.9@gmail.com
- Documentation: Check the MD files above

---

**Ready to accept bookings!** 🚀

