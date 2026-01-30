import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { packageService } from '../services/packageService';
import { PackageFilters } from '../types/package';
import PackageCard from '../components/PackageCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

interface DestinationCard {
  name: string;
  image: string;
  packageCount: number;
  category: string;
}

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDestination = searchParams.get('destination');
  
  const [filters, setFilters] = useState<PackageFilters>({
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
  ];

  const handleDestinationClick = (category: string) => {
    setSearchParams({ destination: category });
  };

  const handleBackToDestinations = () => {
    setSearchParams({});
  };

  // Get packages for selected destination and sort by price (low to high)
  const selectedPackages = (data?.data.filter(pkg => 
    pkg.category === selectedDestination
  ) || []).sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Holiday Packages"
        description="Browse our collection of curated holiday packages. Find your perfect getaway with destinations worldwide, flexible durations, and competitive prices."
        keywords="holiday packages, vacation deals, travel packages, tour packages, all-inclusive holidays, beach vacations, adventure tours"
        url="/packages"
      />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Holiday Packages</h1>
          <p className="text-lg text-blue-100">
            {selectedDestination 
              ? `Explore ${selectedDestination} Packages` 
              : 'Choose your dream destination'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">
              Failed to load packages. Please try again later.
            </p>
          </div>
        )}

        {/* Show Destination Cards if no destination selected */}
        {!selectedDestination && !isLoading && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Select Your Destination
              </h2>
              <p className="text-gray-600">
                Click on a destination to view available packages
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest, index) => (
                <button
                  key={index}
                  onClick={() => handleDestinationClick(dest.category)}
                  className="group block text-left"
                >
                  <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-3xl font-bold mb-2">{dest.name}</h3>
                      <p className="text-lg">{dest.packageCount} Packages Available</p>
                      <div className="mt-4 flex items-center text-white">
                        <span className="font-semibold">View Packages</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show Packages for Selected Destination */}
        {selectedDestination && !isLoading && (
          <div>
            <div className="mb-8">
              <button
                onClick={handleBackToDestinations}
                className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Destinations
              </button>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedDestination} Packages
              </h2>
              <p className="text-gray-600">
                {selectedPackages.length} package{selectedPackages.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {selectedPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedPackages.map((pkg) => (
                  <PackageCard key={pkg._id} package={pkg} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No packages found for {selectedDestination}
                </h3>
                <p className="text-gray-600 mb-4">
                  Check back soon for new packages
                </p>
                <button
                  onClick={handleBackToDestinations}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all destinations
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
