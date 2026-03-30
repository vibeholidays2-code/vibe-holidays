/**
 * Seed script - inserts all packages directly into new MongoDB cluster
 * Run: node seed-packages.js
 */
const { MongoClient } = require('mongodb');

// Try each shard host — one of them is the primary
const HOSTS = [
  'ac-phbkmcw-shard-00-00.nth8j05.mongodb.net',
  'ac-phbkmcw-shard-00-01.nth8j05.mongodb.net',
  'ac-phbkmcw-shard-00-02.nth8j05.mongodb.net',
];

async function findPrimaryURI() {
  for (const host of HOSTS) {
    const uri = `mongodb://vh2:vibe9099@${host}:27017/vibes-holidays?ssl=true&authSource=admin&directConnection=true`;
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
      await client.connect();
      const admin = client.db('admin');
      const status = await admin.command({ isMaster: 1 });
      if (status.ismaster) {
        console.log(`✅ Primary found: ${host}`);
        await client.close();
        return uri;
      }
      await client.close();
    } catch (e) {
      // not this one
    }
  }
  throw new Error('No primary found among shard hosts');
}

let URI;

const packages = [
  {
    name: "Jaisalmer Desert Group Tour",
    destination: "Jaisalmer, Rajasthan",
    duration: 3,
    price: 8500,
    description: "Experience the magic of the Thar Desert with our group tour package. Explore the golden sand dunes, ancient forts, and vibrant culture of Jaisalmer.",
    itinerary: [
      { day: 1, title: "Arrival & Fort Exploration", description: "Arrive in Jaisalmer, check-in, visit Jaisalmer Fort and Patwon Ki Haveli." },
      { day: 2, title: "Desert Safari", description: "Full day desert safari with camel ride, sand dunes, and cultural evening with folk music." },
      { day: 3, title: "Departure", description: "Visit Gadisar Lake and local markets before departure." }
    ],
    inclusions: ["Accommodation", "Breakfast & Dinner", "Camel Safari", "Desert Camp", "Sightseeing", "Local Guide", "All Transfers", "Welcome Drink"],
    exclusions: ["Airfare", "Lunch", "Personal Expenses", "Camera Fees", "Tips", "Travel Insurance"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969707/35_kglxf.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969707/35_kglxf.jpg",
    featured: true,
    active: true,
    category: "Jaisalmer",
    brochureUrl: "/brochures/jaisalmer-group-tour.pdf"
  },
  {
    name: "Jaisalmer Private Desert Tour",
    destination: "Jaisalmer, Rajasthan",
    duration: 3,
    price: 15000,
    description: "Enjoy an exclusive private tour of Jaisalmer with personalized service and luxury desert camping experience.",
    itinerary: [
      { day: 1, title: "Arrival & Fort Exploration", description: "Private arrival transfer, check-in to premium hotel, guided tour of Jaisalmer Fort." },
      { day: 2, title: "Private Desert Experience", description: "Private jeep safari, luxury desert camp with bonfire and cultural performance." },
      { day: 3, title: "Departure", description: "Sunrise at dunes, breakfast, visit local markets, departure transfer." }
    ],
    inclusions: ["Premium Accommodation", "All Meals", "Private Camel Safari", "Luxury Desert Camp", "Private Guide", "All Transfers", "Jeep Safari", "Welcome Drink", "Mineral Water", "Cultural Evening"],
    exclusions: ["Airfare", "Personal Expenses", "Camera Fees", "Tips"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969706/38_etypc.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969706/38_etypc.jpg",
    featured: false,
    active: true,
    category: "Jaisalmer",
    brochureUrl: "/brochures/jaisalmer-private-tour.pdf"
  },
  {
    name: "Bali Paradise @ ₹25,000",
    destination: "Bali, Indonesia",
    duration: 5,
    price: 25000,
    description: "Discover the enchanting island of Bali with our budget-friendly package. Experience stunning temples, rice terraces, and beautiful beaches.",
    itinerary: [
      { day: 1, title: "Arrival in Bali", description: "Airport pickup, check-in to hotel, evening at Kuta Beach." },
      { day: 2, title: "Ubud Exploration", description: "Visit Tegallalang Rice Terraces, Ubud Monkey Forest, and Ubud Palace." },
      { day: 3, title: "Temple Tour", description: "Visit Tanah Lot Temple, Uluwatu Temple, and Kecak Fire Dance." },
      { day: 4, title: "Water Activities", description: "Snorkeling at Blue Lagoon, visit Tirta Gangga Water Palace." },
      { day: 5, title: "Departure", description: "Shopping at Seminyak, airport transfer." }
    ],
    inclusions: ["Return Airfare", "4 Nights Hotel", "Daily Breakfast", "Airport Transfers", "Sightseeing Tours", "Travel Insurance"],
    exclusions: ["Visa Fees", "Lunch & Dinner", "Personal Expenses", "Optional Activities"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali1.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969707/bali1.jpg",
    featured: true,
    active: true,
    category: "Bali",
    brochureUrl: "/brochures/bali-25000.pdf"
  },
  {
    name: "Bali Paradise @ ₹27,000",
    destination: "Bali, Indonesia",
    duration: 6,
    price: 27000,
    description: "An upgraded Bali experience with extra day to explore more of this magical island. Includes water sports and spa treatment.",
    itinerary: [
      { day: 1, title: "Arrival in Bali", description: "Airport pickup, check-in, welcome dinner." },
      { day: 2, title: "Ubud Day", description: "Rice terraces, Monkey Forest, art villages." },
      { day: 3, title: "Temple & Culture", description: "Tanah Lot, Uluwatu, Kecak Dance." },
      { day: 4, title: "Water Sports", description: "Surfing lesson at Kuta, parasailing, banana boat." },
      { day: 5, title: "Spa & Leisure", description: "Traditional Balinese spa, free time at beach." },
      { day: 6, title: "Departure", description: "Last minute shopping, airport transfer." }
    ],
    inclusions: ["Return Airfare", "5 Nights Hotel", "Daily Breakfast", "Airport Transfers", "Sightseeing", "Water Sports", "Spa Session", "Travel Insurance"],
    exclusions: ["Visa Fees", "Lunch & Dinner", "Personal Expenses"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969708/bali2.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969708/bali2.jpg",
    featured: true,
    active: true,
    category: "Bali",
    brochureUrl: "/brochures/bali-27000.pdf"
  },
  {
    name: "Bali Luxury @ ₹30,000",
    destination: "Bali, Indonesia",
    duration: 6,
    price: 30000,
    description: "Indulge in Bali's finest experiences with luxury villa stay, private tours, and exclusive dining.",
    itinerary: [
      { day: 1, title: "Luxury Arrival", description: "Private airport transfer, villa check-in, welcome cocktails." },
      { day: 2, title: "Private Ubud Tour", description: "Private guide through rice terraces, temples, and art galleries." },
      { day: 3, title: "Exclusive Temple Tour", description: "Private sunset tour of Tanah Lot and Uluwatu." },
      { day: 4, title: "Adventure Day", description: "White water rafting, ATV ride through jungle." },
      { day: 5, title: "Wellness Day", description: "Luxury spa, yoga session, private beach club." },
      { day: 6, title: "Departure", description: "Farewell breakfast, private airport transfer." }
    ],
    inclusions: ["Return Airfare", "5 Nights Luxury Villa", "All Meals", "Private Transfers", "Private Guide", "Adventure Activities", "Spa", "Travel Insurance"],
    exclusions: ["Visa Fees", "Personal Expenses", "Tips"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969709/bali3.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969709/bali3.jpg",
    featured: true,
    active: true,
    category: "Bali",
    brochureUrl: "/brochures/bali-30000.pdf"
  },
  {
    name: "Bali Premium @ ₹35,000",
    destination: "Bali, Indonesia",
    duration: 7,
    price: 35000,
    description: "The ultimate Bali experience — 7 days of pure luxury with private villa, butler service, and exclusive island hopping.",
    itinerary: [
      { day: 1, title: "Grand Arrival", description: "VIP airport reception, luxury villa with private pool." },
      { day: 2, title: "Ubud Immersion", description: "Private cooking class, rice terrace trek, temple visit." },
      { day: 3, title: "Island Hopping", description: "Private boat to Nusa Penida, snorkeling at Crystal Bay." },
      { day: 4, title: "Cultural Day", description: "Batik workshop, traditional dance performance, fine dining." },
      { day: 5, title: "Adventure & Spa", description: "Mount Batur sunrise trek, afternoon luxury spa." },
      { day: 6, title: "Leisure Day", description: "Private beach club, sunset cruise." },
      { day: 7, title: "Departure", description: "Farewell brunch, VIP airport transfer." }
    ],
    inclusions: ["Business Class Airfare", "6 Nights Luxury Villa", "All Meals", "Butler Service", "Private Transfers", "All Activities", "Spa", "Travel Insurance"],
    exclusions: ["Visa Fees", "Personal Expenses"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969710/bali4.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969710/bali4.jpg",
    featured: true,
    active: true,
    category: "Bali",
    brochureUrl: "/brochures/bali-35000.pdf"
  },
  {
    name: "Goa Beach Getaway (3N/4D)",
    destination: "Goa",
    duration: 4,
    price: 7500,
    description: "Sun, sand, and sea — enjoy Goa's famous beaches, vibrant nightlife, and Portuguese heritage in this 3-night package.",
    itinerary: [
      { day: 1, title: "Arrival in Goa", description: "Airport pickup, check-in, evening at Baga Beach." },
      { day: 2, title: "North Goa Tour", description: "Calangute, Anjuna, Vagator beaches, Fort Aguada, Chapora Fort." },
      { day: 3, title: "South Goa Tour", description: "Colva Beach, Benaulim, Old Goa churches, Dona Paula." },
      { day: 4, title: "Departure", description: "Breakfast, last beach visit, airport transfer." }
    ],
    inclusions: ["3 Nights Hotel", "Daily Breakfast", "Airport Transfers", "North & South Goa Sightseeing", "Welcome Drink"],
    exclusions: ["Airfare", "Lunch & Dinner", "Water Sports", "Personal Expenses"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969711/goa1.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969711/goa1.jpg",
    featured: true,
    active: true,
    category: "Goa",
    brochureUrl: "/brochures/goa-3n4d.pdf"
  },
  {
    name: "Goa Group Tour Package",
    destination: "Goa",
    duration: 5,
    price: 9500,
    description: "Join our fun-filled Goa group tour with like-minded travelers. Beaches, parties, heritage, and water sports all included.",
    itinerary: [
      { day: 1, title: "Arrival & Welcome", description: "Group pickup, check-in, welcome dinner at beach shack." },
      { day: 2, title: "North Goa Beaches", description: "Baga, Calangute, Anjuna beach hopping, water sports." },
      { day: 3, title: "Heritage Tour", description: "Old Goa churches, Fontainhas Latin Quarter, spice plantation." },
      { day: 4, title: "South Goa & Leisure", description: "Colva, Palolem beach, sunset cruise." },
      { day: 5, title: "Departure", description: "Breakfast, shopping at Mapusa market, airport transfer." }
    ],
    inclusions: ["4 Nights Hotel", "Daily Breakfast & Dinner", "Airport Transfers", "All Sightseeing", "Water Sports", "Sunset Cruise", "Travel Insurance"],
    exclusions: ["Airfare", "Lunch", "Personal Expenses", "Tips"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969712/goa2.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969712/goa2.jpg",
    featured: false,
    active: true,
    category: "Goa",
    brochureUrl: "/brochures/goa-group-tour.pdf"
  },
  {
    name: "Spiti Valley Group Tour",
    destination: "Spiti Valley, Himachal Pradesh",
    duration: 8,
    price: 18000,
    description: "Explore the mystical cold desert of Spiti Valley — ancient monasteries, high-altitude lakes, and breathtaking Himalayan landscapes.",
    itinerary: [
      { day: 1, title: "Shimla to Narkanda", description: "Depart from Shimla, drive to Narkanda, acclimatization." },
      { day: 2, title: "Narkanda to Sangla", description: "Drive through Kinnaur, Sangla Valley, Kamru Fort." },
      { day: 3, title: "Sangla to Chitkul", description: "Visit Chitkul — last inhabited village near Indo-China border." },
      { day: 4, title: "Sangla to Kaza", description: "Drive to Kaza via Nako Lake, Pin Valley." },
      { day: 5, title: "Kaza Local Sightseeing", description: "Key Monastery, Kibber Village, Chicham Bridge." },
      { day: 6, title: "Kaza to Chandratal", description: "Drive to Chandratal Lake, camping by the lake." },
      { day: 7, title: "Chandratal to Manali", description: "Drive through Rohtang Pass to Manali." },
      { day: 8, title: "Departure", description: "Manali sightseeing, departure." }
    ],
    inclusions: ["7 Nights Accommodation", "All Meals", "All Transfers", "Permits", "Guide", "Camping Equipment", "Travel Insurance"],
    exclusions: ["Airfare to Shimla", "Personal Expenses", "Tips", "Medical Expenses"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969713/spiti1.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969713/spiti1.jpg",
    featured: true,
    active: true,
    category: "Spiti Valley",
    brochureUrl: "/brochures/spiti-valley-group-tour.pdf"
  },
  {
    name: "Vietnam @ ₹32,000",
    destination: "Vietnam",
    duration: 7,
    price: 32000,
    description: "Discover Vietnam's rich history, stunning landscapes, and delicious cuisine. From Hanoi's Old Quarter to Ha Long Bay's emerald waters.",
    itinerary: [
      { day: 1, title: "Arrival in Hanoi", description: "Airport pickup, check-in, Hoan Kiem Lake evening walk." },
      { day: 2, title: "Hanoi City Tour", description: "Ho Chi Minh Mausoleum, Temple of Literature, Old Quarter." },
      { day: 3, title: "Ha Long Bay Cruise", description: "Overnight cruise on Ha Long Bay, kayaking, cave exploration." },
      { day: 4, title: "Ha Long to Hoi An", description: "Return to Hanoi, fly to Da Nang, transfer to Hoi An." },
      { day: 5, title: "Hoi An Ancient Town", description: "Explore UNESCO World Heritage ancient town, lantern making." },
      { day: 6, title: "Ho Chi Minh City", description: "Fly to HCMC, Cu Chi Tunnels, War Remnants Museum." },
      { day: 7, title: "Departure", description: "Ben Thanh Market, airport transfer." }
    ],
    inclusions: ["Return Airfare", "6 Nights Hotel", "Daily Breakfast", "Ha Long Bay Cruise", "All Transfers", "Sightseeing", "Travel Insurance"],
    exclusions: ["Visa Fees", "Lunch & Dinner", "Personal Expenses"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969714/vietnam1.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969714/vietnam1.jpg",
    featured: true,
    active: true,
    category: "Vietnam",
    brochureUrl: "/brochures/vietnam-32000.pdf"
  },
  {
    name: "Vietnam Group Tour",
    destination: "Vietnam",
    duration: 8,
    price: 28000,
    description: "Join our popular Vietnam group tour and explore the best of this Southeast Asian gem with fellow travelers.",
    itinerary: [
      { day: 1, title: "Arrival in Hanoi", description: "Group airport pickup, check-in, welcome dinner." },
      { day: 2, title: "Hanoi Highlights", description: "City tour, street food walk, water puppet show." },
      { day: 3, title: "Ha Long Bay", description: "Full day cruise, swimming, sunset on deck." },
      { day: 4, title: "Ha Long to Hue", description: "Return to Hanoi, fly to Hue, Imperial Citadel." },
      { day: 5, title: "Hue to Hoi An", description: "Hai Van Pass drive, Da Nang, Hoi An arrival." },
      { day: 6, title: "Hoi An Free Day", description: "Explore ancient town, cooking class, beach." },
      { day: 7, title: "Ho Chi Minh City", description: "Fly to HCMC, city tour, Cu Chi Tunnels." },
      { day: 8, title: "Departure", description: "Morning market visit, airport transfer." }
    ],
    inclusions: ["Return Airfare", "7 Nights Hotel", "Daily Breakfast & Dinner", "Ha Long Bay Cruise", "All Transfers", "Sightseeing", "Travel Insurance"],
    exclusions: ["Visa Fees", "Lunch", "Personal Expenses", "Tips"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969715/vietnam2.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969715/vietnam2.jpg",
    featured: false,
    active: true,
    category: "Vietnam",
    brochureUrl: "/brochures/vietnam-group-tour.pdf"
  },
  {
    name: "Phu Quoc Island, Vietnam",
    destination: "Phu Quoc, Vietnam",
    duration: 5,
    price: 24000,
    description: "Escape to Vietnam's most beautiful island — pristine beaches, crystal clear waters, and fresh seafood await you at Phu Quoc.",
    itinerary: [
      { day: 1, title: "Arrival at Phu Quoc", description: "Airport pickup, beach resort check-in, sunset at Long Beach." },
      { day: 2, title: "Island Exploration", description: "Vinpearl Safari, Phu Quoc Prison, Dinh Cau Night Market." },
      { day: 3, title: "Snorkeling Tour", description: "Boat trip to An Thoi Islands, snorkeling, fishing." },
      { day: 4, title: "North Island Tour", description: "Ganh Dau Cape, Rach Vem Fishing Village, pepper farms." },
      { day: 5, title: "Departure", description: "Beach morning, shopping, airport transfer." }
    ],
    inclusions: ["Return Airfare", "4 Nights Beach Resort", "Daily Breakfast", "Airport Transfers", "Island Tour", "Snorkeling Trip", "Travel Insurance"],
    exclusions: ["Visa Fees", "Lunch & Dinner", "Personal Expenses"],
    images: ["https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969716/phuquoc1.jpg"],
    thumbnail: "https://res.cloudinary.com/dpsytvwmh/image/upload/v1750969716/phuquoc1.jpg",
    featured: true,
    active: true,
    category: "Vietnam",
    brochureUrl: "/brochures/phu-quoc.pdf"
  }
];

async function seed() {
  URI = await findPrimaryURI();
  const client = new MongoClient(URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected!');

    const db = client.db('vibes-holidays');
    const col = db.collection('packages');

    // Check existing
    const existing = await col.countDocuments();
    console.log(`Existing packages: ${existing}`);

    if (existing > 0) {
      console.log('Packages already exist. Dropping and re-seeding...');
      await col.deleteMany({});
    }

    const result = await col.insertMany(packages);
    console.log(`✅ Inserted ${result.insertedCount} packages successfully!`);

    // Verify
    const count = await col.countDocuments();
    console.log(`Total packages in DB: ${count}`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await client.close();
  }
}

seed();
