const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dpsytvwmh',
  api_key: '298881913228449',
  api_secret: 'fWxgsbCBB_AUZY5wlJNGPIgC1W4',
});

async function listVietnamPhotos() {
  try {
    console.log('🔍 Searching for Vietnam photos in Cloudinary...\n');

    // Search for images with 'vietnam' in the folder or name
    const result = await cloudinary.search
      .expression('folder:vietnam OR resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    console.log(`Found ${result.resources.length} images\n`);
    console.log('='.repeat(80));

    if (result.resources.length === 0) {
      console.log('\n❌ No Vietnam photos found!');
      console.log('\nTrying to list all images...\n');
      
      // List all images
      const allImages = await cloudinary.api.resources({
        type: 'upload',
        max_results: 100,
      });

      console.log(`Total images in Cloudinary: ${allImages.resources.length}\n`);
      
      allImages.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log(`   Format: ${resource.format}`);
        console.log(`   Size: ${(resource.bytes / 1024).toFixed(2)} KB\n`);
      });
    } else {
      result.resources.forEach((resource, index) => {
        console.log(`\n${index + 1}. ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}`);
        console.log(`   Format: ${resource.format}`);
        console.log(`   Width: ${resource.width}px`);
        console.log(`   Height: ${resource.height}px`);
        console.log(`   Size: ${(resource.bytes / 1024).toFixed(2)} KB`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Use these URLs to update your Vietnam packages!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.error && error.error.message) {
      console.error('Details:', error.error.message);
    }
  }
}

listVietnamPhotos();
