# SSL Certificate Setup Guide

This guide covers SSL/TLS certificate setup for the Vibe Holidays website to enable HTTPS.

## Why SSL is Important

- **Security:** Encrypts data between client and server
- **Trust:** Browsers show "Secure" indicator
- **SEO:** Google ranks HTTPS sites higher
- **Required:** Modern browsers warn users about non-HTTPS sites
- **Compliance:** Required for handling sensitive data

## SSL Options

### Option 1: Let's Encrypt (Free, Self-Hosted)

**Best for:** Self-hosted servers (AWS EC2, DigitalOcean Droplet, VPS)

**Pros:**
- Completely free
- Automatic renewal
- Trusted by all browsers
- Easy to set up with Certbot

**Cons:**
- Requires server access
- 90-day certificate validity (auto-renewed)

#### Setup Steps

1. **Install Certbot**

   For Ubuntu/Debian:
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

   For CentOS/RHEL:
   ```bash
   sudo yum install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**

   For Nginx:
   ```bash
   sudo certbot --nginx -d vibeholidays.com -d www.vibeholidays.com -d api.vibeholidays.com
   ```

   For Apache:
   ```bash
   sudo certbot --apache -d vibeholidays.com -d www.vibeholidays.com -d api.vibeholidays.com
   ```

   Follow the prompts:
   - Enter email address for renewal notifications
   - Agree to Terms of Service
   - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

3. **Verify Installation**

   ```bash
   sudo certbot certificates
   ```

   Visit your site: `https://vibeholidays.com`

4. **Test Auto-Renewal**

   ```bash
   sudo certbot renew --dry-run
   ```

   Certbot automatically sets up a cron job for renewal.

5. **Manual Renewal (if needed)**

   ```bash
   sudo certbot renew
   ```

#### Nginx Configuration Example

After Certbot setup, your Nginx config should look like:

```nginx
server {
    listen 80;
    server_name vibeholidays.com www.vibeholidays.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vibeholidays.com www.vibeholidays.com;

    ssl_certificate /etc/letsencrypt/live/vibeholidays.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vibeholidays.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Your application configuration
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.vibeholidays.com;

    ssl_certificate /etc/letsencrypt/live/vibeholidays.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vibeholidays.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

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

---

### Option 2: Cloudflare SSL (Free, Easy)

**Best for:** Any hosting setup, easiest option

**Pros:**
- Completely free
- Automatic setup
- DDoS protection included
- CDN included
- No server configuration needed

**Cons:**
- Requires using Cloudflare nameservers
- Adds Cloudflare as intermediary

#### Setup Steps

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://www.cloudflare.com)
   - Sign up for free account

2. **Add Your Domain**
   - Click "Add a Site"
   - Enter your domain: `vibeholidays.com`
   - Choose Free plan

3. **Update DNS Records**
   
   Cloudflare will scan your existing DNS records. Verify and add:
   
   ```
   Type    Name    Content                 Proxy Status
   A       @       your-server-ip          Proxied (orange cloud)
   A       www     your-server-ip          Proxied (orange cloud)
   A       api     your-backend-ip         Proxied (orange cloud)
   ```

4. **Update Nameservers**
   
   Cloudflare will provide nameservers like:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
   
   Update these at your domain registrar (GoDaddy, Namecheap, etc.)

5. **Configure SSL/TLS**
   
   In Cloudflare dashboard:
   - Go to SSL/TLS → Overview
   - Select "Full (strict)" mode
   - This ensures end-to-end encryption

6. **Enable Additional Security**
   
   - SSL/TLS → Edge Certificates → Enable "Always Use HTTPS"
   - SSL/TLS → Edge Certificates → Enable "Automatic HTTPS Rewrites"
   - SSL/TLS → Edge Certificates → Minimum TLS Version: 1.2

7. **Wait for Propagation**
   
   DNS changes can take 24-48 hours, but usually complete within a few hours.

8. **Verify**
   
   Visit `https://vibeholidays.com` - should show secure connection.

---

### Option 3: Hosting Provider SSL (Free, Automatic)

**Best for:** Heroku, Vercel, Netlify, DigitalOcean App Platform

**Pros:**
- Completely automatic
- No configuration needed
- Included with hosting

**Cons:**
- Tied to specific hosting provider

#### Heroku

SSL is automatic for all apps:
- Custom domains get automatic SSL
- No configuration needed
- Certificates auto-renewed

```bash
# Add custom domain
heroku domains:add vibeholidays.com
heroku domains:add www.vibeholidays.com

# SSL is automatically provisioned
# Update DNS to point to Heroku
```

#### Vercel

SSL is automatic:
- Add custom domain in dashboard
- SSL provisioned automatically
- Update DNS as instructed

#### Netlify

SSL is automatic:
- Add custom domain in dashboard
- SSL provisioned automatically
- Update DNS as instructed

#### DigitalOcean App Platform

SSL is automatic:
- Add custom domain in dashboard
- SSL provisioned automatically
- Update DNS as instructed

---

### Option 4: Commercial SSL Certificate (Paid)

**Best for:** Enterprise requirements, extended validation

**Providers:**
- DigiCert
- Sectigo (formerly Comodo)
- GlobalSign
- GoDaddy

**Pros:**
- Extended validation (EV) available
- Longer validity periods
- Dedicated support
- Warranty included

**Cons:**
- Costs money ($50-$300+/year)
- Manual renewal process
- More complex setup

#### Setup Steps

1. **Purchase Certificate**
   - Choose provider
   - Select certificate type (DV, OV, or EV)
   - Purchase for your domain

2. **Generate CSR (Certificate Signing Request)**

   ```bash
   openssl req -new -newkey rsa:2048 -nodes \
     -keyout vibeholidays.com.key \
     -out vibeholidays.com.csr
   ```

   Fill in details:
   - Country: US
   - State: California
   - City: San Francisco
   - Organization: Vibe Holidays Inc
   - Common Name: vibeholidays.com

3. **Submit CSR to Provider**
   - Paste CSR content into provider's form
   - Complete domain validation (email, DNS, or file)

4. **Download Certificate**
   - Provider will issue certificate
   - Download certificate files

5. **Install Certificate**

   For Nginx:
   ```bash
   sudo cp vibeholidays.com.crt /etc/ssl/certs/
   sudo cp vibeholidays.com.key /etc/ssl/private/
   sudo chmod 600 /etc/ssl/private/vibeholidays.com.key
   ```

   Update Nginx config:
   ```nginx
   ssl_certificate /etc/ssl/certs/vibeholidays.com.crt;
   ssl_certificate_key /etc/ssl/private/vibeholidays.com.key;
   ```

6. **Restart Web Server**
   ```bash
   sudo systemctl restart nginx
   ```

---

## SSL Best Practices

### 1. Use Strong Protocols

Only enable TLS 1.2 and TLS 1.3:

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
```

### 2. Use Strong Ciphers

```nginx
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
```

### 3. Enable HSTS

Force browsers to always use HTTPS:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 4. Enable OCSP Stapling

Improves SSL handshake performance:

```nginx
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/vibeholidays.com/chain.pem;
```

### 5. Redirect HTTP to HTTPS

Always redirect insecure traffic:

```nginx
server {
    listen 80;
    server_name vibeholidays.com www.vibeholidays.com;
    return 301 https://$server_name$request_uri;
}
```

### 6. Test Your SSL Configuration

Use these tools to verify:
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Comprehensive SSL test
- [Security Headers](https://securityheaders.com/) - Check security headers
- [Why No Padlock](https://www.whynopadlock.com/) - Find mixed content issues

Target: A+ rating on SSL Labs

---

## Troubleshooting

### Certificate Not Trusted

**Problem:** Browser shows "Not Secure" or certificate error

**Solutions:**
- Verify certificate is for correct domain
- Check certificate chain is complete
- Ensure certificate hasn't expired
- Clear browser cache

### Mixed Content Warnings

**Problem:** Page loads over HTTPS but some resources use HTTP

**Solutions:**
- Update all resource URLs to use HTTPS or relative URLs
- Check for hardcoded HTTP URLs in code
- Use Content Security Policy to block mixed content
- Check browser console for specific resources

### Certificate Renewal Failed

**Problem:** Let's Encrypt renewal fails

**Solutions:**
- Check Certbot logs: `sudo cat /var/log/letsencrypt/letsencrypt.log`
- Verify domain is accessible from internet
- Check firewall allows port 80 (needed for renewal)
- Manually renew: `sudo certbot renew --force-renewal`

### SSL Handshake Errors

**Problem:** Connection fails during SSL handshake

**Solutions:**
- Check SSL protocols enabled
- Verify cipher suites are compatible
- Check for firewall blocking port 443
- Verify certificate and key match

---

## Monitoring SSL Certificates

### Expiration Monitoring

Set up monitoring to alert before expiration:

1. **Uptime Robot**
   - Add HTTPS monitor
   - Enable SSL certificate expiration alerts

2. **SSL Certificate Checker**
   - Use online tools like SSL Shopper
   - Set up automated checks

3. **Custom Script**
   ```bash
   #!/bin/bash
   # Check SSL expiration
   echo | openssl s_client -servername vibeholidays.com -connect vibeholidays.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

### Automated Renewal Verification

For Let's Encrypt:
```bash
# Add to crontab to test renewal weekly
0 0 * * 0 certbot renew --dry-run
```

---

## Recommended: Cloudflare + Let's Encrypt

For best security and performance, use both:

1. **Let's Encrypt on your server** - Encrypts traffic between server and Cloudflare
2. **Cloudflare SSL** - Encrypts traffic between users and Cloudflare
3. **Cloudflare "Full (strict)" mode** - Ensures end-to-end encryption

This provides:
- End-to-end encryption
- DDoS protection
- CDN benefits
- Free SSL
- Easy management

---

## Quick Reference

### Check Certificate Expiration
```bash
echo | openssl s_client -servername vibeholidays.com -connect vibeholidays.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Test SSL Configuration
```bash
curl -vI https://vibeholidays.com 2>&1 | grep -i ssl
```

### View Certificate Details
```bash
echo | openssl s_client -servername vibeholidays.com -connect vibeholidays.com:443 2>/dev/null | openssl x509 -noout -text
```

### Force HTTPS in Express.js
```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

---

**Recommendation:** Start with Cloudflare SSL for easiest setup, then add Let's Encrypt for full end-to-end encryption if self-hosting.
