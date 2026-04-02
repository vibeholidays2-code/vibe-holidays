import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

interface HeroModernProps {
  featuredPackages: Package[];
}

const HeroModern = ({ featuredPackages: _ }: HeroModernProps) => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Animated Background with Zoom Effect */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      >
        <img
          src="/og-image.jpg"
          alt="Travel destination"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-black/70"
        animate={{
          background: [
            'linear-gradient(to bottom right, rgba(30, 58, 138, 0.6), rgba(88, 28, 135, 0.5), rgba(0, 0, 0, 0.7))',
            'linear-gradient(to bottom right, rgba(88, 28, 135, 0.6), rgba(30, 58, 138, 0.5), rgba(0, 0, 0, 0.7))',
            'linear-gradient(to bottom right, rgba(30, 58, 138, 0.6), rgba(88, 28, 135, 0.5), rgba(0, 0, 0, 0.7))',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Airplane */}
      <motion.div
        className="absolute z-20 text-white/40"
        initial={{ x: '-10%', y: '20%' }}
        animate={{ 
          x: '110%', 
          y: '30%',
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear",
          repeatDelay: 5
        }}
      >
        <svg className="w-8 h-8 sm:w-12 sm:h-12 rotate-45" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </motion.div>

      {/* Glassmorphism Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl mx-auto text-center backdrop-blur-xl bg-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Heading with fade-in from bottom */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore the World with{' '}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Vibes Holidays
            </span>
          </motion.h1>

          {/* Subheading with delay */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover unforgettable destinations and experiences tailored just for you
          </motion.p>

          {/* CTA Buttons with slide-up animation */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/packages" className="w-full sm:w-auto">
              <motion.button
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/50 overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(251, 146, 60, 0.8)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Packages
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </Link>

            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button
                className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white/20 backdrop-blur-md border-2 border-white/60 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: 'rgba(255,255,255,0.95)', 
                  color: '#f97316',
                  boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating Icons */}
          <div className="hidden lg:block">
            <motion.div
              className="absolute top-10 left-10 text-white/30"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </motion.div>

            <motion.div
              className="absolute top-20 right-16 text-white/30"
              animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/>
              </svg>
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-20 text-white/30"
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/70 cursor-pointer hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroModern;
