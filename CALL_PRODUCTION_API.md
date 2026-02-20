# Call Production API to Replace Bali Packages

Since the local MongoDB connection isn't working, you can call the production backend API directly.

## Option 1: Using PowerShell

```powershell
Invoke-WebRequest -Uri "https://vibe-holidays-backend.onrender.com/api/admin/packages/replace-bali" -Method POST -ContentType "application/json"
```

## Option 2: Using Browser Console

1. Open your production website: https://www.vibesholidays.in
2. Open browser console (F12)
3. Run this code:

```javascript
fetch('https://vibe-holidays-backend.onrender.com/api/admin/packages/replace-bali', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

## Option 3: Using Postman or Thunder Client

- Method: POST
- URL: `https://vibe-holidays-backend.onrender.com/api/admin/packages/replace-bali`
- Headers: `Content-Type: application/json`
- Body: (empty)

## What This Does

1. Deletes all old Bali packages from the database
2. Adds the new Bali 4★ Luxury package with:
   - Price: ₹55,000 per person
   - Duration: 6 Nights / 7 Days
   - 4★ Hotels (Fairfield by Marriott + Private Pool Villa)
   - All private tours and transfers
   - Complete 7-day itinerary
   - All inclusions and exclusions

## After Running

The new package will be immediately available on your website at:
- https://www.vibesholidays.in/packages
