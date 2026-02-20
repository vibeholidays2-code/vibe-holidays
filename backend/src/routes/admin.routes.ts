import express from 'express';
import Package from '../models/Package';

const router = express.Router();

// Admin endpoint to delete old Bali packages and add new one
router.post('/packages/replace-bali', async (req, res) => {
  try {
    // Delete all old Bali packages
    const deleteResult = await Package.deleteMany({
      destination: { $regex: /bali/i }
    });

    console.log(`Deleted ${deleteResult.deletedCount} old Bali packages`);

    // Add new Bali Luxury Package
    const newBaliPackage = new Package({
      name: "Bali 4★ Luxury - 6N/7D",
      destination: "Bali",
      duration: "6 Nights / 7 Days",
      price: 55000,
      originalPrice: 65000,
      rating: 4.9,
      reviews: 156,
      category: "International",
      featured: true,
      description: "Experience luxury in Bali with 4★ premium hotels, private tours, and unforgettable experiences. Stay at Fairfield by Marriott in Kuta and a private pool villa in Ubud. All tours are private with no hidden charges.",
      highlights: [
        "4★ Premium Hotels - Fairfield by Marriott & Private Pool Villa",
        "All Private Tours & Transfers",
        "Water Sports - Parasailing, Jet Ski, Banana Boat",
        "Nusa Penida Island Tour with Fast Boat",
        "Bali Safari Park with Jungle Hopper Pass",
        "ATV Tandem Ride & Aloha Swing Experience",
        "Floating Breakfast in Private Pool Villa",
        "Uluwatu Temple & Kecak Fire Dance",
        "All Entry Tickets Included"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival Bali + Finns Beach Club",
          activities: [
            "Arrival at Bali Airport with meet & greet",
            "Private transfer to Kuta hotel",
            "Visit Finns Beach Club",
            "Relax by the beach with sunset experience",
            "Hotel check-in at Fairfield by Marriott"
          ],
          meals: [],
          accommodation: "Fairfield by Marriott Bali Legian (4★)"
        },
        {
          day: 2,
          title: "Water Sports + Uluwatu + Kecak Dance",
          activities: [
            "Breakfast at hotel",
            "Water Sports: Parasailing, Jet Ski, Banana Boat",
            "Visit Uluwatu Temple",
            "Sunset view at Uluwatu",
            "Watch Kecak Fire Dance performance"
          ],
          meals: ["Breakfast"],
          accommodation: "Fairfield by Marriott Bali Legian (4★)"
        },
        {
          day: 3,
          title: "Nusa Penida East Island Tour",
          activities: [
            "Fast boat ride to Nusa Penida",
            "Visit Kelingking Beach (T-Rex viewpoint)",
            "Explore Broken Beach",
            "Angel Billabong natural pool",
            "Crystal Bay for snorkeling",
            "Snack lunch included"
          ],
          meals: ["Breakfast", "Snack Lunch"],
          accommodation: "Fairfield by Marriott Bali Legian (4★)"
        },
        {
          day: 4,
          title: "Bedugul + Handara + Tanah Lot",
          activities: [
            "Breakfast at hotel",
            "Visit Ulundanu Temple (floating temple)",
            "Photo stop at iconic Handara Gate",
            "Scenic lake views at Bedugul",
            "Tanah Lot Temple visit",
            "Sunset at Tanah Lot"
          ],
          meals: ["Breakfast"],
          accommodation: "Fairfield by Marriott Bali Legian (4★)"
        },
        {
          day: 5,
          title: "Safari Park + Ubud Private Pool Villa",
          activities: [
            "Breakfast and checkout from Kuta hotel",
            "Visit Bali Safari Park",
            "Jungle Hopper Pass with animal shows",
            "Check-in to Private Pool Villa in Ubud",
            "Floating breakfast arranged for next morning"
          ],
          meals: ["Breakfast"],
          accommodation: "Dwaraka The Royal Villas - 1 Bedroom Private Pool Villa"
        },
        {
          day: 6,
          title: "ATV + Swing Experience",
          activities: [
            "Floating breakfast in your private pool villa",
            "ATV tandem ride through jungle trails",
            "Aloha Swing experience with photo spots",
            "Return to villa and relax",
            "Enjoy your private pool"
          ],
          meals: ["Floating Breakfast"],
          accommodation: "Dwaraka The Royal Villas - 1 Bedroom Private Pool Villa"
        },
        {
          day: 7,
          title: "Departure",
          activities: [
            "Breakfast at villa",
            "Private airport transfer",
            "Departure from Bali"
          ],
          meals: ["Breakfast"],
          accommodation: "N/A"
        }
      ],
      inclusions: [
        "6 Nights accommodation (4 nights Kuta + 2 nights Ubud)",
        "4★ Fairfield by Marriott Bali Legian - Studio Room",
        "Dwaraka Royal Villas - 1 Bedroom Private Pool Villa",
        "Daily breakfast at all hotels",
        "Floating breakfast in Ubud villa",
        "All private tours and transfers",
        "All entry tickets included",
        "Water sports (Parasailing, Jet Ski, Banana Boat)",
        "Nusa Penida island tour with fast boat",
        "Bali Safari Park with Jungle Hopper Pass",
        "ATV tandem ride",
        "Aloha Swing experience",
        "Uluwatu Temple & Kecak Fire Dance",
        "Professional driver and vehicle",
        "Parking and toll charges"
      ],
      exclusions: [
        "International flights",
        "Bali visa fees",
        "GST (5%)",
        "TCS (5%)",
        "Personal expenses",
        "Lunch and dinner (unless specified)",
        "Travel insurance",
        "Tips and gratuities"
      ],
      hotels: [
        {
          name: "Fairfield by Marriott Bali Legian",
          location: "Kuta",
          rating: 4,
          roomType: "Studio Room",
          nights: 4,
          meals: "Daily Breakfast"
        },
        {
          name: "Dwaraka The Royal Villas",
          location: "Ubud",
          rating: 4,
          roomType: "1 Bedroom Private Pool Villa (Garden View)",
          nights: 2,
          meals: "Daily Breakfast + Floating Breakfast"
        }
      ],
      images: [],
      coverImage: "",
      gallery: [],
      tags: ["Luxury", "Private Tours", "Beach", "Adventure", "Romantic", "Honeymoon"],
      bestTimeToVisit: "April to October",
      difficulty: "Easy",
      groupSize: "2-10 people",
      minAge: 5,
      isActive: true
    });

    const savedPackage = await newBaliPackage.save();

    res.json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} old packages and added new Bali Luxury package`,
      package: savedPackage
    });
  } catch (error: any) {
    console.error('Error replacing Bali packages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to replace Bali packages',
      error: error.message
    });
  }
});

export default router;
