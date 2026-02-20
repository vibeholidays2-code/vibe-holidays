const mongoose = require('mongoose');

// Direct MongoDB connection string
const MONGODB_URI = 'mongodb+srv://vibe_db_user:vibe9099@cluster0.6c6k7zt.mongodb.net/vibes-holidays?retryWrites=true&w=majority';

const packageSchema = new mongoose.Schema({}, { strict: false, collection: 'packages' });
const Package = mongoose.model('Package', packageSchema);

async function addBaliPackage() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Try with different connection options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected successfully!\n');

    // Delete old Bali packages
    console.log('🗑️  Removing old Bali packages...');
    const deleteResult = await Package.deleteMany({
      destination: { $regex: /bali/i }
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} old Bali packages\n`);

    // Add new package
    console.log('📝 Adding new Bali 4★ Luxury Package...');
    
    const newPackage = await Package.create({
      name: "Bali 4★ Luxury - 6N/7D",
      destination: "Bali",
      duration: "6 Nights / 7 Days",
      price: 55000,
      originalPrice: 65000,
      rating: 4.9,
      reviews: 156,
      category: "International",
      featured: true,
      description: "Experience luxury in Bali with 4★ premium hotels, private tours, and unforgettable experiences. Stay at Fairfield by Marriott in Kuta and a private pool villa in Ubud.",
      highlights: [
        "4★ Premium Hotels - Fairfield by Marriott & Private Pool Villa",
        "All Private Tours & Transfers",
        "Water Sports - Parasailing, Jet Ski, Banana Boat",
        "Nusa Penida Island Tour",
        "Bali Safari Park",
        "ATV & Swing Experience",
        "Floating Breakfast",
        "Uluwatu Temple & Kecak Dance"
      ],
      itinerary: [
        { day: 1, title: "Arrival + Finns Beach Club", activities: ["Airport pickup", "Finns Beach Club", "Sunset"], meals: [], accommodation: "Fairfield by Marriott" },
        { day: 2, title: "Water Sports + Uluwatu", activities: ["Parasailing", "Jet Ski", "Banana Boat", "Uluwatu Temple", "Kecak Dance"], meals: ["Breakfast"], accommodation: "Fairfield by Marriott" },
        { day: 3, title: "Nusa Penida Tour", activities: ["Kelingking Beach", "Broken Beach", "Angel Billabong", "Crystal Bay"], meals: ["Breakfast", "Lunch"], accommodation: "Fairfield by Marriott" },
        { day: 4, title: "Bedugul + Tanah Lot", activities: ["Ulundanu Temple", "Handara Gate", "Tanah Lot"], meals: ["Breakfast"], accommodation: "Fairfield by Marriott" },
        { day: 5, title: "Safari + Ubud Villa", activities: ["Bali Safari Park", "Check-in Pool Villa"], meals: ["Breakfast"], accommodation: "Dwaraka Royal Villas" },
        { day: 6, title: "ATV + Swing", activities: ["Floating Breakfast", "ATV Ride", "Aloha Swing"], meals: ["Floating Breakfast"], accommodation: "Dwaraka Royal Villas" },
        { day: 7, title: "Departure", activities: ["Airport transfer"], meals: ["Breakfast"], accommodation: "N/A" }
      ],
      inclusions: [
        "6 Nights 4★ accommodation",
        "Daily breakfast + Floating breakfast",
        "All private tours",
        "All entry tickets",
        "Water sports",
        "Safari park",
        "ATV & Swing"
      ],
      exclusions: [
        "Flights",
        "Visa",
        "GST & TCS",
        "Personal expenses"
      ],
      images: [],
      coverImage: "",
      tags: ["Luxury", "Private Tours", "Beach", "Adventure"],
      isActive: true
    });

    console.log(`✅ Successfully added: ${newPackage.name}`);
    console.log(`   ID: ${newPackage._id}`);
    console.log(`   Price: ₹${newPackage.price}\n`);

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.reason) console.error('Reason:', error.reason);
    process.exit(1);
  }
}

addBaliPackage();
