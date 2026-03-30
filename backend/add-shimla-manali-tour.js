const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  duration: String,
  price: Number,
  coverPhoto: String,
  description: String,
  highlights: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  inclusions: [String],
  exclusions: [String],
  hotels: [{
    location: String,
    name: String,
    roomType: String,
    meals: String
  }],
  pricing: [{
    category: String,
    price: Number
  }],
  category: String,
  idealFor: String,
  travelDates: String,
  groupSize: String,
  active: Boolean,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Package = mongoose.model('Package', packageSchema);

async function addShimlaManaliPackage() {
  try {
    const MONGODB_URI = 'mongodb://vh2:vibe9099@ac-phbkmcw-shard-00-00.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-01.nth8j05.mongodb.net:27017,ac-phbkmcw-shard-00-02.nth8j05.mongodb.net:27017/vibes-holidays?ssl=true&replicaSet=atlas-r6wbgz-shard-0&authSource=admin&retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const shimlaManaliPackage = {
      name: 'Shimla - Manali Tour Package',
      destination: 'Manali',
      duration: '6N/7D',
      price: 18500,
      coverPhoto: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
      description: 'Experience the best of Himachal with our Shimla-Manali tour covering scenic hill stations, colonial architecture, snow-capped mountains, and adventure activities.',
      highlights: [
        'Shimla Mall Road & Ridge',
        'Kufri Snow Point',
        'Solang Valley Adventure',
        'Rohtang Pass (Subject to permit)',
        'Manali Local Sightseeing',
        'Hidimba Temple',
        'Vashisht Hot Springs',
        'Private Vehicle Throughout'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival Shimla',
          description: 'Pickup from Chandigarh/Delhi. Drive to Shimla (7-8 hours). Check-in to hotel. Evening free for Mall Road exploration. Overnight in Shimla.'
        },
        {
          day: 2,
          title: 'Shimla Local Sightseeing',
          description: 'After breakfast, visit Mall Road, Ridge, Christ Church, Scandal Point, Jakhu Temple. Evening at leisure. Overnight in Shimla.'
        },
        {
          day: 3,
          title: 'Shimla - Kufri - Manali',
          description: 'Morning visit to Kufri for snow activities and horse riding. Drive to Manali (7-8 hours) via Kullu Valley. Check-in to hotel. Overnight in Manali.'
        },
        {
          day: 4,
          title: 'Solang Valley & Atal Tunnel',
          description: 'Full day excursion to Solang Valley for adventure activities (paragliding, zorbing, ropeway). Visit Atal Tunnel and Sissu Village. Return to Manali. Overnight stay.'
        },
        {
          day: 5,
          title: 'Manali Local Sightseeing',
          description: 'Visit Hidimba Temple, Manu Temple, Vashisht Hot Springs, Van Vihar, Club House, Old Manali, and Mall Road. Evening free for shopping. Overnight in Manali.'
        },
        {
          day: 6,
          title: 'Rohtang Pass (Optional)',
          description: 'Optional excursion to Rohtang Pass (subject to permit and weather). Enjoy snow activities. Return to Manali. Overnight stay.'
        },
        {
          day: 7,
          title: 'Departure',
          description: 'After breakfast, check-out and drive back to Chandigarh/Delhi. Tour ends with beautiful memories.'
        }
      ],
      inclusions: [
        '6 Nights hotel accommodation',
        'Daily breakfast and dinner',
        'Private vehicle for all transfers and sightseeing',
        'All toll, parking, and driver allowances',
        'GST included'
      ],
      exclusions: [
        'Rohtang Pass permit (₹500-1000 per vehicle)',
        'Adventure activities at Solang Valley',
        'Lunch and beverages',
        'Personal expenses',
        'Travel insurance',
        'Anything not mentioned in inclusions'
      ],
      hotels: [
        {
          location: 'Shimla',
          name: 'Hotel Snow Valley or similar',
          roomType: 'Deluxe Room',
          meals: 'Breakfast + Dinner'
        },
        {
          location: 'Manali',
          name: 'Hotel Swastik Grand or similar',
          roomType: 'Deluxe Room with Mountain View',
          meals: 'Breakfast + Dinner'
        }
      ],
      pricing: [
        {
          category: 'Per Person (Double Sharing)',
          price: 18500
        },
        {
          category: 'Per Person (Triple Sharing)',
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
    console.log('✅ Shimla-Manali package added successfully!');
    console.log('Package ID:', result._id);
    console.log('Package Name:', result.name);
    console.log('Price:', result.price);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addShimlaManaliPackage();
