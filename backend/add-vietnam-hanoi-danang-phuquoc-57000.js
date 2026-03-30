const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamTripleCityPackage = {
  name: 'Hanoi – Da Nang – Phu Quoc Package',
  destination: 'Hanoi, Da Nang & Phu Quoc, Vietnam',
  duration: 9,
  price: 57000,
  description: `Experience the ultimate Vietnam adventure covering culture, mountains, and beaches. Explore Hanoi's historic sites and cruise Halong Bay, marvel at Da Nang's Golden Bridge and Hoi An's charm, then unwind on Phu Quoc's pristine beaches with island hopping and water parks.

Perfect for travelers seeking a complete Vietnam experience from ancient temples to tropical paradise.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Hanoi | City Tour',
      description: `✈️ Arrival at Hanoi International Airport
🚗 Private transfer to hotel
🏨 Check-in & freshen up

🏙️ Hanoi City Tour:
🏛️ Ho Chi Minh Mausoleum (outside)
🛕 One Pillar Pagoda
📚 Temple of Literature
🌉 Hoan Kiem Lake
🚶 Old Quarter walking tour

🏨 Overnight stay at Skylark Hotel, Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 2,
      title: 'Ninh Binh (Hoa Lu – Tam Coc)',
      description: `🍳 Breakfast at hotel
🚗 Full-day excursion to Ninh Binh

🌿 Sightseeing:
🏛️ Hoa Lu Ancient Capital
🚣 Tam Coc Boat Ride (limestone caves)
🚴 Village cycling experience

🏨 Overnight stay at Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 3,
      title: 'Halong Bay Day Cruise',
      description: `🍳 Breakfast
🚗 Transfer to Halong Bay

🛳️ 4★ Day Cruise Includes:
🏝️ Scenic limestone islands
🕳️ Surprising Cave
🏖️ Titop Island
🚣 Kayaking / Bamboo boat

🍱 Lunch on cruise
🌅 Return to Hanoi by evening
🏨 Overnight stay at Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 4,
      title: 'Hanoi ✈ Da Nang',
      description: `🍳 Breakfast & check-out
✈️ Flight to Da Nang (own arrangement)

🚗 Airport pickup & hotel transfer
🌊 Evening free at beach / cafes
🏨 Overnight stay at Grand Citiview Hotel, Da Nang

🚐 Transfer: Private`
    },
    {
      day: 5,
      title: 'Hoi An & Coconut Forest',
      description: `🍳 Breakfast
🚗 Excursion to Cam Thanh Coconut Forest
🛶 Basket Boat Ride

🏮 Hoi An Ancient Town:
🌉 Japanese Covered Bridge
🏛️ Old Merchant Houses
🏮 Lantern Market

🏨 Overnight stay at Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 6,
      title: 'Bana Hills & Golden Hand Bridge',
      description: `🍳 Breakfast
🚐 Full-day tour to Bana Hills

🚡 Cable Car Ride
🌉 Golden Hand Bridge
🎢 Fantasy Park
🍽️ Indian Buffet Lunch Included

🏨 Overnight stay at Da Nang

🚐 Tour Type: SIC`
    },
    {
      day: 7,
      title: 'Da Nang ✈ Phu Quoc',
      description: `🍳 Breakfast & check-out
✈️ Flight to Phu Quoc (own arrangement)

🚗 Airport pickup & hotel transfer
🏝️ Rest & leisure at beach
🏨 Overnight stay at Myrtle Boutique Hotel, Phu Quoc

🚐 Transfer: Private`
    },
    {
      day: 8,
      title: 'Phu Quoc Island Tour',
      description: `🍳 Breakfast

🚤 4 Island Tour by Speedboat:
🤿 Snorkeling & swimming
🪸 Coral viewpoints

🎢 Aquatopia Water Park
🚡 World's Longest Over-Water Cable Car
🍱 Lunch included

🏨 Overnight stay at Phu Quoc

🚐 Tour Type: SIC`
    },
    {
      day: 9,
      title: 'Departure',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Phu Quoc Airport
✈️ Tour ends with beautiful memories

🚐 Transfer: Private`
    }
  ],

  inclusions: [
    '8 Nights accommodation (3N Hanoi + 3N Da Nang + 2N Phu Quoc)',
    'Daily breakfast',
    'All airport & intercity transfers',
    'All sightseeing as per itinerary',
    'Hanoi City Tour',
    'Ninh Binh Day Tour',
    'Halong Bay 4★ day cruise with lunch',
    'Hoi An & Coconut Forest tour',
    'Bana Hills tour with Indian lunch',
    'Phu Quoc island tour with lunch',
    'Aquatopia Water Park',
    'Cable car rides',
    'English-speaking local guide',
    'Travel Insurance INCLUDED',
    'GST INCLUDED',
    'TCS INCLUDED',
    'All local taxes'
  ],

  exclusions: [
    'International & domestic flights',
    'Vietnam Visa',
    'Personal expenses',
    'Anything not mentioned above'
  ],

  images: [],

  featured: true,
  active: true,
  category: 'Beach & Culture',
  brochureUrl: '/brochures/vietnam-hanoi-danang-phuquoc-57000.pdf',

  hotelDetails: [
    {
      name: 'Skylark Hotel',
      location: 'Hanoi',
      nights: 3,
      rating: 3,
      roomType: 'Superior Room (Double Bed, No Window)',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Grand Citiview Hotel',
      location: 'Da Nang',
      nights: 3,
      rating: 3,
      roomType: 'Superior Double Room',
      amenities: ['Daily Breakfast']
    },
    {
      name: 'Myrtle Boutique Hotel',
      location: 'Phu Quoc',
      nights: 2,
      rating: 4,
      roomType: 'Suite Room',
      amenities: ['Daily Breakfast']
    }
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(vietnamTripleCityPackage);
    console.log(`\n✅ Package added successfully!`);
    console.log(`Package ID: ${result._id}`);
    console.log(`Name: ${result.name}`);
    console.log(`Price: ₹${result.price}`);
    console.log(`Active: ${result.active}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPackage();
