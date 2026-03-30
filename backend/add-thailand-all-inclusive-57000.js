const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Thailand All-Inclusive - Krabi, Phuket & Bangkok',
  destination: 'Thailand',
  duration: 6,
  price: 57000,
  description: 'Ultimate Thailand experience with this 6N/7D all-inclusive package covering Krabi, Phuket, and Bangkok. Experience Krabi Jungle Tour, 4 Island Tour, Phi Phi Island with Maya Bay, Phuket Fantasea Show, Chao Phraya Dinner Cruise, and Safari World. Includes multiple lunches and dinners.',
  coverPhoto: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800&q=80',
  highlights: [
    'Krabi Jungle Tour - Emerald Pool, Hot Springs, Tiger Cave Temple',
    'Krabi 4 Island Tour by Longtail Boat with lunch',
    'Phi Phi Island Tour - Maya Bay, Monkey Beach, Viking Cave',
    'Phuket Fantasea Show with dinner',
    'Chao Phraya Princess Dinner Cruise with international buffet',
    'Safari World & Marine Park with lunch',
    'Bangkok Temple Tour - Golden Buddha, Reclining Buddha',
    'Phuket City Tour - Big Buddha, Karon View Point',
    '4★ hotels throughout',
    'Multiple meals included - 3 lunches + 2 dinners'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival Phuket → Krabi | Jungle Tour',
      description: 'Arrival at Phuket Airport. Private Transfer to Krabi Hotel. Krabi Jungle Tour (Private): Emerald Pool, Hot Springs, Tiger Cave Temple. Lunch Included. Overnight stay in Krabi.'
    },
    {
      day: 2,
      title: 'Krabi 4 Island Tour',
      description: 'Breakfast. 4 Island Tour by Longtail Boat (SIC): Phra Nang Cave Beach, Chicken Island, Tup Island, Poda Island. Lunch Included. Overnight stay in Krabi.'
    },
    {
      day: 3,
      title: 'Krabi → Phuket (City Tour)',
      description: 'Breakfast & check-out. Private Transfer to Phuket. En-route Phuket City Tour: Karon View Point, Big Buddha (Photo Stop), Local markets. Overnight stay in Phuket.'
    },
    {
      day: 4,
      title: 'Phi Phi Island + Phuket Fantasea',
      description: 'Breakfast. Phi Phi Island Tour by Speed Boat (SIC): Maya Bay, Monkey Beach, Viking Cave. Lunch Included. Evening Phuket Fantasea Show + Dinner. Private Transfers. Overnight stay in Phuket.'
    },
    {
      day: 5,
      title: 'Phuket → Bangkok | Temple Tour + Cruise',
      description: 'Breakfast & check-out. Private Transfer to Phuket Airport. Flight to Bangkok. Bangkok Temple Tour: Golden Buddha, Mini Reclining Buddha, Gems Gallery. Chao Phraya Princess Dinner Cruise with International Buffet Dinner. Overnight stay in Bangkok.'
    },
    {
      day: 6,
      title: 'Safari World & Marine Park',
      description: 'Breakfast. Safari World + Marine Park (SIC): Safari Drive, Marine Animal Shows. Lunch Included. Overnight stay in Bangkok.'
    },
    {
      day: 7,
      title: 'Departure',
      description: 'Breakfast & check-out. Private Transfer to Airport. Tour ends with beautiful memories.'
    }
  ],
  inclusions: [
    '6 Nights accommodation in 4★ hotels',
    'Daily breakfast',
    'All airport & inter-city transfers',
    'Private transfers where mentioned',
    'SIC tours as per itinerary',
    'All sightseeing & entry fees',
    '3 Lunches (Krabi Jungle, 4 Island, Phi Phi)',
    '2 Dinners (Phuket Fantasea, Chao Phraya Cruise)',
    'GST + TCS + Travel Insurance included'
  ],
  exclusions: [
    'International airfare',
    'Domestic flight Phuket to Bangkok',
    'Personal expenses',
    'Anything not mentioned in inclusions'
  ],
  category: 'International Tours',
  idealFor: 'Couples, Families, Luxury Travelers',
  tourType: 'Group',
  accommodation: 'Krabi (2N): The Cliff Elegance (4★ Superior Room), Phuket (2N): Ashlee Plaza Patong (4★ Superior Room), Bangkok (2N): Bangkok Palace (4★ Superior Room)',
  meals: 'Daily Breakfast + 3 Lunches + 2 Dinners',
  transport: 'Private transfers, Longtail boat, Speedboat, Domestic flight Phuket-Bangkok',
  pricingOptions: [
    { type: 'Double Sharing', price: 57000 },
    { type: 'Triple Sharing', price: 49000 }
  ],
  active: true,
  featured: true,
  brochureUrl: '/brochures/thailand-all-inclusive.pdf'
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
