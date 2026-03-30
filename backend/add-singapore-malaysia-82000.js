const { MongoClient } = require('mongodb');

const uri = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';

const packageData = {
  name: 'Singapore + Malaysia Tour Package',
  destination: 'Singapore',
  duration: 6,
  price: 82000,
  description: 'Experience the best of Singapore and Malaysia in this 6N/7D private tour. Explore iconic attractions including Universal Studios, Sentosa Island, Night Safari, Genting Highlands, and Kuala Lumpur city. Stay in premium 4★ hotels with daily breakfast included.',
  coverPhoto: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  highlights: [
    'Universal Studios Singapore - Full day access',
    'Sentosa Island with Cable Car & Madame Tussauds',
    'Night Safari - World\'s first nocturnal wildlife park',
    'Genting Highlands with Skyway Cable Car',
    'Batu Caves - Famous Hindu shrine',
    'KL Tower Observation Deck',
    'Petronas Twin Towers photo stop',
    'Wings of Time Show at Sentosa',
    'Private transfers in Malaysia, SIC tours in Singapore',
    'Coach transfer Singapore to Kuala Lumpur'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Kuala Lumpur',
      description: 'Welcome to Malaysia – Truly Asia. Meet & greet at Coach Station. Transfer to Hotel. Standard Check-in: 03:00 PM. Leisure time to relax or explore nearby area. Overnight stay in Kuala Lumpur.'
    },
    {
      day: 2,
      title: 'Genting Highlands + Batu Caves Tour',
      description: 'Breakfast at hotel. Proceed for Full Day Genting Highlands Tour. Visit Batu Caves – Famous Hindu shrine with 272 colorful steps. Enjoy Genting Skyway Cable Car scenic ride over rainforest. Explore Genting Highlands (Casino / Theme Park / Shopping). Return transfer to hotel. Overnight stay in Kuala Lumpur.'
    },
    {
      day: 3,
      title: 'Kuala Lumpur City Tour',
      description: 'Breakfast at hotel. Half Day Kuala Lumpur City Tour (4–5 hrs). Visit King\'s Palace (Photo Stop), National Monument, Independence Square, Beryl\'s Chocolate Kingdom, Petronas Twin Towers (Photo Stop). KL Tower Observation Deck included. Free time for shopping / leisure. Overnight stay in Kuala Lumpur.'
    },
    {
      day: 4,
      title: 'Departure + Putrajaya',
      description: 'Breakfast at hotel. Standard Check-out: 12:00 PM. Transfer to Airport. Enroute Visit Putrajaya (Photo Stop – 20 mins). Drop at KLIA / KLIA2 Airport.'
    },
    {
      day: 5,
      title: 'Arrival Singapore + Night Safari',
      description: 'Arrival at Singapore Changi Airport. Meet & greet by our representative. Private transfer to hotel. Luggage drop at lobby (early arrival case). Standard Check-in (as per hotel policy). Evening Experience: Night Safari (SIC Basis) – World\'s first nocturnal wildlife park. Enjoy tram ride & wildlife spotting. Return to hotel. Overnight stay in Singapore.'
    },
    {
      day: 6,
      title: 'City Tour + Sentosa Island',
      description: 'Breakfast at hotel. Proceed for Singapore City Tour (SIC). Visit Merlion Park, Marina Bay Area, Civic District. Proceed to Sentosa Island. Attractions Included: Cable Car Ride, Madame Tussauds (4-in-1 Combo), Wings of Time Show (Evening). Return to hotel. Overnight stay in Singapore.'
    },
    {
      day: 7,
      title: 'Universal Studios',
      description: 'Breakfast at hotel. Full Day at Universal Studios Singapore. Enjoy thrilling rides, Hollywood-themed attractions, live shows & entertainment. Must try rides: Transformers Ride, Jurassic Park Rapids, Revenge of the Mummy. Return to hotel. Overnight stay in Singapore.'
    }
  ],
  inclusions: [
    '3N Singapore + 3N Kuala Lumpur stay (4★ hotels)',
    'Daily Breakfast',
    'All Airport Transfers (Private)',
    'Singapore City Tour + Night Safari + Sentosa + Universal Studios',
    'Genting Highlands Tour + Batu Caves + KL City Tour',
    'KL Tower Ticket + Cable Car Ride',
    'Singapore to Kuala Lumpur Coach Transfer',
    'All Tours (SIC in Singapore & Private in Malaysia)',
    'All Hotel Taxes + Malaysia Tourism Tax'
  ],
  exclusions: [
    'International & Domestic Airfare',
    'Visa Charges (Singapore & Malaysia)',
    'Travel Insurance',
    'Personal Expenses (Shopping, Laundry, Tips, Drinks etc.)',
    'Bank / Currency Conversion Charges',
    'Early Check-in / Late Check-out',
    'Optional Tours & Activities not mentioned',
    'Entrance fees not mentioned in inclusions',
    'Any increase in taxes, fuel surcharge, or entrance fees',
    'Anything not specifically mentioned in inclusions',
    'GST Extra'
  ],
  category: 'International Tours',
  idealFor: 'Couples, Families, Friends',
  tourType: 'Private',
  accommodation: '4★ Hotels - Hotel Boss Singapore (Superior Double Room), Furama Bukit Bintang Kuala Lumpur (Superior Room)',
  meals: 'Daily Breakfast (BB)',
  transport: 'Private transfers in Malaysia, SIC tours in Singapore, Coach transfer between countries',
  active: true,
  featured: true,
  brochureUrl: '/brochures/singapore-malaysia-tour.pdf'
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
