# Vibe Holidays - Deployment Guide

This guide provides comprehensive instructions for deploying the Vibe Holidays website to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account (or self-hosted MongoDB)
- [ ] Domain name registered
- [ ] Email service configured (Gmail, SendGrid, or AWS SES)
- [ ] Hosting accounts set up:
  - Backend: Heroku, DigitalOcean, AWS, or Railway
  - Frontend: Vercel, Netlify, or Cloudflare Pages
- [ ] Git repository with latest code
- [ ] SSL certificate (or use hosting provider's free SSL)

---

## Pre-Deployment Checklist

### Code Preparation

- [ ] All tests passing (`npm test` in both frontend and backend)
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all API endpoints
- [ ] Input validation on all forms
- [ ] Security middleware configured (helmet, CORS, rate limiting)
- [ ] Environment variables documented

### Security Review

- [ ] Strong JWT secret generated
- [ ] Database credentials secured
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] Input sanitization active
- [ ] HTTPS enforced
- [ ] Sensitive data not in version control

### Performance Optimization

- [ ] Images optimized and compressed
- [ ] Code splitting implemented
- [ ] Lazy loading configured
- [ ] Bundle size analyzed and optimized
- [ ] Database indexes created
- [ ] Compression middleware enabled

---

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new project: "Vibe Holidays Production"

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier) or "Dedicated" (production)
   - Select cloud provider and region (closest to your backend server)
   - Name cluster: `vibe-holidays-prod`

3. **Configure Database Access**
   - Go to "Database Access"
   - Add new database user
   - Username: `vibe-holidays-admin`
   - Password: Generate strong password (save securely)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address
   - For development: Add your current IP
   - For production: Add your backend server IP or "Allow access from anywhere" (0.0.0.0/0)
   - Note: Restricting to specific IPs is more secure

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>`
   - Replace `<username>`, `<password>`, and `<database>` with actual values

6. **Create Database and Collections**
   ```javascript
   // Collections will be created automatically by Mongoose
   // Database name: vibe-holidays-prod
   ```

7. **Create Indexes for Performance**
   ```javascript
   // Connect to MongoDB and run these commands:
   
   // Packages collection
   db.packages.createIndex({ destination: 1 })
   db.packages.createIndex({ price: 1 })
   db.packages.createIndex({ featured: 1, active: 1 })
   db.packages.createIndex({ name: "text", description: "text" })
   
   // Bookings collection
   db.bookings.createIndex({ email: 1 })
   db.bookings.createIndex({ status: 1 })
   db.bookings.createIndex({ createdAt: -1 })
   
   // Inquiries collection
   db.inquiries.createIndex({ status: 1 })
   db.inquiries.createIndex({ createdAt: -1 })
   
   // Gallery collection
   db.gallery.createIndex({ category: 1 })
   ```

### Option 2: Self-Hosted MongoDB

If using a self-hosted MongoDB instance:

1. Install MongoDB on your server
2. Configure authentication
3. Set up firewall rules
4. Enable SSL/TLS
5. Configure backups
6. Connection string: `mongodb://username:password@host:port/database`

---

## Backend Deployment

### Option A: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create vibe-holidays-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set JWT_SECRET="your-strong-jwt-secret"
   heroku config:set EMAIL_HOST="smtp.gmail.com"
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER="your-email@gmail.com"
   heroku config:set EMAIL_PASSWORD="your-app-password"
   heroku config:set EMAIL_FROM="noreply@vibeholidays.com"
   heroku config:set ADMIN_EMAIL="admin@vibeholidays.com"
   heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Verify Deployment**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option B: DigitalOcean App Platform

1. **Create DigitalOcean Account**
   - Go to [DigitalOcean](https://www.digitalocean.com)
   - Sign up or log in

2. **Create New App**
   - Click "Create" → "Apps"
   - Connect your GitHub repository
   - Select the backend directory

3. **Configure Build Settings**
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
   - HTTP Port: 5000

4. **Set Environment Variables**
   - Add all variables from `.env.production.example`
   - Use DigitalOcean's environment variable interface

5. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

### Option C: AWS EC2 (Advanced)

1. **Launch EC2 Instance**
   - Choose Ubuntu Server 22.04 LTS
   - Instance type: t2.micro (free tier) or t2.small
   - Configure security group (allow ports 22, 80, 443, 5000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   
   # Install Nginx (reverse proxy)
   sudo apt install -y nginx
   ```

4. **Clone Repository**
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-repo/vibe-holidays.git
   cd vibe-holidays/backend
   sudo npm install
   ```

5. **Configure Environment**
   ```bash
   sudo nano .env
   # Paste production environment variables
   ```

6. **Build Application**
   ```bash
   sudo npm run build
   ```

7. **Start with PM2**
   ```bash
   sudo pm2 start dist/server.js --name vibe-holidays-api
   sudo pm2 startup
   sudo pm2 save
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/vibe-holidays-api
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.vibeholidays.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/vibe-holidays-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Frontend Deployment

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Frontend Directory**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.production.example`
   - Ensure `VITE_API_URL` points to your backend URL

5. **Configure Custom Domain**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

6. **Redeploy with Production Settings**
   ```bash
   vercel --prod
   ```

### Option B: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   cd frontend
   netlify init
   ```

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Set Environment Variables**
   ```bash
   netlify env:set VITE_API_URL "https://your-backend-url.com/api"
   ```

6. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option C: Cloudflare Pages

1. **Login to Cloudflare**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)

2. **Create New Project**
   - Connect GitHub repository
   - Select frontend directory

3. **Configure Build**
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **Set Environment Variables**
   - Add variables from `.env.production.example`

5. **Deploy**
   - Click "Save and Deploy"

---

## SSL Certificate Setup

### Option 1: Let's Encrypt (Free, Recommended for Self-Hosted)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.vibeholidays.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

### Option 2: Cloudflare SSL (Free, Easy)

1. Add your domain to Cloudflare
2. Update nameservers at your domain registrar
3. Enable "Full (strict)" SSL mode in Cloudflare dashboard
4. SSL is automatically provisioned

### Option 3: Hosting Provider SSL

Most hosting providers (Heroku, Vercel, Netlify) provide free SSL certificates automatically.

---

## Environment Variables

### Backend Environment Variables

Create `.env` file in backend directory with these variables:

```bash
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-strong-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=admin@vibeholidays.com
FRONTEND_URL=https://vibeholidays.com

# Optional but recommended
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
FORCE_HTTPS=true
```

### Frontend Environment Variables

Create `.env.production` file in frontend directory:

```bash
VITE_API_URL=https://api.vibeholidays.com/api
VITE_APP_NAME=Vibe Holidays
VITE_CONTACT_EMAIL=info@vibeholidays.com
VITE_CONTACT_PHONE=+1-234-567-8900
```

### Generating Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32
```

---

## Post-Deployment Verification

### Backend Health Check

```bash
# Test health endpoint
curl https://api.vibeholidays.com/health

# Expected response:
# {"status":"ok","message":"Vibe Holidays API is running"}
```

### API Endpoint Tests

```bash
# Test packages endpoint
curl https://api.vibeholidays.com/api/packages

# Test authentication
curl -X POST https://api.vibeholidays.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### Frontend Verification

1. Visit your production URL
2. Check all pages load correctly
3. Test booking form submission
4. Test inquiry form submission
5. Test admin login
6. Verify images load properly
7. Test responsive design on mobile

### SSL Verification

```bash
# Check SSL certificate
curl -vI https://vibeholidays.com 2>&1 | grep -i "SSL"

# Or use online tool:
# https://www.ssllabs.com/ssltest/
```

### Performance Testing

```bash
# Test page load speed
curl -w "@curl-format.txt" -o /dev/null -s https://vibeholidays.com

# Use online tools:
# - Google PageSpeed Insights
# - GTmetrix
# - WebPageTest
```

---

## Monitoring and Maintenance

### Application Monitoring

1. **Error Tracking**
   - Set up Sentry for error tracking
   - Configure alerts for critical errors

2. **Uptime Monitoring**
   - Use UptimeRobot or Pingdom
   - Monitor both frontend and backend
   - Set up email/SMS alerts

3. **Performance Monitoring**
   - Use Google Analytics for user metrics
   - Monitor API response times
   - Track database query performance

### Log Management

```bash
# View PM2 logs (if using PM2)
pm2 logs vibe-holidays-api

# View Heroku logs
heroku logs --tail --app vibe-holidays-api

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backups

**MongoDB Atlas:**
- Automatic backups enabled by default
- Configure backup schedule in Atlas dashboard
- Test restore procedure regularly

**Self-Hosted:**
```bash
# Create backup
mongodump --uri="mongodb://..." --out=/backups/$(date +%Y%m%d)

# Restore backup
mongorestore --uri="mongodb://..." /backups/20240115
```

### Regular Maintenance Tasks

- [ ] Weekly: Review error logs
- [ ] Weekly: Check uptime reports
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review and rotate secrets
- [ ] Monthly: Database performance review
- [ ] Quarterly: Security audit
- [ ] Quarterly: Backup restore test

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Fails

**Symptoms:** Backend crashes on startup, "MongoDB connection error"

**Solutions:**
- Verify MongoDB URI is correct
- Check network access whitelist in MongoDB Atlas
- Ensure database user has correct permissions
- Test connection string locally

#### 2. CORS Errors

**Symptoms:** Frontend can't connect to backend, "CORS policy" errors in browser console

**Solutions:**
- Verify `FRONTEND_URL` environment variable matches your frontend domain
- Check CORS middleware configuration
- Ensure protocol (http/https) matches
- Clear browser cache

#### 3. Email Not Sending

**Symptoms:** Bookings created but no emails received

**Solutions:**
- Verify email credentials are correct
- For Gmail: Use App Password, not regular password
- Check email service logs
- Test email configuration with a simple test script
- Verify firewall allows outbound SMTP connections

#### 4. 502 Bad Gateway

**Symptoms:** Nginx returns 502 error

**Solutions:**
- Check if backend process is running: `pm2 status`
- Verify backend port matches Nginx configuration
- Check backend logs for errors
- Restart backend: `pm2 restart vibe-holidays-api`

#### 5. Images Not Loading

**Symptoms:** Broken image links on frontend

**Solutions:**
- Verify uploads directory exists and has correct permissions
- Check static file serving in Express configuration
- Ensure image URLs are absolute, not relative
- Verify CORS allows image requests

#### 6. High Memory Usage

**Symptoms:** Server crashes or becomes slow

**Solutions:**
- Check for memory leaks in application code
- Increase server memory allocation
- Implement connection pooling for database
- Add caching layer (Redis)
- Optimize database queries

### Getting Help

- Check application logs first
- Review this documentation
- Search GitHub issues
- Contact hosting provider support
- Review MongoDB Atlas documentation
- Check framework documentation (Express, React, Vite)

---

## Security Best Practices

1. **Never commit secrets to version control**
   - Use `.env` files (in `.gitignore`)
   - Use environment variables in hosting platforms

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use strong passwords and secrets**
   - Minimum 32 characters for JWT secrets
   - Use password managers

4. **Enable HTTPS everywhere**
   - Force HTTPS redirects
   - Use HSTS headers

5. **Regular security audits**
   - Review access logs
   - Monitor for suspicious activity
   - Keep software updated

6. **Backup regularly**
   - Automated database backups
   - Test restore procedures
   - Store backups securely

---

## Rollback Procedure

If deployment fails or issues arise:

### Backend Rollback

```bash
# Heroku
heroku rollback

# PM2
pm2 stop vibe-holidays-api
git checkout previous-stable-commit
npm install
npm run build
pm2 restart vibe-holidays-api
```

### Frontend Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

---

## Support and Resources

- **Documentation:** This file
- **Repository:** [GitHub Repository URL]
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Heroku:** https://devcenter.heroku.com
- **Vercel:** https://vercel.com/docs
- **Let's Encrypt:** https://letsencrypt.org/docs

---

## Deployment Checklist Summary

- [ ] Database configured and accessible
- [ ] Backend deployed and health check passing
- [ ] Frontend deployed and accessible
- [ ] SSL certificate installed and working
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Email service working
- [ ] All forms tested and working
- [ ] Admin dashboard accessible
- [ ] Monitoring and logging set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team notified of deployment

---

**Last Updated:** January 2026
**Version:** 1.0.0
