const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

async function deleteAndAddCorrectPackage() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete the incorrect package
    await Package.deleteOne({ _id: new mongoose.Types.ObjectId('69ca3ea22bdd38452d1c12c9') });
    console.log('✅ Deleted incorrect Shimla-Manali package\n');

    // Add the correct package with your exact details
    const shimlaManaliPackage = {
      name: 'Shimla - Manali Tour Package',
      destination: 'Manali',
      duration: '5N/6D',
      price: 17000,
      coverPhoto: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      description: 'Experience the best of Himachal with our Shimla-Manali tour covering scenic hill stations, colonial architecture, snow-capped mountains, and adventure activities. Private Innova Crysta throughout the tour.',
      highlights: [
        'Private Innova Crysta entire tour',
        'Shimla Mall Road & Christ Church',
        'Kufri Adventure Park',
        'Jakhu Temple',
        'Solang Valley Activities',
        'Hidimba Temple',
        'Vashisht Temple',
        'Tibetan Monastery'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Delhi → Shimla',
          description: 'Pickup from Delhi & drive to Shimla. Scenic mountain drive. Hotel check-in. Evening Mall Road visit. Dinner. Overnight stay in Shimla.'
        },
        {
          day: 2,
          title: 'Shimla & Kufri Sightseeing',
          description: 'Breakfast. Sightseeing: Kufri Adventure park, Himalayan views, Jakhu Temple, Mall Road, Christ Church. Dinner. Overnight stay in Shimla.'
        },
        {
          day: 3,
          title: 'Shimla → Manali',
          description: 'Breakfast. Drive to Manali. Enroute: Kullu Valley & river rafting point. Hotel check-in Manali. Dinner. Overnight stay in Manali.'
        },
        {
          day: 4,
          title: 'Solang Valley',
          description: 'Breakfast. Visit Solang Valley. Activities (optional): Ropeway, Snow scooter, Paragliding. Dinner. Overnight stay in Manali.'
        },
        {
          day: 5,
          title: 'Manali Local Sightseeing',
          description: 'Breakfast. Local sightseeing: Hidimba Temple, Vashisht Temple, Tibetan Monastery, Mall Road. Dinner. Overnight stay in Manali.'
        },
        {
          day: 6,
          title: 'Manali → Delhi',
          description: 'Breakfast. Drive back to Delhi. Tour ends with beautiful memories.'
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
          roomType: 'Standard Room',
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
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Package.create(shimlaManaliPackage);
    console.log('✅ Correct Shimla-Manali package added successfully!');
    console.log('Package ID:', result._id);
    console.log('Package Name:', result.name);
    console.log('Duration:', result.duration);
    console.log('Price: ₹' + result.price);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteAndAddCorrectPackage();
