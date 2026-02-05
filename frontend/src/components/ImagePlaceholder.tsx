import { useState, useEffect } from 'react';
import { SkeletonImage } from './SkeletonLoader';

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
  fallbackSrc?: string;
  showLoadingState?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageWithFallbackProps extends ImagePlaceholderProps {
  placeholder?: 'skeleton' | 'blur' | 'icon';
}

const ImagePlaceholder = ({
  src,
  alt,
  className = '',
  aspectRatio = 'video',
  fallbackSrc,
  showLoadingState = true,
  onLoad,
  onError,
}: ImagePlaceholderProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setImageState('loading');
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setImageState('error');
    onError?.();
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    tall: 'aspect-[3/4]',
  };

  if (imageState === 'loading' && showLoadingState) {
    return <SkeletonImage className={className} aspectRatio={aspectRatio} />;
  }

  if (imageState === 'error') {
    return (
      <div className={`${aspectRatioClasses[aspectRatio]} bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center border border-neutral-200/50 ${className}`}>
        <div className="text-center p-6 animate-fade-in">
          <div className="w-16 h-16 bg-neutral-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-neutral-500"
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
          <p className="text-sm text-neutral-600 font-medium">Image not available</p>
          <p className="text-xs text-neutral-500 mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${aspectRatioClasses[aspectRatio]} object-cover transition-all duration-500 ease-out ${
        imageState === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      } rounded-xl ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

// Enhanced image component with professional blur placeholder and better error handling
export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  aspectRatio = 'video',
  fallbackSrc,
  placeholder = 'skeleton',
  showLoadingState = true,
  onLoad,
  onError,
}: ImageWithFallbackProps) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setImageState('loading');
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setImageState('error');
    onError?.();
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    tall: 'aspect-[3/4]',
  };

  const renderPlaceholder = () => {
    switch (placeholder) {
      case 'blur':
        return (
          <div className={`${aspectRatioClasses[aspectRatio]} bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 animate-shimmer rounded-xl overflow-hidden ${className}`}>
            <div className="w-full h-full bg-gradient-to-br from-primary-50/50 via-secondary-50/30 to-primary-50/50 backdrop-blur-sm flex items-center justify-center">
              <div className="animate-fade-in">
                <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'icon':
        return (
          <div className={`${aspectRatioClasses[aspectRatio]} bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl flex items-center justify-center border border-neutral-200/50 ${className}`}>
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-xs text-neutral-500 font-medium">Loading image...</p>
            </div>
          </div>
        );
      
      default:
        return <SkeletonImage className={className} aspectRatio={aspectRatio} />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Placeholder */}
      {imageState === 'loading' && showLoadingState && renderPlaceholder()}
      
      {/* Error state */}
      {imageState === 'error' && (
        <div className={`${aspectRatioClasses[aspectRatio]} bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center border border-neutral-200/50 ${className}`}>
          <div className="text-center p-6 animate-fade-in">
            <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-error-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-600 font-medium">Failed to load image</p>
            <p className="text-xs text-neutral-500 mt-1">Please check your connection</p>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`${aspectRatioClasses[aspectRatio]} object-cover transition-all duration-700 ease-out ${
          imageState === 'loaded' 
            ? 'opacity-100 scale-100' 
            : imageState === 'loading' 
              ? 'opacity-0 scale-105 absolute inset-0' 
              : 'opacity-0'
        } rounded-xl ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default ImagePlaceholder;