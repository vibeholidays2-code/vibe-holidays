# Performance Tests Documentation

This document describes the performance tests implemented for the Vibe Holidays website frontend.

## Overview

The performance test suite validates two critical aspects of the application:

1. **Lazy Loading Implementation** - Ensures code splitting and on-demand loading
2. **Bundle Size Limits** - Verifies production builds stay within performance budgets

**Requirements Validated:** 8.1, 8.3

## Test Files

### 1. `performance.test.tsx`

Tests the lazy loading implementation and performance optimizations.

#### Test Suites:

**Lazy Loading Implementation**
- ✅ Verifies all public pages are lazy loaded
- ✅ Verifies all admin pages are lazy loaded
- ✅ Tests Suspense fallback rendering during component load
- ✅ Validates lazy loading attribute on images
- ✅ Confirms lazy components don't load until needed

**Bundle Size Limits**
- ✅ Checks chunk size configuration (1000 KB limit)
- ✅ Verifies vendor code splitting configuration
- ✅ Confirms minification is enabled
- ✅ Validates console.log removal in production
- ✅ Verifies route-based code splitting

**Performance Optimization Verification**
- ✅ Confirms compression configuration
- ✅ Tests image lazy loading implementation
- ✅ Validates React Query caching configuration
- ✅ Verifies loading states for async operations

### 2. `bundle-analysis.test.ts`

Analyzes the actual production build output to verify bundle sizes and code splitting.

#### Test Suites:

**Build Output Verification**
- ✅ Confirms dist folder exists after build
- ✅ Verifies separate vendor chunks are generated
- ✅ Checks individual chunk sizes stay under limit
- ✅ Validates JavaScript minification
- ✅ Confirms CSS files are generated separately
- ✅ Verifies index.html exists in dist root

**Performance Budget Checks**
- ✅ Total JavaScript size under 2MB
- ✅ Total CSS size under 500KB

**Code Splitting Verification**
- ✅ Confirms multiple route chunks exist
- ✅ Checks for source map generation

## Running the Tests

### Run all performance tests:
```bash
npm test -- performance.test.tsx bundle-analysis.test.ts
```

### Run only lazy loading tests:
```bash
npm test -- performance.test.tsx
```

### Run only bundle analysis tests:
```bash
npm test -- bundle-analysis.test.ts
```

### Note on Bundle Analysis Tests
The bundle analysis tests require a production build to exist. Run the build first:
```bash
npm run build
npm test -- bundle-analysis.test.ts
```

## Current Performance Metrics

Based on the latest test run:

- **Total JavaScript Size:** 0.45 MB ✅ (Budget: 2 MB)
- **Total CSS Size:** 30.63 KB ✅ (Budget: 500 KB)
- **JavaScript Chunks:** 26 ✅ (Excellent code splitting)
- **Individual Chunk Limit:** 1000 KB ✅

## Performance Optimizations Verified

### Code Splitting
- All routes are lazy loaded using `React.lazy()`
- Vendor libraries split into separate chunks:
  - `react-vendor` (React, React DOM, React Router)
  - `query-vendor` (React Query)
  - `form-vendor` (React Hook Form)
  - `animation-vendor` (Framer Motion)

### Image Optimization
- All images use `loading="lazy"` attribute
- Images load on-demand as they enter viewport
- Reduces initial page load time

### Bundle Optimization
- Minification enabled with Terser
- Console.log statements removed in production
- Dead code elimination via tree shaking
- Compression (gzip) configured

### Caching Strategy
- React Query configured for efficient data caching
- `refetchOnWindowFocus: false` to reduce unnecessary requests
- `retry: 1` for failed requests

## Performance Budget Guidelines

### JavaScript Budget
- **Total:** < 2 MB
- **Per Chunk:** < 1 MB
- **Main Bundle:** < 500 KB (ideal)

### CSS Budget
- **Total:** < 500 KB
- **Main Stylesheet:** < 200 KB (ideal)

### Load Time Goals
- **Initial Render:** < 3 seconds (Requirement 8.1)
- **Time to Interactive:** < 5 seconds
- **First Contentful Paint:** < 2 seconds

## Monitoring and Maintenance

### Regular Checks
1. Run bundle analysis after major dependency updates
2. Monitor chunk sizes when adding new features
3. Review lazy loading implementation for new routes
4. Check performance metrics in production

### Warning Signs
- Total JS size approaching 1.5 MB
- Individual chunks exceeding 800 KB
- Fewer than 5 chunks (insufficient code splitting)
- CSS size exceeding 300 KB

### Optimization Strategies
If budgets are exceeded:
1. Analyze bundle with `npm run build` and check dist/assets
2. Consider lazy loading more components
3. Review and remove unused dependencies
4. Implement dynamic imports for large libraries
5. Optimize images and assets
6. Consider CDN for large static assets

## Related Documentation

- [Vite Configuration](../../vite.config.ts)
- [Performance Optimizations](../../PERFORMANCE_OPTIMIZATIONS.md)
- [Image Optimization](../../IMAGE_OPTIMIZATION.md)

## Requirements Traceability

- **Requirement 8.1:** Page load within 3 seconds - Validated by bundle size limits and lazy loading
- **Requirement 8.3:** Lazy loading for below-the-fold content - Validated by image lazy loading tests
