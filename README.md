# Vibe Holidays Website

A full-stack travel and holiday booking website built with modern web technologies.

## Project Structure

```
vibe-holidays/
├── backend/          # Node.js/Express API
├── frontend/         # React SPA
└── .kiro/            # Kiro specs and documentation
    └── specs/
        └── vibe-holidays-website/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with bcrypt
- **Email:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting
- **Testing:** Jest, fast-check (property-based testing)

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Query
- **Forms:** React Hook Form
- **Animation:** Framer Motion
- **Testing:** Vitest, fast-check (property-based testing)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe-holidays
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

#### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm run dev
```
Application runs on http://localhost:5173

#### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Testing

**Backend Tests:**
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
```

**Frontend Tests:**
```bash
cd frontend
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with UI
```

### Code Quality

**Linting:**
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

**Formatting:**
```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vibe-holidays

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@vibeholidays.com
ADMIN_EMAIL=admin@vibeholidays.com

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Features

- ✅ Holiday package browsing and search
- ✅ Online booking system
- ✅ Customer inquiry forms
- ✅ Image gallery
- ✅ Admin dashboard
- ✅ Package management
- ✅ Booking management
- ✅ Email notifications
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Security features (HTTPS, CORS, Rate Limiting)

## Development Workflow

This project follows a spec-driven development approach. See `.kiro/specs/vibe-holidays-website/` for:

- **requirements.md** - Detailed requirements using EARS patterns
- **design.md** - System architecture and design decisions
- **tasks.md** - Implementation task list

## API Documentation

API endpoints will be documented as they are implemented. See `backend/README.md` for details.

## Contributing

1. Follow the task list in `.kiro/specs/vibe-holidays-website/tasks.md`
2. Write tests for all new features
3. Run linting and formatting before committing
4. Ensure all tests pass

## License

ISC
