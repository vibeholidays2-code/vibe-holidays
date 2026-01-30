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

const HomePageNew = () => {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/packages?featured=true&limit=6`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedPackages(data.packages || data);
        }
      } catch (error) {
        console.error('Error fetching featured packages:', error);
      }
    };

    fetchFeaturedPackages();
  }, []);

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

      {/* Hero Section - Modern Full-Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block text-yellow-400">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Create unforgettable memories with Vibes Holidays. Explore exotic destinations, experience local cultures, and make your dream vacation a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages">
                <Button variant="primary" className="px-8 py-4 text-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold">
                  Explore Packages
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900">
                  Plan Your Trip
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked packages for your perfect getaway
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/packages/${pkg._id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={pkg.thumbnail || pkg.images[0] || '/placeholder-image.jpg'}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold">
                        ₹{pkg.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{pkg.destination}</span>
                        <span className="mx-2">•</span>
                        <span>{pkg.duration} days</span>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {pkg.description}
                      </p>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
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
              <Button variant="primary" className="px-8 py-3 text-lg">
                View All Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Vibes Holidays?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for unforgettable travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🌍',
                title: 'Trusted & Experienced',
                description: 'Years of expertise in creating perfect travel experiences'
              },
              {
                icon: '💰',
                title: 'Best Price Guarantee',
                description: 'Competitive prices with transparent, no hidden costs'
              },
              {
                icon: '🎯',
                title: 'Customized Packages',
                description: 'Tailored itineraries designed just for you'
              },
              {
                icon: '📞',
                title: '24/7 Support',
                description: 'Always available on call/WhatsApp during your trip'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let us help you plan the perfect vacation. Contact us today and make your travel dreams come true!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" className="px-8 py-4 text-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold">
                  Contact Us Now
                </Button>
              </Link>
              <a href="tel:+917048505128">
                <Button variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-gray-900">
                  📞 +91 7048505128
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePageNew;
