const https = require('https');

// Cloudinary collection URL
const collectionUrl = 'https://collection.cloudinary.com/dpsytvwmh/a4632d93904afb4d164f22c2e15e294d';

console.log('Fetching Vietnam images from Cloudinary collection...');
console.log('Collection URL:', collectionUrl);
console.log('\nPlease manually check the collection and provide the correct image URLs.');
console.log('\nThe images should be in this format:');
console.log('https://res.cloudinary.com/dpsytvwmh/image/upload/v[version]/[public_id].jpg');
