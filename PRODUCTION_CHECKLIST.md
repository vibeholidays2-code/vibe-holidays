# Production Deployment Checklist

Use this checklist to ensure all aspects of production deployment are properly configured.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (backend: `npm test`, frontend: `npm test`)
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] ESLint warnings resolved
- [ ] Code reviewed and approved
- [ ] Latest changes merged to main branch
- [ ] Version number updated in package.json

### Security
- [ ] Strong JWT secret generated (minimum 32 characters)
- [ ] Database credentials secured and not in version control
- [ ] Email credentials secured (using app passwords, not regular passwords)
- [ ] All `.env` files in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Security headers configured (Helmet.js)
- [ ] CORS restricted to production domain only
- [ ] Rate limiting enabled on all endpoints
- [ ] Input sanitization active
- [ ] SQL injection protection (using Mongoose parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF protection for state-changing operations

### Performance
- [ ] Images optimized and compressed
- [ ] Code splitting implemented
- [ ] Lazy loading configured for images
- [ ] Bundle size analyzed (`npm run build` in frontend)
- [ ] Compression middleware enabled (gzip)
- [ ] Database indexes created for frequently queried fields
- [ ] Caching strategy implemented where appropriate

### Database
- [ ] Production database created (MongoDB Atlas or self-hosted)
- [ ] Database user created with appropriate permissions
- [ ] Network access configured (IP whitelist)
- [ ] Connection string tested
- [ ] Indexes created for performance
- [ ] Backup strategy configured
- [ ] Data migration plan (if migrating from dev/staging)

### Email Service
- [ ] Email service account created (Gmail, SendGrid, AWS SES)
- [ ] SMTP credentials obtained
- [ ] Email templates tested
- [ ] Sender email verified
- [ ] Admin email configured
- [ ] Email sending tested in staging environment

## Deployment

### Backend Deployment
- [ ] Hosting platform selected (Heroku, DigitalOcean, AWS, Railway)
- [ ] Backend application deployed
- [ ] Environment variables configured
- [ ] Health check endpoint responding (`/health`)
- [ ] Database connection successful
- [ ] API endpoints accessible
- [ ] Logs accessible and monitored

### Frontend Deployment
- [ ] Hosting platform selected (Vercel, Netlify, Cloudflare Pages)
- [ ] Frontend application deployed
- [ ] Environment variables configured
- [ ] API URL pointing to production backend
- [ ] Build successful
- [ ] All pages loading correctly
- [ ] Assets (images, fonts) loading correctly

### Domain and SSL
- [ ] Domain name registered
- [ ] DNS configured:
  - [ ] A record for root domain
  - [ ] CNAME for www subdomain
  - [ ] A/CNAME for API subdomain
- [ ] SSL certificate installed
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate auto-renewal configured
- [ ] Mixed content warnings resolved

### CORS Configuration
- [ ] `FRONTEND_URL` environment variable set to production domain
- [ ] CORS middleware configured to allow production domain only
- [ ] Credentials enabled in CORS if needed
- [ ] Preflight requests handled correctly

## Post-Deployment Verification

### Functional Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Package browsing works
- [ ] Package detail pages load
- [ ] Search functionality works
- [ ] Filtering works
- [ ] Booking form submits successfully
- [ ] Booking confirmation email received
- [ ] Inquiry form submits successfully
- [ ] Inquiry confirmation email received
- [ ] Contact form works
- [ ] Gallery page loads and images display
- [ ] Admin login works
- [ ] Admin dashboard displays data
- [ ] Admin can create/edit/delete packages
- [ ] Admin can view bookings
- [ ] Admin can view inquiries
- [ ] Admin can upload gallery images
- [ ] Admin logout works

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Responsive Design Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] Lighthouse score > 90 (Best Practices)
- [ ] Lighthouse score > 90 (SEO)

### SEO Verification
- [ ] Meta tags present on all pages
- [ ] Open Graph tags configured
- [ ] Sitemap.xml accessible
- [ ] Robots.txt configured
- [ ] Structured data (JSON-LD) implemented
- [ ] Canonical URLs set
- [ ] 404 page configured
- [ ] Google Search Console configured
- [ ] Google Analytics configured (if applicable)

### Security Testing
- [ ] HTTPS working on all pages
- [ ] Security headers present (check with securityheaders.com)
- [ ] No mixed content warnings
- [ ] XSS protection verified
- [ ] CSRF protection verified
- [ ] Rate limiting working (test with multiple requests)
- [ ] SQL injection protection verified
- [ ] File upload restrictions working
- [ ] Authentication working correctly
- [ ] Authorization working correctly (admin routes protected)

### Email Testing
- [ ] Booking confirmation email received by customer
- [ ] Booking notification email received by admin
- [ ] Inquiry acknowledgment email received by customer
- [ ] Inquiry notification email received by admin
- [ ] Contact form email received by admin
- [ ] Email formatting correct (HTML rendering)
- [ ] Email links working
- [ ] Unsubscribe link working (if applicable)

## Monitoring and Maintenance

### Monitoring Setup
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom)
- [ ] Error tracking configured (Sentry, Rollbar)
- [ ] Log aggregation configured
- [ ] Performance monitoring configured
- [ ] Database monitoring configured
- [ ] Alert notifications configured (email, SMS, Slack)

### Backup Configuration
- [ ] Database backup schedule configured
- [ ] Backup retention policy set
- [ ] Backup storage location configured
- [ ] Backup restore procedure tested
- [ ] File upload backup configured (if applicable)

### Documentation
- [ ] Deployment documentation complete
- [ ] Environment variables documented
- [ ] API documentation updated
- [ ] Admin user guide created
- [ ] Troubleshooting guide created
- [ ] Rollback procedure documented

### Team Preparation
- [ ] Team trained on admin dashboard
- [ ] Support email configured
- [ ] Escalation procedures defined
- [ ] On-call schedule established (if applicable)
- [ ] Access credentials shared securely

## Go-Live

### Final Checks
- [ ] All checklist items above completed
- [ ] Stakeholders notified of go-live time
- [ ] Maintenance window scheduled (if needed)
- [ ] Rollback plan ready
- [ ] Support team on standby

### Launch
- [ ] DNS switched to production
- [ ] Verify site accessible at production domain
- [ ] Monitor logs for errors
- [ ] Monitor performance metrics
- [ ] Monitor user activity
- [ ] Verify all critical flows working

### Post-Launch (First 24 Hours)
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Monitor uptime
- [ ] Check email delivery
- [ ] Review user feedback
- [ ] Address any critical issues immediately

### Post-Launch (First Week)
- [ ] Review analytics data
- [ ] Review error logs
- [ ] Review performance metrics
- [ ] Gather user feedback
- [ ] Plan improvements based on feedback
- [ ] Update documentation based on learnings

## Ongoing Maintenance

### Daily
- [ ] Check uptime monitoring
- [ ] Review error logs
- [ ] Monitor performance metrics

### Weekly
- [ ] Review analytics
- [ ] Check backup status
- [ ] Review security logs
- [ ] Update content as needed

### Monthly
- [ ] Update dependencies (`npm audit`, `npm update`)
- [ ] Review and rotate secrets (if policy requires)
- [ ] Database performance review
- [ ] Review and optimize slow queries
- [ ] Review disk space usage
- [ ] Review bandwidth usage

### Quarterly
- [ ] Security audit
- [ ] Performance audit
- [ ] Backup restore test
- [ ] Disaster recovery drill
- [ ] Review and update documentation
- [ ] Review and update monitoring alerts

### Annually
- [ ] SSL certificate renewal (if not auto-renewed)
- [ ] Domain renewal
- [ ] Comprehensive security audit
- [ ] Architecture review
- [ ] Scalability assessment

---

## Emergency Contacts

**Hosting Provider Support:**
- Backend: [Provider] - [Support URL/Phone]
- Frontend: [Provider] - [Support URL/Phone]

**Database Provider:**
- MongoDB Atlas: https://support.mongodb.com

**Domain Registrar:**
- [Registrar Name] - [Support URL/Phone]

**Email Service:**
- [Service Name] - [Support URL/Phone]

**Team Contacts:**
- Technical Lead: [Name] - [Email/Phone]
- DevOps: [Name] - [Email/Phone]
- Support: [Email]

---

## Notes

Use this space to document any deployment-specific notes, issues encountered, or lessons learned:

```
[Add notes here]
```

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** _______________
**Sign-off:** _______________
