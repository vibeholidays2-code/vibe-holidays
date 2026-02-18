import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import SEO from '../components/SEO';

interface Package {
  _id: string;
  name: string;
  destination: string;
  duration: number;
  price: number;
  description: string;
  thumbnail?: string;
  images: string[];
  category?: string;
}

const HomePageModern = () => {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/packages?featured=true&limit=3`);
        if (response.ok) {
          const data = await response.json();
          const packages = data.data || data.packages || [];
          setFeaturedPackages(packages);
        }
      } catch (error) {
        console.error('Error fetching featured packages:', error);
      }
    };

    fetchFeaturedPackages();
  }, []);

  // Auto-rotate destination cards
  useEffect(() => {
    if (featuredPackages.length > 0) {
      const timer = setInterval(() => {
        setCurrentDestinationIndex((prev) => (prev + 1) % featuredPackages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [featuredPackages.length]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Vibes Holidays',
    description: 'Your gateway to unforgettable travel experiences',
    url: 'https://www.vibesholidays.in',
    telephone: '+91 7048505128',
    email: 'vibesholidays.9@gmail.com',
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SEO
        title="Vibes Holidays - The Journey Beyond Your Imaginary"
        description="Discover thousands of beautiful places around the world with wonderful experiences you can imagine."
        keywords="travel, holidays, vacation packages, adventure, destinations"
        url="/"
        structuredData={structuredData}
      />

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-12"
        >
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-12 sm:mb-16 lg:mb-20">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Vibes Holidays" className="h-8 w-8 sm:h-10 sm:w-10" />
              <span className="text-white font-bold text-lg sm:text-xl">Vibes Holidays</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-white/90">
              <Link to="/" className="hover:text-white transition-colors">Destination</Link>
              <Link to="/packages" className="hover:text-white transition-colors">Tour Packages</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>

            <Link to="/contact">
              <Button className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 rounded-full">
                Schedule now
              </Button>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-white/80 mb-4 sm:mb-6">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base">LOCATION, STATE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                The Journey Beyond<br />Your Imaginary
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 lg:mb-10 max-w-xl">
                Discover thousands of beautiful places around the world with wonderful experiences you can imagine.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/packages">
                  <Button bgColor="#FFA726" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-full">
                    Explore Now
                  </Button>
                </Link>
                
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="flex items-center justify-center sm:justify-start gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 rounded-full transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <span className="font-medium">Play the video</span>
                </button>
              </div>
            </motion.div>

            {/* Right Content - Floating Destination Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] hidden lg:block"
            >
              {featuredPackages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{
                    opacity: index === currentDestinationIndex ? 1 : 0.6,
                    scale: index === currentDestinationIndex ? 1 : 0.85,
                    y: index * 60,
                    x: index * 30,
                    zIndex: featuredPackages.length - index,
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-0 right-0 w-80 h-96 bg-white/15 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setCurrentDestinationIndex(index)}
                >
                  <img
                    src={pkg.thumbnail || pkg.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{pkg.destination}</span>
                    </div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                  </div>

                  {/* Navigation Dots */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {featuredPackages.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDestinationIndex(i);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentDestinationIndex ? 'bg-white w-2 h-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid sm:grid-cols-2 gap-6 mt-12 sm:mt-16 lg:mt-20"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-2">Excellence</h3>
              <p className="text-white/70 text-sm">Striving for exceptional quality in every aspect of our service.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-2">Sustainable</h3>
              <p className="text-white/70 text-sm">Promoting responsible travel practices for a greener future.</p>
            </div>
          </motion.div>

          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex justify-center gap-4 mt-8"
          >
            {['instagram', 'youtube', 'twitter', 'linkedin'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <span className="sr-only">{social}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0z" />
                </svg>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePageModern;
