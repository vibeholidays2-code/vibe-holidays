# ⚡ Quick Domain Setup - www.vibesholidays.in

## ✅ Code Updated - Ready to Deploy!

All URLs changed from `vibe-holidays-red.vercel.app` to `www.vibesholidays.in`

---

## 🚀 3-Step Setup (30 minutes)

### Step 1: Deploy Code (2 minutes)

```bash
git add .
git commit -m "Update to custom domain"
git push
```

Wait for Vercel to deploy (2-3 minutes)

---

### Step 2: Connect Domain in Vercel (5 minutes)

1. Go to: https://vercel.com/dashboard
2. Select: **vibe-holidays-red** project
3. Click: **Settings** → **Domains**
4. Add: `www.vibesholidays.in`
5. Vercel shows DNS records to add

---

### Step 3: Add DNS Record (5 minutes + wait time)

**In your domain registrar** (where you bought vibesholidays.in):

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Wait**: 15-30 minutes for DNS to propagate

---

## ✅ Verify It Works

After 30 minutes, visit: **https://www.vibesholidays.in**

Should see:
- ✅ Your website
- ✅ Green padlock (SSL)
- ✅ All pages work

---

## 📊 Then Update Google

### Google Search Console (10 min)
1. Add property: `https://www.vibesholidays.in`
2. Verify (HTML tag already in code)
3. Submit sitemap: `https://www.vibesholidays.in/sitemap.xml`

### Google Analytics (5 min)
1. Admin → Data Streams
2. Update URL to: `https://www.vibesholidays.in`

---

## 🎯 That's It!

Your custom domain will be live in 30 minutes!

**Full Guide**: See `CUSTOM_DOMAIN_SETUP.md` for detailed instructions.

