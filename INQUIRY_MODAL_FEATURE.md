# Inquiry Modal Feature

## Overview
A beautiful inquiry modal that automatically appears 5 seconds after a logged-in user lands on the home page.

## Features

### 1. **Auto-Trigger on Login**
- Modal appears automatically 5 seconds after user logs in
- Only shows once per session (uses sessionStorage to track)
- Only displays if user has a valid auth token

### 2. **Beautiful Design**
- Smooth fade-in and scale animation using Framer Motion
- Gradient header with "Plan Your Perfect Trip" messaging
- Professional form layout with all necessary fields
- Close button (X) in the top-right corner
- Backdrop overlay that closes modal when clicked

### 3. **Form Fields**
- Full Name (required)
- Phone Number (required)
- Email (required)
- Message/Trip Details (required)
- Office visit checkbox option

### 4. **User Experience**
- Loading state while submitting
- Success message with auto-close after 2 seconds
- Error handling with user-friendly messages
- Form clears after successful submission
- Responsive design for all screen sizes

### 5. **Integration**
- Submits to `/contact` endpoint (or `/inquiries` if packageId provided)
- Stores inquiry in MongoDB
- Sends email notifications to admin and customer
- Uses existing API service with auth token

## Files Modified/Created

### New Files:
- `frontend/src/components/InquiryModal.tsx` - Modal component

### Modified Files:
- `frontend/src/pages/HomePage.tsx` - Added modal state and trigger logic

## How It Works

1. **User logs in** → Gets auth token stored in localStorage
2. **User navigates to home page** → Component checks for token
3. **5 seconds pass** → Modal automatically appears
4. **User fills form** → Submits inquiry
5. **Success message** → Modal closes after 2 seconds
6. **Admin receives email** → Notification sent to vibesholidays.9@gmail.com

## Customization

### Change Delay Time
Edit `HomePage.tsx` line with `setTimeout(..., 5000)` - change 5000 to desired milliseconds

### Change Modal Styling
Edit `InquiryModal.tsx` - modify Tailwind classes for colors, sizes, animations

### Change Form Fields
Edit `InquiryModal.tsx` - add/remove Input or Textarea components

## Testing

1. Log in to the application
2. Navigate to home page
3. Wait 5 seconds
4. Modal should appear with smooth animation
5. Fill form and submit
6. Check email for confirmation

## Notes

- Modal won't show if user is not logged in
- Modal won't show twice in the same session (even on page refresh)
- Uses sessionStorage to track if modal was shown
- Fully responsive on mobile, tablet, and desktop
- Accessible with proper ARIA labels and keyboard support
