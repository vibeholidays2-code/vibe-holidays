import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
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
}

const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch featured packages
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

  // Auto-advance carousel
  useEffect(() => {
    if (featuredPackages.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(featuredPackages.length / 3));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredPackages.length]);

  const services = [
    {
      icon: '🌍',
      title: 'Worldwide Destinations',
      description: 'Explore exotic locations across the globe with our curated travel packages'
    },
    {
      icon: '✈️',
      title: 'Hassle-Free Booking',
      description: 'Simple and secure booking process with instant confirmation'
    },
    {
      icon: '🏨',
      title: 'Premium Accommodations',
      description: 'Stay in handpicked hotels and resorts for ultimate comfort'
    },
    {
      icon: '🎯',
      title: 'Customized Itineraries',
      description: 'Tailored travel plans designed to match your preferences'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'New York, USA',
      text: 'Vibe Holidays made our dream vacation a reality! The attention to detail and customer service was exceptional.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      location: 'Singapore',
      text: 'Best travel experience ever! Everything was perfectly organized and the destinations were breathtaking.',
      rating: 5
    },
    {
      name: 'Emma Williams',
      location: 'London, UK',
      text: 'Professional, reliable, and truly care about creating memorable experiences. Highly recommended!',
      rating: 5
    }
  ];

  const visiblePackages = featuredPackages.slice(currentSlide * 3, currentSlide * 3 + 3);

  // Structured data for homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Vibe Holidays',
    description: 'Your gateway to unforgettable travel experiences',
    url: 'https://vibeholidays.com',
    logo: 'https://vibeholidays.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://facebook.com/vibeholidays',
      'https://instagram.com/vibeholidays',
      'https://twitter.com/vibeholidays',
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Vibe Holidays - Travel & Holiday Booking"
        description="Discover unforgettable travel experiences with Vibe Holidays. Browse our curated holiday packages, explore exotic destinations, and book your dream vacation today."
        keywords="travel, holidays, vacation packages, holiday booking, travel agency, tours, destinations, adventure travel, beach holidays, cultural tours"
        url="/"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')",
            backgroundBlendMode: 'overlay'
          }}
        ></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Create unforgettable memories with Vibe Holidays - Your gateway to extraordinary travel experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/packages">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Packages
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Holiday Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked destinations and experiences designed to create lasting memories
            </p>
          </motion.div>

          {featuredPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {visiblePackages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card hover className="h-full flex flex-col">
                      <div className="relative h-48 mb-4 -m-6 mb-4">
                        <img
                          src={pkg.thumbnail || pkg.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                          alt={pkg.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ₹{pkg.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-gray-600 mb-2 flex items-center">
                          <span className="mr-2">📍</span>
                          {pkg.destination}
                        </p>
                        <p className="text-gray-600 mb-4 flex items-center">
                          <span className="mr-2">⏱️</span>
                          {pkg.duration} days
                        </p>
                        <p className="text-gray-700 mb-4 line-clamp-2 flex-1">
                          {pkg.description}
                        </p>
                        <Link to={`/packages/${pkg._id}`}>
                          <Button variant="primary" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Carousel Controls */}
              {featuredPackages.length > 3 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: Math.ceil(featuredPackages.length / 3) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index ? 'bg-primary-600 w-8' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="text-center mt-8">
                <Link to="/packages">
                  <Button variant="outline" size="lg">
                    View All Packages
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured packages...</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Vibe Holidays?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive travel solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from real travelers who chose Vibe Holidays
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Let us help you plan the perfect getaway. Browse our packages or get in touch for a custom itinerary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/packages">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100">
                  Browse Packages
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
                  Get Custom Quote
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full bg-primary-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Need Help Planning?
                </h3>
                <p className="text-gray-700 mb-6">
                  Our travel experts are here to help you create the perfect itinerary tailored to your preferences and budget.
                </p>
                <Link to="/contact">
                  <Button variant="primary">
                    Contact Our Experts
                  </Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full bg-gray-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  View Our Gallery
                </h3>
                <p className="text-gray-700 mb-6">
                  Get inspired by stunning photos from our destinations and see what awaits you on your next adventure.
                </p>
                <Link to="/gallery">
                  <Button variant="secondary">
                    Explore Gallery
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
