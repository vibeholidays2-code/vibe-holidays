const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Ujjain - Omkareshwar - Indore (2 Jyotirlinga Tour)',
  destination: 'Ujjain',
  duration: 2,
  price: 10000,
  description: '2 Jyotirlinga Group Tour covering Mahakaleshwar (Ujjain) and Omkareshwar. Group tour from Ahmedabad via AC Sleeper Bus. Experience divine darshan, Bhasma Aarti, Ram Ghat Aarti, and Indore city sightseeing. Includes breakfast + dinner with comfortable hotel stays.',
  coverPhoto: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
  highlights: [
    'Mahakaleshwar Jyotirlinga Darshan',
    'Bhasma Aarti - Early Morning (Day 3)',
    'Omkareshwar Jyotirlinga Darshan',
    'Ram Ghat - Shipra Aarti',
    'Narmada Ghat - Omkareshwar',
    'Kal Bhairav Temple',
    'Harsiddhi Mata Temple',
    'Chintaman Ganesh Temple',
    'Indore City Sightseeing',
    'Sarafa Bazaar / Chappan Dukan'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Ahmedabad → Ujjain',
      description: 'Evening departure from Ahmedabad. Overnight journey by AC Sleeper Bus.'
    },
    {
      day: 2,
      title: 'Ujjain Darshan | Overnight Stay',
      description: 'Mahakaleshwar Jyotirlinga Darshan. Visit Kal Bhairav, Harsiddhi Mata, Chintaman Ganesh. Ram Ghat – Evening Aarti. Dinner at Hotel. Overnight Stay – Ujjain.'
    },
    {
      day: 3,
      title: 'Bhasma Aarti → Omkareshwar → Indore',
      description: 'Early Morning Bhasma Aarti. Omkareshwar Jyotirlinga Darshan. Narmada Ghat & Mamleshwar Temple. Indore Sightseeing + Sarafa Bazaar. Dinner at Hotel. Overnight Stay – Indore.'
    },
    {
      day: 4,
      title: 'Indore | Self Explore → Night Departure',
      description: 'Breakfast at Hotel. Full day free for self explore. Night departure to Ahmedabad. Tour ends with divine blessings.'
    }
  ],
  inclusions: [
    'Ahmedabad ⇄ Ujjain ⇄ Indore AC Sleeper Bus',
    'Ujjain ⇄ Omkareshwar ⇄ Indore transfers',
    '1 Night stay in Ujjain + 1 Night stay in Indore',
    'Breakfast & Dinner (MAP) for 2 days',
    'All sightseeing as per itinerary',
    'Tour coordination & assistance',
    'GST Included'
  ],
  exclusions: [
    'Lunch',
    'Bhasma Aarti charges (arranged at additional cost)',
    'VIP / Special Darshan charges',
    'Personal expenses',
    'Anything not mentioned in inclusions'
  ],
  category: 'Pilgrimage & Spiritual',
  idealFor: 'Pilgrims, Families, Groups',
  tourType: 'Group',
  accommodation: 'Ujjain (1N): The Byke Boutique – Mahakal Aangan, Indore (1N): The Byke Stella Boutique Hotel',
  meals: 'Daily Breakfast + Dinner',
  transport: 'AC Sleeper Bus (Ahmedabad-Ahmedabad), Local transfers for sightseeing',
  groupDepartures: ['20 February 2026'],
  pricingOptions: [
    { type: 'Double Sharing', price: 10000 },
    { type: 'Triple Sharing', price: 9500 }
  ],
  active: true,
  featured: false,
  brochureUrl: '/brochures/ujjain-omkareshwar-tour.pdf'
};

async function addPackage() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('vibes-holidays');
    const packages = db.collection('packages');
    
    const result = await packages.insertOne(packageData);
    
    console.log('✅ Package added successfully!');
    console.log(`Package ID: ${result.insertedId}\n`);
    console.log('Package Details:');
    console.log(`  Name: ${packageData.name}`);
    console.log(`  Destination: ${packageData.destination}`);
    console.log(`  Duration: ${packageData.duration}N/${packageData.duration + 1}D`);
    console.log(`  Price: ₹${packageData.price} per person (Double Sharing)`);
    console.log(`  Tour Type: ${packageData.tourType}`);
    console.log(`  Category: ${packageData.category}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

addPackage();
