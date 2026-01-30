# Email Service Setup Guide

This guide covers configuring email services for the Vibe Holidays application to send booking confirmations, inquiry notifications, and other transactional emails.

## Table of Contents

1. [Email Service Options](#email-service-options)
2. [Gmail Setup](#gmail-setup-easiest)
3. [SendGrid Setup](#sendgrid-setup-recommended)
4. [AWS SES Setup](#aws-ses-setup-scalable)
5. [Testing Email Configuration](#testing-email-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Email Service Options

### Comparison

| Service | Cost | Ease of Setup | Reliability | Daily Limit | Best For |
|---------|------|---------------|-------------|-------------|----------|
| Gmail | Free | Easy | Good | 500 emails | Development, Small sites |
| SendGrid | Free tier (100/day) | Easy | Excellent | 100-100k+ | Production (recommended) |
| AWS SES | $0.10/1000 emails | Medium | Excellent | 200-50k+ | High volume, AWS users |
| Mailgun | Free tier (100/day) | Easy | Excellent | 100-10k+ | Production |
| Postmark | $10/month (10k emails) | Easy | Excellent | 10k+ | Transactional emails |

### Recommendation

- **Development/Testing:** Gmail
- **Production (Small-Medium):** SendGrid Free/Paid
- **Production (High Volume):** AWS SES or SendGrid
- **Already on AWS:** AWS SES

---

## Gmail Setup (Easiest)

Best for development and small production sites (up to 500 emails/day).

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter name: "Vibe Holidays Backend"
5. Click "Generate"
6. Copy the 16-character password (save it securely!)

### Step 3: Configure Environment Variables

Add to backend `.env`:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@vibeholidays.com
```

### Step 4: Test Configuration

```javascript
// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-16-char-app-password'
  }
});

transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email from Vibe Holidays'
}, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.messageId);
  }
});
```

Run:
```bash
node test-email.js
```

### Limitations

- **Daily limit:** 500 emails per day
- **Rate limit:** 2 emails per second
- **Not recommended for production** (Gmail may flag as spam)
- **From address:** Must be your Gmail address

---

## SendGrid Setup (Recommended)

Best for production. Free tier includes 100 emails/day, paid plans start at $15/month for 40k emails.

### Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com)
2. Click "Start for Free"
3. Fill in registration form
4. Verify email address

### Step 2: Create API Key

1. Go to [API Keys](https://app.sendgrid.com/settings/api_keys)
2. Click "Create API Key"
3. Name: "Vibe Holidays Production"
4. Permissions: "Full Access" (or "Mail Send" only for security)
5. Click "Create & View"
6. **Copy the API key** (you won't see it again!)

### Step 3: Verify Sender Identity

**Option A: Single Sender Verification (Free tier)**

1. Go to [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Click "Verify a Single Sender"
3. Fill in form:
   - From Name: Vibe Holidays
   - From Email: noreply@vibeholidays.com (or your email)
   - Reply To: info@vibeholidays.com
   - Company Address: Your business address
4. Click "Create"
5. Check email and click verification link

**Option B: Domain Authentication (Recommended for production)**

1. Go to [Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Click "Authenticate Your Domain"
3. Select DNS host (e.g., GoDaddy, Cloudflare)
4. Enter domain: vibeholidays.com
5. Follow instructions to add DNS records:
   ```
   Type: CNAME
   Host: em1234.vibeholidays.com
   Value: u1234567.wl123.sendgrid.net
   
   Type: CNAME
   Host: s1._domainkey.vibeholidays.com
   Value: s1.domainkey.u1234567.wl123.sendgrid.net
   
   Type: CNAME
   Host: s2._domainkey.vibeholidays.com
   Value: s2.domainkey.u1234567.wl123.sendgrid.net
   ```
6. Wait for DNS propagation (up to 48 hours)
7. Click "Verify" in SendGrid

### Step 4: Configure Environment Variables

Add to backend `.env`:

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=admin@vibeholidays.com
```

### Step 5: Update Email Configuration

Update `backend/src/config/email.ts`:

```typescript
import nodemailer from 'nodemailer';

export const createEmailTransporter = () => {
  // SendGrid configuration
  if (process.env.EMAIL_HOST === 'smtp.sendgrid.net') {
    return nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Gmail or other SMTP
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || ''
    }
  });
};
```

### Step 6: Test Configuration

```javascript
// test-sendgrid.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'your-sendgrid-api-key'
  }
});

transporter.sendMail({
  from: 'noreply@vibeholidays.com',
  to: 'test@example.com',
  subject: 'Test Email from SendGrid',
  text: 'This is a test email from Vibe Holidays via SendGrid',
  html: '<p>This is a <strong>test email</strong> from Vibe Holidays via SendGrid</p>'
}, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.messageId);
  }
});
```

### SendGrid Features

- **Email Activity:** View sent emails in dashboard
- **Analytics:** Open rates, click rates, bounces
- **Templates:** Create email templates in dashboard
- **Webhooks:** Get notified of email events
- **Suppression Lists:** Manage unsubscribes and bounces

---

## AWS SES Setup (Scalable)

Best for high volume or if already using AWS. Very cost-effective at scale.

### Step 1: Create AWS Account

1. Go to [AWS](https://aws.amazon.com)
2. Create account or sign in
3. Go to [SES Console](https://console.aws.amazon.com/ses)

### Step 2: Verify Email Address

1. In SES Console, go to "Verified identities"
2. Click "Create identity"
3. Choose "Email address"
4. Enter: noreply@vibeholidays.com
5. Click "Create identity"
6. Check email and click verification link

### Step 3: Verify Domain (Recommended)

1. Click "Create identity"
2. Choose "Domain"
3. Enter: vibeholidays.com
4. Enable DKIM signing
5. Add DNS records provided by AWS:
   ```
   Type: TXT
   Name: _amazonses.vibeholidays.com
   Value: [provided by AWS]
   
   Type: CNAME (DKIM)
   Name: [provided by AWS]
   Value: [provided by AWS]
   ```
6. Wait for verification (up to 72 hours)

### Step 4: Request Production Access

By default, SES is in "sandbox mode" (can only send to verified addresses).

1. Go to "Account dashboard"
2. Click "Request production access"
3. Fill in form:
   - Mail type: Transactional
   - Website URL: https://vibeholidays.com
   - Use case description: "Sending booking confirmations and inquiry notifications for travel booking website"
   - Compliance: Describe how you handle bounces and complaints
4. Submit request (usually approved within 24 hours)

### Step 5: Create SMTP Credentials

1. Go to "SMTP settings"
2. Click "Create SMTP credentials"
3. Enter IAM user name: "vibe-holidays-ses-smtp"
4. Click "Create"
5. **Download credentials** (you won't see them again!)
   - SMTP Username: [20-character string]
   - SMTP Password: [44-character string]

### Step 6: Configure Environment Variables

Add to backend `.env`:

```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=admin@vibeholidays.com
AWS_REGION=us-east-1
```

### Step 7: Test Configuration

```javascript
// test-ses.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-smtp-username',
    pass: 'your-smtp-password'
  }
});

transporter.sendMail({
  from: 'noreply@vibeholidays.com',
  to: 'test@example.com',
  subject: 'Test Email from AWS SES',
  text: 'This is a test email from Vibe Holidays via AWS SES',
  html: '<p>This is a <strong>test email</strong> from Vibe Holidays via AWS SES</p>'
}, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.messageId);
  }
});
```

### AWS SES Features

- **Very low cost:** $0.10 per 1,000 emails
- **High deliverability:** Excellent reputation
- **Scalable:** Send millions of emails
- **Monitoring:** CloudWatch metrics
- **Bounce handling:** Automatic bounce management

---

## Testing Email Configuration

### Test Script

Create `backend/test-email-config.js`:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
    
    // Send test email
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Vibe Holidays - Email Configuration Test',
      text: 'This is a test email to verify email configuration.',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify email configuration for Vibe Holidays.</p>
        <p><strong>Configuration:</strong></p>
        <ul>
          <li>Host: ${process.env.EMAIL_HOST}</li>
          <li>Port: ${process.env.EMAIL_PORT}</li>
          <li>From: ${process.env.EMAIL_FROM}</li>
        </ul>
        <p>If you received this email, your email configuration is working correctly!</p>
      `
    }, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
      process.exit(0);
    });
  }
});
```

Run:
```bash
cd backend
node test-email-config.js
```

### Test All Email Templates

Create `backend/test-all-emails.js`:

```javascript
const { sendBookingConfirmation, sendBookingAdminNotification, sendInquiryNotification } = require('./src/services/emailService');

const testBooking = {
  customerName: 'John Doe',
  email: 'test@example.com',
  phone: '+1-234-567-8900',
  travelDate: new Date('2024-06-15'),
  numberOfTravelers: 2,
  totalPrice: 2500,
  packageId: {
    name: 'Bali Paradise Package',
    destination: 'Bali, Indonesia',
    duration: 7
  }
};

const testInquiry = {
  name: 'Jane Smith',
  email: 'test@example.com',
  phone: '+1-234-567-8900',
  message: 'I would like more information about your Maldives packages.',
  packageId: {
    name: 'Maldives Luxury Escape'
  }
};

async function testAllEmails() {
  try {
    console.log('Testing booking confirmation email...');
    await sendBookingConfirmation(testBooking);
    console.log('✅ Booking confirmation sent');
    
    console.log('Testing booking admin notification...');
    await sendBookingAdminNotification(testBooking);
    console.log('✅ Booking admin notification sent');
    
    console.log('Testing inquiry notification...');
    await sendInquiryNotification(testInquiry);
    console.log('✅ Inquiry notification sent');
    
    console.log('\n✅ All email tests completed successfully!');
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testAllEmails();
```

Run:
```bash
cd backend
node test-all-emails.js
```

---

## Troubleshooting

### Authentication Failed

**Problem:** `Error: Invalid login: 535 Authentication failed`

**Solutions:**
- **Gmail:** Verify you're using App Password, not regular password
- **SendGrid:** Verify API key is correct and has "Mail Send" permission
- **AWS SES:** Verify SMTP credentials are correct
- Check username and password in `.env` file

### Connection Timeout

**Problem:** `Error: Connection timeout`

**Solutions:**
- Check EMAIL_HOST is correct
- Check EMAIL_PORT is correct (usually 587)
- Verify firewall allows outbound connections on port 587
- Try port 465 with `secure: true`

### Emails Going to Spam

**Problem:** Emails are delivered but go to spam folder

**Solutions:**
- **Verify domain:** Set up SPF, DKIM, and DMARC records
- **Use professional email:** Don't use Gmail for production
- **Avoid spam triggers:** Don't use all caps, excessive exclamation marks
- **Include unsubscribe link:** Required for bulk emails
- **Warm up IP:** Gradually increase sending volume
- **Monitor reputation:** Use tools like mail-tester.com

### SPF Record

Add to DNS:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:sendgrid.net include:amazonses.com ~all
```

### DKIM Records

Provided by email service (SendGrid, AWS SES) during domain verification.

### DMARC Record

Add to DNS:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@vibeholidays.com
```

### Rate Limiting

**Problem:** `Error: 550 Daily sending quota exceeded`

**Solutions:**
- **Gmail:** Upgrade to Google Workspace or switch to SendGrid/SES
- **SendGrid:** Upgrade plan or wait for quota reset
- **AWS SES:** Request limit increase in AWS console

### Emails Not Sending

**Problem:** No error but emails not received

**Solutions:**
- Check spam folder
- Verify recipient email is correct
- Check email service dashboard for delivery status
- Enable debug logging:
  ```javascript
  const transporter = nodemailer.createTransporter({
    // ... config
    debug: true,
    logger: true
  });
  ```

---

## Best Practices

### 1. Use Transactional Email Service

Don't use Gmail for production. Use SendGrid, AWS SES, or similar.

### 2. Verify Domain

Set up SPF, DKIM, and DMARC records for better deliverability.

### 3. Handle Bounces

Monitor and handle bounced emails:
- Remove invalid addresses from database
- Set up bounce webhooks (SendGrid, AWS SES)

### 4. Monitor Sending

- Track delivery rates
- Monitor bounce rates
- Watch for spam complaints
- Set up alerts for failures

### 5. Use Templates

Create reusable email templates for consistency.

### 6. Test Thoroughly

Test all email types before going live:
- Booking confirmations
- Admin notifications
- Inquiry acknowledgments
- Password resets (if applicable)

### 7. Respect Privacy

- Include unsubscribe link for marketing emails
- Don't sell or share email addresses
- Comply with GDPR, CAN-SPAM, etc.

---

## Quick Reference

### Gmail
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### SendGrid
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### AWS SES
```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
```

---

**Recommendation:** Use SendGrid for production. It's reliable, affordable, and easy to set up with excellent deliverability.
