# Vibe Holidays Frontend

Frontend application for the Vibe Holidays website built with React, TypeScript, Vite, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── tests/          # Test files
├── App.tsx         # Main App component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- Framer Motion
- Axios
- React Hook Form
- Vitest (testing)
- fast-check (property-based testing)
