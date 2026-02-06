const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function listCloudinaryFiles() {
  try {
    console.log('Fetching files from Cloudinary...\n');
    
    // Get all resources from the vibe-holidays/gallery folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'vibe-holidays/gallery',
      max_results: 500,
      resource_type: 'image'
    });

    console.log(`Found ${result.resources.length} images:\n`);
    
    result.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}\n`);
    });

    // Get videos
    const videoResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'vibe-holidays/gallery',
      max_results: 500,
      resource_type: 'video'
    });

    console.log(`\nFound ${videoResult.resources.length} videos:\n`);
    
    videoResult.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}\n`);
    });

    console.log('\n✓ Copy these URLs and use them in your gallery!');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.error && error.error.message) {
      console.error('Details:', error.error.message);
    }
  }
}

listCloudinaryFiles();
