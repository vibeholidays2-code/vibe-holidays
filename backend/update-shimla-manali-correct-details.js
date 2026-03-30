const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function updateShimlaManaliPackage() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const updatedData = {
      name: 'Shimla - Manali Tour Package',
      destination: 'Manali',
      duration: '5N/6D',
      price: 17000,
      coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      description: 'Experience the best of Himachal with our Shimla-Manali tour covering scenic hill stations, colonial architecture, snow-capped mountains, and adventure activities. Private Innova Crysta throughout the tour.',
      highlights: [
        'Private Innova Crysta entire tour',
        'Shimla Mall Road & Kufri',
        'Solang Valley Adventure',
        'Manali Local Sightseeing',
        'Hidimba & Vashisht Temples',
        'Daily Breakfast & Dinner',
        'All Transfers & Sightseeing',
        'Professional Driver'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Delhi → Shimla',
          description: 'Pickup from Delhi and drive to Shimla. Scenic mountain drive. Hotel check-in. Evening Mall Road visit. Dinner. Overnight stay in Shimla.'
        },
        {
          day: 2,
          title: 'Shimla & Kufri Sightseeing',
          description: 'After breakfast, visit Kufri Adventure Park with Himalayan views, Jakhu Temple, Mall Road, and Christ Church. Dinner and overnight stay in Shimla.'
        },
        {
          day: 3,
          title: 'Shimla → Manali',
          description: 'After breakfast, drive to Manali. Enroute visit Kullu Valley and river rafting point. Hotel check-in Manali. Dinner and overnight stay in Manali.'
        },
        {
          day: 4,
          title: 'Solang Valley',
          description: 'After breakfast, visit Solang Valley. Optional activities: Ropeway, Snow scooter, Paragliding. Dinner and overnight stay in Manali.'
        },
        {
          day: 5,
          title: 'Manali Local Sightseeing',
          description: 'After breakfast, local sightseeing: Hidimba Temple, Vashisht Temple, Tibetan Monastery, Mall Road. Dinner and overnight stay in Manali.'
        },
        {
          day: 6,
          title: 'Manali → Delhi',
          description: 'After breakfast, drive back to Delhi. Tour ends with beautiful memories.'
        }
      ],
      inclusions: [
        'Private Innova Crysta entire tour',
        '2 Nights Shimla hotel',
        '3 Nights Manali hotel',
        'Daily breakfast',
        'Daily dinner',
        'All transfers & sightseeing',
        'Toll, parking, driver allowance'
      ],
      exclusions: [
        'GST',
        'Rohtang pass permit',
        'Adventure activities',
        'Lunch',
        'Personal expenses'
      ],
      hotels: [
        {
          location: 'Shimla',
          name: 'DLS Hillcrest Resort',
          roomType: 'Standard Room',
          meals: 'Breakfast + Dinner'
        },
        {
          location: 'Manali',
          name: 'Hotel Swastik Grand',
          roomType: 'Deluxe Room',
          meals: 'Breakfast + Dinner'
        }
      ],
      pricing: [
        {
          category: 'Per Person (Double Sharing)',
          price: 17000
        }
      ],
      category: 'Adventure & Mountains',
      idealFor: 'Families, Couples, Friends',
      travelDates: 'Year Round (Best: March to June, September to November)',
      groupSize: 'Minimum 2 persons',
      active: true,
      featured: false,
      updatedAt: new Date()
    };

    const result = await Package.updateOne(
      { _id: new mongoose.Types.ObjectId('69ca3ea22bdd38452d1c12c9') },
      { $set: updatedData }
    );
    
    console.log('✅ Updated Shimla-Manali package with correct details');
    console.log('Modified count:', result.modifiedCount);

    // Verify the update
    const pkg = await Package.findById('69ca3ea22bdd38452d1c12c9').select('name destination duration price hotels');
    console.log('\n📦 Updated Package:');
    console.log('Name:', pkg.name);
    console.log('Destination:', pkg.destination);
    console.log('Duration:', pkg.duration);
    console.log('Price: ₹' + pkg.price);
    console.log('Hotels:', pkg.hotels.map(h => `${h.location}: ${h.name}`).join(', '));

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateShimlaManaliPackage();
