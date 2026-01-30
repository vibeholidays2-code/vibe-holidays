# Design Document: Vibe Holidays Website

## Overview

The Vibe Holidays website is a full-stack web application built with modern technologies to provide a professional, performant, and user-friendly experience for both customers and administrators. The system follows a client-server architecture with a React-based frontend, Node.js/Express backend, and MongoDB database.

The design emphasizes:
- Clean, modern UI with responsive design
- Fast performance and SEO optimization
- Secure data handling and authentication
- Easy content management for administrators
- Scalable architecture for future growth

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (React SPA with React Router, Tailwind CSS, Framer Motion) │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS/REST API
┌─────────────────────▼───────────────────────────────────────┐
│                     API Gateway Layer                        │
│         (Express.js with middleware for auth, CORS)          │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌───▼────────┐ ┌─▼──────────┐
│   Business   │ │   Auth     │ │   Email    │
│    Logic     │ │  Service   │ │  Service   │
│  Controllers │ │            │ │ (Nodemailer)│
└───────┬──────┘ └───┬────────┘ └────────────┘
        │            │
┌───────▼────────────▼──────┐
│     Data Access Layer     │
│    (Mongoose Models)      │
└───────────┬───────────────┘
            │
┌───────────▼───────────────┐
│   MongoDB Database        │
│  (Collections: packages,  │
│   bookings, inquiries,    │
│   users, gallery)         │
└───────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ (UI framework)
- React Router v6 (client-side routing)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Axios (HTTP client)
- React Hook Form (form handling)
- React Query (server state management)

**Backend:**
- Node.js 18+ (runtime)
- Express.js (web framework)
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- Bcrypt (password hashing)
- Nodemailer (email service)
- Express Validator (input validation)
- Helmet (security headers)
- Rate Limiter (DDoS protection)

**DevOps & Tools:**
- Vite (build tool)
- ESLint & Prettier (code quality)
- Git (version control)

## Components and Interfaces

### Frontend Components

#### 1. Public Pages

**HomePage Component**
- Hero section with background image/video
- Featured packages carousel
- Services overview section
- Testimonials section
- Call-to-action sections

**PackagesPage Component**
- Package grid/list view
- Filter sidebar (destination, price, duration)
- Search bar
- Pagination
- Package cards with key information

**PackageDetailPage Component**
- Full package information display
- Image gallery/carousel
- Itinerary timeline
- Inclusions/exclusions lists
- Booking button and form modal

**GalleryPage Component**
- Masonry/grid layout for images
- Category filters
- Lightbox for full-size viewing
- Lazy loading implementation

**ContactPage Component**
- Contact form
- Business information display
- Embedded map
- Social media links

**AboutPage Component**
- Company story and mission
- Team information
- Why choose us section

#### 2. Booking & Forms

**BookingForm Component**
- Multi-step form (personal info, travel details, preferences)
- Date picker for travel dates
- Number of travelers selector
- Special requests textarea
- Form validation with error messages
- Submit with loading state

**InquiryForm Component**
- Contact information fields
- Package selection dropdown
- Message textarea
- Validation and submission

**ContactForm Component**
- Name, email, subject, message fields
- Validation
- Success/error feedback

#### 3. Admin Dashboard

**AdminLayout Component**
- Sidebar navigation
- Header with user info and logout
- Protected route wrapper

**DashboardHome Component**
- Statistics cards (bookings, inquiries, revenue)
- Recent bookings table
- Recent inquiries list
- Quick actions

**PackageManagement Component**
- Package list with edit/delete actions
- Add new package form
- Rich text editor for descriptions
- Image upload functionality
- Status toggle (active/inactive)

**BookingManagement Component**
- Bookings table with filters
- Status management (pending, confirmed, cancelled)
- Booking details view
- Export functionality

**InquiryManagement Component**
- Inquiries list
- Mark as read/responded
- Quick reply functionality

**GalleryManagement Component**
- Image upload with drag-and-drop
- Category assignment
- Image editing (crop, resize)
- Bulk operations

#### 4. Shared Components

**Navbar Component**
- Logo
- Navigation links
- Mobile hamburger menu
- Responsive design

**Footer Component**
- Quick links
- Contact information
- Social media icons
- Newsletter signup
- Copyright notice

**LoadingSpinner Component**
- Reusable loading indicator

**Modal Component**
- Reusable modal wrapper
- Close functionality
- Backdrop

**Button Component**
- Styled button with variants (primary, secondary, outline)
- Loading state
- Disabled state

**Card Component**
- Reusable card layout
- Image, title, description, action slots

### Backend API Endpoints

#### Public Endpoints

```
GET    /api/packages              - Get all packages (with filters)
GET    /api/packages/:id          - Get package by ID
GET    /api/gallery               - Get gallery images
GET    /api/gallery/:category     - Get images by category
POST   /api/bookings              - Create new booking
POST   /api/inquiries             - Submit inquiry
POST   /api/contact               - Send contact message
```

#### Admin Endpoints (Protected)

```
POST   /api/auth/login            - Admin login
POST   /api/auth/logout           - Admin logout
GET    /api/auth/me               - Get current admin user

GET    /api/admin/packages        - Get all packages (admin view)
POST   /api/admin/packages        - Create package
PUT    /api/admin/packages/:id    - Update package
DELETE /api/admin/packages/:id    - Delete package

GET    /api/admin/bookings        - Get all bookings
GET    /api/admin/bookings/:id    - Get booking details
PUT    /api/admin/bookings/:id    - Update booking status

GET    /api/admin/inquiries       - Get all inquiries
PUT    /api/admin/inquiries/:id   - Update inquiry status

POST   /api/admin/gallery         - Upload images
DELETE /api/admin/gallery/:id     - Delete image
PUT    /api/admin/gallery/:id     - Update image metadata

GET    /api/admin/stats           - Get dashboard statistics
```

### API Request/Response Formats

**Package Object:**
```json
{
  "_id": "string",
  "name": "string",
  "destination": "string",
  "duration": "number (days)",
  "price": "number",
  "description": "string",
  "itinerary": ["string"],
  "inclusions": ["string"],
  "exclusions": ["string"],
  "images": ["string (URLs)"],
  "featured": "boolean",
  "active": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Booking Object:**
```json
{
  "_id": "string",
  "packageId": "string",
  "customerName": "string",
  "email": "string",
  "phone": "string",
  "travelDate": "date",
  "numberOfTravelers": "number",
  "specialRequests": "string",
  "status": "pending|confirmed|cancelled",
  "totalPrice": "number",
  "createdAt": "date"
}
```

**Inquiry Object:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "packageId": "string (optional)",
  "message": "string",
  "status": "new|read|responded",
  "createdAt": "date"
}
```

## Data Models

### MongoDB Collections

#### packages Collection
```javascript
{
  name: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  itinerary: [{ type: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  images: [{ type: String }],
  thumbnail: { type: String },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### bookings Collection
```javascript
{
  packageId: { type: ObjectId, ref: 'Package', required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  travelDate: { type: Date, required: true },
  numberOfTravelers: { type: Number, required: true },
  specialRequests: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

#### inquiries Collection
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  packageId: { type: ObjectId, ref: 'Package' },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'responded'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now }
}
```

#### users Collection (Admin)
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
}
```

#### gallery Collection
```javascript
{
  url: { type: String, required: true },
  category: { type: String, required: true },
  caption: { type: String },
  destination: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```



## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Package Data Completeness

*For any* package retrieved from the database, the package object should contain all required fields: name, destination, duration, price, description, itinerary, inclusions, exclusions, and images.

**Validates: Requirements 2.2, 2.3**

### Property 2: Package Filtering Correctness

*For any* filter criteria (destination, price range, or duration), all packages returned by the filter should match the specified criteria.

**Validates: Requirements 2.4**

### Property 3: Package Search Relevance

*For any* search keyword, all packages returned in search results should contain the keyword in at least one of the following fields: name, destination, or description.

**Validates: Requirements 2.5**

### Property 4: Booking Validation

*For any* booking submission, if any required field (customerName, email, phone, travelDate, numberOfTravelers, packageId) is missing or invalid, the system should reject the booking and return a validation error.

**Validates: Requirements 3.2**

### Property 5: Booking Persistence and Email Notification

*For any* valid booking submission, the system should store the booking in the database and trigger a confirmation email to the customer email address.

**Validates: Requirements 3.3, 10.1**

### Property 6: Inquiry Submission Triggers Dual Notifications

*For any* inquiry submission, the system should create an inquiry record and trigger both a user acknowledgment email and an admin notification email.

**Validates: Requirements 3.5, 10.3**

### Property 7: Gallery Images Organized by Category

*For any* category filter applied to gallery images, all returned images should belong to the specified category.

**Validates: Requirements 4.4**

### Property 8: Gallery Image Metadata Completeness

*For any* gallery image object, it should include a URL, category, and caption field (caption may be empty but field must exist).

**Validates: Requirements 4.5**

### Property 9: Contact Form Validation

*For any* contact form submission, if the email field is invalid or the message field is empty, the system should reject the submission and return a validation error.

**Validates: Requirements 5.2**

### Property 10: Authentication with Valid Credentials

*For any* admin login attempt with valid credentials (correct username and password), the system should return an authentication token and grant access to protected routes.

**Validates: Requirements 6.1**

### Property 11: Authentication Rejects Invalid Credentials

*For any* admin login attempt with invalid credentials (incorrect username or password), the system should reject the authentication and not grant access.

**Validates: Requirements 6.1**

### Property 12: Dashboard Data Retrieval

*For any* authenticated admin request to the dashboard endpoint, the response should include arrays of recent bookings and recent inquiries.

**Validates: Requirements 6.2**

### Property 13: Package CRUD Operations

*For any* package, an admin should be able to create it, retrieve it by ID, update its fields, and delete it, with each operation reflecting immediately in subsequent queries.

**Validates: Requirements 6.3, 6.5**

### Property 14: Booking Status Field Presence

*For any* booking object retrieved by admin, it should include a status field with one of the valid values: 'pending', 'confirmed', or 'cancelled'.

**Validates: Requirements 6.4**

### Property 15: Password Hashing Security

*For any* user account created or password updated, the password stored in the database should be hashed (not plain text) and should be verifiable using bcrypt comparison.

**Validates: Requirements 9.2, 9.3**

### Property 16: Rate Limiting Protection

*For any* endpoint with rate limiting enabled, if the number of requests from a single IP exceeds the threshold within the time window, subsequent requests should be rejected with a 429 status code.

**Validates: Requirements 9.5**

### Property 17: Booking Admin Notification

*For any* booking created, the system should trigger an email notification to the admin email address containing the booking details.

**Validates: Requirements 10.2**

### Property 18: Email Content Completeness

*For any* booking confirmation email sent to a customer, the email content should include the package name, travel date, number of travelers, and total price.

**Validates: Requirements 10.5**

## Error Handling

### Client-Side Error Handling

**Form Validation Errors:**
- Display inline error messages for invalid fields
- Prevent form submission until all validations pass
- Show field-specific error messages (e.g., "Email is required", "Invalid email format")

**API Request Errors:**
- Display user-friendly error messages for failed requests
- Show loading states during requests
- Implement retry logic for transient failures
- Handle network errors gracefully

**404 Not Found:**
- Display custom 404 page for invalid routes
- Provide navigation back to home page

**Authentication Errors:**
- Redirect to login page when token expires
- Clear stored credentials on logout
- Show "Session expired" message

### Server-Side Error Handling

**Validation Errors (400 Bad Request):**
- Return structured error response with field-specific messages
- Format: `{ success: false, errors: [{ field: 'email', message: 'Invalid email' }] }`

**Authentication Errors (401 Unauthorized):**
- Return error when token is missing or invalid
- Clear any server-side session data

**Authorization Errors (403 Forbidden):**
- Return error when user lacks permissions for resource
- Log unauthorized access attempts

**Not Found Errors (404):**
- Return error when requested resource doesn't exist
- Format: `{ success: false, message: 'Package not found' }`

**Server Errors (500 Internal Server Error):**
- Log full error details server-side
- Return generic error message to client (don't expose internals)
- Format: `{ success: false, message: 'An error occurred. Please try again.' }`

**Database Errors:**
- Catch and log database connection errors
- Implement retry logic for transient database failures
- Return appropriate error response to client

**Email Service Errors:**
- Log email sending failures
- Don't block main operation if email fails (async handling)
- Implement retry queue for failed emails

### Error Logging

- Log all errors with timestamp, request details, and stack trace
- Use different log levels (error, warn, info, debug)
- Store logs in files with rotation
- Monitor critical errors for immediate attention

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests:**
- Verify specific examples and edge cases
- Test integration points between components
- Validate error conditions and boundary cases
- Test specific user flows and scenarios

**Property-Based Tests:**
- Verify universal properties across all inputs
- Use randomized input generation to test many scenarios
- Catch edge cases that might be missed in example-based tests
- Validate correctness properties defined in this document

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across the input space.

### Property-Based Testing Configuration

**Library:** fast-check (for JavaScript/TypeScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `// Feature: vibe-holidays-website, Property {number}: {property_text}`

**Example Property Test Structure:**
```javascript
// Feature: vibe-holidays-website, Property 2: Package Filtering Correctness
test('filtered packages match criteria', () => {
  fc.assert(
    fc.property(
      fc.record({
        destination: fc.string(),
        minPrice: fc.nat(),
        maxPrice: fc.nat()
      }),
      async (filterCriteria) => {
        const packages = await filterPackages(filterCriteria);
        packages.forEach(pkg => {
          expect(pkg.destination).toBe(filterCriteria.destination);
          expect(pkg.price).toBeGreaterThanOrEqual(filterCriteria.minPrice);
          expect(pkg.price).toBeLessThanOrEqual(filterCriteria.maxPrice);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

### Testing Scope

**Backend API Tests:**
- Test all API endpoints with valid and invalid inputs
- Test authentication and authorization
- Test database operations (CRUD)
- Test email service integration
- Test input validation and sanitization
- Property tests for data integrity and business logic

**Frontend Component Tests:**
- Test component rendering with different props
- Test user interactions (clicks, form submissions)
- Test form validation logic
- Test API integration (mocked responses)
- Test routing and navigation

**Integration Tests:**
- Test complete user flows (browse → book → confirm)
- Test admin workflows (login → manage → logout)
- Test email notifications end-to-end

**End-to-End Tests (Optional):**
- Test critical user journeys in browser environment
- Test responsive design on different viewports
- Test performance benchmarks

### Test Organization

```
backend/
  tests/
    unit/
      models/
      controllers/
      services/
    property/
      packages.property.test.js
      bookings.property.test.js
      auth.property.test.js
    integration/
      api.integration.test.js

frontend/
  src/
    components/
      __tests__/
        Component.test.jsx
    pages/
      __tests__/
        Page.test.jsx
```

### Continuous Testing

- Run tests on every commit (pre-commit hook)
- Run full test suite in CI/CD pipeline
- Maintain minimum 80% code coverage
- Block merges if tests fail

## Implementation Notes

### Development Workflow

1. **Setup Phase:**
   - Initialize project structure (frontend and backend)
   - Set up development environment and dependencies
   - Configure database connection
   - Set up environment variables

2. **Backend Development:**
   - Implement database models
   - Create API routes and controllers
   - Implement authentication middleware
   - Set up email service
   - Write backend tests

3. **Frontend Development:**
   - Create component library
   - Implement pages and routing
   - Connect to backend API
   - Implement state management
   - Style with Tailwind CSS

4. **Integration:**
   - Connect frontend to backend
   - Test complete user flows
   - Fix bugs and refine UX

5. **Deployment:**
   - Set up hosting (frontend and backend)
   - Configure domain and SSL
   - Set up environment variables in production
   - Deploy and test

### Security Considerations

- Use HTTPS for all communications
- Implement CORS properly (whitelist frontend domain)
- Sanitize all user inputs
- Use parameterized queries (Mongoose handles this)
- Implement rate limiting on all public endpoints
- Use secure HTTP headers (Helmet.js)
- Store secrets in environment variables
- Implement JWT with reasonable expiration times
- Hash passwords with bcrypt (salt rounds: 10)
- Validate file uploads (type, size)
- Implement CSRF protection for state-changing operations

### Performance Optimization

- Implement database indexing on frequently queried fields
- Use pagination for large data sets
- Implement image optimization and lazy loading
- Use CDN for static assets
- Implement caching where appropriate (Redis for session storage)
- Minimize bundle size (code splitting, tree shaking)
- Optimize database queries (avoid N+1 problems)
- Implement compression (gzip)

### Scalability Considerations

- Design stateless API (horizontal scaling)
- Use connection pooling for database
- Implement job queue for email sending (Bull/Redis)
- Consider microservices for future growth
- Use load balancer for multiple instances
- Implement monitoring and logging
- Plan for database replication and backups
