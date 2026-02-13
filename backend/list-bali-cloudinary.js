const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpsytvwmh',
  api_key: '298881913228449',
  api_secret: 'fWxgsbCBB_AUZY5wlJNGPIgC1W4'
});

async function listBaliPhotos() {
  try {
    console.log('Fetching Bali photos from Cloudinary...\n');

    // List all resources in the root folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Root folder
      max_results: 500
    });

    console.log(`Total files found: ${result.resources.length}\n`);

    // Filter for Bali-related images (you can adjust the filter)
    const baliPhotos = result.resources
      .filter(resource => {
        // Look for files that might be Bali photos
        // Adjust this filter based on your naming convention
        const filename = resource.public_id.toLowerCase();
        return resource.format === 'png' || resource.format === 'jpg' || resource.format === 'jpeg';
      })
      .map(resource => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at
      }));

    console.log(`Found ${baliPhotos.length} image files:\n`);

    baliPhotos.forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.public_id}.${photo.format}`);
      console.log(`   URL: ${photo.url}`);
      console.log(`   Size: ${photo.width}x${photo.height}`);
      console.log('');
    });

    // Save to file for reference
    const fs = require('fs');
    fs.writeFileSync(
      'backend/bali-photos-list.json',
      JSON.stringify(baliPhotos, null, 2)
    );
    console.log('✅ Photo list saved to backend/bali-photos-list.json');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listBaliPhotos();
