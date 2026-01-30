const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Package Schema
const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

async function addBrochureUrls() {
  try {
    console.log('📄 Adding brochure URLs to packages...\n');

    // Update Bali packages
    const baliPackages = await Package.find({ category: 'Bali' }).sort({ price: 1 });
    
    if (baliPackages.length >= 4) {
      await Package.updateOne(
        { _id: baliPackages[0]._id },
        { $set: { brochureUrl: 'http://localhost:5000/brochures/bali-25000.pdf' } }
      );
      console.log(`✅ Updated: ${baliPackages[0].name} - Added brochure URL`);

      await Package.updateOne(
        { _id: baliPackages[1]._id },
        { $set: { brochureUrl: 'http://localhost:5000/brochures/bali-27000.pdf' } }
      );
      console.log(`✅ Updated: ${baliPackages[1].name} - Added brochure URL`);

      await Package.updateOne(
        { _id: baliPackages[2]._id },
        { $set: { brochureUrl: 'http://localhost:5000/brochures/bali-30000.pdf' } }
      );
      console.log(`✅ Updated: ${baliPackages[2].name} - Added brochure URL`);

      await Package.updateOne(
        { _id: baliPackages[3]._id },
        { $set: { brochureUrl: 'http://localhost:5000/brochures/bali-35000.pdf' } }
      );
      console.log(`✅ Updated: ${baliPackages[3].name} - Added brochure URL`);
    }

    // Update Jaisalmer packages
    const groupTour = await Package.findOne({ name: /Jaisalmer Desert Group Tour/i });
    if (groupTour) {
      await Package.updateOne(
        { _id: groupTour._id },
        { $set: { brochureUrl: 'http://localhost:5000/brochures/jaisalmer-group-tour.pdf' } }
      );
      console.log(`✅ Updated: ${groupTour.name} - Added brochure URL`);
    }

    const privateTour = await Package.findOne({ name: /Jaisalmer Private/i });
    if (privateTour) {
      await Package.updateOne(
        { _id: privateTour._id },
        { $set: { brochureUrl: 'http://localhost:5000/brochures/jaisalmer-private-tour.pdf' } }
      );
      console.log(`✅ Updated: ${privateTour.name} - Added brochure URL`);
    }

    console.log('\n🎉 All brochure URLs added successfully!');
    console.log('\n💡 Users can now click "View Full Brochure" to see the complete PDF details');
    console.log('🌐 Visit: http://localhost:5173/packages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding brochure URLs:', error);
    process.exit(1);
  }
}

addBrochureUrls();
