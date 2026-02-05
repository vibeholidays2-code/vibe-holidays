import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { packageService } from '../services/packageService';
import { SkeletonPackageDetail } from '../components/SkeletonLoader';
import { ImageWithFallback } from '../components/ImagePlaceholder';
import Modal from '../components/Modal';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          className="max-w-lg mx-auto text-center p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Package Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The package you're looking for doesn't exist or has been removed. Let's get you back to exploring amazing destinations.
          </p>
          <Link to="/packages">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              ← Explore All Packages
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const pkg = data.data;
  const images = pkg.images.length > 0 ? pkg.images : ['/placeholder-image.jpg'];

  // Structured data for package (TourPackage schema)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: pkg.description,
    image: images,
    touristType: 'Leisure',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: pkg.itinerary?.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item,
      })) || [],
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Vibe Holidays',
      url: 'https://vibeholidays.com',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEO
        title={pkg.name}
        description={pkg.description.substring(0, 160)}
        keywords={`${pkg.destination}, ${pkg.name}, holiday package, vacation, travel, ${pkg.duration} days trip`}
        image={images[0]}
        url={`/packages/${pkg._id}`}
        type="article"
        structuredData={structuredData}
      />
      
      {/* Enhanced Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200 font-medium">
              Home
            </Link>
            <svg className="w-4 h-4 mx-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/packages" className="hover:text-blue-600 transition-colors duration-200 font-medium">
              Packages
            </Link>
            <svg className="w-4 h-4 mx-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-semibold truncate">{pkg.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-3 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Enhanced Image Gallery */}
            <motion.div 
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200/50"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div
                className="relative h-[500px] cursor-pointer group"
                onClick={() => setIsImageModalOpen(true)}
              >
                <ImageWithFallback
                  src={images[selectedImageIndex]}
                  alt={pkg.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  aspectRatio="video"
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Featured Badge */}
                {pkg.featured && (
                  <motion.span 
                    className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    ⭐ Featured Package
                  </motion.span>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 right-6 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Zoom Indicator */}
                <div className="absolute bottom-6 left-6 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Click to view full size
                </div>
              </div>
              
              {/* Enhanced Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-6 bg-gray-50/50">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                          index === selectedImageIndex
                            ? 'border-blue-500 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                        }`}
                        whileHover={{ scale: index === selectedImageIndex ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
              )}
            </motion.div>

            {/* Enhanced Package Info */}
            <motion.div 
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {pkg.name}
                </h1>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Destination</p>
                      <p className="font-semibold">{pkg.destination}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Duration</p>
                      <p className="font-semibold">{pkg.duration} days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  About This Package
                </h2>
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-8">
                  {pkg.description}
                </div>
                
                {pkg.brochureUrl && (
                  <motion.div 
                    className="mt-8 pt-8 border-t border-gray-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <a
                      href={pkg.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg group transition-all duration-200 bg-blue-50 hover:bg-blue-100 px-6 py-4 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold">View Complete Brochure</p>
                        <p className="text-sm text-blue-500">Detailed itinerary and information (PDF)</p>
                      </div>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <motion.div 
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex gap-6 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="bg-gray-50 rounded-2xl p-6 group-hover:bg-gray-100 transition-colors duration-300">
                          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Day {index + 1}</h3>
                          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{item}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Inclusions & Exclusions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inclusions */}
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <motion.div 
                  className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    What's Included
                  </h2>
                  <ul className="space-y-4">
                    {pkg.inclusions.map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover:bg-green-200 transition-colors duration-200">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Exclusions */}
              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <motion.div 
                  className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Not Included
                  </h2>
                  <ul className="space-y-4">
                    {pkg.exclusions.map((item, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                      >
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover:bg-red-200 transition-colors duration-200">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar - Booking Card */}
          <div className="xl:col-span-1">
            <motion.div 
              className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 sticky top-24 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* Pricing Header */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <p className="text-blue-100 text-sm font-medium mb-2">Starting from</p>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-bold">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-xl text-blue-100 ml-2">per person</span>
                  </div>
                  <p className="text-blue-100 text-sm">All inclusive package</p>
                </div>
              </div>

              <div className="p-8">
                {/* Action Buttons */}
                <div className="space-y-4 mb-8">
                  <Button
                    onClick={() => setIsBookingModalOpen(true)}
                    variant="primary"
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Book This Package
                  </Button>

                  {pkg.brochureUrl && (
                    <a
                      href={pkg.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button
                        variant="secondary"
                        className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Brochure
                      </Button>
                    </a>
                  )}
                </div>

                {/* Package Features */}
                <div className="border-t border-gray-200 pt-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">Package Highlights</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{pkg.duration} Days Adventure</p>
                        <p className="text-sm text-gray-500">Complete itinerary included</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Group & Private Tours</p>
                        <p className="text-sm text-gray-500">Flexible booking options</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">24/7 Support</p>
                        <p className="text-sm text-gray-500">Always here to help</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Best Price Guarantee</p>
                        <p className="text-sm text-gray-500">Competitive pricing</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 mb-3">Need Help?</h4>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      Have questions about this package? Our travel experts are here to help you plan the perfect trip.
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm group transition-colors duration-200"
                    >
                      Contact Our Experts
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title=""
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Dream Trip</h3>
            <p className="text-gray-600">You're one step away from an amazing experience</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="font-bold text-lg mb-4 text-gray-900">{pkg.name}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Destination</p>
                <p className="text-gray-900 font-semibold">{pkg.destination}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Duration</p>
                <p className="text-gray-900 font-semibold">{pkg.duration} days</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price per person</span>
                <span className="text-2xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Ready to Book?</h5>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Our booking system is being enhanced for a better experience. For now, please contact our travel experts who will help you secure your spot and answer any questions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => setIsBookingModalOpen(false)}
              variant="secondary"
              className="flex-1 py-3"
            >
              Maybe Later
            </Button>
            <Link to="/contact" className="flex-1">
              <Button variant="primary" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Contact Our Experts
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* Enhanced Image Lightbox Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title=""
      >
        <div className="relative bg-black rounded-2xl overflow-hidden">
          <img
            src={images[selectedImageIndex]}
            alt={pkg.name}
            className="w-full h-auto max-h-[85vh] object-contain"
          />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                  }}
                  className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} of {images.length}
              </div>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PackageDetailPage;
