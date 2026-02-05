import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from '../types/package';

interface PackageCardProps {
  package: Package;
}

const PackageCard = ({ package: pkg }: PackageCardProps) => {
  const imageUrl = pkg.thumbnail || pkg.images[0] || '/placeholder-image.jpg';

  // Animation variants for the card
  const cardVariants = {
    initial: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale: 1.02,
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  // Animation variants for the image
  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the overlay
  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { 
        duration: 0.3 
      }
    }
  };

  // Animation variants for the price badge
  const priceBadgeVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 10
    },
    hover: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        delay: 0.1
      }
    }
  };

  // Animation variants for the title
  const titleVariants = {
    initial: { color: '#111827' },
    hover: { 
      color: '#1e40af',
      transition: { 
        duration: 0.2 
      }
    }
  };

  // Animation variants for the arrow
  const arrowVariants = {
    initial: { x: 0 },
    hover: { 
      x: 4,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  // Animation variants for the featured badge
  const featuredBadgeVariants = {
    initial: { 
      scale: 1,
      rotate: 0
    },
    hover: { 
      scale: 1.05,
      rotate: 2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  return (
    <Link to={`/packages/${pkg._id}`} className="block group">
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        className="h-full overflow-hidden rounded-2xl bg-white border border-neutral-200"
      >
        <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={pkg.name}
            className="w-full h-full object-cover"
            loading="lazy"
            variants={imageVariants}
          />
          
          {/* Subtle overlay for better text readability */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
            variants={overlayVariants}
          />
          
          {pkg.featured && (
            <motion.div 
              className="absolute top-2 right-2 sm:top-3 sm:right-3"
              variants={featuredBadgeVariants}
            >
              <span className="bg-gradient-secondary text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-soft">
                ✨ Featured
              </span>
            </motion.div>
          )}
          
          {/* Price badge overlay */}
          <motion.div 
            className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3"
            variants={priceBadgeVariants}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 shadow-soft">
              <span className="text-base sm:text-lg font-bold text-primary-600">
                ₹{pkg.price.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
        
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Enhanced typography hierarchy */}
          <motion.h3 
            className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 line-clamp-2"
            variants={titleVariants}
          >
            {pkg.name}
          </motion.h3>
          
          {/* Improved metadata with better spacing */}
          <div className="flex items-center justify-between mb-2 sm:mb-3 text-xs sm:text-sm md:text-base">
            <motion.div 
              className="flex items-center text-neutral-600"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-primary-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium truncate">{pkg.destination}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-neutral-600 ml-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-primary-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{pkg.duration} days</span>
            </motion.div>
          </div>
          
          {/* Enhanced description with better typography */}
          <motion.p 
            className="text-neutral-600 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {pkg.description}
          </motion.p>
          
          {/* Refined pricing and CTA section */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-200">
            <motion.div 
              className="flex flex-col"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600">
                ₹{pkg.price.toLocaleString()}
              </span>
              <span className="text-neutral-500 text-xs">per person</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-primary-600 font-semibold min-h-[44px] py-2"
              whileHover={{ 
                color: '#1d4ed8',
                scale: 1.05
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="mr-1 text-xs sm:text-sm md:text-base">View Details</span>
              <motion.svg 
                className="w-3 h-3 sm:w-4 sm:h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                variants={arrowVariants}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PackageCard;
