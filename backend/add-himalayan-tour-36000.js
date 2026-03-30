const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Himalayan Tour - Sikkim & Darjeeling',
  destination: 'Darjeeling',
  duration: 5,
  price: 36000,
  description: 'Explore the majestic Himalayas with this 5N/6D private tour covering Gangtok, Pelling, and Darjeeling. Experience Tsomgo Lake, Buddha Park, Tiger Hill sunrise, tea gardens, and stunning Kanchenjunga views. Includes breakfast + dinner with private vehicle throughout.',
  coverPhoto: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  highlights: [
    'Tsomgo Lake (12,312 ft) & Baba Mandir (13,200 ft)',
    'Buddha Park with 130 ft statue',
    'Kanchenjunga mountain views',
    'Chenrezig Skywalk in Pelling',
    'Pemayangtse Monastery',
    'Tiger Hill sunrise experience',
    'Ghoom Monastery & Batasia Loop',
    'Himalayan Mountaineering Institute',
    'Tea Garden visit',
    'Peace Pagoda'
  ],
  itinerary: [
    {
      day: 1,
      title: 'NJP / IXB → Gangtok',
      description: 'Arrival at NJP Railway Station / Bagdogra Airport. Meet & greet + transfer to Gangtok (4–5 hrs). Check-in at hotel. Leisure time. Overnight stay in Gangtok.'
    },
    {
      day: 2,
      title: 'Tsomgo Lake + Baba Mandir',
      description: 'Breakfast. Excursion to Tsomgo Lake (12,312 ft) and Baba Mandir (13,200 ft). Optional: Nathula Pass (Extra Cost). Overnight stay in Gangtok.'
    },
    {
      day: 3,
      title: 'Gangtok → Pelling (via Ravangla)',
      description: 'Breakfast & check-out. Drive to Pelling. Enroute Visit Buddha Park (130 ft statue). Enjoy Kanchenjunga views. Overnight stay in Pelling.'
    },
    {
      day: 4,
      title: 'Pelling → Darjeeling',
      description: 'Breakfast. Sightseeing: Chenrezig Skywalk, Pemayangtse Monastery, Rabdentse Ruins. Transfer to Darjeeling. Overnight stay in Darjeeling.'
    },
    {
      day: 5,
      title: 'Darjeeling Full Day Tour',
      description: 'Early morning: Tiger Hill Sunrise. Visit Ghoom Monastery, Batasia Loop, Himalayan Mountaineering Institute, Tea Garden, Peace Pagoda. Overnight stay in Darjeeling.'
    },
    {
      day: 6,
      title: 'Departure',
      description: 'Breakfast. Transfer to NJP / IXB. Tour ends with beautiful memories.'
    }
  ],
  inclusions: [
    '5 Nights Hotel Stay',
    'Daily Breakfast & Dinner',
    'All Transfers & Sightseeing (Private Vehicle)',
    'Driver Allowance, Toll, Parking',
    'All Applicable Taxes (GST Included)',
    'NJP / IXB Pick-up & Drop'
  ],
  exclusions: [
    'Airfare / Train Tickets',
    'Nathula Pass Charges',
    'Entry Fees',
    'Personal Expenses',
    'Anything not mentioned in inclusions'
  ],
  category: 'Hill Stations & Mountains',
  idealFor: 'Couples, Families, Nature Lovers',
  tourType: 'Private',
  accommodation: 'Gangtok (2N): Tashi Yang / Yak & Yeti (Deluxe Room), Pelling (1N): De Regency / Rufina Palm Bliss (Premium Room), Darjeeling (2N): Divine Himalayan Resort (Deluxe Room)',
  meals: 'Daily Breakfast + Dinner',
  transport: 'Private vehicle for all transfers and sightseeing',
  active: true,
  featured: false,
  brochureUrl: '/brochures/himalayan-tour.pdf'
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
