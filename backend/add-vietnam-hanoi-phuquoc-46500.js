const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const vietnamHanoiPhuQuocPackage = {
  name: 'Hanoi & Phu Quoc Package',
  destination: 'Hanoi & Phu Quoc, Vietnam',
  duration: 7,
  price: 46500,
  description: `Experience the perfect blend of culture and beach paradise with our Hanoi & Phu Quoc Package. Explore Hanoi's historic sites, cruise through Halong Bay's limestone karsts, discover ancient Ninh Binh, then relax on Phu Quoc's pristine beaches with island hopping, water parks, and wildlife adventures.

Perfect for travelers seeking both cultural immersion and tropical island relaxation.`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival Hanoi | Afternoon City Tour',
      description: `✈️ Arrival at Hanoi International Airport
🚗 Private transfer to hotel
🏨 Check-in & freshen up

🕑 Afternoon Hanoi City Tour (SIC):
📚 Temple of Literature – Vietnam's first university
🏛️ Hoa Lo Prison Museum (Hanoi Hilton)
🚶 Local culture & heritage walk

🏨 Overnight stay at Skylark Hotel, Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 2,
      title: 'Halong Bay 4★ Day Cruise',
      description: `🍳 Breakfast at hotel
🚗 Drive to Halong Bay via expressway

🛳️ 4★ Day Cruise Experience:
🏝️ Limestone karst islands
🕳️ Sung Sot (Surprise) Cave
🚣 Luon Cave – Kayaking / Bamboo Boat
🏖️ Ti Top Island – swimming / viewpoint

🍱 Lunch on cruise
🌅 Evening return to Hanoi
🏨 Overnight stay in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 3,
      title: 'Ninh Binh Day Tour (Hoa Lu – Tam Coc)',
      description: `🍳 Breakfast
🚗 Full-day excursion to Ninh Binh

🌿 Sightseeing Includes:
🏛️ Hoa Lu Ancient Capital (Dinh & Le Kings Temple)
🚣 Tam Coc Boat Ride (3 caves through rice fields)
🌾 Village life & scenic limestone views

🏨 Overnight stay in Hanoi

🚐 Tour Type: SIC`
    },
    {
      day: 4,
      title: 'Hanoi ✈ Phu Quoc | Island Arrival',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Hanoi Airport
✈️ Flight to Phu Quoc (own arrangement)

🚐 Airport pickup & transfer to hotel
🏖️ Leisure time at beach
🏨 Overnight stay at Myrtle Boutique Hotel, Phu Quoc

🚐 Transfer: Private`
    },
    {
      day: 5,
      title: 'Phu Quoc 4 Island Tour + Aquatopia',
      description: `🍳 Breakfast

🚤 4 Island Speedboat Tour:
🏝️ May Rut Trong Island – beach time
🤿 Gam Ghi Island – snorkeling
🏊 May Rut Ngoai Island – swimming

🍽️ Buffet Lunch at Hon Thom
💦 Aquatopia Water Park
🚡 World's Longest Overwater Cable Car

🏨 Overnight stay in Phu Quoc

🚐 Tour Type: SIC`
    },
    {
      day: 6,
      title: 'Vinpearl Safari + VinWonders + Grand World',
      description: `🍳 Breakfast

🦁 Visit Vinpearl Safari – largest open zoo in Vietnam
🎡 VinWonders Theme Park – rides & aquarium
🍽️ Meal included

🌆 Evening visit to Grand World Phu Quoc:
🏛️ Venice River style area
🏰 European architecture vibes

🏨 Overnight stay in Phu Quoc

🚐 Tour Type: SIC`
    },
    {
      day: 7,
      title: 'Departure Phu Quoc',
      description: `🍳 Breakfast & check-out
🚗 Transfer to Phu Quoc Airport
✈️ Tour ends with beautiful memories

🚐 Transfer: Private`
    }
  ],

  inclusions: [
    '6 Nights accommodation (3N Hanoi + 3N Phu Quoc)',
    'Daily breakfast',
    'All airport transfers (Private)',
    'All sightseeing as per itinerary (SIC / PVT)',
    'Hanoi City Tour',
    'Ninh Binh Tour',
    'Halong Bay 4★ Cruise with Lunch',
    'Phu Quoc 4 Island Tour with Lunch',
    'Aquatopia Water Park & Cable Car',
    'Vinpearl Safari + VinWonders + Grand World',
    'English-speaking local assistance',
    'Travel Insurance INCLUDED',
    'GST INCLUDED',
    'TCS INCLUDED'
  ],

  exclusions: [
    'International & domestic flights',
    'Vietnam Visa',
    'Personal expenses',
    'Optional activities not mentioned'
  ],

  images: [],

  featured: true,
  active: true,
  category: 'Beach & Culture',
  brochureUrl: '/brochures/vietnam-hanoi-phuquoc-46500.pdf',

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
      name: 'Myrtle Boutique Hotel',
      location: 'Phu Quoc',
      nights: 3,
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

    const result = await Package.create(vietnamHanoiPhuQuocPackage);
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
