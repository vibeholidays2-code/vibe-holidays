# 🌐 Custom Domain Setup - www.vibesholidays.in

## ✅ What's Been Updated

All URLs in your codebase have been updated from `vibe-holidays-red.vercel.app` to `www.vibesholidays.in`

### Files Updated:
1. ✅ `frontend/public/sitemap.xml` - All URLs updated
2. ✅ `frontend/src/utils/generateSitemap.ts` - Base URL updated
3. ✅ `frontend/src/utils/structuredData.ts` - Schema URLs updated
4. ✅ `frontend/src/components/SEO.tsx` - Meta tags updated

---

## 🚀 How to Connect Your Domain to Vercel

### Step 1: Add Domain in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project: **vibe-holidays-red**
3. Click **Settings** tab
4. Click **Domains** in left sidebar
5. Click **Add Domain**
6. Enter: `www.vibesholidays.in`
7. Click **Add**

### Step 2: Configure DNS Records

Vercel will show you the DNS records you need to add. You'll need to add these in your domain registrar (where you bought vibesholidays.in).

**Option A: If you want www.vibesholidays.in (Recommended)**

Add a CNAME record:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**Option B: If you want both www and non-www**

Add these records:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: Add Domain Records in Your Registrar

**Where you bought your domain** (GoDaddy, Namecheap, Google Domains, etc.):

1. Login to your domain registrar
2. Find DNS Management / DNS Settings
3. Add the CNAME record shown above
4. Save changes

**DNS Propagation**: Takes 5 minutes to 48 hours (usually 15-30 minutes)

---

## 🔍 Verify Domain Setup

### Check DNS Propagation

Use these tools to check if DNS is working:
- https://dnschecker.org/
- Enter: `www.vibesholidays.in`
- Should show Vercel's IP or CNAME

### Test Your Domain

After DNS propagates:
1. Visit: https://www.vibesholidays.in
2. Should load your website
3. Check SSL certificate (should show green padlock)

---

## 📋 After Domain is Connected

### 1. Update Google Search Console

**Add New Property**:
1. Go to https://search.google.com/search-console/
2. Click **Add Property**
3. Enter: `https://www.vibesholidays.in`
4. Verify ownership (HTML tag method - already in your code)
5. Submit sitemap: `https://www.vibesholidays.in/sitemap.xml`

**Keep Old Property**:
- Don't delete the Vercel URL property yet
- Google will transfer data over time
- You can set up a 301 redirect later

### 2. Update Google Analytics

**Add New Data Stream**:
1. Go to https://analytics.google.com/
2. Admin → Data Streams
3. Click your web stream
4. Update URL to: `https://www.vibesholidays.in`

Or create a new stream for the custom domain.

### 3. Update Social Media Links

Update your website URL on:
- Facebook page
- Instagram bio
- Twitter profile
- LinkedIn company page
- Any other social profiles

### 4. Update Business Listings

Update on:
- Google My Business
- Bing Places
- Travel directories
- Review sites (TripAdvisor, etc.)

---

## 🔄 Set Up Redirects (Optional but Recommended)

### Redirect Vercel URL to Custom Domain

In Vercel dashboard:
1. Go to Settings → Domains
2. Find `vibe-holidays-red.vercel.app`
3. Click the three dots (...)
4. Select **Redirect to www.vibesholidays.in**

This ensures anyone visiting the old URL gets redirected to your custom domain.

---

## 📧 Update Email References

### Update in Code (If Needed)

Check these files for any hardcoded URLs:
- Email templates
- Contact forms
- API responses
- Error messages

### Update Documentation

Update URLs in:
- README files
- Documentation
- Deployment guides
- Any shared links

---

## 🎯 SEO Considerations

### 1. Canonical URLs

Your SEO component already handles this, but verify:
- Each page has canonical URL pointing to www.vibesholidays.in
- No mixed URLs (some pages with Vercel, some with custom domain)

### 2. Sitemap

✅ Already updated to use www.vibesholidays.in

Submit to:
- Google Search Console
- Bing Webmaster Tools

### 3. Robots.txt

Create/update `frontend/public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://www.vibesholidays.in/sitemap.xml
```

### 4. 301 Redirects

Vercel automatically handles:
- HTTP → HTTPS redirect
- Non-www → www redirect (if configured)
- Old Vercel URL → Custom domain (if configured)

---

## 🔐 SSL Certificate

### Automatic SSL

Vercel automatically provides:
- Free SSL certificate (Let's Encrypt)
- Auto-renewal
- HTTPS enforcement

### Verify SSL

After domain connects:
1. Visit https://www.vibesholidays.in
2. Click padlock icon in browser
3. Should show "Connection is secure"
4. Certificate should be valid

---

## 📊 Monitor After Domain Change

### Week 1: Check Daily

- [ ] Domain loads correctly
- [ ] SSL certificate working
- [ ] All pages accessible
- [ ] Images loading
- [ ] Forms working
- [ ] Google Analytics tracking

### Week 2-4: Check Weekly

- [ ] Search Console coverage
- [ ] Google Analytics traffic
- [ ] No broken links
- [ ] Social media links updated
- [ ] Email links working

---

## 🚨 Troubleshooting

### Domain Not Loading

**Check**:
1. DNS records added correctly
2. Wait for DNS propagation (up to 48 hours)
3. Clear browser cache
4. Try incognito mode
5. Check dnschecker.org

**Common Issues**:
- Wrong CNAME value
- DNS not propagated yet
- Cloudflare proxy enabled (should be DNS only)
- TTL too high (set to 3600 or Auto)

### SSL Certificate Error

**Solutions**:
1. Wait 24 hours for certificate generation
2. Check domain is verified in Vercel
3. Ensure DNS is pointing to Vercel
4. Contact Vercel support if persists

### Old URL Still Showing

**Solutions**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Clear DNS cache: `ipconfig /flushdns` (Windows)
3. Try different browser
4. Check if redirect is set up in Vercel

### Google Search Console Not Verifying

**Solutions**:
1. Ensure HTML meta tag is in your code
2. Deploy latest changes to Vercel
3. Wait for deployment to complete
4. Try verification again
5. Use alternative verification method (DNS TXT record)

---

## 📝 Checklist: Domain Setup Complete

### Vercel Setup
- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured
- [ ] Domain verified and connected
- [ ] SSL certificate active
- [ ] Redirect from Vercel URL set up

### DNS Configuration
- [ ] CNAME record added
- [ ] DNS propagated (check dnschecker.org)
- [ ] Domain loads correctly
- [ ] HTTPS working

### SEO Updates
- [ ] Google Search Console property added
- [ ] Sitemap submitted
- [ ] Google Analytics updated
- [ ] Robots.txt created/updated
- [ ] Canonical URLs verified

### External Updates
- [ ] Social media links updated
- [ ] Google My Business updated
- [ ] Business listings updated
- [ ] Email signatures updated
- [ ] Marketing materials updated

### Testing
- [ ] Homepage loads
- [ ] All pages accessible
- [ ] Images loading
- [ ] Forms working
- [ ] Booking system working
- [ ] Mobile responsive
- [ ] SSL certificate valid

---

## 🎉 Your Custom Domain URLs

### Main URLs
- **Homepage**: https://www.vibesholidays.in/
- **Packages**: https://www.vibesholidays.in/packages
- **Gallery**: https://www.vibesholidays.in/gallery
- **About**: https://www.vibesholidays.in/about
- **Contact**: https://www.vibesholidays.in/contact

### Admin URLs
- **Admin Login**: https://www.vibesholidays.in/admin/login
- **Admin Dashboard**: https://www.vibesholidays.in/admin/dashboard

### SEO URLs
- **Sitemap**: https://www.vibesholidays.in/sitemap.xml
- **Robots**: https://www.vibesholidays.in/robots.txt

---

## 📞 Support

### Vercel Support
- Dashboard: https://vercel.com/support
- Documentation: https://vercel.com/docs/concepts/projects/domains

### Domain Registrar Support
- Contact your domain provider (where you bought vibesholidays.in)
- They can help with DNS configuration

### Need Help?
- Check Vercel documentation
- Contact Vercel support
- Check domain registrar help center

---

## 🚀 Next Steps After Domain Setup

1. **Deploy Changes**:
   ```bash
   git add .
   git commit -m "Update URLs to custom domain"
   git push
   ```

2. **Verify Deployment**:
   - Check Vercel dashboard
   - Visit www.vibesholidays.in
   - Test all pages

3. **Submit to Search Engines**:
   - Google Search Console
   - Bing Webmaster Tools
   - Submit sitemap

4. **Monitor**:
   - Google Analytics
   - Search Console
   - Website uptime

---

**Your website is ready for your custom domain!** 🎉

Once you add the DNS records, your site will be live at www.vibesholidays.in within 15-30 minutes (up to 48 hours maximum).

