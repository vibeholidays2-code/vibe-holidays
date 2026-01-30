# Booking and Inquiry Forms - Implementation Guide

This document provides guidance on using the BookingForm and InquiryForm components in the Vibe Holidays website.

## Components Overview

### BookingForm Component

A multi-step form for booking holiday packages with validation and API integration.

**Location:** `frontend/src/components/BookingForm.tsx`

**Features:**
- Multi-step form (Personal Info → Travel Details)
- Real-time form validation with error messages
- Dynamic price calculation based on number of travelers
- Date validation (travel date must be in future)
- Success/error feedback with visual indicators
- Loading states during submission
- Responsive design

**Props:**
```typescript
interface BookingFormProps {
  packageId: string;          // Required: ID of the package being booked
  packageName: string;         // Required: Name of the package (for display)
  packagePrice: number;        // Required: Price per person
  onSuccess?: () => void;      // Optional: Callback after successful submission
  onCancel?: () => void;       // Optional: Callback when user cancels
}
```

**Usage Example:**
```tsx
import BookingForm from './components/BookingForm';
import Modal from './components/Modal';

function PackageDetailPage() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowBookingModal(true)}>
        Book Now
      </button>
      
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Complete Your Booking"
        size="lg"
      >
        <BookingForm
          packageId="507f1f77bcf86cd799439011"
          packageName="Bali Paradise Getaway"
          packagePrice={1299}
          onSuccess={() => {
            setTimeout(() => setShowBookingModal(false), 2000);
          }}
          onCancel={() => setShowBookingModal(false)}
        />
      </Modal>
    </>
  );
}
```

**API Endpoint:**
- POST `/api/bookings`
- Request body includes: packageId, customerName, email, phone, travelDate, numberOfTravelers, specialRequests, totalPrice

**Validation Rules:**
- Customer Name: Required, minimum 2 characters
- Email: Required, valid email format
- Phone: Required, minimum 10 digits
- Travel Date: Required, must be in the future
- Number of Travelers: Required, between 1 and 20

---

### InquiryForm Component

A form for submitting general inquiries or package-specific questions.

**Location:** `frontend/src/components/InquiryForm.tsx`

**Features:**
- Optional package selection dropdown
- Fetches available packages from API
- Form validation with error messages
- Success/error feedback with visual indicators
- Loading states during submission
- Responsive design

**Props:**
```typescript
interface InquiryFormProps {
  preselectedPackageId?: string;  // Optional: Pre-select a specific package
  onSuccess?: () => void;          // Optional: Callback after successful submission
  onCancel?: () => void;           // Optional: Callback when user cancels
}
```

**Usage Example 1 - General Inquiry:**
```tsx
import InquiryForm from './components/InquiryForm';
import Modal from './components/Modal';

function ContactPage() {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowInquiryModal(true)}>
        Send Inquiry
      </button>
      
      <Modal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title="Send Us an Inquiry"
        size="lg"
      >
        <InquiryForm
          onSuccess={() => {
            setTimeout(() => setShowInquiryModal(false), 2000);
          }}
          onCancel={() => setShowInquiryModal(false)}
        />
      </Modal>
    </>
  );
}
```

**Usage Example 2 - Package-Specific Inquiry:**
```tsx
import InquiryForm from './components/InquiryForm';
import Modal from './components/Modal';

function PackageDetailPage({ packageId }) {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowInquiryModal(true)}>
        Ask a Question
      </button>
      
      <Modal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title="Inquire About This Package"
        size="lg"
      >
        <InquiryForm
          preselectedPackageId={packageId}
          onSuccess={() => {
            setTimeout(() => setShowInquiryModal(false), 2000);
          }}
          onCancel={() => setShowInquiryModal(false)}
        />
      </Modal>
    </>
  );
}
```

**API Endpoints:**
- GET `/api/packages` - Fetches available packages for dropdown
- POST `/api/inquiries` - Submits the inquiry

**Validation Rules:**
- Name: Required, minimum 2 characters
- Email: Required, valid email format
- Phone: Optional, minimum 10 digits if provided
- Package: Optional selection
- Message: Required, minimum 10 characters

---

## Integration Checklist

### For PackageDetailPage:
- [ ] Import BookingForm and Modal components
- [ ] Add state for modal visibility
- [ ] Add "Book Now" button that opens modal
- [ ] Pass package details (id, name, price) to BookingForm
- [ ] Handle success callback to close modal after delay
- [ ] Optionally add InquiryForm for package-specific questions

### For ContactPage:
- [ ] Import InquiryForm and Modal components
- [ ] Add state for modal visibility
- [ ] Add "Send Inquiry" button that opens modal
- [ ] Handle success callback to close modal after delay
- [ ] Consider adding the form directly on the page instead of modal

### For HomePage:
- [ ] Optionally add quick inquiry button in hero section
- [ ] Link to packages page or open inquiry modal

---

## Styling Notes

Both forms use the existing component library:
- `Input` component for text/email/tel/date/number inputs
- `Textarea` component for multi-line text
- `Select` component for dropdown selections
- `Button` component with loading states
- Tailwind CSS for styling

The forms are fully responsive and follow the existing design system.

---

## Error Handling

Both forms handle errors gracefully:
- **Validation errors**: Displayed inline below each field
- **API errors**: Displayed in a red alert box above form actions
- **Network errors**: Caught and displayed with user-friendly message
- **Success state**: Shows success message with green checkmark icon

---

## Testing

The forms integrate with the existing test suite. To test:

```bash
cd frontend
npm test
```

All existing tests pass with the new components.

---

## Next Steps

1. Integrate BookingForm into PackageDetailPage
2. Integrate InquiryForm into ContactPage
3. Add inquiry button to PackagesPage (optional)
4. Test end-to-end booking flow with backend API
5. Test end-to-end inquiry flow with backend API
6. Add analytics tracking for form submissions (optional)

---

## Requirements Validation

This implementation satisfies the following requirements:

**Requirement 3.1**: Booking form with required fields ✓
**Requirement 3.2**: Form validation ✓
**Requirement 3.3**: Booking submission and confirmation ✓
**Requirement 3.4**: Inquiry form availability ✓
**Requirement 3.5**: Inquiry submission and acknowledgment ✓
**Requirement 7.2**: Responsive design and mobile functionality ✓

---

## Support

For questions or issues with these forms, refer to:
- Component source code with inline comments
- Example files: `BookingFormExample.tsx` and `InquiryFormExample.tsx`
- Design document: `.kiro/specs/vibe-holidays-website/design.md`
- Requirements document: `.kiro/specs/vibe-holidays-website/requirements.md`
