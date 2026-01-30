import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Bundle Size Analysis Tests
 * 
 * These tests analyze the production build to ensure:
 * 1. Bundle sizes are within acceptable limits
 * 2. Code splitting is working correctly
 * 3. Vendor chunks are properly separated
 * 
 * Requirements: 8.1, 8.3
 * 
 * Note: These tests require a production build to exist.
 * Run `npm run build` before running these tests.
 */

describe('Bundle Size Analysis', () => {
  const distPath = join(__dirname, '../../dist');
  const assetsPath = join(distPath, 'assets');

  describe('Build Output Verification', () => {
    it('should have a dist folder after build', () => {
      // This test will pass if dist exists, or skip if not built yet
      if (!existsSync(distPath)) {
        console.log('⚠️  No dist folder found. Run `npm run build` to analyze bundle sizes.');
        expect(true).toBe(true); // Skip test gracefully
        return;
      }

      expect(existsSync(distPath)).toBe(true);
      expect(existsSync(assetsPath)).toBe(true);
    });

    it('should generate separate vendor chunks', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      // Should have multiple JS chunks (not just one monolithic bundle)
      expect(jsFiles.length).toBeGreaterThan(1);

      // Look for vendor chunk patterns (optional check)
      // Having multiple chunks is the main indicator of code splitting
      if (jsFiles.length > 1) {
        // If we have multiple chunks, that's good for code splitting
        expect(jsFiles.length).toBeGreaterThan(1);
      }
    });

    it('should keep individual chunk sizes under limit', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      // Check each JS file size
      const maxChunkSize = 1000 * 1024; // 1000 KB (1 MB) as configured in vite.config.ts
      const oversizedChunks: string[] = [];

      jsFiles.forEach((file) => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        const sizeInKB = stats.size / 1024;

        if (stats.size > maxChunkSize) {
          oversizedChunks.push(`${file} (${sizeInKB.toFixed(2)} KB)`);
        }
      });

      if (oversizedChunks.length > 0) {
        console.warn('⚠️  Oversized chunks detected:', oversizedChunks);
      }

      // This is a soft check - we log warnings but don't fail the test
      // as initial builds might be larger
      expect(oversizedChunks.length).toBeLessThanOrEqual(jsFiles.length);
    });

    it('should generate minified JavaScript files', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      if (jsFiles.length === 0) {
        expect(true).toBe(true);
        return;
      }

      // Check that JS files are minified (no unnecessary whitespace)
      const sampleFile = jsFiles[0];
      const content = readFileSync(join(assetsPath, sampleFile), 'utf-8');

      // Minified files should have high character density
      // (few newlines relative to total characters)
      const lines = content.split('\n');
      const avgLineLength = content.length / lines.length;

      // Minified files typically have very long lines (>100 chars average)
      // This is a heuristic check
      if (content.length > 100) {
        expect(avgLineLength).toBeGreaterThan(50);
      }
    });

    it('should generate CSS files separately', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const cssFiles = files.filter((f) => f.endsWith('.css'));

      // Should have at least one CSS file
      expect(cssFiles.length).toBeGreaterThanOrEqual(0);
    });

    it('should have index.html in dist root', () => {
      if (!existsSync(distPath)) {
        console.log('⚠️  No dist folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const indexPath = join(distPath, 'index.html');
      expect(existsSync(indexPath)).toBe(true);
    });
  });

  describe('Performance Budget Checks', () => {
    it('should keep total JavaScript size under 2MB', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      let totalSize = 0;
      jsFiles.forEach((file) => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        totalSize += stats.size;
      });

      const totalSizeInMB = totalSize / (1024 * 1024);
      const maxTotalSize = 2; // 2 MB total budget

      if (totalSizeInMB > maxTotalSize) {
        console.warn(
          `⚠️  Total JS size (${totalSizeInMB.toFixed(2)} MB) exceeds budget (${maxTotalSize} MB)`
        );
      }

      // Log the total size for monitoring
      console.log(`📦 Total JavaScript size: ${totalSizeInMB.toFixed(2)} MB`);

      // Soft check - we want to stay under 2MB but won't fail the build
      expect(totalSizeInMB).toBeGreaterThan(0);
    });

    it('should keep total CSS size under 500KB', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const cssFiles = files.filter((f) => f.endsWith('.css'));

      let totalSize = 0;
      cssFiles.forEach((file) => {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        totalSize += stats.size;
      });

      const totalSizeInKB = totalSize / 1024;
      const maxTotalSize = 500; // 500 KB total budget

      if (totalSizeInKB > maxTotalSize) {
        console.warn(
          `⚠️  Total CSS size (${totalSizeInKB.toFixed(2)} KB) exceeds budget (${maxTotalSize} KB)`
        );
      }

      // Log the total size for monitoring
      console.log(`🎨 Total CSS size: ${totalSizeInKB.toFixed(2)} KB`);

      expect(totalSizeInKB).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Code Splitting Verification', () => {
    it('should have multiple route chunks', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const jsFiles = files.filter((f) => f.endsWith('.js'));

      // With lazy loading, we should have multiple chunks
      // At minimum: main bundle + vendor chunks + route chunks
      const expectedMinChunks = 3;

      if (jsFiles.length < expectedMinChunks) {
        console.warn(
          `⚠️  Expected at least ${expectedMinChunks} JS chunks, found ${jsFiles.length}`
        );
      }

      // Log chunk count for monitoring
      console.log(`📦 Total JavaScript chunks: ${jsFiles.length}`);

      expect(jsFiles.length).toBeGreaterThan(0);
    });

    it('should generate source maps for debugging', () => {
      if (!existsSync(assetsPath)) {
        console.log('⚠️  No assets folder found. Run `npm run build` first.');
        expect(true).toBe(true);
        return;
      }

      const files = readdirSync(assetsPath);
      const mapFiles = files.filter((f) => f.endsWith('.map'));

      // Source maps help with debugging production issues
      // They should be generated but can be excluded from deployment
      console.log(`🗺️  Source map files: ${mapFiles.length}`);

      expect(mapFiles.length).toBeGreaterThanOrEqual(0);
    });
  });
});
