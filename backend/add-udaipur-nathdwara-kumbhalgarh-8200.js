const mongoose = require('mongoose');
require('dotenv').config();

const packageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', packageSchema);

const udaipurNathdwaraPackage = {
  name: 'Udaipur - Nathdwara - Kumbhalgarh Group Tour',
  destination: 'Udaipur, Nathdwara & Kumbhalgarh, Rajasthan',
  duration: 3,
  price: 8200,
  description: `Experience the spiritual and royal heritage of Rajasthan with our 2 Nights / 3 Days Group Tour. Explore Udaipur's magnificent palaces and lakes, seek blessings at Eklingji and Nathdwara Shrinathji Temple, and witness the grandeur of Kumbhalgarh Fort. Stay at comfortable hotels with breakfast and dinner included.

NO HIDDEN CHARGES - All taxes included!`,
  
  itinerary: [
    {
      day: 1,
      title: 'Ahmedabad → Udaipur',
      description: `🌅 Early morning departure from Ahmedabad

🏨 Reach Udaipur & hotel check-in

🏰 Udaipur Sightseeing:
• City Palace
• Fateh Sagar Lake
• Saheliyon Ki Bari
• Jagdish Temple
• Lake Pichola (Boating Optional)
• Visit Local Market

🌆 Evening: Bagore Ki Haveli Cultural Show (Optional)

🛌 Overnight stay in Udaipur`
    },
    {
      day: 2,
      title: 'Udaipur → Eklingji → Nathdwara → Kumbhalgarh',
      description: `🍳 Breakfast & check-out
🚗 Start journey

📍 Stop 1: Eklingji Temple

📍 Stop 2: Nathdwara – Shrinathji Temple
• Main darshan (approx 1–2 hrs)
• Lunch break (optional)

🚗 Continue to Kumbhalgarh (Approx. 2 hrs)

📍 Visit:
• Kumbhalgarh Fort
• Sunset view
• Lord Shiva temple (very peaceful & powerful place)

🎭 Optional: Light & Sound Show

🏨 Stay: Kumbhalgarh Hotel/Resort (MAP Plan)
🛌 Overnight stay in Kumbhalgarh`
    },
    {
      day: 3,
      title: 'Kumbhalgarh → Nathdwara → Ahmedabad',
      description: `🙏 Morning Darshan (optional)
🍳 Breakfast & check-out

🚗 Return to Ahmedabad

✨ Tour ends with beautiful memories`
    }
  ],

  inclusions: [
    '1 Night Stay in Udaipur (Hotel Siddharth)',
    '1 Night Stay in Kumbhalgarh (Kumbhal Palace Resort or Similar)',
    'Daily Breakfast & Dinner (MAP Plan)',
    'Udaipur Sightseeing',
    'Eklingji Temple Visit',
    'Nathdwara Shrinathji Darshan',
    'Kumbhalgarh Fort Visit',
    'Ahmedabad to Ahmedabad Transportation (AC Vehicle)',
    'Driver Allowance, Toll, Parking Charges',
    'All Applicable Taxes (GST Included)'
  ],

  exclusions: [
    'Entry Tickets (City Palace, Kumbhalgarh Fort, etc.)',
    'Boating Charges (Lake Pichola)',
    'Guide Charges',
    'Personal Expenses (Shopping, Tips, Snacks, etc.)',
    'Optional Activities (Light & Sound Show, Cultural Show)',
    'Anything not mentioned in inclusions'
  ],

  images: ['https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg'],
  thumbnail: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770375997/6d0ccf8b-d3dc-41da-a806-ca12529d3676_vg55ls.jpg',

  featured: true,
  active: true,
  category: 'Heritage & Culture',
  brochureUrl: '/brochures/udaipur-nathdwara-kumbhalgarh.pdf',

  hotelDetails: [
    {
      name: 'Hotel Siddharth',
      location: 'Udaipur',
      nights: 1,
      rating: 3,
      roomType: 'AC Room with LED TV',
      amenities: ['Breakfast', 'Dinner', 'AC', 'LED TV', 'Hot Water']
    },
    {
      name: 'Kumbhal Palace Hotel & Resort (or Similar)',
      location: 'Kumbhalgarh',
      nights: 1,
      rating: 3,
      roomType: 'AC Room with Hill View',
      amenities: ['Breakfast', 'Dinner', 'AC', 'Hill View', 'Hot Water']
    }
  ],

  pricingOptions: [
    {
      type: 'Double Sharing',
      price: 8500,
      description: 'Per person (1 Room - 2 Pax) - GST Included'
    },
    {
      type: 'Triple Sharing',
      price: 8200,
      description: 'Per person (1 Room - 3 Pax) - GST Included'
    },
    {
      type: 'Child with Extra Bed',
      price: 8200,
      description: 'Per child - GST Included'
    },
    {
      type: 'Child without Extra Bed (Below 6 Years)',
      price: 6500,
      description: 'Per child - GST Included'
    },
    {
      type: 'Child without Seat & Bed (Below 6 Years)',
      price: 3000,
      description: 'Per child - GST Included'
    }
  ],

  travelDetails: {
    mode: 'AC Vehicle',
    route: 'Ahmedabad → Udaipur → Kumbhalgarh → Ahmedabad',
    included: true
  },

  highlights: [
    'Nathdwara Shrinathji Temple Darshan',
    'Kumbhalgarh Fort - UNESCO World Heritage Site',
    'City Palace & Lake Pichola',
    'Eklingji Temple Visit',
    'Scenic Aravalli Mountain Views',
    'NO HIDDEN CHARGES - All Taxes Included'
  ],

  cancellationPolicy: `Refund amount is subject to the cancellation date and the departure date:
• More than 4 weeks before departure: Booking Amount + ₹2,500 per person
• 4 weeks prior to departure: 25% of total package cost
• 3 weeks prior to departure: 50% of total package cost
• 2 weeks prior to departure: 75% of total package cost
• Less than 2 weeks / No Show: 100% Non-Refundable`,

  importantNotes: 'NO HIDDEN CHARGES - All applicable taxes (GST) included in package rates. Child policy available for families.'
};

async function addPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Package.create(udaipurNathdwaraPackage);
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
