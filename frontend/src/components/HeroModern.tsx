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

// showOnMobile: only 2 badges on small screens to avoid clutter
const destinations = [
  { label: 'Bali', emoji: '🏖️', pos: { top: '20%', left: '4%' }, mobileShow: true },
  { label: 'Kashmir', emoji: '🏔️', pos: { top: '20%', right: '4%' }, mobileShow: true },
  { label: 'Goa', emoji: '🌊', pos: { top: '46%', left: '3%' }, mobileShow: false },
  { label: 'Dubai', emoji: '🌆', pos: { top: '46%', right: '3%' }, mobileShow: false },
  { label: 'Maldives', emoji: '🐠', pos: { top: '70%', left: '4%' }, mobileShow: false },
  { label: 'Thailand', emoji: '🛕', pos: { top: '70%', right: '4%' }, mobileShow: false },
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

      {/* Floating Destination Badges */}
      {destinations.map((dest, i) => (
        <motion.div
          key={dest.label}
          className={`absolute z-10 ${dest.mobileShow ? '' : 'hidden sm:block'}`}
          style={dest.pos}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.12, duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          <motion.div
            animate={{ y: [0, i % 2 === 0 ? -9 : 9, 0] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-lg border border-white/30 rounded-full text-white text-xs sm:text-sm font-semibold shadow-2xl select-none">
              <span className="text-sm sm:text-base">{dest.emoji}</span>
              <span>{dest.label}</span>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* CTA Buttons — pinned to bottom */}
      <div className="relative z-10 mt-auto pb-8 sm:pb-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-5">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full sm:w-auto"
        >
          <Link to="/packages">
            <motion.button
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4 min-h-[52px] bg-[#FFA726] text-white rounded-full font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/30 overflow-hidden"
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
          transition={{ delay: 0.52, duration: 0.6 }}
          className="w-full sm:w-auto"
        >
          <Link to="/contact">
            <motion.button
              className="w-full sm:w-auto px-8 sm:px-10 py-4 min-h-[52px] bg-white/15 backdrop-blur-md border-2 border-white/60 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl"
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
