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
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">

      {/* Full-screen Ken Burns background */}
      <div className="absolute inset-0">
        <img
          src="/og-image.jpg"
          alt="Travel destination"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>


      {/* Floating Destination Badges */}
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

      {/* CTA Buttons — pinned to bottom */}
      <div className="relative z-10 mt-auto pb-12 sm:pb-20 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-6 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link to="/packages">
            <motion.button
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#FFA726] text-white rounded-full font-bold text-base sm:text-lg shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="relative z-10 flex items-center gap-2">
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
        >
          <Link to="/contact">
            <motion.button
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white/12 backdrop-blur-md border-2 border-white/70 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl"
              whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,0.95)', color: '#FFA726' }}
              whileTap={{ scale: 0.96 }}
            >
              Get Consultation
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroModern;
