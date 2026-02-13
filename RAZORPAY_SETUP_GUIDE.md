# 🔑 Razorpay Setup Guide

## Quick Setup Steps

### Step 1: Create Razorpay Account

1. Go to https://razorpay.com/
2. Click "Sign Up" (top right)
3. Fill in your details:
   - Business Name: Vibe Holidays
   - Email: vibesholidays.9@gmail.com
   - Phone: +91 7048505128
4. Verify your email and phone

### Step 2: Get Test API Keys (For Development)

1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy both keys:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secret!)

### Step 3: Add Keys to Development Environment

Update `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Test the Integration

1. Start your backend: `cd backend && npm run dev`
2. Start your frontend: `cd frontend && npm run dev`
3. Create a test booking
4. Use test payment credentials:
   - **Card**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **UPI**: success@razorpay

### Step 5: Complete KYC (For Production)

To accept real payments, you need to complete KYC:

1. Go to **Account & Settings** → **KYC Details**
2. Upload required documents:
   - PAN Card
   - Business Registration (if applicable)
   - Bank Account Details
   - Address Proof
3. Wait for verification (usually 24-48 hours)

### Step 6: Get Live API Keys

After KYC approval:

1. Go to **Settings** → **API Keys**
2. Switch to **Live Mode** (toggle at top)
3. Click **Generate Live Key**
4. Copy both keys:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

### Step 7: Add Live Keys to Production

Update `backend/.env.production`:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

Also add to Render:
1. Go to Render Dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add variables:
   - `RAZORPAY_KEY_ID` = your live key
   - `RAZORPAY_KEY_SECRET` = your live secret

### Step 8: Configure Settlement Account

1. Go to **Settings** → **Bank Account**
2. Add your bank account details:
   - Account Number
   - IFSC Code
   - Account Holder Name
3. Verify with test deposit

### Step 9: Set Up Webhooks (Optional but Recommended)

Webhooks notify your server about payment events:

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-backend-url.onrender.com/api/payments/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
4. Copy webhook secret
5. Add to environment: `RAZORPAY_WEBHOOK_SECRET=xxxxx`

---

## Test Payment Credentials

### Test Cards

**Success Card**:
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Any name
```

**Failure Card**:
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

### Test UPI

**Success**:
```
UPI ID: success@razorpay
```

**Failure**:
```
UPI ID: failure@razorpay
```

### Test Net Banking

Select any bank and use:
- Username: `razorpay`
- Password: `razorpay`

---

## Important Notes

### Security
- ⚠️ Never commit API keys to Git
- ⚠️ Keep Key Secret confidential
- ⚠️ Use environment variables only
- ⚠️ Different keys for test/live modes

### Transaction Fees
- Domestic cards: 2%
- International cards: 3%
- UPI: Free (first 50), then 0.5%
- Net Banking: 2%
- Wallets: 2%

### Settlement
- Payments settled to your bank account
- T+3 days settlement cycle (default)
- Can request instant settlement (charges apply)

### Support
- Email: support@razorpay.com
- Phone: 1800-102-0480
- Dashboard: Live chat available

---

## Verification Checklist

Before going live, verify:

- [ ] KYC completed and approved
- [ ] Bank account added and verified
- [ ] Live API keys generated
- [ ] Keys added to production environment
- [ ] Test payment successful in test mode
- [ ] Email notifications working
- [ ] Invoice generation working
- [ ] Webhook configured (optional)
- [ ] Settlement account configured

---

## Quick Links

- Dashboard: https://dashboard.razorpay.com/
- Documentation: https://razorpay.com/docs/
- API Reference: https://razorpay.com/docs/api/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/
- Support: https://razorpay.com/support/

---

## Need Help?

If you face any issues:

1. Check Razorpay documentation
2. Review error logs in Render
3. Test with different payment methods
4. Contact Razorpay support
5. Email: vibesholidays.9@gmail.com

---

**Ready to accept payments!** 🎉

