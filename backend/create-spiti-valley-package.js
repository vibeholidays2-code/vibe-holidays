require('dotenv').config();
const mongoose = require('mongoose');

// Define Package schema inline since we can't import TypeScript
const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    itinerary: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    images: { type: [String], default: [] },
    thumbnail: { type: String },
    brochureUrl: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    category: { type: String },
    highlights: { type: [String], default: [] },
    cancellationPolicy: { type: String }
  },
  { timestamps: true }
);

const Package = mongoose.model('Package', PackageSchema);

const spitiValleyPackage = {
  name: 'Spiti Valley Group Tour - 7N/8D',
  destination: 'Spiti Valley',
  duration: 8,
  price: 19999,
  category: 'Spiti Valley',
  featured: true,
  images: [
    'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80'
  ],
  thumbnail: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  description: `🏔️ **SPITI VALLEY GROUP TOUR - 7 NIGHTS / 8 DAYS**

📍 **Tour Route**: Delhi ➝ Shimla ➝ Kalpa ➝ Tabo ➝ Kaza ➝ Manali ➝ Delhi

We focus on value + comfort + unforgettable memories, not just another package. We're committed to making your travel experience stress-free and secure. 🏔️🏝🌿

📍 **Tour Start Point**: Delhi
📍 **Tour End Point**: Delhi

---

🏨 **HOTEL DETAILS**

• **Shimla**: DLS Hotels – The Rock Castle / Similar
• **Kalpa**: Kalpa Jungle Retreat / Similar
• **Tabo**: Hotel Lhunpo House / Similar
• **Kaza**: Hotel Lhasa Norling / Similar
• **Kalpa (Return)**: Palmo Home Stay / Similar
• **Manali**: Hotel Swastik Grand / Similar

---

🍽 **MEAL PLAN**
✔ Daily Breakfast
✔ Daily Dinner

---

💰 **PACKAGE COST (PER PERSON – GST INCLUDED)**

👫 **Double Sharing**: ₹19,999 /-
👨‍👩‍👦 **Triple Sharing**: ₹17,999 /-

---

🚌 **OPTIONAL TRAVEL ADD-ON (FROM AHMEDABAD)**

📍 Ahmedabad ⇄ Delhi (Return)
🚌 AC Bus Ticket (Return): ₹3,500 /- per person

---

🌟 **WHY CHOOSE VIBES HOLIDAYS?**

✨ **Expertly Curated Itineraries** – Every detail planned for maximum enjoyment
🏔️ **Himalayan Specialists** – Deep knowledge of mountain destinations
🛡️ **Trusted & Reliable** – Thousands of happy travelers
💯 **Best Value** – Premium experiences at competitive prices
🤝 **24/7 Support** – We're with you throughout your journey
🎯 **Hassle-Free Travel** – Sit back, relax, and enjoy the adventure`,

  itinerary: [
    `📅 **DAY 1 – DELHI ➝ SHIMLA**

🚗 Early morning departure from Delhi
🛣️ Drive via Chandigarh
🏨 Check-in at hotel
🍽 Dinner at hotel
🛌 Overnight Stay: Shimla`,

    `📅 **DAY 2 – SHIMLA ➝ KALPA**

🍽 Breakfast
🏔️ Scenic drive along Sutlej River
🌄 Views of Kinnaur Kailash Range
🏨 Hotel check-in
🍽 Dinner
🛌 Overnight Stay: Kalpa`,

    `📅 **DAY 3 – KALPA ➝ TABO**

🍽 Breakfast
🚗 Drive towards Spiti Valley
🛕 Visit Tabo Monastery (UNESCO World Heritage Site)
🏨 Check-in at hotel / homestay
🍽 Dinner
🛌 Overnight Stay: Tabo`,

    `📅 **DAY 4 – TABO ➝ DHANKAR ➝ KAZA**

🍽 Breakfast
🏰 Visit Dhankar Monastery & Fort
🚗 Drive to Kaza (Headquarter of Spiti Valley)
🏨 Check-in
🍽 Dinner
🛌 Overnight Stay: Kaza`,

    `📅 **DAY 5 – KAZA LOCAL SIGHTSEEING**

🍽 Breakfast
🛕 Key Monastery
🏔️ Langza Village (Fossil Village)
📮 Hikkim Village – World's Highest Post Office
🏘️ Komic Village – One of the highest motorable villages
🍽 Dinner
🛌 Overnight Stay: Kaza`,

    `📅 **DAY 6 – KAZA ➝ KALPA**

🍽 Breakfast
🚗 Return journey via same scenic route
🏨 Check-in at homestay
🍽 Dinner
🛌 Overnight Stay: Kalpa`,

    `📅 **DAY 7 – KALPA ➝ MANALI**

🍽 Breakfast
🚗 Long yet beautiful Himalayan drive
🏨 Check-in at hotel
🍽 Dinner
🛌 Overnight Stay: Manali`,

    `📅 **DAY 8 – MANALI ➝ DELHI**

🍽 Breakfast
🚗 Drive back to Delhi
🙏 Tour Ends with Lifetime Memories`
  ],

  inclusions: [
    '7 Nights accommodation (hotels / homestays mentioned or similar)',
    'Breakfast & Dinner (MAP)',
    'Delhi–Delhi travel by Tempo Traveller',
    'All sightseeing as per itinerary',
    'Driver allowance, toll & parking',
    'GST Included',
    'Tour assistance from Vibes Holidays'
  ],

  exclusions: [
    'Ahmedabad ⇄ Delhi bus ticket (₹3,500 optional)',
    'Lunch',
    'Personal expenses, tips',
    'Entry fees / camera charges',
    'Travel / medical insurance',
    'Anything not mentioned in inclusions'
  ],

  highlights: [
    'UNESCO World Heritage Site - Tabo Monastery',
    'World\'s Highest Post Office - Hikkim',
    'Key Monastery - Ancient Buddhist Monastery',
    'Langza Fossil Village',
    'Komic Village - One of highest motorable villages',
    'Kinnaur Kailash Range Views',
    'Dhankar Monastery & Fort',
    'Complete Spiti Valley Circuit'
  ],

  cancellationPolicy: `📌 **CANCELLATION & REFUND POLICY**

Refund amount is subject to the cancellation date and the departure date:

• **More than 4 weeks before departure**: Booking Amount + ₹2,500 per person
• **4 weeks prior to departure**: 25% of total package cost
• **3 weeks prior to departure**: 50% of total package cost
• **2 weeks prior to departure**: 75% of total package cost
• **Less than 2 weeks / No Show**: 100% Non-Refundable`,

  brochureUrl: '/brochures/spiti-valley-group-tour.pdf'
};

async function createSpitiValleyPackage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if package already exists
    const existingPackage = await Package.findOne({ 
      name: spitiValleyPackage.name 
    });

    if (existingPackage) {
      console.log('Spiti Valley package already exists. Updating...');
      await Package.findByIdAndUpdate(existingPackage._id, spitiValleyPackage);
      console.log('✅ Spiti Valley package updated successfully!');
    } else {
      const newPackage = new Package(spitiValleyPackage);
      await newPackage.save();
      console.log('✅ Spiti Valley package created successfully!');
    }

    console.log('\n📦 Package Details:');
    console.log('Name:', spitiValleyPackage.name);
    console.log('Destination:', spitiValleyPackage.destination);
    console.log('Duration:', spitiValleyPackage.duration, 'days');
    console.log('Price: ₹', spitiValleyPackage.price);
    console.log('Category:', spitiValleyPackage.category);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSpitiValleyPackage();
