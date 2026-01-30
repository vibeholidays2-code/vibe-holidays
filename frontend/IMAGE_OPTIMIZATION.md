# Image Optimization Guide

This document provides guidelines for optimizing images in the Vibe Holidays website.

## Current Optimizations

### 1. Lazy Loading
- All gallery images use the `loading="lazy"` attribute
- Images are loaded only when they enter the viewport
- Reduces initial page load time

### 2. Responsive Images
- Images are served at appropriate sizes for different devices
- Use srcset and sizes attributes when possible

## Recommended Practices

### Image Formats
1. **WebP Format**: Use WebP for better compression (30% smaller than JPEG)
2. **Fallback**: Provide JPEG/PNG fallbacks for older browsers
3. **SVG**: Use SVG for logos and icons

### Image Compression
Before uploading images:
1. Compress images using tools like:
   - TinyPNG (https://tinypng.com/)
   - ImageOptim (https://imageoptim.com/)
   - Squoosh (https://squoosh.app/)

2. Target file sizes:
   - Thumbnails: < 50KB
   - Full-size images: < 200KB
   - Hero images: < 500KB

### Image Dimensions
Recommended dimensions for different use cases:
- Package thumbnails: 800x600px
- Package detail images: 1200x800px
- Gallery images: 1200x800px
- Hero images: 1920x1080px

### Implementation Example

```tsx
// Using picture element for WebP with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// Using img with lazy loading
<img 
  src="image.jpg" 
  alt="Description" 
  loading="lazy"
  width="800"
  height="600"
/>
```

## CDN Integration (Future Enhancement)

For production, consider using a CDN with automatic image optimization:
- Cloudinary
- Imgix
- AWS CloudFront with Lambda@Edge

These services can:
- Automatically convert to WebP
- Resize images on-the-fly
- Serve from edge locations
- Apply compression automatically
