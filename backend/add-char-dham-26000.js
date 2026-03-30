const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Char Dham Group Tour',
  destination: 'Char Dham',
  duration: 10,
  price: 26000,
  description: 'Complete Char Dham Yatra covering Yamunotri, Gangotri, Kedarnath & Badrinath. Group tour from Ahmedabad via AC Sleeper Bus. Experience divine darshan at all four sacred shrines with comfortable accommodation and guided tours.',
  coverPhoto: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=800&q=80',
  highlights: [
    'Complete Char Dham Yatra - Yamunotri, Gangotri, Kedarnath, Badrinath',
    'AC Sleeper Bus from Ahmedabad to Ahmedabad',
    'Har-Ki-Pauri Ganga Aarti in Haridwar',
    'Kedarnath Temple darshan with overnight stay',
    'Badrinath Temple darshan with Mana Village visit',
    'Gangotri & Yamunotri Temple darshan',
    'Rishikesh Ganga Aarti at Triveni Ghat',
    'Breakfast + Dinner included daily',
    'Local transport via Tempo Traveller',
    'Experienced tour manager throughout'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Ahmedabad Departure',
      description: 'Evening reporting. AC Sleeper Bus departure from Ahmedabad. Dinner (own). Overnight journey.'
    },
    {
      day: 2,
      title: 'Haridwar Arrival',
      description: 'Morning arrival Haridwar. Hotel check-in & freshen up. Afternoon rest. Evening Highlight: Har-Ki-Pauri Ganga Aarti. Holy Ganga darshan. Dinner. Overnight stay – Haridwar.'
    },
    {
      day: 3,
      title: 'Haridwar → Barkot',
      description: 'Morning wake-up. Breakfast. Scenic drive to Barkot. Tea breaks enroute. Hotel check-in. Leisure rest. Dinner. Stay – Barkot.'
    },
    {
      day: 4,
      title: 'Yamunotri Darshan',
      description: 'Early Wake-up: 4:00 AM. Tea. Drive to Janki Chatti. Start trek to Yamunotri. Yamunotri Temple darshan. Hot kund snan. Return trek. Drive back Barkot. Dinner. Stay – Barkot.'
    },
    {
      day: 5,
      title: 'Barkot → Uttarkashi',
      description: 'Wake-up. Breakfast. Drive Uttarkashi. Kashi Vishwanath Temple. Evening darshan. Dinner. Stay – Uttarkashi.'
    },
    {
      day: 6,
      title: 'Gangotri Darshan',
      description: 'Early wake-up. Breakfast. Drive Gangotri. Holy Ganga snan. Gangotri Temple darshan. Harsil valley visit. Return Uttarkashi. Dinner. Stay – Uttarkashi.'
    },
    {
      day: 7,
      title: 'Uttarkashi → Guptkashi',
      description: 'Wake-up. Breakfast. Long scenic drive. Tea breaks. Hotel check-in. Dinner. Stay – Guptkashi.'
    },
    {
      day: 8,
      title: 'Kedarnath Darshan',
      description: 'Early wake-up: 1:00 AM. Drive Sonprayag. Trek to Kedarnath. Kedarnath Temple darshan. Evening aarti. Stay – Kedarnath.'
    },
    {
      day: 9,
      title: 'Kedarnath → Guptkashi',
      description: 'Morning darshan. Trek down. Drive Guptkashi. Dinner. Stay – Guptkashi.'
    },
    {
      day: 10,
      title: 'Badrinath Darshan',
      description: 'Wake-up. Breakfast. Drive Badrinath. Badrinath Temple darshan. Tapt Kund. Mana Village. Bhim Pul. Vyas Gufa. Dinner. Stay – Badrinath.'
    },
    {
      day: 11,
      title: 'Badrinath → Rishikesh',
      description: 'Breakfast. Drive to Rishikesh. Ram Jhula & Laxman Jhula. Evening Ganga Aarti – Triveni Ghat. Dinner. Overnight stay – Rishikesh.'
    },
    {
      day: 12,
      title: 'Rishikesh → Ahmedabad',
      description: 'Morning wake-up. Breakfast. Self explore / free time. Departure for Ahmedabad. Overnight journey. Tour Ends with Divine Blessings & Beautiful Memories.'
    }
  ],
  inclusions: [
    'AC Sleeper Bus Ahmedabad–Ahmedabad',
    'All hotel stays (10 Nights)',
    'Breakfast + Dinner daily',
    'All sightseeing as per itinerary',
    'Local transport (Tempo Traveller)',
    'Experienced tour manager',
    'All transfers and transportation'
  ],
  exclusions: [
    'Pony/Helicopter for Kedarnath trek',
    'VIP darshan tickets',
    'Lunch',
    'Entry tickets to monuments',
    'Personal expenses (shopping, tips, etc.)',
    'Travel insurance',
    'Anything not mentioned in inclusions'
  ],
  category: 'Pilgrimage & Spiritual',
  idealFor: 'Pilgrims, Families, Groups',
  tourType: 'Group',
  accommodation: 'Hotels in Haridwar, Barkot (2N), Uttarkashi (2N), Guptkashi (2N), Kedarnath (1N), Badrinath (1N), Rishikesh (1N)',
  meals: 'Daily Breakfast + Dinner',
  transport: 'AC Sleeper Bus (Ahmedabad-Ahmedabad), Tempo Traveller for local sightseeing',
  groupDepartures: [
    '15 April 2026', '22 April 2026', '29 April 2026',
    '06 May 2026', '13 May 2026', '20 May 2026', '27 May 2026',
    '03 June 2026', '10 June 2026', '17 June 2026', '24 June 2026'
  ],
  pricingOptions: [
    { type: 'Double Sharing', price: 26000 },
    { type: 'Triple Sharing', price: 25000 },
    { type: 'Quad Sharing', price: 23500 },
    { type: 'Child (6-12 years)', price: 12000 }
  ],
  active: true,
  featured: true,
  brochureUrl: '/brochures/char-dham-tour.pdf'
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
    console.log(`  Group Departures: ${packageData.groupDepartures.length} dates`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

addPackage();
