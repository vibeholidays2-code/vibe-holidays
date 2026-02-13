const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpsytvwmh',
  api_key: '298881913228449',
  api_secret: 'fWxgsbCBB_AUZY5wlJNGPIgC1W4'
});

async function listJaisalmerPhotos() {
  try {
    console.log('Fetching Jaisalmer photos from Cloudinary...\n');

    // List all resources
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Root folder
      max_results: 500
    });

    console.log(`Total files found: ${result.resources.length}\n`);

    // Get all image files and sort by date
    const allPhotos = result.resources
      .filter(resource => {
        return resource.format === 'png' || resource.format === 'jpg' || resource.format === 'jpeg';
      })
      .map(resource => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by newest first

    console.log(`Found ${allPhotos.length} image files (sorted by newest first):\n`);

    allPhotos.slice(0, 20).forEach((photo, index) => {
      console.log(`${index + 1}. ${photo.public_id}.${photo.format}`);
      console.log(`   URL: ${photo.url}`);
      console.log(`   Size: ${photo.width}x${photo.height}`);
      console.log(`   Created: ${photo.created_at}`);
      console.log('');
    });

    // Save to file for reference
    const fs = require('fs');
    fs.writeFileSync(
      'backend/jaisalmer-photos-list.json',
      JSON.stringify(allPhotos.slice(0, 20), null, 2)
    );
    console.log('✅ Photo list saved to backend/jaisalmer-photos-list.json');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listJaisalmerPhotos();
