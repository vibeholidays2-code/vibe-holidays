import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { packageService } from '../services/packageService';
import { PackageFilters } from '../types/package';
import PackageCard from '../components/PackageCard';
import { SkeletonPackageCard } from '../components/SkeletonLoader';
import { InlineLoader } from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─── 3D Floating Orb (Three.js) ─────────────────────────────────────────────
const FloatingOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.006;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });

  return (
    <group>
      {/* Core globe wireframe */}
      <Sphere ref={meshRef} args={[1.8, 48, 48]}>
        <meshBasicMaterial color="#14B8A6" wireframe transparent opacity={0.35} />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.0, 48, 48]}>
        <meshBasicMaterial color="#FFA726" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>

      {/* Outer glow ring */}
      <Sphere args={[2.2, 48, 48]}>
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>

      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.6, 0.018, 16, 100]} />
        <meshBasicMaterial color="#FFA726" transparent opacity={0.7} />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#14B8A6" transparent opacity={0.4} />
      </mesh>

      {/* Destination dots */}
      {[
        [1.4, 0.8, 1.0],
        [-1.2, 1.1, 0.9],
        [0.5, -1.5, 1.1],
        [1.7, -0.3, 0.5],
        [-0.8, -1.2, 1.3],
        [1.0, 1.4, -0.7],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#FFA726" />
        </mesh>
      ))}
    </group>
  );
};

const PackagesGlobe = () => (
  <div className="w-full h-full">
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <FloatingOrb />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  </div>
);

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TiltCard = ({ children, className = '', onClick }: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  // Only enable tilt on devices with a real pointer (desktop)
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`cursor-pointer ${className}`}
      style={isTouchDevice ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={isTouchDevice ? {} : { scale: 1.03, z: 20 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};


// ─── Animated Background Particles ──────────────────────────────────────────
const ParticleField = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.random() * 200 + 60,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.08 + 0.03,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.id % 3 === 0
              ? 'radial-gradient(circle, rgba(20,184,166,1) 0%, transparent 70%)'
              : p.id % 3 === 1
                ? 'radial-gradient(circle, rgba(255,167,38,1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(99,102,241,1) 0%, transparent 70%)',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────
interface DestinationCard {
  name: string;
  image: string;
  packageCount: number;
  category: string;
  emoji: string;
  tagline: string;
  color: string;
}

const destinations: DestinationCard[] = [
  {
    name: 'Bali',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969368/29_eu4myp.png',
    packageCount: 4,
    category: 'Bali',
    emoji: '🏖️',
    tagline: 'Island of the Gods',
    color: 'from-teal-500/80 to-emerald-600/80',
  },
  {
    name: 'Jaisalmer',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770969705/36_gc4lnd.png',
    packageCount: 2,
    category: 'Jaisalmer',
    emoji: '🏰',
    tagline: 'The Golden City',
    color: 'from-amber-500/80 to-orange-600/80',
  },
  {
    name: 'Vietnam',
    image: 'https://res.cloudinary.com/dpsytvwmh/image/upload/v1770967468/19_pw2che.png',
    packageCount: 11,
    category: 'Vietnam',
    emoji: '🛕',
    tagline: 'Land of Timeless Beauty',
    color: 'from-red-500/80 to-rose-600/80',
  },
  {
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    packageCount: 2,
    category: 'Goa',
    emoji: '🌊',
    tagline: 'Sun, Sand & Serenity',
    color: 'from-blue-500/80 to-cyan-600/80',
  },
  {
    name: 'Spiti Valley',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    packageCount: 1,
    category: 'Spiti Valley',
    emoji: '🏔️',
    tagline: 'The Middle Land',
    color: 'from-indigo-500/80 to-purple-600/80',
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────
const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDestination = searchParams.get('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'duration' | 'name'>('price-low');

  const heroRef = useRef<HTMLDivElement>(null);

  const [filters] = useState<PackageFilters>({ page: 1, limit: 50 });

  const { data, isLoading, error } = useQuery({
    queryKey: ['packages', filters],
    queryFn: () => packageService.getPackages(filters),
  });

  const handleDestinationClick = (destination: string) => {
    setSearchParams({ destination });
  };

  const handleBackToDestinations = () => {
    setSearchParams({});
  };

  const filteredAndSortedPackages = useMemo(() => {
    let packages = data?.data || [];
    if (selectedDestination) {
      packages = packages.filter((pkg) =>
        pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      packages = packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(q) ||
          pkg.destination.toLowerCase().includes(q) ||
          pkg.description.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-low': packages.sort((a, b) => a.price - b.price); break;
      case 'price-high': packages.sort((a, b) => b.price - a.price); break;
      case 'duration': packages.sort((a, b) => a.duration - b.duration); break;
      case 'name': packages.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return packages;
  }, [data?.data, selectedDestination, searchQuery, sortBy]);

  // Scroll to top on destination change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedDestination]);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <SEO
        title="Holiday Packages"
        description="Browse our collection of curated holiday packages. Find your perfect getaway with destinations worldwide, flexible durations, and competitive prices."
        keywords="holiday packages, vacation deals, travel packages, tour packages, all-inclusive holidays, beach vacations, adventure tours"
        url="/packages"
      />

      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, #0d1117 0%, #0d4a45 40%, #1a1a2e 100%)',
              'linear-gradient(135deg, #1a1a2e 0%, #0d9488 40%, #0d1117 100%)',
              'linear-gradient(135deg, #0d4a45 0%, #1a1a2e 40%, #0d9488 100%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Particle field */}
        <ParticleField />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 sm:py-20 lg:py-28">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm"
              >
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                Explore The World
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[0.95]">
                <span className="text-white">Holiday</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">
                  Packages
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-lg mb-8 leading-relaxed">
                {selectedDestination
                  ? `Discover amazing ${selectedDestination} experiences curated just for you`
                  : 'Choose your dream destination and embark on unforgettable journeys crafted with care'}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { label: 'Destinations', value: '50+', icon: '🌍' },
                  { label: 'Packages', value: '100+', icon: '📦' },
                  { label: 'Happy Travelers', value: '5K+', icon: '✈️' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xl">{stat.icon}</span>
                    <div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block h-[420px] relative"
            >
              {/* Glow behind globe */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
                <div className="absolute w-48 h-48 bg-orange-500/10 rounded-full blur-2xl" />
              </div>
              <PackagesGlobe />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Main Content ── */}
      <div className="bg-slate-950 relative">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 xl:px-12 py-16 lg:py-20 relative z-10">

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-12">
              <div className="text-center">
                <InlineLoader text="Waking up the server and loading packages..." />
                <p className="text-slate-500 mt-4 text-sm">
                  ⏳ First load may take 30-60 seconds as the server wakes up from sleep
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Unable to Load Packages</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">We're having trouble loading the packages right now. Please check your connection and try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* ── Destination Selection View ── */}
          {!selectedDestination && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Section Header */}
              <div className="text-center mb-16">
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-5 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-sm font-semibold tracking-wide uppercase mb-5 backdrop-blur-sm"
                >
                  ✨ Handpicked Destinations
                </motion.span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Select Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    Dream Destination
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
                  Discover handpicked destinations with carefully curated packages designed for unforgettable experiences
                </p>
              </div>

              {/* Destination Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                {destinations.map((dest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TiltCard onClick={() => handleDestinationClick(dest.category)}>
                      <div className="relative h-80 md:h-96 lg:h-[26rem] rounded-3xl overflow-hidden group">
                        {/* Background image */}
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                        {/* Colored hover overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${dest.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* Top badge */}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold">
                            <span>{dest.emoji}</span>
                            <span>{dest.tagline}</span>
                          </div>
                        </div>

                        {/* Package count badge */}
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1.5 bg-[#FFA726] rounded-full text-white text-xs font-bold shadow-lg">
                            {dest.packageCount} Package{dest.packageCount !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Bottom content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-3xl md:text-4xl font-extrabold mb-1 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                            {dest.name}
                          </h3>
                          <p className="text-slate-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {dest.packageCount} Premium Package{dest.packageCount !== 1 ? 's' : ''} Available
                          </p>

                          {/* CTA row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-teal-300 group-hover:text-white transition-colors duration-300">
                              <span className="font-semibold text-sm">Explore Packages</span>
                              <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                            {/* Shimmer button */}
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-[#FFA726] group-hover:border-[#FFA726] transition-all duration-300">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* 3D depth shine */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                          }}
                        />
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-16"
              >
                <p className="text-slate-400 mb-4">Can't find what you're looking for?</p>
                <a
                  href="https://wa.me/917048505128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  💬 WhatsApp Us for Custom Packages
                </a>
              </motion.div>
            </motion.div>
          )}

          {/* ── Packages View (after destination selected) ── */}
          {selectedDestination && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back Button + Header */}
              <div className="mb-12">
                <motion.button
                  onClick={handleBackToDestinations}
                  className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold mb-8 group transition-colors duration-200"
                  whileHover={{ x: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  Back to Destinations
                </motion.button>

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                  <div>
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-xs font-semibold tracking-wider uppercase mb-3"
                    >
                      {filteredAndSortedPackages.length} Package{filteredAndSortedPackages.length !== 1 ? 's' : ''} Available
                    </motion.span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                        {selectedDestination}
                      </span>{' '}
                      Packages
                    </h2>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <motion.div
                className="relative mb-12 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Glassmorphism panel */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Search */}
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Search Packages
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search by name, destination, or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 text-white placeholder-slate-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Sort */}
                    <div className="lg:w-56">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Sort By
                      </label>
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                          className="block w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 text-white appearance-none cursor-pointer outline-none"
                        >
                          <option value="price-low" className="bg-slate-900">Price: Low to High</option>
                          <option value="price-high" className="bg-slate-900">Price: High to Low</option>
                          <option value="duration" className="bg-slate-900">Duration</option>
                          <option value="name" className="bg-slate-900">Name (A-Z)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active filter chip */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        className="mt-5 pt-5 border-t border-white/10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-400">Active filters:</span>
                          <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs">
                            <span>Search: "{searchQuery}"</span>
                            <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-teal-200 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Package Grid */}
              <AnimatePresence mode="wait">
                {filteredAndSortedPackages.length > 0 ? (
                  <motion.div
                    key="packages-grid"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {filteredAndSortedPackages.map((pkg, index) => (
                      <motion.div
                        key={pkg._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.08,
                          duration: 0.5,
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                        }}
                        layout
                      >
                        <PackageCard package={pkg} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-packages"
                    className="max-w-lg mx-auto text-center py-20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-teal-500/20 to-teal-600/20 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {searchQuery ? 'No packages match your search' : `No packages found for ${selectedDestination}`}
                    </h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                      {searchQuery
                        ? 'Try adjusting your search terms or browse all packages'
                        : 'Check back soon for new packages or explore other destinations'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="border-2 border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Clear Search
                        </button>
                      )}
                      <button
                        onClick={handleBackToDestinations}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
                      >
                        View All Destinations
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Bottom CTA Strip ── */}
      {!selectedDestination && !isLoading && (
        <section className="relative py-20 overflow-hidden">
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
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255,167,38,0.6) 0%, transparent 55%)',
                'radial-gradient(circle at 80% 30%, rgba(255,167,38,0.6) 0%, transparent 55%)',
                'radial-gradient(circle at 50% 80%, rgba(255,167,38,0.6) 0%, transparent 55%)',
                'radial-gradient(circle at 20% 50%, rgba(255,167,38,0.6) 0%, transparent 55%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-5">🌍</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
                Can't Find Your Perfect Trip?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                We craft custom travel experiences tailored to your preferences, budget, and schedule. Let's plan your dream vacation together!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://wa.me/917048505128" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-10 py-4 bg-[#FFA726] hover:bg-[#FB8C00] text-white font-bold text-lg rounded-full shadow-2xl transition-colors"
                  >
                    💬 WhatsApp Us
                  </motion.button>
                </a>
                <a href="tel:+917048505128">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-10 py-4 bg-white/15 backdrop-blur-md border-2 border-white text-white font-bold text-lg rounded-full shadow-2xl hover:bg-white hover:text-teal-700 transition-all duration-300"
                  >
                    📞 Call Now
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PackagesPage;
