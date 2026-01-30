# Vibe Holidays - Deployment Execution Guide

This guide provides step-by-step instructions for deploying the Vibe Holidays website to production. Follow these steps in order.

## 🎯 Deployment Overview

**Recommended Stack:**
- **Backend:** Heroku (easiest) or DigitalOcean App Platform
- **Frontend:** Vercel (recommended) or Netlify
- **Database:** MongoDB Atlas (managed)
- **Email:** SendGrid or Gmail with App Password
- **Monitoring:** UptimeRobot + Sentry (optional)

**Estimated Time:** 2-3 hours for first deployment

---

## ✅ Pre-Deployment Checklist

Before starting deployment, ensure:

- [ ] All tests are passing
- [ ] Code is committed and pushed to GitHub
- [ ] You have accounts for:
  - MongoDB Atlas
  - Heroku or DigitalOcean
  - Vercel or Netlify
  - Email service (Gmail/SendGrid)
- [ ] Domain name registered (optional for initial deployment)

---

## 📋 Step-by-Step Deployment

### Step 1: Set Up Production Database (MongoDB Atlas)

**Time: 15 minutes**

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Verify email

2. **Create New Cluster**
   ```
   - Click "Build a Database"
   - Choose "Shared" (Free tier - M0)
   - Select cloud provider: AWS
   - Select region: Closest to your users
   - Cluster name: vibe-holidays-prod
   - Click "Create Cluster"
   ```

3. **Create Database User**
   ```
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: vibe-admin
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
   ```

4. **Configure Network Access**
   ```
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, restrict to your server IPs
   - Click "Confirm"
   ```

5. **Get Connection String**
   ```
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Format: mongodb+srv://vibe-admin:<password>@cluster.mongodb.net/
   - Replace <password> with the password you saved
   - Add database name: /vibe-holidays-prod
   ```

6. **Save Connection String**
   ```
   Final format:
   mongodb+srv://vibe-admin:YOUR_PASSWORD@cluster.mongodb.net/vibe-holidays-prod?retryWrites=true&w=majority
   ```

✅ **Checkpoint:** Connection string saved securely

---

### Step 2: Configure Email Service

**Time: 10 minutes**

#### Option A: Gmail (Easiest for testing)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable if not already enabled

2. **Generate App Password**
   ```
   - Go to Security → 2-Step Verification
   - Scroll to "App passwords"
   - Select app: "Mail"
   - Select device: "Other" → "Vibe Holidays"
   - Click "Generate"
   - SAVE THE 16-CHARACTER PASSWORD
   ```

3. **Email Configuration Values**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=<16-character-app-password>
   EMAIL_FROM=noreply@vibeholidays.com
   ADMIN_EMAIL=your-email@gmail.com
   ```

#### Option B: SendGrid (Recommended for production)

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up for free account (100 emails/day)

2. **Create API Key**
   ```
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "Vibe Holidays Production"
   - Permissions: "Full Access"
   - Click "Create & View"
   - SAVE THE API KEY (shown only once)
   ```

3. **Verify Sender Email**
   ```
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Fill in your email and details
   - Verify email
   ```

4. **Email Configuration Values**
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-sendgrid-api-key>
   EMAIL_FROM=noreply@vibeholidays.com
   ADMIN_EMAIL=your-email@example.com
   ```

✅ **Checkpoint:** Email credentials saved securely

---

### Step 3: Deploy Backend

**Time: 20-30 minutes**

#### Option A: Heroku (Recommended for beginners)

1. **Install Heroku CLI**
   ```bash
   # Windows (PowerShell as Administrator)
   winget install Heroku.HerokuCLI
   
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   # Press any key to open browser and login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create vibe-holidays-api
   # Note: If name is taken, try: vibe-holidays-api-yourname
   ```

4. **Generate JWT Secret**
   ```bash
   # Run this command and save the output
   openssl rand -base64 32
   ```

5. **Set Environment Variables**
   ```bash
   # Replace values with your actual credentials
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="mongodb+srv://vibe-admin:YOUR_PASSWORD@cluster.mongodb.net/vibe-holidays-prod?retryWrites=true&w=majority"
   heroku config:set JWT_SECRET="<output-from-openssl-command>"
   heroku config:set EMAIL_HOST="smtp.gmail.com"
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER="your-email@gmail.com"
   heroku config:set EMAIL_PASSWORD="<your-app-password>"
   heroku config:set EMAIL_FROM="noreply@vibeholidays.com"
   heroku config:set ADMIN_EMAIL="your-email@gmail.com"
   heroku config:set FRONTEND_URL="https://vibe-holidays.vercel.app"
   ```

6. **Deploy to Heroku**
   ```bash
   # Make sure you're in the backend directory
   git push heroku main
   
   # If you're on a different branch:
   git push heroku your-branch:main
   ```

7. **Verify Deployment**
   ```bash
   # Check if app is running
   heroku ps
   
   # View logs
   heroku logs --tail
   
   # Test health endpoint
   curl https://vibe-holidays-api.herokuapp.com/health
   ```

8. **Save Backend URL**
   ```
   Your backend URL: https://vibe-holidays-api.herokuapp.com
   API URL: https://vibe-holidays-api.herokuapp.com/api
   ```

✅ **Checkpoint:** Backend deployed and health check passing

---

### Step 4: Deploy Frontend

**Time: 15-20 minutes**

#### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   # Enter your email and verify
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   
   # Initial deployment
   vercel
   
   # Answer prompts:
   # Set up and deploy? Yes
   # Which scope? Your account
   # Link to existing project? No
   # Project name? vibe-holidays
   # Directory? ./
   # Override settings? No
   ```

4. **Set Environment Variables**
   ```bash
   # Set API URL (use your Heroku backend URL)
   vercel env add VITE_API_URL production
   # When prompted, enter: https://vibe-holidays-api.herokuapp.com/api
   
   # Set other variables
   vercel env add VITE_APP_NAME production
   # Enter: Vibe Holidays
   
   vercel env add VITE_CONTACT_EMAIL production
   # Enter: info@vibeholidays.com
   
   vercel env add VITE_CONTACT_PHONE production
   # Enter: +1-234-567-8900
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

6. **Get Deployment URL**
   ```bash
   # Your site will be at:
   https://vibe-holidays.vercel.app
   # Or similar
   ```

7. **Update Backend CORS**
   ```bash
   # Go back to backend directory
   cd ../backend
   
   # Update FRONTEND_URL with your Vercel URL
   heroku config:set FRONTEND_URL="https://vibe-holidays.vercel.app"
   ```

✅ **Checkpoint:** Frontend deployed and accessible

---

### Step 5: Verify Deployment

**Time: 15 minutes**

1. **Test Backend Health**
   ```bash
   curl https://vibe-holidays-api.herokuapp.com/health
   # Expected: {"status":"ok","message":"Vibe Holidays API is running"}
   ```

2. **Test API Endpoints**
   ```bash
   # Test packages endpoint
   curl https://vibe-holidays-api.herokuapp.com/api/packages
   # Expected: [] or list of packages
   ```

3. **Test Frontend**
   - Open your Vercel URL in browser
   - Check homepage loads
   - Check navigation works
   - Check packages page loads
   - Check gallery page loads
   - Check contact page loads

4. **Test Forms**
   - Try submitting inquiry form
   - Check if email is received
   - Try submitting contact form
   - Check if email is received

5. **Test Admin Login**
   - Go to /admin/login
   - Try logging in (you'll need to create admin user first)

✅ **Checkpoint:** All basic functionality working

---

### Step 6: Create Admin User

**Time: 5 minutes**

Since there's no admin user yet, you need to create one directly in the database:

1. **Connect to MongoDB Atlas**
   - Go to MongoDB Atlas dashboard
   - Click "Browse Collections"
   - Select your database: vibe-holidays-prod

2. **Create Admin User**
   - Click on "users" collection (create if doesn't exist)
   - Click "Insert Document"
   - Use this format:
   ```json
   {
     "username": "admin",
     "email": "admin@vibeholidays.com",
     "password": "$2b$10$YourHashedPasswordHere",
     "role": "admin",
     "createdAt": {"$date": "2026-01-15T00:00:00.000Z"}
   }
   ```

3. **Generate Hashed Password**
   ```bash
   # In backend directory, create a quick script
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YourPassword123!', 10, (err, hash) => console.log(hash));"
   ```

4. **Update Document**
   - Replace the password field with the hashed password
   - Click "Insert"

5. **Test Login**
   - Go to your frontend URL + /admin/login
   - Login with:
     - Username: admin
     - Password: YourPassword123! (or whatever you used)

✅ **Checkpoint:** Admin user created and can login

---

### Step 7: Configure Custom Domain (Optional)

**Time: 30 minutes**

#### For Frontend (Vercel)

1. **Add Domain in Vercel**
   ```
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Domains
   - Add your domain: vibeholidays.com
   - Add www subdomain: www.vibeholidays.com
   ```

2. **Configure DNS**
   ```
   - Go to your domain registrar
   - Add DNS records:
     
     Type: A
     Name: @
     Value: 76.76.21.21 (Vercel's IP)
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation**
   - Usually takes 5-60 minutes
   - Check status in Vercel dashboard

#### For Backend (Heroku)

1. **Add Domain in Heroku**
   ```bash
   heroku domains:add api.vibeholidays.com
   ```

2. **Get DNS Target**
   ```bash
   heroku domains
   # Note the DNS Target value
   ```

3. **Configure DNS**
   ```
   - Go to your domain registrar
   - Add DNS record:
     
     Type: CNAME
     Name: api
     Value: <dns-target-from-heroku>
   ```

4. **Update Environment Variables**
   ```bash
   # Update frontend URL in backend
   heroku config:set FRONTEND_URL="https://vibeholidays.com"
   
   # Update API URL in frontend
   cd frontend
   vercel env add VITE_API_URL production
   # Enter: https://api.vibeholidays.com/api
   
   # Redeploy frontend
   vercel --prod
   ```

✅ **Checkpoint:** Custom domain configured and working

---

### Step 8: Set Up Monitoring (Optional but Recommended)

**Time: 15 minutes**

#### UptimeRobot (Free uptime monitoring)

1. **Create Account**
   - Go to https://uptimerobot.com
   - Sign up for free account

2. **Add Monitors**
   ```
   Monitor 1:
   - Type: HTTP(s)
   - Name: Vibe Holidays Backend
   - URL: https://vibe-holidays-api.herokuapp.com/health
   - Interval: 5 minutes
   
   Monitor 2:
   - Type: HTTP(s)
   - Name: Vibe Holidays Frontend
   - URL: https://vibe-holidays.vercel.app
   - Interval: 5 minutes
   ```

3. **Configure Alerts**
   - Add email for notifications
   - Set alert threshold: 2 minutes

#### Sentry (Error tracking - optional)

1. **Create Account**
   - Go to https://sentry.io
   - Sign up for free account

2. **Create Project**
   - Choose platform: Node.js (for backend)
   - Project name: vibe-holidays-backend

3. **Get DSN**
   - Copy the DSN from project settings

4. **Add to Backend**
   ```bash
   heroku config:set SENTRY_DSN="<your-sentry-dsn>"
   ```

✅ **Checkpoint:** Monitoring configured

---

## 🎉 Deployment Complete!

Your Vibe Holidays website is now live!

### URLs

- **Frontend:** https://vibe-holidays.vercel.app (or your custom domain)
- **Backend API:** https://vibe-holidays-api.herokuapp.com/api
- **Admin Dashboard:** https://vibe-holidays.vercel.app/admin

### Next Steps

1. **Test Everything**
   - Browse packages
   - Submit booking
   - Submit inquiry
   - Test admin dashboard
   - Upload gallery images
   - Create/edit packages

2. **Add Content**
   - Create holiday packages
   - Upload gallery images
   - Update about page content

3. **Configure SEO**
   - Submit sitemap to Google Search Console
   - Set up Google Analytics (optional)
   - Verify meta tags

4. **Set Up Backups**
   - MongoDB Atlas has automatic backups
   - Test restore procedure

5. **Monitor Performance**
   - Check UptimeRobot dashboard
   - Review Heroku metrics
   - Check Vercel analytics

---

## 🆘 Troubleshooting

### Backend Issues

**Problem: Health check fails**
```bash
# Check logs
heroku logs --tail

# Common issues:
# - Database connection failed: Check MONGODB_URI
# - Port binding error: Heroku sets PORT automatically
# - Build failed: Check package.json scripts
```

**Problem: CORS errors**
```bash
# Verify FRONTEND_URL matches your frontend domain
heroku config:get FRONTEND_URL

# Update if needed
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
```

**Problem: Emails not sending**
```bash
# Check email configuration
heroku config:get EMAIL_HOST
heroku config:get EMAIL_USER

# Test with a simple booking
# Check Heroku logs for email errors
```

### Frontend Issues

**Problem: API calls fail**
```bash
# Check VITE_API_URL
vercel env ls

# Update if needed
vercel env add VITE_API_URL production
# Enter correct backend URL

# Redeploy
vercel --prod
```

**Problem: Build fails**
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - TypeScript errors
# - Missing dependencies
# - Environment variables not set
```

### Database Issues

**Problem: Connection timeout**
```
# Check network access in MongoDB Atlas
# Ensure 0.0.0.0/0 is whitelisted
# Or add Heroku IP addresses
```

---

## 📞 Support

- **Heroku Status:** https://status.heroku.com
- **Vercel Status:** https://www.vercel-status.com
- **MongoDB Atlas Support:** https://support.mongodb.com

---

## 📝 Deployment Log

**Deployment Date:** _________________

**Deployed By:** _________________

**Backend URL:** _________________

**Frontend URL:** _________________

**Database:** _________________

**Issues Encountered:** _________________

**Notes:** _________________

---

**Congratulations on your deployment! 🚀**
