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

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Fetching from:', `${apiUrl}/api/packages?featured=true&limit=6`);
        const response = await fetch(`${apiUrl}/api/packages?featured=true&limit=6`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Received data:', data);
          const packages = data.data || data.packages || [];
          console.log('Setting packages:', packages);
          setFeaturedPackages(packages);
        } else {
          console.error('Failed to fetch:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching featured packages:', error);
      }
    };

    fetchFeaturedPackages();
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

  const destinations = [
    { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', packages: 4 },
    { name: 'Jaisalmer', image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80', packages: 2 },
    { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80', packages: 11 },
    { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', packages: 0 },
    { name: 'Shimla', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80', packages: 0 },
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', packages: 0 },
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

      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-2xl md:text-3xl text-gray-200 mb-8">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/packages">
                  <Button className="px-10 py-5 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
                    🌟 Explore Packages
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="px-10 py-5 text-lg bg-white/20 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full shadow-2xl transform hover:scale-105 transition-all">
                    📞 Plan Your Trip
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-yellow-400 w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              🌏 Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our most loved travel destinations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/packages?destination=${dest.name}`} className="group block">
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-3xl font-bold mb-2">{dest.name}</h3>
                      <p className="text-lg">{dest.packages} Packages Available</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              ✨ Featured Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked packages for your perfect getaway
            </p>
          </motion.div>

          {featuredPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPackages.slice(0, 6).map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/packages/${pkg._id}`} className="group block">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={pkg.thumbnail || pkg.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                            ₹{pkg.price.toLocaleString()}
                          </div>
                          {pkg.category && (
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                              {pkg.category}
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {pkg.name}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <span className="mr-2">📍</span>
                            <span>{pkg.destination}</span>
                            <span className="mx-2">•</span>
                            <span>⏱️ {pkg.duration} days</span>
                          </div>
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {pkg.description}
                          </p>
                          <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                            View Details
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/packages">
                  <Button className="px-10 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full shadow-xl transform hover:scale-105 transition-all">
                    View All Packages →
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading amazing packages...</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              💬 What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from real travelers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 border-4 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-purple-500 text-2xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              🎉 Ready for Your Next Adventure?
            </h2>
            <p className="text-2xl mb-10 max-w-3xl mx-auto">
              Let us help you plan the perfect vacation. Contact us today and make your travel dreams come true!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <Button className="px-12 py-5 text-xl !bg-blue-500 hover:!bg-blue-600 !text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
                  📧 Contact Us Now
                </Button>
              </Link>
              <a href="https://wa.me/917048505128" target="_blank" rel="noopener noreferrer">
                <Button className="px-12 py-5 text-xl !bg-green-500 hover:!bg-green-600 !text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all">
                  💬 WhatsApp Us
                </Button>
              </a>
              <a href="tel:+917048505128">
                <Button className="px-12 py-5 text-xl !bg-white/20 backdrop-blur-md border-2 border-white !text-white hover:!bg-white hover:!text-purple-600 rounded-full shadow-2xl transform hover:scale-105 transition-all">
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
