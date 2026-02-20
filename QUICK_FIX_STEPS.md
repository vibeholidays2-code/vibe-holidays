# Quick Fix for MongoDB Connection - 3 Easy Steps

## The Easiest Solution: Use MongoDB Atlas Website

**This is the fastest way and requires NO technical fixes:**

1. Open browser and go to: https://cloud.mongodb.com/
2. Login with your MongoDB credentials
3. Click "Browse Collections"
4. Select database: `vibes-holidays` → collection: `packages`
5. In the filter box, type: `{"destination": {"$regex": "bali", "$options": "i"}}`
6. Click "Find" - you'll see all Bali packages
7. Delete each old Bali package (click trash icon)
8. Click "INSERT DOCUMENT" button (green button at top)
9. Switch to `{}` JSON view
10. Open file `BALI_LUXURY_PACKAGE_DATA.json` from your project
11. Copy ALL the content
12. Paste into MongoDB Atlas
13. Click "Insert"

**Done!** The new Bali package is now live on your website.

---

## Alternative: Fix DNS (If you want to run scripts locally)

### Step 1: Change DNS to Google DNS

Run PowerShell as Administrator and execute:

```powershell
# Get your Wi-Fi interface name
Get-NetAdapter | Where-Object {$_.Status -eq "Up"}

# Set Google DNS (replace "Wi-Fi" with your interface name if different)
Set-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -ServerAddresses ("8.8.8.8","8.8.4.4")

# Flush DNS cache
ipconfig /flushdns
```

### Step 2: Test Connection

```powershell
node backend/add-bali-direct.js
```

### Step 3: If Still Not Working

Your ISP might be blocking MongoDB. Use one of these:
- **Mobile Hotspot**: Connect to your phone's hotspot
- **VPN**: Use a free VPN like ProtonVPN
- **MongoDB Compass**: Download from https://www.mongodb.com/try/download/compass

---

## Why MongoDB Atlas Website is Best

✅ No network issues
✅ No DNS problems  
✅ No firewall issues
✅ Works from any computer
✅ Takes 2 minutes
✅ 100% reliable

## Current Status

- ✅ Frontend working: http://localhost:5173/
- ✅ Production backend working
- ❌ Local MongoDB connection blocked by network
- ✅ Solution: Use MongoDB Atlas website to add package

You don't need to fix the local connection to add the Bali package!
