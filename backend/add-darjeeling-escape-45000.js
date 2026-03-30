const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Darjeeling Escape - Gangtok, Pelling & Darjeeling',
  destination: 'Darjeeling',
  duration: 6,
  price: 45000,
  description: 'Experience the enchanting beauty of Northeast India with this 6N/7D private tour covering Gangtok, Pelling, and Darjeeling. Visit Tsomgo Lake, Buddha Park, Kanchenjunga viewpoints, Tiger Hill sunrise, and explore tea gardens. Includes breakfast + dinner with private cab throughout.',
  coverPhoto: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  highlights: [
    'Tsomgo Lake (12,312 ft) & Baba Mandir (13,200 ft)',
    'Buddha Park with 130 ft statue in Ravangla',
    'Kanchenjunga viewpoints in Pelling',
    'Tiger Hill sunrise view',
    'Ghoom Monastery & Batasia Loop',
    'Himalayan Mountaineering Institute',
    'Padmaja Naidu Zoological Park',
    'Tea Garden visit',
    'Peace Pagoda',
    'Private cab for all transfers & sightseeing'
  ],
  itinerary: [
    {
      day: 1,
      title: 'NJP / IXB → Gangtok',
      description: 'Meet & greet on arrival at NJP Railway Station / IXB Airport. Transfer to Gangtok (5,500 ft.). Check-in & relax. Evening at leisure (explore MG Marg). Overnight stay in Gangtok.'
    },
    {
      day: 2,
      title: 'Tsomgo Lake & Baba Mandir',
      description: 'Breakfast at hotel. Excursion to Tsomgo Lake (12,312 ft.) and Baba Mandir (13,200 ft.). Optional: Nathula Pass (₹ Extra) (Closed Mon & Tue). Overnight stay in Gangtok.'
    },
    {
      day: 3,
      title: 'Gangtok → Pelling via Ravangla',
      description: 'Drive to Pelling via Ravangla. Visit Buddha Park (130 ft statue). Continue to Pelling (6,100 ft.). Enjoy close view of Kanchenjunga. Overnight stay in Pelling.'
    },
    {
      day: 4,
      title: 'Pelling Full Day Sightseeing',
      description: 'Visit Rimbi Waterfalls, Khecheopalri Lake & Monastery, Kanchenjunga Waterfalls, Rabdentse Ruins, Skywalk & View Tower. Evening free for leisure. Overnight stay in Pelling.'
    },
    {
      day: 5,
      title: 'Pelling → Darjeeling',
      description: 'Transfer to Darjeeling (6,950 ft.). Check-in & relax. Evening at leisure. Overnight stay in Darjeeling.'
    },
    {
      day: 6,
      title: 'Darjeeling Sightseeing',
      description: 'Early morning visit to Tiger Hill for Sunrise. Enroute visit Ghoom Monastery and Batasia Loop. Later sightseeing: Himalayan Mountaineering Institute, Padmaja Naidu Zoological Park (Closed Thursday), Tenzing Rock, Tea Garden (outer view), Peace Pagoda. Overnight stay in Darjeeling.'
    },
    {
      day: 7,
      title: 'Darjeeling → NJP / IXB Drop',
      description: 'Breakfast. Transfer to Airport. Tour ends with beautiful memories.'
    }
  ],
  inclusions: [
    'Accommodation on Double Sharing',
    'Daily Breakfast & Dinner',
    'Private Cab for Transfers & Sightseeing',
    'NJP / IXB Pick-up & Drop',
    '24x7 On-Trip Assistance',
    'GST included',
    'Driver Allowance, Toll, Parking & Taxes'
  ],
  exclusions: [
    'Airfare / Train Tickets',
    'Nathula Pass Permit Charges',
    'Entry Fees / Personal Expenses',
    'Anything not mentioned in inclusions'
  ],
  category: 'Hill Stations & Mountains',
  idealFor: 'Couples, Families, Nature Lovers',
  tourType: 'Private',
  accommodation: 'Gangtok (2N): Tashi Yang / Yak & Yeti (Deluxe Room), Pelling (2N): De Regency / Rufina Palm Bliss (Premium Room), Darjeeling (2N): Divine Himalayan Resort (Deluxe Room)',
  meals: 'Daily Breakfast + Dinner',
  transport: 'Private cab for all transfers and sightseeing',
  active: true,
  featured: true,
  brochureUrl: '/brochures/darjeeling-escape.pdf'
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
    console.log(`  Price: ₹${packageData.price} per person (including GST)`);
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
