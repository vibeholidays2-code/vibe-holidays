import { useState, useEffect } from 'react';
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
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Gallery"
        description="Explore stunning photos from our destinations. View beautiful images of beaches, mountains, cities, and cultural experiences from around the world."
        keywords="travel gallery, destination photos, vacation images, travel photography, holiday pictures, destination gallery"
        url="/gallery"
      />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
        <p className="text-lg text-gray-600">
          Explore beautiful destinations through our gallery
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No images found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image._id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.caption || image.destination || 'Gallery image'}
                loading="lazy"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {(image.caption || image.destination) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  {image.destination && (
                    <p className="text-white font-semibold text-sm">
                      {image.destination}
                    </p>
                  )}
                  {image.caption && (
                    <p className="text-white/90 text-xs mt-1">{image.caption}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
            aria-label="Previous image"
          >
            &#8249;
          </button>

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredImages[selectedImageIndex].url}
              alt={
                filteredImages[selectedImageIndex].caption ||
                filteredImages[selectedImageIndex].destination ||
                'Gallery image'
              }
              className="max-w-full max-h-[90vh] object-contain"
            />
            {(filteredImages[selectedImageIndex].caption ||
              filteredImages[selectedImageIndex].destination) && (
              <div className="text-center mt-4 text-white">
                {filteredImages[selectedImageIndex].destination && (
                  <p className="font-semibold text-lg">
                    {filteredImages[selectedImageIndex].destination}
                  </p>
                )}
                {filteredImages[selectedImageIndex].caption && (
                  <p className="text-sm text-gray-300 mt-1">
                    {filteredImages[selectedImageIndex].caption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
            aria-label="Next image"
          >
            &#8250;
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
