import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { SkeletonPackageCard } from '../components/SkeletonLoader';
import { ImageWithFallback } from '../components/ImagePlaceholder';
import LoadingSpinner, { InlineLoader } from '../components/LoadingSpinner';
import InquiryModal from '../components/InquiryModal';

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

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        console.log('Fetching from:', `${apiUrl}/packages?featured=true&limit=12`);
        const response = await fetch(`${apiUrl}/packages?featured=true&limit=12`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Received data:', data);
          const packages = data.data || data.packages || [];
          console.log('Setting packages:', packages);
          setFeaturedPackages(packages);
          // Reset slide to 0 when packages load
          setCurrentSlide(0);
        } else {
          console.error('Failed to fetch:', response.status, response.statusText);
          setError('Failed to load featured packages');
        }
      } catch (error) {
        console.error('Error fetching featured packages:', error);
        setError('Unable to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPackages();
  }, []);

  // Auto-slide for mobile screens only
  useEffect(() => {
    // Only enable auto-slide on mobile (screen width < 640px)
    const isMobile = () => window.innerWidth < 640;
    
    if (featuredPackages.length > 0 && isMobile()) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => {
          // Ensure we stay within bounds
          const nextSlide = (prev + 1) % featuredPackages.length;
          return nextSlide;
        });
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [featuredPackages.length]);

  // Show inquiry modal after 5 seconds for all users
  // Show inquiry modal after 5 seconds - DESKTOP ONLY
  useEffect(() => {
    console.log('Modal effect running...');
    
    // Only show modal on desktop screens (width >= 768px)
    const isDesktop = () => window.innerWidth >= 768;
    
    if (isDesktop()) {
      // Set up timer to show modal after 5 seconds
      const timer = setTimeout(() => {
        console.log('5 seconds elapsed - showing modal (desktop only)');
        setShowInquiryModal(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-rotate hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
      title: 'Discover Your Next Adventure',
      subtitle: 'Explore the world with Vibes Holidays',
    },
    {
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
      title: 'Create Unforgettable Memories',
      subtitle: 'Experience the journey of a lifetime',
    },
    {
      image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1920&q=80',
      title: 'Your Dream Vacation Awaits',
      subtitle: 'Let us plan your perfect getaway',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Ahmedabad',
      rating: 5,
      text: 'Amazing experience! The Bali package was perfectly organized. Every detail was taken care of. Highly recommend Vibes Holidays!',
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Rahul Patel',
      location: 'Surat',
      rating: 5,
      text: 'The Jaisalmer desert tour was incredible! Great hospitality, beautiful locations, and excellent service throughout.',
      image: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Anjali Desai',
      location: 'Vadodara',
      rating: 5,
      text: 'Best travel agency! They customized our honeymoon package perfectly. Thank you for making our trip memorable!',
      image: 'https://i.pravatar.cc/150?img=5',
    },
  ];

  const stats = [
    { number: '5000+', label: 'Happy Travelers', icon: '😊' },
    { number: '50+', label: 'Destinations', icon: '🌍' },
    { number: '100+', label: 'Tour Packages', icon: '🎒' },
    { number: '10+', label: 'Years Experience', icon: '⭐' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Vibes Holidays',
    description: 'Your gateway to unforgettable travel experiences',
    url: 'https://vibeholidays.com',
    telephone: '+91 7048505128',
    email: 'vibesholidays.9@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'E-block, 510, PNTC, 5, Times Of India Press Rd',
      addressLocality: 'Vejalpur, Ahmedabad',
      addressRegion: 'Gujarat',
      postalCode: '380015',
      addressCountry: 'IN',
    },
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Vibes Holidays - Travel & Holiday Booking"
        description="Discover unforgettable travel experiences with Vibes Holidays. Browse our curated holiday packages, explore exotic destinations, and book your dream vacation today."
        keywords="travel, holidays, vacation packages, holiday booking, travel agency, tours, destinations, adventure travel, beach holidays, cultural tours"
        url="/"
        structuredData={structuredData}
      />

      {/* Inquiry Modal - Shows 5 seconds after login */}
      <InquiryModal 
        isOpen={showInquiryModal} 
        onClose={() => setShowInquiryModal(false)} 
      />

      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Enhanced gradient overlay with subtle animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Subtle animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-5xl xl:max-w-6xl"
            >
              {/* Enhanced typography with better hierarchy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-3 sm:mb-4 lg:mb-6"
              >
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs sm:text-sm lg:text-base font-medium tracking-wide uppercase">
                  Premium Travel Experience
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-[0.9] tracking-tight"
              >
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  {heroSlides[currentSlide].title}
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-200 mb-6 sm:mb-8 lg:mb-12 font-light leading-relaxed max-w-3xl sm:max-w-4xl xl:max-w-5xl"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6"
              >
                <Link to="/packages" className="w-full sm:w-auto">
                  <Button className="group w-full sm:w-auto px-5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/10">
                    <span className="flex items-center justify-center gap-2 lg:gap-3">
                      <span className="text-lg lg:text-xl">✨</span>
                      <span>Explore Packages</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button className="group w-full sm:w-auto px-5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2 lg:gap-3">
                      <span className="text-base lg:text-lg">📞</span>
                      <span>Plan Your Trip</span>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8 shadow-lg' 
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 right-8 z-20"
        >
          <div className="flex flex-col items-center gap-2 text-white/80">
            <span className="text-sm font-medium tracking-wide">Scroll</span>
            <div className="animate-bounce">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
              Trusted by Thousands of Happy Travelers
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
              Our commitment to excellence speaks through numbers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className="text-center text-white group"
              >
                <div className="relative mb-3 sm:mb-4 lg:mb-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 sm:mb-2 lg:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-1 sm:mb-2 lg:mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium text-blue-100 tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-3 sm:mb-4 lg:mb-6"
            >
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 rounded-full text-blue-600 text-xs sm:text-sm lg:text-base font-semibold tracking-wide uppercase">
                Handpicked for You
              </span>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8 leading-tight">
              ✨ Featured Packages
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-600 max-w-3xl sm:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed">
              Carefully curated travel experiences designed to create unforgettable memories
            </p>
          </motion.div>

          {featuredPackages.length > 0 ? (
            <>
              {/* Mobile: Carousel View */}
              <div className="sm:hidden relative">
                <div className="overflow-hidden">
                  {featuredPackages[currentSlide] ? (
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="px-4"
                    >
                      <Link to={`/packages/${featuredPackages[currentSlide]._id}`} className="group block">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-slate-100/50">
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={featuredPackages[currentSlide].thumbnail || featuredPackages[currentSlide].images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                              alt={featuredPackages[currentSlide].name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Sale Price Badge */}
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg animate-pulse">
                                {(() => {
                                  const originalPrice = Math.round(featuredPackages[currentSlide].price * 1.25);
                                  const discount = originalPrice - featuredPackages[currentSlide].price;
                                  const discountPercent = Math.round((discount / originalPrice) * 100);
                                  return `${discountPercent}% OFF`;
                                })()}
                              </div>
                              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white px-2.5 py-1.5 rounded-xl font-bold shadow-xl backdrop-blur-sm border border-white/20">
                                <div className="text-xs text-white/70 line-through mb-0.5">
                                  ₹{Math.round(featuredPackages[currentSlide].price * 1.25).toLocaleString()}
                                </div>
                                <div className="flex items-baseline">
                                  <span className="text-xs">₹</span>
                                  <span className="text-sm">{featuredPackages[currentSlide].price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            {featuredPackages[currentSlide].category && (
                              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-lg text-xs font-semibold shadow-lg border border-white/50">
                                {featuredPackages[currentSlide].category}
                              </div>
                            )}
                            
                            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                              <span className="text-sm">🔥</span>
                              <span>SALE</span>
                            </div>
                          </div>
                          
                          <div className="p-5 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                              {featuredPackages[currentSlide].name}
                            </h3>
                            
                            <div className="flex items-center text-slate-600 mb-3 text-sm">
                              <span className="mr-1.5 text-base">📍</span>
                              <span className="font-medium">{featuredPackages[currentSlide].destination}</span>
                              <span className="mx-2 text-slate-400">•</span>
                              <span className="mr-1 text-base">⏱️</span>
                              <span className="font-medium">{featuredPackages[currentSlide].duration} days</span>
                            </div>
                            
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                              {featuredPackages[currentSlide].description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                                View Details →
                              </span>
                              <div className="flex items-center gap-1 text-amber-500">
                                <span>⭐</span>
                                <span className="text-slate-700 font-semibold text-sm">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-600">
                      Loading package...
                    </div>
                  )}
                </div>
                
                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {featuredPackages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop/Tablet: Grid View */}
              <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-8xl mx-auto">
                {featuredPackages.slice(0, 8).map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                  >
                    <Link to={`/packages/${pkg._id}`} className="group block h-full">
                      <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col border border-slate-100/50">
                        <div className="relative h-48 sm:h-56 md:h-64 lg:h-56 xl:h-64 overflow-hidden">
                          <img
                            src={pkg.thumbnail || pkg.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                            }}
                          />
                          {/* Enhanced overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Sale Price Badge with Original Price */}
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col items-end gap-1">
                            {/* Discount Badge */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                              {(() => {
                                const originalPrice = Math.round(pkg.price * 1.25);
                                const discount = originalPrice - pkg.price;
                                const discountPercent = Math.round((discount / originalPrice) * 100);
                                return `${discountPercent}% OFF`;
                              })()}
                            </div>
                            {/* Price Container */}
                            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 rounded-xl sm:rounded-2xl font-bold shadow-xl backdrop-blur-sm border border-white/20">
                              {/* Original Price - Crossed Out */}
                              <div className="text-xs sm:text-sm text-white/70 line-through mb-0.5">
                                ₹{Math.round(pkg.price * 1.25).toLocaleString()}
                              </div>
                              {/* Sale Price */}
                              <div className="flex items-baseline">
                                <span className="text-xs sm:text-sm">₹</span>
                                <span className="text-sm sm:text-base md:text-lg">{pkg.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Category badge */}
                          {pkg.category && (
                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm text-slate-800 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg border border-white/50">
                              {pkg.category}
                            </div>
                          )}
                          
                          {/* Sale Badge */}
                          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold shadow-lg flex items-center gap-1">
                            <span className="text-sm">🔥</span>
                            <span>SALE</span>
                          </div>
                        </div>
                        
                        <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex-1 flex flex-col">
                          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                            {pkg.name}
                          </h3>
                          
                          <div className="flex items-center text-slate-600 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                            <span className="mr-1.5 sm:mr-2 text-sm sm:text-base md:text-lg">📍</span>
                            <span className="font-medium">{pkg.destination}</span>
                            <span className="mx-2 sm:mx-3 text-slate-400">•</span>
                            <span className="mr-1 text-sm sm:text-base md:text-lg">⏱️</span>
                            <span className="font-medium">{pkg.duration} days</span>
                          </div>
                          
                          <p className="text-slate-600 line-clamp-3 mb-4 sm:mb-6 leading-relaxed flex-1 text-xs sm:text-sm md:text-base">
                            {pkg.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors text-xs sm:text-sm md:text-base">
                              <span>View Details</span>
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1.5 sm:ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                            
                            {/* Rating placeholder */}
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-amber-400 text-xs sm:text-sm">★</span>
                              ))}
                              <span className="text-slate-500 text-xs sm:text-sm ml-1">(4.9)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center mt-12 sm:mt-16 lg:mt-20"
              >
                <Link to="/packages">
                  <Button className="group px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 text-base sm:text-lg lg:text-xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/10">
                    <span className="flex items-center gap-2 lg:gap-3">
                      <span>View All Packages</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </>
          ) : isLoading ? (
            <div className="space-y-8">
              {/* Professional loading state with skeleton cards */}
              <InlineLoader text="Discovering Amazing Packages" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <SkeletonPackageCard />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Unable to Load Packages</h3>
                <p className="text-slate-600 mb-6">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Featured Packages</h3>
                <p className="text-slate-600 mb-6">We're currently updating our featured packages. Check back soon!</p>
                <Link to="/packages">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                    Browse All Packages
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/50 rounded-full text-amber-600 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                Real Stories
              </span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              💬 What Our Travelers Say
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Authentic experiences shared by our valued customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                className="group"
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100/50 h-full flex flex-col relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
                  
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-3xl sm:text-4xl text-blue-500/20 group-hover:text-blue-500/30 transition-colors">
                    "
                  </div>
                  
                  {/* Rating stars */}
                  <div className="flex mb-4 sm:mb-6 relative z-10">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.15) + (i * 0.1) }}
                        className="text-amber-400 text-xl sm:text-2xl mr-1 group-hover:text-amber-500 transition-colors"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <blockquote className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 flex-1 relative z-10 font-medium">
                    "{testimonial.text}"
                  </blockquote>
                  
                  {/* Author info */}
                  <div className="flex items-center relative z-10">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mr-3 sm:mr-4 border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow object-cover"
                      />
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg sm:text-xl mb-1 group-hover:text-blue-600 transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-500 text-sm sm:text-base flex items-center">
                        <span className="mr-1">📍</span>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  
                  {/* Verified badge */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ✓ Verified
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Additional testimonials indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 sm:mt-16"
          >
            <p className="text-slate-600 text-base sm:text-lg mb-3 sm:mb-4">
              Join thousands of satisfied travelers
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="flex -space-x-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white shadow-lg"></div>
                ))}
              </div>
              <span className="text-slate-500 ml-3 text-sm sm:text-base">+5000 happy customers</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              🎉 Ready for Your Next Adventure?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto">
              Let us help you plan the perfect vacation. Contact us today and make your travel dreams come true!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 text-lg sm:text-xl !bg-blue-500 hover:!bg-blue-600 !text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
                  📧 Contact Us Now
                </Button>
              </Link>
              <a href="https://wa.me/917048505128" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 text-lg sm:text-xl !bg-green-500 hover:!bg-green-600 !text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
                  💬 WhatsApp Us
                </Button>
              </a>
              <a href="tel:+917048505128" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 text-lg sm:text-xl !bg-white/20 backdrop-blur-md border-2 border-white !text-white hover:!bg-white hover:!text-purple-600 rounded-full shadow-2xl transform hover:scale-105 transition-all">
                  📞 Call Now
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
