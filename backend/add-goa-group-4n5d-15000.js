const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const goaGroupPackage = {
  name: 'Goa Group Tour Package',
  destination: 'Goa',
  duration: 5,
  price: 15000,
  description: `Experience the ultimate Goa adventure with our 4 Nights / 5 Days Group Tour Package. Enjoy beaches, cruise party with live DJ, comprehensive sightseeing, and thrilling water sports including scuba diving. Stay at comfortable hotels in Calangute with daily breakfast and dinner included.

Beaches • Cruise Party • Sightseeing • Water Sports - We focus on value + comfort + unforgettable memories!`,
  
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Goa | Night Cruise Party',
      description: `✈ Arrival at Goa Airport / Railway Station
🚗 Transfer to hotel & check-in
🍽 Lunch (own expense)
💤 Rest / Free time

🌃 Evening Highlight:
🚢 Swastik Cruises – Dinner Cruise Party
🎵 Live DJ Music
💃 Dance Floor
🍽 Dinner on Cruise

🌙 Overnight stay in Goa`
    },
    {
      day: 2,
      title: 'North Goa Sightseeing',
      description: `🍳 Breakfast at Hotel

🏖 North Goa Attractions:
🏰 Fort Aguada
🐬 Dolphin Trip
🏖 Candolim Beach
🏖 Calangute Beach
🏖 Baga Beach
🏖 Anjuna Beach
🏖 Vagator Beach
❄️ Snow Park
🎭 Wax Museum
⚡ Thunder World
🛍️ Tito's Lane & Shopping

🍽 Dinner at Hotel
🛌 Overnight stay in Goa`
    },
    {
      day: 3,
      title: 'South Goa Sightseeing',
      description: `🍳 Breakfast at Hotel

🏝 South Goa Attractions:
⛪ Old Goa Church (Basilica of Bom Jesus)
🏛️ St. Augustine Tower
🙏 Mangueshi Temple
🌿 Spice Plantation Tour
⛪ Panjim Church
🌊 Dona Paula Beach
🏖 Miramar Beach

🍽 Dinner at Hotel
🛌 Overnight stay in Goa`
    },
    {
      day: 4,
      title: 'Water Sports Day',
      description: `🍳 Breakfast at Hotel

🌊 Water Sports Activities:
🏄 Jet Ski
🪂 Parasailing
🍌 Banana Boat Ride
🤿 Scuba Diving (with instructor & equipment)

🛍️ Free time at beach / shopping

🍽 Dinner at Hotel
🛌 Overnight stay in Goa`
    },
    {
      day: 5,
      title: 'Departure from Goa',
      description: `🍳 Breakfast at Hotel
🧳 Hotel Check-out
🚗 Transfer to Airport / Railway Station

🙏 Tour Ends with Unforgettable Goa Memories`
    }
  ],

  inclusions: [
    '4 Nights accommodation in selected hotel',
    'Daily Breakfast & Dinner at hotel',
    'Dinner on Swastik Cruises',
    'Airport / Railway transfers',
    'North Goa & South Goa sightseeing',
    'Swastik Cruises Dinner Cruise with Live DJ',
    'Dolphin Trip',
    'Snow Park + Wax Museum + Thunder World',
    'Water sports activities (Jet Ski, Parasailing, Banana Boat, Scuba Diving)',
    'AC coach / cab for sightseeing',
    'All tolls, parking & driver charges',
    'GST Included'
  ],

  exclusions: [
    'Flights (₹8,000 approx. extra - Ahmedabad to Goa)',
    'Lunch',
    'Personal expenses',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Beach Holiday',
  brochureUrl: '/brochures/goa-group-tour.pdf',

  hotelDetails: [
    {
      name: 'Bloom Hotel / Summit Calangute Resort & Spa',
      location: 'Calangute',
      nights: 4,
      rating: 3,
      roomType: 'Standard Room',
      amenities: ['Breakfast', 'Dinner', 'AC', 'WiFi']
    }
  ],

  pricingOptions: [
    {
      type: 'Double Sharing',
      price: 17000,
      description: 'Per person (GST Included)'
    },
    {
      type: 'Triple Sharing',
      price: 15000,
      description: 'Per person (GST Included)'
    }
  ],

  highlights: [
    'Swastik Cruises Dinner Party with Live DJ',
    'Comprehensive Water Sports Package',
    'Dolphin Trip',
    'Snow Park, Wax Museum & Thunder World',
    'Complete North & South Goa Coverage',
    'Group Tour Experience'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'Hotels subject to availability at time of booking. Flight rates depend on booking date & availability (approx. ₹8,000 extra for Ahmedabad-Goa-Ahmedabad).'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(goaGroupPackage);
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
