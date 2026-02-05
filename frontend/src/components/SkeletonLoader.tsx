import { ReactNode } from 'react';

interface SkeletonLoaderProps {
  className?: string;
  children?: ReactNode;
}

interface SkeletonCardProps {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  showMetadata?: boolean;
  className?: string;
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

interface SkeletonImageProps {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
}

// Base skeleton component with enhanced shimmer animation
const SkeletonLoader = ({ className = '', children }: SkeletonLoaderProps) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
};

// Enhanced skeleton for rectangular content blocks with shimmer effect
export const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`} />
);

// Enhanced skeleton for circular content (avatars, icons)
export const SkeletonCircle = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-shimmer rounded-full ${className}`} />
);

// Skeleton for text content with multiple lines
export const SkeletonText = ({ lines = 3, className = '' }: SkeletonTextProps) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBox
        key={index}
        className={`h-4 ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Enhanced skeleton for images with different aspect ratios and better placeholder
export const SkeletonImage = ({ className = '', aspectRatio = 'video' }: SkeletonImageProps) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    tall: 'aspect-[3/4]',
  };

  return (
    <div className={`bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-shimmer rounded-xl overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {/* Enhanced placeholder icon with subtle animation */}
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-100/50 to-neutral-200/50">
        <div className="animate-fade-in">
          <svg
            className="w-12 h-12 text-neutral-400 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Enhanced skeleton for package cards with better styling
export const SkeletonPackageCard = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showPrice = true,
  showMetadata = true,
  className = '',
}: SkeletonCardProps) => (
  <SkeletonLoader className={`bg-white rounded-3xl overflow-hidden shadow-soft border border-neutral-100/50 hover:shadow-medium transition-shadow duration-300 ${className}`}>
    {showImage && (
      <div className="relative">
        <SkeletonImage className="w-full h-72" aspectRatio="video" />
        {/* Subtle overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
    )}
    
    <div className="p-6 space-y-4">
      {showTitle && (
        <SkeletonBox className="h-7 w-3/4" />
      )}
      
      {showMetadata && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SkeletonCircle className="h-4 w-4" />
            <SkeletonBox className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-2">
            <SkeletonCircle className="h-4 w-4" />
            <SkeletonBox className="h-4 w-20" />
          </div>
        </div>
      )}
      
      {showDescription && (
        <div className="space-y-3">
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />
          <SkeletonBox className="h-4 w-4/6" />
        </div>
      )}
      
      {showPrice && (
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="space-y-2">
            <SkeletonBox className="h-7 w-24" />
            <SkeletonBox className="h-3 w-16" />
          </div>
          <SkeletonBox className="h-10 w-28 rounded-xl" />
        </div>
      )}
    </div>
  </SkeletonLoader>
);

// Enhanced skeleton for package detail page with better organization
export const SkeletonPackageDetail = () => (
  <div className="min-h-screen bg-gradient-subtle animate-fade-in">
    {/* Breadcrumb skeleton */}
    <div className="bg-white border-b border-neutral-200/50">
      <div className="container mx-auto px-4 py-4">
        <SkeletonLoader>
          <div className="flex items-center space-x-2">
            <SkeletonBox className="h-4 w-12" />
            <div className="w-1 h-1 bg-neutral-300 rounded-full" />
            <SkeletonBox className="h-4 w-16" />
            <div className="w-1 h-1 bg-neutral-300 rounded-full" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </SkeletonLoader>
      </div>
    </div>

    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image gallery skeleton */}
          <SkeletonLoader className="bg-white rounded-2xl shadow-soft overflow-hidden border border-neutral-100/50">
            <SkeletonImage className="w-full h-96" aspectRatio="video" />
            <div className="p-6 flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonImage key={index} className="w-20 h-20 flex-shrink-0" aspectRatio="square" />
              ))}
            </div>
          </SkeletonLoader>

          {/* Package info skeleton */}
          <SkeletonLoader className="bg-white rounded-2xl shadow-soft p-8 space-y-6 border border-neutral-100/50">
            <div className="space-y-4">
              <SkeletonBox className="h-10 w-3/4" />
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <SkeletonCircle className="h-5 w-5" />
                  <SkeletonBox className="h-5 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <SkeletonCircle className="h-5 w-5" />
                  <SkeletonBox className="h-5 w-20" />
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <SkeletonBox className="h-6 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBox key={index} className={`h-4 ${index === 3 ? 'w-3/4' : 'w-full'}`} />
                ))}
              </div>
            </div>
          </SkeletonLoader>

          {/* Itinerary skeleton */}
          <SkeletonLoader className="bg-white rounded-2xl shadow-soft p-8 space-y-6 border border-neutral-100/50">
            <SkeletonBox className="h-7 w-40" />
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <SkeletonCircle className="w-12 h-12" />
                  </div>
                  <div className="flex-1 pt-2 space-y-3">
                    <SkeletonBox className="h-5 w-32" />
                    <div className="space-y-2">
                      <SkeletonBox className="h-4 w-full" />
                      <SkeletonBox className="h-4 w-4/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SkeletonLoader>
        </div>

        {/* Enhanced sidebar skeleton */}
        <div className="lg:col-span-1">
          <SkeletonLoader className="bg-white rounded-2xl shadow-soft p-8 space-y-6 sticky top-4 border border-neutral-100/50">
            <div className="space-y-3">
              <SkeletonBox className="h-8 w-36" />
              <SkeletonBox className="h-4 w-24" />
            </div>
            <div className="space-y-4">
              <SkeletonBox className="h-12 w-full rounded-xl" />
              <SkeletonBox className="h-12 w-full rounded-xl" />
            </div>
            <div className="border-t border-neutral-200 pt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <SkeletonCircle className="h-5 w-5" />
                  <SkeletonBox className="h-4 w-28" />
                </div>
              ))}
            </div>
          </SkeletonLoader>
        </div>
      </div>
    </div>
  </div>
);

// New skeleton components for different use cases

// Skeleton for navigation menu
export const SkeletonNavigation = () => (
  <SkeletonLoader className="bg-white border-b border-neutral-200/50">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-8 w-32" />
        <div className="hidden md:flex items-center space-x-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBox key={index} className="h-5 w-16" />
          ))}
        </div>
        <SkeletonBox className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  </SkeletonLoader>
);

// Skeleton for hero section
export const SkeletonHero = () => (
  <SkeletonLoader className="relative h-96 bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-shimmer">
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
      <div className="text-center space-y-6 max-w-2xl">
        <SkeletonBox className="h-12 w-96 mx-auto" />
        <SkeletonBox className="h-6 w-80 mx-auto" />
        <SkeletonBox className="h-12 w-40 mx-auto rounded-xl" />
      </div>
    </div>
  </SkeletonLoader>
);

// Skeleton for grid layouts
export const SkeletonGrid = ({ 
  columns = 3, 
  rows = 2, 
  className = "" 
}: { 
  columns?: number; 
  rows?: number; 
  className?: string; 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 ${className}`}>
    {Array.from({ length: columns * rows }).map((_, index) => (
      <SkeletonPackageCard key={index} />
    ))}
  </div>
);

export default SkeletonLoader;