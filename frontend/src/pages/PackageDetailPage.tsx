import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { packageService } from '../services/packageService';
import { reviewService, Review } from '../services/reviewService';
import { SkeletonPackageDetail } from '../components/SkeletonLoader';
import { ImageWithFallback } from '../components/ImagePlaceholder';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ReviewForm from '../components/ReviewForm';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions'>('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [packageReviews, setPackageReviews] = useState<Review[]>([]);

  // Fetch reviews
  useEffect(() => {
    reviewService.getApprovedReviews().then((revs) => {
      setPackageReviews(revs);
    }).catch(() => { });
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['package', id],
    queryFn: () => packageService.getPackageById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <SkeletonPackageDetail />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950">
        <motion.div
          className="max-w-lg mx-auto text-center p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">Package Not Found</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            The package you're looking for doesn't exist or has been removed. Let's get you back to exploring amazing destinations.
          </p>
          <Link to="/packages">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
            >
              ← Explore All Packages
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const pkg = data.data;
  const images = pkg.images.length > 0 ? pkg.images : ['/placeholder-image.jpg'];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: pkg.description,
    image: images,
    touristType: 'Leisure',
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Vibe Holidays',
      url: 'https://vibeholidays.com',
    },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'itinerary', label: 'Itinerary', icon: '🗓️' },
    { id: 'inclusions', label: "What's Included", icon: '✅' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <SEO
        title={pkg.name}
        description={pkg.description.substring(0, 160)}
        keywords={`${pkg.destination}, ${pkg.name}, holiday package, vacation, travel, ${pkg.duration} days trip`}
        image={images[0]}
        url={`/packages/${pkg._id}`}
        type="article"
        schema={structuredData}
      />

      {/* ── Sticky Breadcrumb ── */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <nav className="flex items-center text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-teal-400 transition-colors duration-200 font-medium">Home</Link>
            <svg className="w-3 h-3 mx-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/packages" className="hover:text-teal-400 transition-colors duration-200 font-medium">Packages</Link>
            <svg className="w-3 h-3 mx-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-semibold truncate max-w-[150px] sm:max-w-xs">{pkg.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Image Banner ── */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full"
        >
          <div className="w-full h-full cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
            <ImageWithFallback
              src={images[selectedImageIndex]}
              alt={pkg.name}
              className="w-full h-full object-cover"
              aspectRatio="video"
              placeholder="blur"
            />
          </div>
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

        {/* Featured badge */}
        {pkg.featured && (
          <motion.div
            className="absolute top-4 left-4 sm:top-6 sm:left-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="flex items-center gap-2 px-4 py-2 bg-[#FFA726] text-white text-xs sm:text-sm font-bold rounded-full shadow-xl">
              ⭐ Featured Package
            </span>
          </motion.div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/80 px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Click to view full size
        </div>

        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-semibold">
                📍 {pkg.destination}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-semibold">
                ⏱️ {pkg.duration} Days
              </span>
              {pkg.category && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold">
                  {pkg.category}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl">
              {pkg.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Thumbnail Strip ── */}
      {images.length > 1 && (
        <div className="bg-slate-900/60 backdrop-blur-sm border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${index === selectedImageIndex
                    ? 'border-teal-400 shadow-lg shadow-teal-500/20 scale-105'
                    : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                    }`}
                  whileHover={{ scale: index === selectedImageIndex ? 1.05 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${pkg.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    aspectRatio="square"
                    placeholder="blur"
                    showLoadingState={false}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">

          {/* ── Left Column ── */}
          <div className="xl:col-span-2 space-y-6 sm:space-y-8">

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex gap-1"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span className="hidden sm:inline">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { icon: '📍', label: 'Destination', value: pkg.destination, color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/20' },
                      { icon: '⏱️', label: 'Duration', value: `${pkg.duration} Days`, color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20' },
                      { icon: '💰', label: 'Price/Person', value: `₹${pkg.price.toLocaleString()}`, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
                      { icon: '⭐', label: 'Rating', value: '4.9 / 5.0', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20' },
                    ].map((info, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`bg-gradient-to-br ${info.color} border ${info.border} rounded-2xl p-4 backdrop-blur-sm`}
                      >
                        <div className="text-2xl mb-2">{info.icon}</div>
                        <p className="text-xs text-slate-400 font-medium mb-1">{info.label}</p>
                        <p className="text-sm sm:text-base font-bold text-white">{info.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/30 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      About This Package
                    </h2>
                    <div className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                      {pkg.description}
                    </div>

                    {pkg.brochureUrl && (
                      <motion.div
                        className="mt-8 pt-8 border-t border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <a
                          href={pkg.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-400 hover:text-teal-300 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold">View Complete Brochure</p>
                            <p className="text-xs text-teal-500">Detailed itinerary and information (PDF)</p>
                          </div>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && (
                <motion.div
                  key="itinerary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  {pkg.itinerary && pkg.itinerary.length > 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        Day-by-Day Itinerary
                      </h2>
                      <div className="space-y-5">
                        {pkg.itinerary.map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex gap-4 lg:gap-6 group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.4 }}
                          >
                            {/* Day number */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                                {index + 1}
                              </div>
                              {index < pkg.itinerary!.length - 1 && (
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-teal-500/40 to-transparent mt-2 min-h-[20px]" />
                              )}
                            </div>
                            {/* Content */}
                            <div className="flex-1 pb-2">
                              <div className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-teal-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300">
                                <h3 className="font-bold text-teal-400 mb-2 text-sm sm:text-base">Day {index + 1}</h3>
                                <p className="text-slate-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">{item}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                      <div className="text-4xl mb-4">🗓️</div>
                      <p className="text-slate-400">Detailed itinerary will be shared upon booking.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Inclusions Tab */}
              {activeTab === 'inclusions' && (
                <motion.div
                  key="inclusions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Inclusions */}
                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        What's Included
                      </h2>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-3 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                              <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-slate-300 leading-relaxed text-sm sm:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Exclusions */}
                  {pkg.exclusions && pkg.exclusions.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        Not Included
                      </h2>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((item, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-3 group"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="w-5 h-5 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:bg-red-500/30 transition-colors">
                              <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <span className="text-slate-300 leading-relaxed text-sm sm:text-base">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(!pkg.inclusions || pkg.inclusions.length === 0) && (!pkg.exclusions || pkg.exclusions.length === 0) && (
                    <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <p className="text-slate-400">Inclusions and exclusions will be detailed in the brochure.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sticky Sidebar ── */}
          <div className="xl:col-span-1">
            <motion.div
              className="sticky top-20 sm:top-24 space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Pricing Card */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Gradient header */}
                <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-slate-800 p-6 sm:p-8 overflow-hidden">
                  {/* Decorative orbs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFA726]/10 rounded-full translate-y-12 -translate-x-12" />

                  <div className="relative z-10">
                    <p className="text-teal-200 text-sm font-medium mb-2">Starting from</p>
                    <div className="flex items-baseline mb-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-lg text-teal-200 ml-2">per person</span>
                    </div>
                    <p className="text-teal-300 text-sm">All inclusive package</p>

                    {/* Savings badge */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFA726]/20 border border-[#FFA726]/30 rounded-full">
                      <span className="text-[#FFA726] text-xs font-bold">🔥 Save 20% — Limited Offer</span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 space-y-4">
                  {/* Book button */}
                  <motion.button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-4 bg-gradient-to-r from-[#FFA726] to-[#FB8C00] hover:from-[#FFB74D] hover:to-[#FFA726] text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/20 transition-all duration-300 transform hover:scale-[1.02]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🎒 Book This Package
                  </motion.button>

                  {/* WhatsApp button */}
                  <a
                    href={`https://wa.me/917048505128?text=Hi! I'm interested in the ${pkg.name} package. Can you share more details?`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      className="w-full py-3.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      💬 WhatsApp Enquiry
                    </motion.button>
                  </a>

                  {pkg.brochureUrl && (
                    <a href={pkg.brochureUrl} target="_blank" rel="noopener noreferrer">
                      <motion.button
                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Brochure
                      </motion.button>
                    </a>
                  )}

                  {/* Package highlights */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="font-bold text-white text-sm mb-4">Package Highlights</h3>
                    <div className="space-y-3">
                      {[
                        { icon: '⏱️', title: `${pkg.duration} Days Adventure`, sub: 'Complete itinerary included', color: 'bg-teal-500/10 border-teal-500/20' },
                        { icon: '👥', title: 'Group & Private Tours', sub: 'Flexible booking options', color: 'bg-blue-500/10 border-blue-500/20' },
                        { icon: '📞', title: '24/7 Support', sub: 'Always here to help', color: 'bg-purple-500/10 border-purple-500/20' },
                        { icon: '🛡️', title: 'Best Price Guarantee', sub: 'Competitive pricing', color: 'bg-amber-500/10 border-amber-500/20' },
                      ].map((h, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${h.color} backdrop-blur-sm`}>
                          <span className="text-xl">{h.icon}</span>
                          <div>
                            <p className="font-semibold text-white text-xs sm:text-sm">{h.title}</p>
                            <p className="text-slate-400 text-xs">{h.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Need help */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <h4 className="font-bold text-white mb-2 text-sm">Need Help?</h4>
                      <p className="text-slate-400 mb-3 text-xs leading-relaxed">
                        Have questions? Our travel experts are ready to help you plan the perfect trip.
                      </p>
                      <Link
                        to="/contact"
                        className="inline-flex items-center text-teal-400 hover:text-teal-300 font-semibold text-xs group transition-colors duration-200"
                      >
                        Contact Our Experts
                        <svg className="w-3 h-3 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews Section ── */}
      <div className="bg-slate-950 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center justify-center">
                  ⭐
                </div>
                Customer Reviews
              </h2>
              {packageReviews.length > 0 && (
                <p className="text-slate-400 mt-1 text-sm">{packageReviews.length} verified reviews</p>
              )}
            </div>
            <motion.button
              onClick={() => setShowReviewForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all duration-300"
            >
              ✍️ Write a Review
            </motion.button>
          </div>

          {packageReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packageReviews.slice(0, 6).map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <span key={si} className={`text-sm ${si < review.rating ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">"{review.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{review.name}</p>
                      {review.destination && (
                        <p className="text-slate-400 text-xs">📍 {review.destination}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-slate-400 font-medium">No reviews yet</p>
              <p className="text-slate-500 text-sm mt-1">Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Booking Modal ── */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="">
        <div className="p-6 sm:p-8 bg-slate-900 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Book Your Dream Trip</h3>
            <p className="text-slate-400">You're one step away from an amazing experience</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-lg mb-4 text-white">{pkg.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 font-medium">Destination</p>
                <p className="text-white font-semibold">{pkg.destination}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Duration</p>
                <p className="text-white font-semibold">{pkg.duration} days</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-slate-400">Price per person</span>
              <span className="text-2xl font-bold text-teal-400">₹{pkg.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-semibold text-teal-300 mb-1">Ready to Book?</h5>
                <p className="text-teal-400/80 text-sm leading-relaxed">
                  Contact our travel experts who will help you secure your spot and answer any questions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setIsBookingModalOpen(false)} variant="secondary" className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-xl">
              Maybe Later
            </Button>
            <Link to="/contact" className="flex-1">
              <Button variant="primary" className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white rounded-xl font-semibold">
                Contact Experts
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* ── Image Lightbox ── */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="">
        <div className="relative bg-black rounded-2xl overflow-hidden">
          <img
            src={images[selectedImageIndex]}
            alt={pkg.name}
            className="w-full h-auto max-h-[85vh] object-contain"
          />

          {images.length > 1 && (
            <>
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((p) => (p === 0 ? images.length - 1 : p - 1)); }}
                  className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((p) => (p === images.length - 1 ? 0 : p + 1)); }}
                  className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} of {images.length}
              </div>
            </>
          )}

          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Modal>

      {/* ── Review Form Modal ── */}
      <ReviewForm
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        onSuccess={() => {
          setShowReviewForm(false);
          reviewService.getApprovedReviews().then((revs) => {
            setPackageReviews(revs);
          }).catch(() => { });
        }}
      />
    </div>
  );
};

export default PackageDetailPage;
