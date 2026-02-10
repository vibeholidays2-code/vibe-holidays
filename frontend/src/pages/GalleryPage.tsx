import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';
import { Gallery } from '../types/gallery';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

const GalleryPage = () => {
  const [images, setImages] = useState<Gallery[]>([]);
  const [filteredImages, setFilteredImages] = useState<Gallery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAllImages();
      setImages(data);
      setFilteredImages(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map((img) => img.category)));
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err) {
      setError('Failed to load gallery images. Please try again later.');
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  };

  const getMediaUrl = (url: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <SEO
        title="Gallery - Vibes Holidays"
        description="Explore stunning photos and videos from our destinations. View beautiful images of beaches, mountains, cities, and cultural experiences from around the world."
        keywords="travel gallery, destination photos, vacation images, travel photography, holiday pictures, destination gallery, travel videos"
        url="/gallery"
      />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">📸 Travel Gallery</h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Explore beautiful destinations through our collection of stunning photos and videos
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            All ({images.length})
          </button>
          {categories.map((category) => {
            const count = images.filter(img => img.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <LoadingSpinner />
            <p className="text-gray-600 mt-6 text-lg">Loading gallery...</p>
            <p className="text-gray-500 mt-2 text-sm">
              ⏳ First load may take 30-60 seconds as the server wakes up
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
              <p className="font-semibold mb-2">Error Loading Gallery</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
          <>
            {filteredImages.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-gray-500 text-xl">No media found in this category.</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredImages.map((image, index) => {
                  const mediaUrl = getMediaUrl(image.url);
                  const isVideoFile = isVideo(mediaUrl);
                  
                  return (
                    <motion.div
                      key={image._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                      onClick={() => openLightbox(index)}
                    >
                      {isVideoFile ? (
                        <div className="relative h-64 bg-black">
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            VIDEO
                          </div>
                        </div>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={image.caption || image.destination || 'Gallery image'}
                          loading="lazy"
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                          }}
                        />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {image.destination && (
                            <p className="text-white font-bold text-lg mb-1">
                              {image.destination}
                            </p>
                          )}
                          {image.caption && (
                            <p className="text-white/90 text-sm">{image.caption}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>
      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {lightboxOpen && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white text-5xl hover:text-gray-300 z-10 w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
              aria-label="Close lightbox"
            >
              &times;
            </button>

            {/* Previous Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-6 text-white text-6xl hover:text-gray-300 z-10 w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
                aria-label="Previous"
              >
                &#8249;
              </button>
            )}

            {/* Media Content */}
            <div
              className="max-w-7xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo(getMediaUrl(filteredImages[selectedImageIndex].url)) ? (
                <video
                  src={getMediaUrl(filteredImages[selectedImageIndex].url)}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={getMediaUrl(filteredImages[selectedImageIndex].url)}
                  alt={
                    filteredImages[selectedImageIndex].caption ||
                    filteredImages[selectedImageIndex].destination ||
                    'Gallery image'
                  }
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
                  }}
                />
              )}
              
              {/* Caption */}
              {(filteredImages[selectedImageIndex].caption ||
                filteredImages[selectedImageIndex].destination) && (
                <div className="text-center mt-6 text-white bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  {filteredImages[selectedImageIndex].destination && (
                    <p className="font-bold text-xl mb-2">
                      {filteredImages[selectedImageIndex].destination}
                    </p>
                  )}
                  {filteredImages[selectedImageIndex].caption && (
                    <p className="text-sm text-gray-300">
                      {filteredImages[selectedImageIndex].caption}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Next Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-6 text-white text-6xl hover:text-gray-300 z-10 w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
                aria-label="Next"
              >
                &#8250;
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-lg bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
              {selectedImageIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
