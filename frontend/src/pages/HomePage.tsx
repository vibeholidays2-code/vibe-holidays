import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, animate, useAnimationControls } from 'framer-motion';
import Button from '../components/Button';
import SEO from '../components/SEO';
import HeroModern from '../components/HeroModern';
import WhyChooseUs from '../components/WhyChooseUs';
import FloatingGlobe3D from '../components/FloatingGlobe3D';
import { SkeletonPackageCard } from '../components/SkeletonLoader';
import { InlineLoader } from '../components/LoadingSpinner';
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

// ─── Animated Counter ────────────────────────────────────────────────────────
const CountUp = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [inView, target, suffix, count]);

  return <span ref={ref}>0{suffix}</span>;
};

// ─── Infinite Testimonials Carousel ──────────────────────────────────────────
const CARD_WIDTH = 360;
const GAP = 24;

const TestimonialsCarousel = ({ items }: { items: typeof testimonialData }) => {
  const doubled = [...items, ...items]; // duplicate for seamless loop
  const x = useMotionValue(0);
  const controls = useAnimationControls();
  const [paused, setPaused] = useState(false);
  const totalWidth = items.length * (CARD_WIDTH + GAP);

  useEffect(() => {
    if (paused) {
      controls.stop();
      return;
    }
    controls.start({
      x: [0, -totalWidth],
      transition: { duration: items.length * 5, ease: 'linear', repeat: Infinity },
    });
  }, [paused, controls, totalWidth, items.length]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex"
        style={{ x, gap: GAP }}
        animate={controls}
        drag="x"
        dragConstraints={{ left: -totalWidth, right: 0 }}
      >
        {doubled.map((t, i) => (
          <div
            key={i}
            className="flex-shrink-0 bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-shadow duration-400 border border-slate-100 relative overflow-hidden group"
            style={{ width: CARD_WIDTH }}
          >
            {/* Large quote */}
            <div className="absolute top-4 right-5 text-6xl text-teal-100 font-serif leading-none select-none">"</div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, si) => (
                <span key={si} className="text-amber-400 text-lg">★</span>
              ))}
            </div>

            {/* Text */}
            <blockquote className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10">
              "{t.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={t.image}
                alt={t.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <span>📍</span>{t.location}
                </p>
              </div>
              <div className="ml-auto bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
                ✓ Verified
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const testimonialData = [
  { name: 'Priya Sharma', location: 'Ahmedabad', rating: 5, text: 'Amazing experience! The Bali package was perfectly organized. Every detail was taken care of. Highly recommend Vibes Holidays!', image: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Rahul Patel', location: 'Surat', rating: 5, text: 'The Jaisalmer desert tour was incredible! Great hospitality, beautiful locations, and excellent service throughout.', image: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Anjali Desai', location: 'Vadodara', rating: 5, text: 'Best travel agency! They customized our honeymoon package perfectly. Thank you for making our trip memorable!', image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Vikram Singh', location: 'Mumbai', rating: 5, text: 'Professional service from start to finish. The Kashmir trip exceeded all expectations. Will definitely book again!', image: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Neha Kapoor', location: 'Delhi', rating: 5, text: 'Fantastic Goa package! Beach resorts were amazing and the itinerary was perfect. Great value for money!', image: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Arjun Mehta', location: 'Bangalore', rating: 5, text: 'Dubai trip was spectacular! Everything was well-organized and the team was very responsive. Highly recommended!', image: 'https://i.pravatar.cc/150?img=11' },
];

const stats = [
  { number: 5000, suffix: '+', label: 'Happy Travelers', icon: '✈️', color: 'from-teal-400 to-teal-600' },
  { number: 50, suffix: '+', label: 'Destinations', icon: '🌍', color: 'from-blue-400 to-blue-600' },
  { number: 100, suffix: '+', label: 'Tour Packages', icon: '📦', color: 'from-orange-400 to-orange-600' },
  { number: 10, suffix: '+', label: 'Years Experience', icon: '⭐', color: 'from-purple-400 to-purple-600' },
];

const ctaIcons = [
  { icon: '✈️', delay: 0, left: '10%' },
  { icon: '🌴', delay: 0.8, left: '25%' },
  { icon: '🏖️', delay: 1.6, left: '50%' },
  { icon: '🗺️', delay: 0.4, left: '70%' },
  { icon: '🌅', delay: 1.2, left: '85%' },
];

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/packages?featured=true&limit=12`);
        if (response.ok) {
          const data = await response.json();
          setFeaturedPackages(data.data || data.packages || []);
        } else {
          setError('Failed to load featured packages');
        }
      } catch {
        setError('Unable to connect to server');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedPackages();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      const timer = setTimeout(() => setShowInquiryModal(true), 5000);
      return () => clearTimeout(timer);
    }
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
        schema={structuredData}
      />

      <InquiryModal isOpen={showInquiryModal} onClose={() => setShowInquiryModal(false)} />

      {/* ── Hero ── */}
      <HeroModern featuredPackages={featuredPackages} />

      {/* ── Featured Packages ── */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block px-5 py-2 bg-teal-50 border border-teal-100 rounded-full text-teal-600 text-sm font-semibold tracking-wide uppercase mb-4"
            >
              Handpicked for You
            </motion.span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">Packages</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto">
              Carefully curated travel experiences designed to create unforgettable memories.
            </p>
          </motion.div>

          {featuredPackages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {featuredPackages.slice(0, 8).map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link to={`/packages/${pkg._id}`} className="group block h-full">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col border border-slate-100">
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={pkg.thumbnail || pkg.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                            alt={pkg.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'; }}
                          />
                          {/* Hover overlay with "View Details" */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                            <span className="text-white font-semibold text-sm flex items-center gap-1">
                              View Details
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>

                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                              {Math.round(20)}% OFF
                            </div>
                            <div className="bg-[#FFA726] text-white px-3 py-1.5 rounded-xl font-bold shadow-xl text-sm">
                              <div className="text-white/70 line-through text-xs">₹{Math.round(pkg.price * 1.25).toLocaleString()}</div>
                              <div>₹{pkg.price.toLocaleString()}</div>
                            </div>
                          </div>

                          {pkg.category && (
                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md">
                              {pkg.category}
                            </div>
                          )}

                          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1">
                            🔥 SALE
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors leading-snug">
                            {pkg.name}
                          </h3>
                          <div className="flex items-center text-slate-500 text-sm mb-3 gap-1">
                            <span>📍</span>
                            <span className="font-medium">{pkg.destination}</span>
                            <span className="mx-2 text-slate-300">•</span>
                            <span>⏱️</span>
                            <span className="font-medium">{pkg.duration} days</span>
                          </div>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                            {pkg.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-amber-400 text-sm">★</span>
                              ))}
                              <span className="text-slate-400 text-xs ml-1">(4.9)</span>
                            </div>
                            <span className="text-teal-600 text-sm font-semibold group-hover:text-teal-700 flex items-center gap-1">
                              Details
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
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
                className="text-center mt-14"
              >
                <Link to="/packages">
                  <Button className="group px-10 py-4 text-lg bg-[#FFA726] hover:bg-[#FB8C00] text-white font-semibold rounded-2xl shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                    <span className="flex items-center gap-2">
                      View All Packages
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </>
          ) : isLoading ? (
            <div className="space-y-8">
              <InlineLoader text="Waking up server and discovering packages..." />
              <p className="text-center text-gray-500 text-sm">⏳ First load may take 30-60 seconds</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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
                <Button onClick={() => window.location.reload()} className="bg-[#FFA726] hover:bg-[#FB8C00] text-white px-6 py-3 rounded-xl font-semibold">Try Again</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Featured Packages</h3>
              <p className="text-slate-600 mb-6">We're currently updating our featured packages. Check back soon!</p>
              <Link to="/packages">
                <Button className="bg-[#FFA726] hover:bg-[#FB8C00] text-white px-6 py-3 rounded-xl font-semibold">Browse All Packages</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-teal-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-teal-900/80 to-teal-900/50" />
          {/* Animated blobs */}
          <motion.div animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-16 left-8 w-40 h-40 bg-teal-400/15 rounded-full blur-3xl" />
          <motion.div animate={{ y: [0, 25, 0], opacity: [0.15, 0.4, 0.15] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} className="absolute bottom-16 right-8 w-56 h-56 bg-orange-400/15 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — heading + stat cards */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-teal-300 text-sm font-semibold tracking-wider uppercase mb-5"
              >
                Our Impact
              </motion.span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                Trusted by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Thousands</span> of Travelers
              </h2>
              <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed">
                Our numbers reflect the trust and satisfaction of our growing community of happy explorers.
              </p>

              {/* Stat cards grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.55, type: 'spring', stiffness: 100 }}
                    className="bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl p-5 hover:bg-white/12 transition-colors duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-extrabold text-white mb-1">
                      <CountUp target={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — 3D Globe (desktop) */}
            <div>
              <div className="hidden lg:block">
                <FloatingGlobe3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <WhyChooseUs />

      {/* ── Testimonials ── */}
      <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 mb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block px-5 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/60 rounded-full text-amber-600 text-sm font-semibold mb-5"
            >
              Real Stories
            </motion.span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              What Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">Travelers Say</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Authentic experiences shared by our valued customers
            </p>
          </motion.div>
        </div>

        <TestimonialsCarousel items={testimonialData} />

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex -space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white shadow-md" />
            ))}
          </div>
          <p className="text-slate-500 text-sm font-medium">+5,000 happy travelers trust Vibes Holidays</p>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden text-white">
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)',
              'linear-gradient(135deg, #0f766e 0%, #134e4a 40%, #0d9488 100%)',
              'linear-gradient(135deg, #134e4a 0%, #0d9488 60%, #0f766e 100%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Orange radial accent */}
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,167,38,0.5) 0%, transparent 55%)',
              'radial-gradient(circle at 80% 30%, rgba(255,167,38,0.5) 0%, transparent 55%)',
              'radial-gradient(circle at 50% 80%, rgba(255,167,38,0.5) 0%, transparent 55%)',
              'radial-gradient(circle at 20% 50%, rgba(255,167,38,0.5) 0%, transparent 55%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating travel icons */}
        {ctaIcons.map((item, i) => (
          <div
            key={i}
            className="absolute bottom-0 text-3xl animate-float-icon pointer-events-none"
            style={{ left: item.left, animationDelay: `${item.delay}s`, animationDuration: `${3.5 + i * 0.4}s` }}
          >
            {item.icon}
          </div>
        ))}

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
              className="text-5xl mb-5"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Let us help you plan the perfect vacation. Contact us today and make your travel dreams come true!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-10 py-4 bg-[#FFA726] hover:bg-[#FB8C00] text-white font-bold text-lg rounded-full shadow-2xl transition-colors"
                >
                  📧 Contact Us Now
                </motion.button>
              </Link>
              <a href="https://wa.me/917048505128" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-2xl transition-colors"
                >
                  💬 WhatsApp Us
                </motion.button>
              </a>
              <a href="tel:+917048505128" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06, backgroundColor: 'rgba(255,255,255,1)', color: '#FFA726' }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-10 py-4 bg-white/15 backdrop-blur-md border-2 border-white text-white font-bold text-lg rounded-full shadow-2xl transition-colors"
                >
                  📞 Call Now
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
