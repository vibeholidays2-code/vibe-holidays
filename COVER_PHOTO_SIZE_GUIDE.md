# 📸 Cover Photo Size Guide for Vibe Holidays

## Recommended Sizes

### 🎯 Optimal Size (Best Quality)
**1200 x 800 pixels** (3:2 aspect ratio)
- Perfect for all displays
- Good balance of quality and file size
- Works great on mobile and desktop

### ✅ Acceptable Sizes

| Use Case | Dimensions | Aspect Ratio | Notes |
|----------|------------|--------------|-------|
| **Standard** | 1200 x 800 px | 3:2 | Recommended |
| **High Quality** | 1920 x 1280 px | 3:2 | For premium look |
| **Minimum** | 800 x 600 px | 4:3 | Acceptable but not ideal |
| **Landscape** | 1600 x 900 px | 16:9 | Works well |

## Where Cover Photos Appear

### 1. Package Cards (Homepage & Packages Page)
- **Display Size**: 
  - Mobile: ~350px wide
  - Tablet: ~400px wide
  - Desktop: ~450px wide
- **Height**: ~250-300px
- **Recommended**: 1200 x 800 px

### 2. Package Detail Page Hero
- **Display Size**: Full width
  - Mobile: 100% width, ~300px height
  - Desktop: 100% width, ~500px height
- **Recommended**: 1920 x 1280 px (for best quality)

### 3. Featured Packages Section
- **Display Size**: Similar to package cards
- **Recommended**: 1200 x 800 px

## Aspect Ratio Guidelines

### ✅ Best Aspect Ratios
1. **3:2** (1200 x 800) - Most versatile
2. **16:9** (1600 x 900) - Modern widescreen
3. **4:3** (1200 x 900) - Classic format

### ❌ Avoid These
- Square (1:1) - Will be cropped
- Portrait (2:3) - Not suitable for cards
- Ultra-wide (21:9) - Too wide

## File Format & Quality

### Format
- **Best**: JPG (for photos)
- **Alternative**: PNG (for graphics with transparency)
- **Avoid**: GIF, BMP

### Quality Settings
- **Compression**: 80-90% quality
- **File Size**: 
  - Target: 100-300 KB
  - Maximum: 500 KB
  - Minimum: 50 KB

## Image Optimization Tips

### 1. Use Cloudinary Transformations
Your images are hosted on Cloudinary, which can automatically optimize them:

```
Original URL:
https://res.cloudinary.com/dpsytvwmh/image/upload/v1770803087/1_sc4g1v.png

Optimized URL (1200x800, quality 80):
https://res.cloudinary.com/dpsytvwmh/image/upload/w_1200,h_800,c_fill,q_80/v1770803087/1_sc4g1v.png
```

### 2. Cloudinary Parameters
- `w_1200` - Width 1200px
- `h_800` - Height 800px
- `c_fill` - Crop to fill (maintains aspect ratio)
- `q_80` - Quality 80%
- `f_auto` - Auto format (WebP for modern browsers)

### 3. Example Optimized URLs

**For Package Cards:**
```
https://res.cloudinary.com/dpsytvwmh/image/upload/w_800,h_600,c_fill,q_85,f_auto/v1770803087/1_sc4g1v.png
```

**For Hero Images:**
```
https://res.cloudinary.com/dpsytvwmh/image/upload/w_1920,h_1280,c_fill,q_90,f_auto/v1770803087/1_sc4g1v.png
```

## Current Image Analysis

### Your Phu Quoc Cover Photo
**URL**: `https://res.cloudinary.com/dpsytvwmh/image/upload/v1770803087/1_sc4g1v.png`

**Status**: ✅ Good quality
**Format**: PNG
**Recommendation**: Already suitable, but can be optimized further

**Optimized Version** (recommended):
```
https://res.cloudinary.com/dpsytvwmh/image/upload/w_1200,h_800,c_fill,q_85,f_auto/v1770803087/1_sc4g1v.png
```

## Quick Reference Chart

| Screen | Width | Height | Aspect | File Size |
|--------|-------|--------|--------|-----------|
| Mobile | 800px | 600px | 4:3 | 100-150 KB |
| Tablet | 1200px | 800px | 3:2 | 150-250 KB |
| Desktop | 1920px | 1280px | 3:2 | 250-400 KB |

## Best Practices

### ✅ DO
- Use high-quality, sharp images
- Choose images with good lighting
- Ensure main subject is centered
- Use landscape orientation
- Compress images before uploading
- Test on mobile and desktop

### ❌ DON'T
- Use blurry or pixelated images
- Upload images larger than 2MB
- Use portrait orientation
- Include too much text in image
- Use dark images (hard to see details)

## Image Composition Tips

### For Travel Package Photos
1. **Show the destination** - Iconic landmarks or scenery
2. **Include people** (optional) - Adds scale and emotion
3. **Good lighting** - Natural daylight is best
4. **Clear focal point** - One main subject
5. **Vibrant colors** - Attracts attention

### Examples of Good Cover Photos
- ✅ Golden Bridge with clear sky (your current Phu Quoc image)
- ✅ Beach with turquoise water
- ✅ Mountain landscape with clear view
- ✅ City skyline at sunset
- ✅ Cultural landmarks

### Examples to Avoid
- ❌ Crowded scenes with no focal point
- ❌ Dark or underexposed images
- ❌ Blurry or out-of-focus shots
- ❌ Images with watermarks
- ❌ Low-resolution images

## How to Prepare Images

### Step 1: Choose Your Image
- Select high-quality photo
- Ensure it represents the destination

### Step 2: Resize (if needed)
**Tools**:
- Online: [Squoosh.app](https://squoosh.app)
- Desktop: Photoshop, GIMP
- Mobile: Snapseed, Lightroom Mobile

**Target**: 1200 x 800 pixels

### Step 3: Compress
- Use 80-90% quality
- Target file size: 100-300 KB

### Step 4: Upload to Cloudinary
- Upload through Cloudinary dashboard
- Or use the upload API
- Get the URL

### Step 5: Update Package
- Use the update script
- Or contact me to update it

## Testing Your Images

### Checklist
- [ ] Image loads quickly (< 2 seconds)
- [ ] Looks sharp on mobile
- [ ] Looks sharp on desktop
- [ ] Colors are vibrant
- [ ] Main subject is visible
- [ ] No pixelation or blur
- [ ] File size < 500 KB

## Need Help?

If you need help optimizing images:
1. Share the image URL
2. I'll create optimized versions
3. Update the package for you

## Summary

**Recommended Size**: 1200 x 800 pixels (3:2 ratio)
**Format**: JPG (80-90% quality)
**File Size**: 100-300 KB
**Aspect Ratio**: 3:2 or 16:9

Your current Phu Quoc image is good quality and will work well on the website!
