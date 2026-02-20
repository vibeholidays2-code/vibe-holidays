# Fix MongoDB Connection Issue

## Problem
Error: `querySrv ECONNREFUSED _mongodb._tcp.cluster0.6c6k7zt.mongodb.net`

This is a DNS resolution issue preventing connection to MongoDB Atlas.

## Solutions (Try in Order)

### Solution 1: Change DNS Settings (Most Effective)

1. **Open Network Settings**
   - Press `Win + R`, type `ncpa.cpl`, press Enter
   - Right-click your active network connection
   - Select "Properties"

2. **Change DNS Servers**
   - Select "Internet Protocol Version 4 (TCP/IPv4)"
   - Click "Properties"
   - Select "Use the following DNS server addresses"
   - Preferred DNS: `8.8.8.8` (Google DNS)
   - Alternate DNS: `8.8.4.4` (Google DNS)
   - Click OK

3. **Flush DNS Cache**
   ```powershell
   ipconfig /flushdns
   ```

4. **Test Connection**
   ```powershell
   node backend/add-bali-direct.js
   ```

### Solution 2: Check Firewall/Antivirus

1. **Temporarily disable Windows Firewall**
   - Open Windows Security
   - Go to Firewall & network protection
   - Turn off for Private network (temporarily)

2. **Check Antivirus**
   - If you have antivirus (Avast, Norton, McAfee, etc.)
   - Temporarily disable it
   - Try connecting again

3. **Add MongoDB to Firewall Exceptions**
   - Windows Defender Firewall → Advanced Settings
   - Outbound Rules → New Rule
   - Port → TCP → 27017
   - Allow the connection

### Solution 3: Use Mobile Hotspot

If your ISP is blocking MongoDB Atlas:

1. Enable mobile hotspot on your phone
2. Connect your computer to the hotspot
3. Try running the script again:
   ```powershell
   node backend/add-bali-direct.js
   ```

### Solution 4: Use VPN

1. Install a VPN (ProtonVPN, Windscribe - free options)
2. Connect to VPN
3. Try the connection again

### Solution 5: Whitelist Your IP in MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Login to your account
3. Click on "Network Access" in left sidebar
4. Click "Add IP Address"
5. Click "Add Current IP Address"
6. Or add `0.0.0.0/0` to allow all IPs (less secure but works)
7. Click "Confirm"
8. Wait 2-3 minutes for changes to apply

### Solution 6: Use MongoDB Compass (Easiest Alternative)

Instead of running scripts, use MongoDB Compass GUI:

1. **Download MongoDB Compass**
   - https://www.mongodb.com/try/download/compass

2. **Connect**
   - Open Compass
   - Paste connection string:
     ```
     mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays
     ```
   - Click Connect

3. **Delete Old Bali Packages**
   - Navigate to `vibes-holidays` → `packages`
   - Filter: `{destination: /bali/i}`
   - Select all → Delete

4. **Add New Package**
   - Click "ADD DATA" → "Insert Document"
   - Copy content from `BALI_LUXURY_PACKAGE_DATA.json`
   - Paste and click Insert

### Solution 7: Use MongoDB Atlas Web Interface (No Installation)

1. Go to https://cloud.mongodb.com/
2. Login
3. Click "Browse Collections"
4. Select `vibes-holidays` → `packages`
5. Filter: `{"destination": {"$regex": "bali", "$options": "i"}}`
6. Delete old Bali packages
7. Click "INSERT DOCUMENT"
8. Switch to JSON view
9. Paste content from `BALI_LUXURY_PACKAGE_DATA.json`
10. Click Insert

## Quick Test Commands

After trying any solution, test with:

```powershell
# Test DNS resolution
nslookup cluster0.6c6k7zt.mongodb.net 8.8.8.8

# Test MongoDB connection
node backend/add-bali-direct.js
```

## Why This Happens

1. **ISP DNS Issues**: Your ISP's DNS servers may not resolve MongoDB Atlas domains
2. **Firewall Blocking**: Windows Firewall or antivirus blocking MongoDB ports
3. **ISP Blocking**: Some ISPs block MongoDB Atlas connections
4. **Network Configuration**: Corporate/school networks may block external databases

## Recommended Solution

**Use MongoDB Compass or Atlas Web Interface** - These are the most reliable methods and don't require fixing network issues.

## Need Help?

If none of these work, you can:
1. Use the production backend (already working on your website)
2. Add packages through MongoDB Atlas web interface
3. Contact your ISP about MongoDB Atlas access
