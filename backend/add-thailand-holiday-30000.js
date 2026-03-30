const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Thailand Holiday Package - Pattaya & Bangkok',
  destination: 'Thailand',
  duration: 5,
  price: 30000,
  description: 'Experience the best of Thailand with this 5N/6D package covering Pattaya and Bangkok. Enjoy Coral Island tour, Alcázar Cabaret Show, Safari World & Marine Park, temple tours, and vibrant nightlife. Includes breakfast daily, 2 lunches, and all major attractions.',
  coverPhoto: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
  highlights: [
    'Coral Island tour with speedboat & Indian lunch',
    'Alcázar Cabaret Show - spectacular costumes & dance',
    'Safari World & Marine Park with buffet lunch',
    'Dolphin, Orangutan, Bird & Stunt shows',
    'Golden Buddha Temple & Mini Reclining Buddha',
    'Gems Gallery visit',
    'Pattaya Beach Road nightlife',
    'Bangkok shopping - Indra Market, Platinum Mall',
    'Private transfers for airport & Bangkok',
    'GST + TCS + Travel Insurance included'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival Bangkok → Pattaya',
      description: 'Arrival at Bangkok Airport. Meet & greet with driver. Private transfer to Pattaya (2 hrs). Hotel check-in. Evening free to explore Pattaya Beach Road. Enjoy nightlife & cafés.'
    },
    {
      day: 2,
      title: 'Pattaya Leisure + Alcázar Show',
      description: 'Breakfast at hotel. Relax at beach / optional water sports. Explore local markets. Evening: Famous Alcázar Cabaret Show with spectacular costumes & dance. Photo opportunity. Tour Type: SIC.'
    },
    {
      day: 3,
      title: 'Coral Island Tour',
      description: 'Breakfast. Speedboat ride to Coral Island. White sand beaches & clear water. Swimming & beach fun. Parasailing (optional). Jet ski (optional). Indian lunch included. Return Pattaya by afternoon. Evening Thai massage / shopping. Tour Type: SIC.'
    },
    {
      day: 4,
      title: 'Pattaya → Bangkok + City Tour',
      description: 'Breakfast & checkout. Private transfer to Bangkok. Enroute sightseeing: Golden Buddha Temple, Mini Reclining Buddha, Gems Gallery. Hotel check-in Bangkok. Evening free for shopping – Indra Market, Platinum Mall, Night markets.'
    },
    {
      day: 5,
      title: 'Safari World & Marine Park',
      description: 'Breakfast. Transfer to Safari World. Highlights: Safari drive (open zoo), Dolphin show, Orangutan show, Bird show, Stunt show. Buffet lunch inside park. Return hotel evening. Night free for shopping. Tour Type: SIC.'
    },
    {
      day: 6,
      title: 'Departure',
      description: 'Breakfast. Checkout. Private airport transfer. Return to Ahmedabad.'
    }
  ],
  inclusions: [
    '5 Nights hotel stay (3★ hotels)',
    'Daily breakfast',
    'Coral island tour with Indian lunch',
    'Alcázar show tickets',
    'Safari world with buffet lunch',
    'Bangkok temple tour',
    'All transfers (Private for airport & Bangkok, SIC for tours)',
    'All sightseeing tours as per itinerary',
    'Entry tickets for all attractions',
    'GST + TCS + Travel Insurance included'
  ],
  exclusions: [
    'International flights (added separately)',
    'Visa if required',
    'Water sports (parasailing, jet ski)',
    'Personal expenses',
    'Tips',
    'Meals not mentioned (lunch on Day 1, 2, 4, 6 and all dinners)'
  ],
  category: 'International Tours',
  idealFor: 'Couples, Families, Friends',
  tourType: 'Group',
  accommodation: 'Pattaya (3N): Golden Beach Hotel (3★ Superior Room), Bangkok (2N): The Ecotel Hotel (3★ Superior Room)',
  meals: 'Daily Breakfast + 2 Lunches (Coral Island & Safari World)',
  transport: 'Private transfers for airport & Bangkok, SIC tours for Pattaya attractions',
  active: true,
  featured: true,
  brochureUrl: '/brochures/thailand-holiday.pdf'
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
