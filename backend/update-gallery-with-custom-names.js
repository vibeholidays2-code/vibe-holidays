const mongoose = require('mongoose');
require('dotenv').config();

const gallerySchema = new mongoose.Schema({
  url: String,
  category: String,
  caption: String,
  destination: String,
  order: Number,
  createdAt: Date
});

const Gallery = mongoose.model('Gallery', gallerySchema);

async function updateGalleryWithCustomNames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Clear existing gallery items
    await Gallery.deleteMany({});
    console.log('✓ Cleared existing gallery items\n');

    // Map URLs to custom names from GALLERY_PHOTO_LIST.md
    const galleryItems = [
      // IMAGES (13 photos)
      {
        caption: 'Bali',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376000/WhatsApp_Image_2026-02-06_at_3.15.36_PM_sgggck.jpg',
        category: 'Destinations',
        destination: 'Bali',
        order: 1
      },
      {
        caption: 'Bali',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376001/a33bcec2-aba1-480c-8c96-d261b9ceb46f_sg1mjx.jpg',
        category: 'Destinations',
        destination: 'Bali',
        order: 2
      },
      {
        caption: 'Bali',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376001/d121a179-6425-410c-b316-bfb182f6a3c8_jbzixv.jpg',
        category: 'Destinations',
        destination: 'Bali',
        order: 3
      },
      {
        caption: 'Bali',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376001/d7260db0-dcf6-4809-b493-437be4d20e8a_ov8izy.jpg',
        category: 'Destinations',
        destination: 'Bali',
        order: 4
      },
      {
        caption: 'Ayodhya',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376000/WhatsApp_Image_2026-02-06_at_3.15.37_PM_zwsagp.jpg',
        category: 'Destinations',
        destination: 'Ayodhya',
        order: 5
      },
      {
        caption: 'Bali',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376000/867a6b73-6d89-4500-9232-5a35d3cc64c0_yjfmtf.jpg',
        category: 'Destinations',
        destination: 'Bali',
        order: 6
      },
      {
        caption: 'Ayodhya',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770376000/WhatsApp_Image_2026-02-06_at_3.15.37_PM_2_jphh0f.jpg',
        category: 'Destinations',
        destination: 'Ayodhya',
        order: 7
      },
      {
        caption: 'Jaisalmer',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375999/0c1925c1-05c6-427c-80ab-eff4a3d16567_n5z65v.jpg',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 8
      },
      {
        caption: 'Ayodhya',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375998/WhatsApp_Image_2026-02-06_at_3.15.37_PM_1_orcwx3.jpg',
        category: 'Destinations',
        destination: 'Ayodhya',
        order: 9
      },
      {
        caption: 'Jaisalmer',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 10
      },
      {
        caption: 'Jaisalmer',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375996/WhatsApp_Image_2026-02-06_at_3.15.38_PM_2_nowwyq.jpg',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 11
      },
      {
        caption: 'Jaisalmer',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375996/WhatsApp_Image_2026-02-06_at_3.15.38_PM_clpnyy.jpg',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 12
      },
      {
        caption: 'Jaisalmer',
        url: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375996/WhatsApp_Image_2026-02-06_at_3.15.38_PM_1_a0r0zm.jpg',
        category: 'Destinations',
        destination: 'Jaisalmer',
        order: 13
      },
      
      // VIDEOS (4 videos)
      {
        caption: 'Bali Feedback',
        url: 'https://res.cloudinary.com/dpsytvwmh/video/upload/v1770376000/WhatsApp_Video_2026-02-06_at_3.15.36_PM_rj7lav.mp4',
        category: 'Videos',
        destination: 'Bali',
        order: 14
      },
      {
        caption: 'Shimla Feedback',
        url: 'https://res.cloudinary.com/dpsytvwmh/video/upload/v1770375999/feedback_2_ihngb4.mp4',
        category: 'Videos',
        destination: 'Shimla',
        order: 15
      },
      {
        caption: 'Bali Feedback',
        url: 'https://res.cloudinary.com/dpsytvwmh/video/upload/v1770375999/feedback_uiwn9l.mp4',
        category: 'Videos',
        destination: 'Bali',
        order: 16
      },
      {
        caption: 'Advanture in Bali',
        url: 'https://res.cloudinary.com/dpsytvwmh/video/upload/v1770375998/bali_tp80yp.mp4',
        category: 'Videos',
        destination: 'Bali',
        order: 17
      }
    ];

    // Insert gallery items
    for (const item of galleryItems) {
      await Gallery.create({
        ...item,
        createdAt: new Date()
      });
      console.log(`✓ Added: ${item.caption} (${item.destination})`);
    }

    console.log(`\n✓ Successfully updated ${galleryItems.length} gallery items with custom names!`);
    console.log('\nYour gallery now shows your custom photo names! 🎉');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateGalleryWithCustomNames();
