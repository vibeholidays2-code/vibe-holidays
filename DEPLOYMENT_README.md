# Deployment Documentation

This directory contains comprehensive guides for deploying the Vibe Holidays website to production.

## 📚 Documentation Index

### Main Deployment Guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide covering all aspects of production deployment

### Configuration Guides
- **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** - Step-by-step checklist for deployment preparation
- **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)** - MongoDB production setup (Atlas and self-hosted)
- **[EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md)** - Email service configuration (Gmail, SendGrid, AWS SES)
- **[SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md)** - SSL certificate setup for HTTPS

### Environment Configuration
- **[backend/.env.production.example](./backend/.env.production.example)** - Backend production environment variables template
- **[frontend/.env.production.example](./frontend/.env.production.example)** - Frontend production environment variables template

## 🚀 Quick Start

### 1. Pre-Deployment Preparation

Before deploying, complete these steps:

1. **Review the Production Checklist**
   ```bash
   # Open and review
   cat PRODUCTION_CHECKLIST.md
   ```

2. **Set Up Production Database**
   - Follow [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)
   - Recommended: MongoDB Atlas
   - Create production database and user
   - Configure network access
   - Create indexes for performance

3. **Configure Email Service**
   - Follow [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md)
   - Recommended: SendGrid for production
   - Verify sender domain
   - Test email sending

4. **Prepare Environment Variables**
   - Copy `.env.production.example` files
   - Fill in actual production values
   - Generate strong secrets:
     ```bash
     openssl rand -base64 32
     ```

### 2. Backend Deployment

Choose your hosting platform:

#### Option A: Heroku (Easiest)
```bash
cd backend
heroku create vibe-holidays-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-connection-string"
# ... set other environment variables
git push heroku main
```

#### Option B: DigitalOcean App Platform
1. Connect GitHub repository
2. Select backend directory
3. Configure environment variables
4. Deploy

#### Option C: AWS EC2 (Most Control)
1. Launch EC2 instance
2. Install Node.js and dependencies
3. Clone repository
4. Configure environment
5. Set up PM2 and Nginx
6. Configure SSL with Let's Encrypt

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### 3. Frontend Deployment

Choose your hosting platform:

#### Option A: Vercel (Recommended)
```bash
cd frontend
vercel
# Follow prompts
vercel --prod
```

#### Option B: Netlify
```bash
cd frontend
netlify init
netlify deploy --prod
```

#### Option C: Cloudflare Pages
1. Connect GitHub repository
2. Configure build settings
3. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### 4. SSL Certificate Setup

Follow [SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md):

- **Easiest:** Cloudflare SSL (free, automatic)
- **Self-Hosted:** Let's Encrypt with Certbot
- **Hosting Provider:** Automatic SSL (Heroku, Vercel, Netlify)

### 5. Post-Deployment Verification

Use the checklist in [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md):

- [ ] Health check endpoint responding
- [ ] All pages loading correctly
- [ ] Forms submitting successfully
- [ ] Emails sending correctly
- [ ] Admin dashboard accessible
- [ ] SSL certificate working
- [ ] Performance metrics acceptable

## 📋 Deployment Checklist Summary

### Pre-Deployment
- [ ] All tests passing
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Database configured
- [ ] Email service configured
- [ ] Environment variables prepared

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] CORS configured

### Post-Deployment
- [ ] Functional testing completed
- [ ] Cross-browser testing completed
- [ ] Performance testing completed
- [ ] SEO verification completed
- [ ] Monitoring configured
- [ ] Backups configured

## 🔧 Configuration Files

### Backend Environment Variables

Required variables for production:

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-strong-secret

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-api-key
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=admin@vibeholidays.com

# CORS
FRONTEND_URL=https://vibeholidays.com
```

See [backend/.env.production.example](./backend/.env.production.example) for complete list.

### Frontend Environment Variables

Required variables for production:

```bash
# API
VITE_API_URL=https://api.vibeholidays.com/api

# Application
VITE_APP_NAME=Vibe Holidays
VITE_CONTACT_EMAIL=info@vibeholidays.com
VITE_CONTACT_PHONE=+1-234-567-8900
```

See [frontend/.env.production.example](./frontend/.env.production.example) for complete list.

## 🛠️ Recommended Technology Stack

### Hosting

**Backend:**
- **Recommended:** Heroku or DigitalOcean App Platform
- **Alternative:** AWS EC2, Railway, Render

**Frontend:**
- **Recommended:** Vercel
- **Alternative:** Netlify, Cloudflare Pages

### Database
- **Recommended:** MongoDB Atlas (managed)
- **Alternative:** Self-hosted MongoDB

### Email Service
- **Recommended:** SendGrid
- **Alternative:** AWS SES, Mailgun

### SSL Certificate
- **Recommended:** Cloudflare SSL (free, automatic)
- **Alternative:** Let's Encrypt, hosting provider SSL

### Monitoring
- **Uptime:** UptimeRobot, Pingdom
- **Errors:** Sentry, Rollbar
- **Analytics:** Google Analytics

## 📊 Cost Estimates

### Free Tier (Development/Small Production)
- **Hosting:** Heroku Free + Vercel Free = $0/month
- **Database:** MongoDB Atlas M0 = $0/month
- **Email:** SendGrid Free (100 emails/day) = $0/month
- **SSL:** Let's Encrypt or Cloudflare = $0/month
- **Total:** $0/month

### Small Production
- **Hosting:** Heroku Hobby ($7) + Vercel Pro ($20) = $27/month
- **Database:** MongoDB Atlas M10 = $57/month
- **Email:** SendGrid Essentials (40k emails) = $15/month
- **Domain:** $12/year
- **Total:** ~$100/month

### Medium Production
- **Hosting:** DigitalOcean App Platform ($12) + Vercel Pro ($20) = $32/month
- **Database:** MongoDB Atlas M20 = $115/month
- **Email:** SendGrid Pro (100k emails) = $90/month
- **CDN:** Cloudflare Pro = $20/month
- **Monitoring:** Sentry Team = $26/month
- **Total:** ~$283/month

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Database credentials secured
- [ ] HTTPS enforced everywhere
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] Input sanitization active
- [ ] Security headers configured (Helmet.js)
- [ ] No secrets in version control
- [ ] Regular security updates
- [ ] Backup strategy implemented

## 📈 Performance Targets

- **Page Load Time:** < 3 seconds
- **Time to Interactive:** < 5 seconds
- **First Contentful Paint:** < 1.5 seconds
- **Lighthouse Score:** > 90 (all categories)
- **API Response Time:** < 200ms (average)
- **Uptime:** > 99.9%

## 🆘 Support Resources

### Documentation
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Heroku Dev Center](https://devcenter.heroku.com)
- [Vercel Docs](https://vercel.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com)
- [Let's Encrypt Docs](https://letsencrypt.org/docs)

### Tools
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Security Headers Check](https://securityheaders.com)
- [GTmetrix](https://gtmetrix.com)

### Community
- [Stack Overflow](https://stackoverflow.com)
- [MongoDB Community](https://www.mongodb.com/community)
- [Node.js Discord](https://discord.gg/nodejs)

## 🔄 Maintenance Schedule

### Daily
- Monitor uptime and error logs
- Check email delivery

### Weekly
- Review analytics
- Check backup status
- Review security logs

### Monthly
- Update dependencies
- Review performance metrics
- Database optimization

### Quarterly
- Security audit
- Backup restore test
- Architecture review

## 📝 Notes

- Always test in staging environment before production
- Keep documentation updated
- Document any custom configurations
- Maintain rollback procedures
- Regular team training on deployment process

## 🎯 Next Steps

1. **Read the main deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Complete the checklist:** [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
3. **Set up database:** [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)
4. **Configure email:** [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md)
5. **Set up SSL:** [SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md)
6. **Deploy and verify**

---

**Questions?** Review the troubleshooting sections in each guide or contact the development team.

**Last Updated:** January 2026
**Version:** 1.0.0
