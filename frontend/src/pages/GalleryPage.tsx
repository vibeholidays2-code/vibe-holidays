import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';
import { Gallery } from '../types/gallery';
import LoadingSpinner from '../components/LoadingSpinner';
import SEO from '../components/SEO';

// ─── Particle Background ─────────────────────────────────────────────────────
const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 180 + 60,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 14 + 8,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.07 + 0.02,
  type: i % 3,
}));

const ParticleField = () => (
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
          background:
            p.type === 0
              ? 'radial-gradient(circle, rgba(20,184,166,1) 0%, transparent 70%)'
              : p.type === 1
                ? 'radial-gradient(circle, rgba(255,167,38,1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(99,102,241,1) 0%, transparent 70%)',
          opacity: p.opacity,
        }}
        animate={{ y: [0, -35, 0], x: [0, 18, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// ─── Masonry Column Layout ───────────────────────────────────────────────────
interface MasonryGridProps {
  items: Gallery[];
  onOpen: (index: number) => void;
  getMediaUrl: (url: string) => string;
  isVideo: (url: string) => boolean;
}

const MasonryGrid = ({ items, onOpen, getMediaUrl, isVideo }: MasonryGridProps) => {
  // Split into 3 columns
  const columns = useMemo(() => {
    const cols: Gallery[][] = [[], [], []];
    items.forEach((item, i) => cols[i % 3].push(item));
    return cols;
  }, [items]);

  // Map item to its global index for lightbox
  const globalIndex = useCallback(
    (colIdx: number, rowIdx: number) => {
      return colIdx + rowIdx * 3;
    },
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4 lg:gap-5">
          {col.map((image, rowIdx) => {
            const mediaUrl = getMediaUrl(image.url);
            const isVid = isVideo(mediaUrl);
            const idx = globalIndex(colIdx, rowIdx);
            // Vary heights for masonry feel
            const heights = ['h-52', 'h-72', 'h-60', 'h-80', 'h-56', 'h-64'];
            const h = heights[(colIdx * 3 + rowIdx) % heights.length];

            return (
              <motion.div
                key={image._id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (colIdx * 0.1 + rowIdx * 0.08), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${h}`}
                onClick={() => onOpen(idx)}
                whileHover={{ y: -4 }}
              >
                {isVid ? (
                  <div className="relative w-full h-full bg-slate-900">
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                    {/* Video badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      VIDEO
                    </div>
                  </div>
                ) : (
                  <img
                    src={mediaUrl}
                    alt={image.caption || image.destination || 'Gallery image'}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'; }}
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                  {/* Zoom icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {image.destination && (
                      <p className="text-white font-bold text-base mb-0.5 flex items-center gap-1.5">
                        <span className="text-teal-300">📍</span>
                        {image.destination}
                      </p>
                    )}
                    {image.caption && (
                      <p className="text-white/80 text-xs leading-relaxed line-clamp-2">{image.caption}</p>
                    )}
                    {image.category && (
                      <span className="inline-block mt-2 px-2.5 py-1 bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold rounded-full capitalize">
                        {image.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }}
                />
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─── Premium Lightbox ────────────────────────────────────────────────────────
interface LightboxProps {
  images: Gallery[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  getMediaUrl: (url: string) => string;
  isVideo: (url: string) => boolean;
}

const Lightbox = ({ images, index, onClose, onPrev, onNext, getMediaUrl, isVideo }: LightboxProps) => {
  const img = images[index];
  const mediaUrl = getMediaUrl(img.url);
  const isVid = isVideo(mediaUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

      {/* Close */}
      <motion.button
        className="absolute top-5 right-5 z-20 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <motion.button
          className="absolute left-4 sm:left-6 z-20 w-12 h-12 bg-white/10 hover:bg-teal-500/30 border border-white/20 hover:border-teal-500/40 rounded-full flex items-center justify-center text-white transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Media */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl w-full mx-16 sm:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        {isVid ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain"
          />
        ) : (
          <img
            src={mediaUrl}
            alt={img.caption || img.destination || 'Gallery image'}
            className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'; }}
          />
        )}

        {/* Caption */}
        {(img.caption || img.destination) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4"
          >
            {img.destination && (
              <p className="font-bold text-white text-lg flex items-center justify-center gap-2 mb-1">
                <span className="text-teal-400">📍</span>
                {img.destination}
              </p>
            )}
            {img.caption && <p className="text-slate-300 text-sm">{img.caption}</p>}
            {img.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-full capitalize">
                {img.category}
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <motion.button
          className="absolute right-4 sm:right-6 z-20 w-12 h-12 bg-white/10 hover:bg-teal-500/30 border border-white/20 hover:border-teal-500/40 rounded-full flex items-center justify-center text-white transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 max-w-sm overflow-x-auto px-4 scrollbar-hide">
          {images.slice(Math.max(0, index - 3), Math.min(images.length, index + 4)).map((thumb, i) => {
            const thumbUrl = getMediaUrl(thumb.url);
            const realIdx = Math.max(0, index - 3) + i;
            return (
              <button
                key={thumb._id}
                onClick={(e) => { e.stopPropagation(); /* navigate to realIdx */ }}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${realIdx === index ? 'border-teal-400 scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
              >
                {isVideo(thumbUrl) ? (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                ) : (
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const GalleryPage = () => {
  const [images, setImages] = useState<Gallery[]>([]);
  const [filteredImages, setFilteredImages] = useState<Gallery[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => { fetchImages(); }, []);

  useEffect(() => {
    setFilteredImages(
      selectedCategory === 'all' ? images : images.filter((img) => img.category === selectedCategory)
    );
  }, [selectedCategory, images]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, filteredImages.length]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAllImages();
      setImages(data);
      setFilteredImages(data);
      const uniqueCategories = Array.from(new Set(data.map((img) => img.category)));
      setCategories(uniqueCategories);
      setError(null);
    } catch (err) {
      setError('Failed to load gallery images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => { setSelectedImageIndex(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const goToPrevious = () => setSelectedImageIndex((p) => (p === 0 ? filteredImages.length - 1 : p - 1));
  const goToNext = () => setSelectedImageIndex((p) => (p === filteredImages.length - 1 ? 0 : p + 1));

  const isVideo = (url: string) => url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

  const getMediaUrl = (url: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  const categoryIcons: Record<string, string> = {
    beach: '🏖️', mountain: '🏔️', city: '🌆', culture: '🛕', adventure: '🧗', wildlife: '🦁',
    bali: '🌴', goa: '🌊', kashmir: '❄️', vietnam: '🛕', dubai: '🌇', default: '📸',
  };

  const getCategoryIcon = (cat: string) =>
    categoryIcons[cat.toLowerCase()] || categoryIcons.default;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <SEO
        title="Gallery - Vibes Holidays"
        description="Explore stunning photos and videos from our destinations. View beautiful images of beaches, mountains, cities, and cultural experiences from around the world."
        keywords="travel gallery, destination photos, vacation images, travel photography, holiday pictures, destination gallery, travel videos"
        url="/gallery"
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        {/* Animated gradient */}
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

        <ParticleField />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(20,184,166,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm"
            >
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              Visual Stories
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-[0.95]">
              <span className="text-white">Travel</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400">
                Gallery
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Explore breathtaking destinations through our curated collection of stunning photos and videos from around the world
            </p>

            {/* Stats row */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-8"
              >
                {[
                  { label: 'Photos & Videos', value: images.length + '+' },
                  { label: 'Destinations', value: categories.length + '+' },
                  { label: 'Categories', value: categories.length },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-extrabold text-white">{s.value}</div>
                    <div className="text-xs text-slate-400 font-medium">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <LoadingSpinner />
            <p className="text-slate-400 mt-6 text-lg">Loading gallery...</p>
            <p className="text-slate-500 mt-2 text-sm">⏳ First load may take 30-60 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Failed to Load Gallery</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={fetchImages}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/25"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Gallery */}
        {!loading && !error && (
          <>
            {/* Category Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center mb-10 sm:mb-12 scrollbar-hide px-1"
            >
              {/* All button */}
              <motion.button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>🌍</span>
                All
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-white/10'}`}>
                  {images.length}
                </span>
              </motion.button>

              {categories.map((category) => {
                const count = images.filter((img) => img.category === category).length;
                const isActive = selectedCategory === category;
                return (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm capitalize transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span>{getCategoryIcon(category)}</span>
                    {category}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Results count */}
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <p className="text-slate-500 text-sm">
                Showing <span className="text-teal-400 font-semibold">{filteredImages.length}</span> {filteredImages.length === 1 ? 'item' : 'items'}
                {selectedCategory !== 'all' && (
                  <> in <span className="text-white font-semibold capitalize">{selectedCategory}</span></>
                )}
              </p>
            </motion.div>

            {/* Empty state */}
            {filteredImages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24"
              >
                <div className="text-6xl mb-5">🖼️</div>
                <h3 className="text-xl font-bold text-white mb-3">No Media Found</h3>
                <p className="text-slate-400">No items in this category yet. Check back soon!</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="mt-6 px-6 py-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 rounded-xl font-semibold transition-all duration-300"
                >
                  View All
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <MasonryGrid
                    items={filteredImages}
                    onOpen={openLightbox}
                    getMediaUrl={getMediaUrl}
                    isVideo={isVideo}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && filteredImages.length > 0 && (
          <Lightbox
            images={filteredImages}
            index={selectedImageIndex}
            onClose={closeLightbox}
            onPrev={goToPrevious}
            onNext={goToNext}
            getMediaUrl={getMediaUrl}
            isVideo={isVideo}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
