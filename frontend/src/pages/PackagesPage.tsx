import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { packageService } from '../services/packageService';
import { PackageFilters } from '../types/package';
import PackageCard from '../components/PackageCard';
import { SkeletonPackageCard } from '../components/SkeletonLoader';
import { InlineLoader } from '../components/LoadingSpinner';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';

interface DestinationCard {
  name: string;
  image: string;
  packageCount: number;
  category: string;
}

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDestination = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'duration' | 'name'>('price-low');
  
  const [filters] = useState<PackageFilters>({
    page: 1,
    limit: 50,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['packages', filters],
    queryFn: () => packageService.getPackages(filters),
  });

  // Destination cards data
  const destinations: DestinationCard[] = [
    { 
      name: 'Bali', 
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', 
      packageCount: 4,
      category: 'Bali'
    },
    { 
      name: 'Jaisalmer', 
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80', 
      packageCount: 2,
      category: 'Jaisalmer'
    },
    { 
      name: 'Vietnam', 
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80', 
      packageCount: 11,
      category: 'Vietnam'
    },
    { 
      name: 'Goa', 
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', 
      packageCount: 2,
      category: 'Goa'
    },
    { 
      name: 'Spiti Valley', 
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', 
      packageCount: 1,
      category: 'Spiti Valley'
    },
  ];

  const handleDestinationClick = (category: string) => {
    setSearchParams({ category: category });
  };

  const handleBackToDestinations = () => {
    setSearchParams({});
  };

  // Get packages for selected destination and apply filtering/sorting
  const filteredAndSortedPackages = useMemo(() => {
    let packages = data?.data.filter(pkg => 
      pkg.category === selectedDestination
    ) || [];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      packages = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(query) ||
        pkg.destination.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        packages.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        packages.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        packages.sort((a, b) => a.duration - b.duration);
        break;
      case 'name':
        packages.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return packages;
  }, [data?.data, selectedDestination, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Holiday Packages"
        description="Browse our collection of curated holiday packages. Find your perfect getaway with destinations worldwide, flexible durations, and competitive prices."
        keywords="holiday packages, vacation deals, travel packages, tour packages, all-inclusive holidays, beach vacations, adventure tours"
        url="/packages"
      />
      
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 lg:mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Holiday Packages
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl lg:max-w-4xl">
              {selectedDestination 
                ? `Discover amazing ${selectedDestination} experiences` 
                : 'Choose your dream destination and embark on unforgettable journeys'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 xl:px-12 py-12 lg:py-16">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-12">
            <div className="text-center">
              <InlineLoader text="Loading amazing packages..." />
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
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Packages</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">We're having trouble loading the packages right now. Please check your connection and try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Show Destination Cards if no destination selected */}
        {!selectedDestination && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
                Select Your Dream Destination
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl lg:max-w-4xl mx-auto">
                Discover handpicked destinations with carefully curated packages designed for unforgettable experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-8xl mx-auto">
              {destinations.map((dest, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDestinationClick(dest.category)}
                  className="group block text-left"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02]">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 xl:p-12 text-white">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-3 lg:mb-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                        {dest.name}
                      </h3>
                      <p className="text-base md:text-lg lg:text-xl xl:text-2xl mb-4 md:mb-6 lg:mb-8 text-blue-100">
                        {dest.packageCount} Premium Package{dest.packageCount !== 1 ? 's' : ''} Available
                      </p>
                      <div className="flex items-center text-white group-hover:text-blue-200 transition-colors duration-300">
                        <span className="font-semibold text-base md:text-lg lg:text-xl">Explore Packages</span>
                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2 md:ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Show Packages for Selected Destination */}
        {selectedDestination && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header with Back Button */}
            <div className="mb-12">
              <motion.button
                onClick={handleBackToDestinations}
                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-6 group transition-colors duration-200"
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <svg className="w-5 h-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Destinations
              </motion.button>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedDestination} Packages
                  </h2>
                  <p className="text-xl text-gray-600">
                    {filteredAndSortedPackages.length} package{filteredAndSortedPackages.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Filter and Search Interface */}
            <motion.div 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search Input */}
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
                    Search Packages
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by name, destination, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="lg:w-64">
                  <label htmlFor="sort" className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="block w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="duration">Duration</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {searchQuery && (
                <motion.div 
                  className="mt-6 pt-6 border-t border-gray-100"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <span>Search: "{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-blue-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
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
                        delay: index * 0.1, 
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
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
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {searchQuery ? 'No packages match your search' : `No packages found for ${selectedDestination}`}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {searchQuery 
                      ? 'Try adjusting your search terms or browse all packages'
                      : 'Check back soon for new packages or explore other destinations'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Clear Search
                      </button>
                    )}
                    <button
                      onClick={handleBackToDestinations}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
  );
};

export default PackagesPage;
