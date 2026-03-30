const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Thailand - Phuket & Krabi Holiday Package',
  destination: 'Thailand',
  duration: 5,
  price: 42000,
  description: 'Explore the stunning beaches and islands of Thailand with this 5N/6D package covering Phuket and Krabi. Experience Krabi 4 Island Tour, Phi Phi Island with Maya Bay, Phuket city tour, and pristine beaches. Includes breakfast daily, 2 lunches, and all island tours.',
  coverPhoto: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80',
  highlights: [
    'Krabi 4 Island Tour by Longtail Boat',
    'Phra Nang Beach, Chicken Island, Tup Island, Poda Island',
    'Phi Phi Island Tour by Speedboat',
    'Maya Bay - famous from "The Beach" movie',
    'Monkey Beach & Pileh Lagoon',
    'Phuket City Tour - Big Buddha & beaches',
    'Lunch included on island tours',
    'Private transfers between destinations',
    'GST + TCS + Travel Insurance included',
    '3★ hotels with breakfast daily'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival Phuket → Krabi',
      description: 'Arrival Phuket Airport. Private transfer to Krabi. Hotel check-in. Leisure time. Overnight stay in Krabi.'
    },
    {
      day: 2,
      title: 'Krabi 4 Island Tour',
      description: 'Breakfast. 4 Island Tour by Longtail Boat. Visit Phra Nang Beach, Chicken Island, Tup Island, Poda Island. Lunch box included. Overnight Krabi.'
    },
    {
      day: 3,
      title: 'Krabi → Phuket',
      description: 'Breakfast. Private transfer to Phuket. Hotel check-in. Evening free. Overnight Phuket.'
    },
    {
      day: 4,
      title: 'Phuket City Tour',
      description: 'Breakfast. Phuket City Tour. Visit Big Buddha, Beaches, Shopping stops. Overnight Phuket.'
    },
    {
      day: 5,
      title: 'Phi Phi Island',
      description: 'Breakfast. Phi Phi Island Tour by Speedboat. Visit Maya Bay, Monkey Beach, Pileh Lagoon. Lunch included. Overnight Phuket.'
    },
    {
      day: 6,
      title: 'Departure',
      description: 'Breakfast. Airport transfer. Return journey. Tour ends with beautiful memories.'
    }
  ],
  inclusions: [
    '5 Nights hotel stay (3★ hotels)',
    'Daily breakfast',
    'Krabi 4 island tour with lunch box',
    'Phi Phi island tour with lunch',
    'Phuket city tour',
    'Private transfers (airport & Krabi-Phuket)',
    'Travel insurance',
    'GST + TCS included'
  ],
  exclusions: [
    'International flights',
    'Thailand visa (if applicable)',
    'Island entry fees',
    'Lunch & dinner (except on island tours)',
    'Personal expenses',
    'Water sports activities'
  ],
  category: 'International Tours',
  idealFor: 'Couples, Families, Beach Lovers',
  tourType: 'Group',
  accommodation: 'Krabi (2N): Andamanee Boutique (3★ Deluxe Room with Balcony), Phuket (3N): Bel Aire Hotel (3★ Superior Room)',
  meals: 'Daily Breakfast + 2 Lunches (island tours)',
  transport: 'Private transfers, Longtail boat for Krabi islands, Speedboat for Phi Phi',
  active: true,
  featured: true,
  brochureUrl: '/brochures/thailand-phuket-krabi.pdf'
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
    console.log(`  Price: ₹${packageData.price} per person`);
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
