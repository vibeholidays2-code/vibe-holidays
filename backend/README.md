# Vibe Holidays Backend API

Backend API for the Vibe Holidays website built with Node.js, Express, TypeScript, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

3. Start MongoDB (make sure MongoDB is running locally or update MONGODB_URI in .env)

4. Run the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/         # Configuration files (database, etc.)
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic services
├── utils/          # Utility functions
├── tests/          # Test files
│   ├── unit/       # Unit tests
│   ├── property/   # Property-based tests
│   └── integration/# Integration tests
└── server.ts       # Application entry point
```

## API Endpoints

Documentation will be added as endpoints are implemented.
