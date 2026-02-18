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

const destinations = [
  { label: 'Bali', emoji: '🏖️', pos: { top: '18%', left: '5%' } },
  { label: 'Kashmir', emoji: '🏔️', pos: { top: '15%', right: '6%' } },
  { label: 'Goa', emoji: '🌊', pos: { top: '45%', left: '4%' } },
  { label: 'Dubai', emoji: '🌆', pos: { top: '42%', right: '5%' } },
  { label: 'Maldives', emoji: '🐠', pos: { top: '70%', left: '6%' } },
  { label: 'Thailand', emoji: '🛕', pos: { top: '68%', right: '6%' } },
];

const HeroModern = ({ featuredPackages: _ }: HeroModernProps) => {
  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: 'calc(100svh - 4rem)' }}
    >
      {/* Full-screen Ken Burns background */}
      <div className="absolute inset-0">
        <img
          src="/og-image.jpg"
          alt="Travel destination"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-black/50" />
        {/* Bottom gradient for button readability */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Floating Destination Badges — desktop only */}
      {destinations.map((dest, i) => (
        <motion.div
          key={dest.label}
          className="absolute hidden lg:block z-10"
          style={dest.pos}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          <motion.div
            animate={{ y: [0, i % 2 === 0 ? -9 : 9, 0] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-lg border border-white/30 rounded-full text-white text-sm font-semibold shadow-2xl select-none">
              <span className="text-base">{dest.emoji}</span>
              <span>{dest.label}</span>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Hero content — centred on mobile, bottom on desktop */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 sm:px-8 text-center pt-8 pb-6 sm:pb-10 lg:pb-16">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-white/90 text-xs sm:text-sm font-semibold mb-5 sm:mb-6"
        >
          <span className="w-2 h-2 bg-[#FFA726] rounded-full animate-pulse" />
          Trusted by 5,000+ Happy Travelers
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] mb-4 sm:mb-5 max-w-4xl"
        >
          Your Dream{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA726] via-orange-400 to-yellow-300">
            Vacation
          </span>{' '}
          Awaits
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-sm sm:text-base lg:text-xl text-white/80 max-w-xl sm:max-w-2xl mb-8 sm:mb-10 leading-relaxed"
        >
          Handcrafted holiday packages to the world's most beautiful destinations — at unbeatable prices.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="w-full sm:w-auto"
          >
            <Link to="/packages">
              <motion.button
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#FFA726] text-white rounded-full font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/30 overflow-hidden"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Packages
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                {/* Shine sweep */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.55 }}
                />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="w-full sm:w-auto"
          >
            <Link to="/contact">
              <motion.button
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white/15 backdrop-blur-md border-2 border-white/60 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl"
                whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.95)', color: '#FFA726' }}
                whileTap={{ scale: 0.96 }}
              >
                Get Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile destination pills — horizontal scroll */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="flex lg:hidden gap-2 mt-6 overflow-x-auto scrollbar-hide pb-1 w-full justify-start sm:justify-center"
        >
          {destinations.map((dest) => (
            <div
              key={dest.label}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold"
            >
              <span>{dest.emoji}</span>
              <span>{dest.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroModern;
