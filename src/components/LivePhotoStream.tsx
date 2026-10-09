import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WeddingPhoto, PhotoCategory, PhotoFilter } from '../types/wedding';
import { soundEngine } from '../utils/audio';
import {
  Camera,
  Upload,
  Heart,
  Sparkles,
  Maximize2,
  X,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LivePhotoStreamProps {
  photos: WeddingPhoto[];
  onAddPhoto: (photo: WeddingPhoto) => void;
  onLikePhoto: (id: string) => void;
}

const SAMPLE_GUEST_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    caption: 'The candlelit tables look magnificent in the evening glow!',
    uploader: 'Aunt Clara',
    category: 'dinner' as PhotoCategory
  },
  {
    url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Lakeside sunset over the mountains. What a fairytale view.',
    uploader: 'Sebastien & Leo',
    category: 'cocktail' as PhotoCategory
  },
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    caption: 'Toast to the happy couple! Best party ever.',
    uploader: 'Groomsmen Squad',
    category: 'party' as PhotoCategory
  }
];

const PHOTO_FILTERS: { value: PhotoFilter; label: string; cssFilter: string }[] = [
  { value: 'none', label: 'Original', cssFilter: 'none' },
  { value: 'black-and-white', label: 'Black & White', cssFilter: 'grayscale(1)' },
  { value: 'sepia', label: 'Sepia', cssFilter: 'sepia(0.85)' },
];

export const LivePhotoStream: React.FC<LivePhotoStreamProps> = ({
  photos,
  onAddPhoto,
  onLikePhoto
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>('all');
  const [isUploadingModal, setIsUploadingModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Upload Form State
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<PhotoCategory>('candid');
  const [photoFilter, setPhotoFilter] = useState<PhotoFilter>('none');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Filter photos
  // Public gallery is strict: a photo must be explicitly approved by an admin.
  const approvedPhotos = photos.filter((photo) => photo.moderationStatus === 'approved');
  const filteredPhotos = selectedCategory === 'all'
    ? approvedPhotos
    : approvedPhotos.filter((p) => p.category === selectedCategory);

  const getPhotoFilterStyle = (filter: PhotoFilter = 'none') => ({
    filter: PHOTO_FILTERS.find((option) => option.value === filter)?.cssFilter ?? 'none'
  });

  const currentLightboxPhoto = lightboxIndex !== null && filteredPhotos[lightboxIndex]
    ? filteredPhotos[lightboxIndex]
    : null;

  // Lightbox navigation handlers
  const handlePrevPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + filteredPhotos.length) % filteredPhotos.length;
    });
    soundEngine.playNote(440, 0.3, 0.08, 'sine');
  }, [filteredPhotos.length]);

  const handleNextPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % filteredPhotos.length;
    });
    soundEngine.playNote(554.37, 0.3, 0.08, 'sine');
  }, [filteredPhotos.length]);

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPhoto();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrevPhoto, handleNextPhoto, handleCloseLightbox]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (lightboxIndex !== null && thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.children[lightboxIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [lightboxIndex]);

  // Slideshow auto timer
  useEffect(() => {
    let timer: number;
    if (isSlideshowActive && filteredPhotos.length > 0) {
      timer = window.setInterval(() => {
        setSlideshowIndex((prev) => (prev + 1) % filteredPhotos.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSlideshowActive, filteredPhotos.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setImagePreview(sampleUrl);
  };

  const handleSubmitPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    const newPhoto: WeddingPhoto = {
      id: `p-${Date.now()}`,
      url: imagePreview,
      caption: caption.trim() || 'A cherished celebration memory',
      uploaderName: uploaderName.trim() || 'Honored Guest',
      category,
      timestamp: 'Just now',
      likes: 1,
      isLikedByUser: true,
      filter: photoFilter,
      moderationStatus: 'pending'
    };

    onAddPhoto(newPhoto);
    soundEngine.playNote(659.25, 0.8, 0.25, 'sine');

    // Reset
    setImagePreview(null);
    setCaption('');
    setUploaderName('');
    setPhotoFilter('none');
    setIsUploadingModal(false);
  };

  const handleQuickSimulate = () => {
    const pick = SAMPLE_GUEST_PHOTOS[Math.floor(Math.random() * SAMPLE_GUEST_PHOTOS.length)];
    const simPhoto: WeddingPhoto = {
      id: `sim-${Date.now()}`,
      url: pick.url,
      caption: pick.caption,
      uploaderName: pick.uploader,
      category: pick.category,
      timestamp: 'Just now',
      likes: Math.floor(Math.random() * 8) + 1,
      isLikedByUser: false,
      moderationStatus: 'approved'
    };
    onAddPhoto(simPhoto);
    soundEngine.playNote(587.33, 0.5, 0.2, 'sine');
  };

  const openLightboxAt = (photo: WeddingPhoto) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    soundEngine.playNote(523.25, 0.4, 0.1, 'sine');
  };

  const categories: { label: string; value: PhotoCategory }[] = [
    { label: 'All Photos', value: 'all' },
    { label: 'Ceremony', value: 'ceremony' },
    { label: 'Cocktail Hour', value: 'cocktail' },
    { label: 'Dinner & Toasts', value: 'dinner' },
    { label: 'Party & Dancing', value: 'party' },
    { label: 'Candids', value: 'candid' },
  ];

  return (
    <section id="photos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold mb-2 font-sans">
          <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Real-Time Guest Gallery</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal tracking-wide">
          Shared Moments & Memories
        </h2>
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#C85A17]" />
          <span className="w-2 h-2 rounded-full bg-[#0F5132] ring-2 ring-[#C85A17]/30" />
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#C85A17]" />
        </div>
        <p className="font-serif italic text-base sm:text-lg text-[#524438] max-w-xl mx-auto">
          Snap and share your perspective of our wedding day in real time. Click any photo to view full-screen with high-definition gallery controls.
        </p>
      </div>

      {/* Action Bar (Upload Photo, Projector Slideshow, Simulate) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 glass p-4 rounded-2xl border border-[#C85A17]/25 shadow-xs backdrop-blur-xl">
        
        {/* Category Filters (Segmented control) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 glass rounded-xl border border-[#0F5132]/20">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 text-xs font-sans rounded-lg transition-all cursor-pointer ${
                selectedCategory === c.value
                  ? 'bg-[#0F5132] text-white font-medium shadow-sm'
                  : 'text-[#4d4035] hover:text-[#0F5132] hover:bg-black/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleQuickSimulate}
            className="px-3.5 py-2 glass glass-hover border border-[#0F5132]/30 text-[#0F5132] text-xs uppercase tracking-[0.16em] rounded-xl font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Simulate another guest snapping and uploading a photo right now"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0F5132]" />
            <span className="hidden sm:inline">Simulate Live Snap</span>
          </button>

          <button
            onClick={() => setIsSlideshowActive(true)}
            className="px-3.5 py-2 glass glass-hover border border-[#C85A17]/40 text-[#C85A17] text-xs uppercase tracking-[0.16em] rounded-xl font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Launch Projector Slideshow Mode"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Venue Projector</span>
          </button>

          <button
            onClick={() => setIsUploadingModal(true)}
            className="px-4 py-2 bg-[#C85A17] hover:bg-[#a0420b] text-white text-xs uppercase tracking-[0.18em] rounded-xl font-semibold font-sans transition-all flex items-center gap-2 shadow-sm cursor-pointer border border-[#0F5132]/30 active:scale-95"
          >
            <Camera className="w-4 h-4 text-white" />
            <span>Share a Photo</span>
          </button>
        </div>

      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="group glass glass-hover rounded-2xl border border-[#0F5132]/20 hover:border-[#C85A17]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col backdrop-blur-xl"
          >
            {/* Image Box */}
            <div
              className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
              onClick={() => openLightboxAt(photo)}
              title="Click to view full-screen"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={getPhotoFilterStyle(photo.filter)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-white text-xs font-sans flex items-center gap-1.5 drop-shadow-sm font-medium">
                  <Maximize2 className="w-3.5 h-3.5 text-[#C85A17]" />
                  Full-screen view
                </span>
                <span className="text-white/80 text-[10px] uppercase font-sans tracking-widest bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  #{index + 1}
                </span>
              </div>
              <span className="absolute top-3 left-3 bg-[#082E1D]/80 backdrop-blur-md text-[10px] uppercase tracking-wider text-emerald-100 px-2.5 py-0.5 rounded-full font-sans border border-[#0F5132]/40 shadow-xs">
                {photo.category}
              </span>
            </div>

            {/* Photo Footer Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-[#2c241d] font-serif italic text-base leading-snug line-clamp-2">
                  “{photo.caption}”
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500 font-sans">
                  <span className="font-medium text-[#0F5132]">{photo.uploaderName}</span>
                  <span>·</span>
                  <span>{photo.timestamp}</span>
                </div>
              </div>

              {/* Like / Heart interaction */}
              <div className="mt-3 pt-3 border-t border-[#0F5132]/10 flex items-center justify-between">
                <button
                  onClick={() => onLikePhoto(photo.id)}
                  className={`flex items-center gap-1.5 text-xs font-sans transition-colors cursor-pointer ${
                    photo.isLikedByUser ? 'text-rose-600 font-semibold' : 'text-stone-500 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform active:scale-125 ${photo.isLikedByUser ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{photo.likes} {photo.likes === 1 ? 'love' : 'loves'}</span>
                </button>

                <button
                  onClick={() => openLightboxAt(photo)}
                  className="text-[#C85A17] hover:text-[#0F5132] p-1.5 rounded-lg hover:bg-[#C85A17]/10 transition-colors cursor-pointer flex items-center gap-1 text-xs font-sans"
                  title="Expand photo in lightbox"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium hidden sm:inline">Inspect</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-16 glass rounded-2xl border border-[#0F5132]/20 p-8">
          <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="font-serif text-lg text-[#0F5132]">No photos in this category yet</p>
          <p className="text-xs text-stone-500 font-sans mt-1">Be the first guest to share a moment here!</p>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/45 backdrop-blur-2xl rounded-3xl border border-white/55 max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsUploadingModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-[#0F5132] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C85A17] font-sans font-semibold">
                Live Guest Camera
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#0F5132] mt-1">
                Share Your Wedding Snapshot
              </h3>
            </div>

            <form onSubmit={handleSubmitPhoto} className="space-y-4">
              
              {/* Image Picker */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#C85A17]/30 shadow-md group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={getPhotoFilterStyle(photoFilter)}
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#C85A17]/40 bg-white/40 flex flex-col items-center justify-center cursor-pointer hover:bg-white/70 hover:border-[#C85A17] transition-all p-4 text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#C85A17]/10 flex items-center justify-center text-[#C85A17] mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#0F5132] uppercase tracking-wider font-sans">
                      Tap to Choose or Snap Photo
                    </span>
                    <span className="text-[11px] text-stone-500 mt-1 font-sans">
                      Supports mobile cameras and desktop libraries
                    </span>
                  </div>
                )}
              </div>

              {/* Preset selection shortcut if guest wants to try quickly */}
              {!imagePreview && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-500 font-sans block mb-1">
                    Or select a celebratory sample:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_GUEST_PHOTOS.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSample(s.url)}
                        className="aspect-[4/3] rounded-xl overflow-hidden border border-[#C85A17]/25 hover:border-[#C85A17] hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <img src={s.url} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photo filter selection */}
              {imagePreview && (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#0F5132] mb-2 font-sans">
                    Apply a Filter
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PHOTO_FILTERS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPhotoFilter(option.value)}
                        className={`rounded-xl border px-2 py-2 text-xs font-semibold transition-all cursor-pointer ${
                          photoFilter === option.value
                            ? 'border-[#C85A17] bg-[#C85A17]/10 text-[#C85A17] ring-1 ring-[#C85A17]/30'
                            : 'border-[#0F5132]/20 bg-white/70 text-[#0F5132] hover:border-[#C85A17]/60'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploader Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#0F5132] mb-1 font-sans">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nicholas & Helena"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0F5132]/25 focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17] focus:outline-none text-sm text-[#2b241e] bg-white/80 font-sans transition-all"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#0F5132] mb-1 font-sans">
                  Caption or Memory
                </label>
                <input
                  type="text"
                  placeholder="e.g. The first dance took our breath away!"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0F5132]/25 focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17] focus:outline-none text-sm text-[#2b241e] bg-white/80 font-sans transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#0F5132] mb-1 font-sans">
                  Moment Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PhotoCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#0F5132]/25 focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17] focus:outline-none text-sm text-[#2b241e] bg-white/80 font-sans transition-all"
                >
                  <option value="candid">Candid Moment</option>
                  <option value="ceremony">Ceremony</option>
                  <option value="cocktail">Cocktail Hour</option>
                  <option value="dinner">Dinner & Toasts</option>
                  <option value="party">Party & Dancing</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!imagePreview}
                className={`w-full py-3 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold font-sans transition-all ${
                  imagePreview
                    ? 'bg-[#C85A17] hover:bg-[#a0420b] text-white shadow-md cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Post to Live Wedding Wall
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPGRADED FULLSCREEN LIGHTBOX MODAL WITH NAVIGATION ARROWS */}
      {currentLightboxPhoto && lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 backdrop-blur-2xl animate-fade-in select-none p-3 sm:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photo lightbox"
        >
          {/* Top Control Bar */}
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 pb-2 border-b border-white/10">
            {/* Left: Counter & Category Badge */}
            <div className="flex items-center gap-3">
              <span className="bg-black/25 px-3 py-1 rounded-full text-xs font-mono font-medium text-white/90 border border-white/30 backdrop-blur-md">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <span className="bg-[#0F5132]/80 text-emerald-200 border border-[#0F5132] px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-sans font-semibold backdrop-blur-sm">
                {currentLightboxPhoto.category}
              </span>
              <span className="hidden md:inline text-xs text-white/50 font-sans">
                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/80">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/80">→</kbd> to navigate · <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/80">Esc</kbd> to exit
              </span>
            </div>

            {/* Right: Actions & Close */}
            <div className="flex items-center gap-2">
              <a
                href={currentLightboxPhoto.url}
                download="wedding-photo.jpg"
                target="_blank"
                rel="noreferrer"
                className="p-2 sm:px-3 sm:py-1.5 bg-black/25 hover:bg-black/55 text-white/90 hover:text-white rounded-full border border-white/30 transition-all flex items-center gap-1.5 text-xs font-sans cursor-pointer backdrop-blur-md"
                title="Download or open original full resolution image"
              >
                <Download className="w-4 h-4 text-[#C85A17]" />
                <span className="hidden sm:inline">Original Res</span>
              </a>

              <button
                onClick={handleCloseLightbox}
                className="p-2 bg-black/25 hover:bg-rose-900/50 text-white rounded-full border border-white/30 transition-all cursor-pointer backdrop-blur-md"
                aria-label="Close full-screen photo"
                title="Close (Escape)"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Central Stage: Left Arrow, Main Full-Screen Image, Right Arrow */}
          <div className="relative flex-1 flex items-center justify-center my-2 max-w-7xl mx-auto w-full px-2 sm:px-12">
            
            {/* PREVIOUS NAVIGATION ARROW BUTTON */}
            <button
              onClick={handlePrevPhoto}
              aria-label="Previous photo (Left Arrow key)"
              title="Previous photo (←)"
              className="absolute left-1 sm:left-4 z-30 p-3 sm:p-4 rounded-full bg-black/25 hover:bg-black/55 text-white border border-white/35 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer group"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* MAIN IMAGE CONTAINER */}
            <div className="relative max-h-[64vh] sm:max-h-[68vh] w-full flex items-center justify-center overflow-hidden">
              <img
                key={currentLightboxPhoto.id}
                src={currentLightboxPhoto.url}
                alt={currentLightboxPhoto.caption}
                className="max-h-[64vh] sm:max-h-[68vh] max-w-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] object-contain border border-white/15 transition-all duration-300"
                style={getPhotoFilterStyle(currentLightboxPhoto.filter)}
              />
            </div>

            {/* NEXT NAVIGATION ARROW BUTTON */}
            <button
              onClick={handleNextPhoto}
              aria-label="Next photo (Right Arrow key)"
              title="Next photo (→)"
              className="absolute right-1 sm:right-4 z-30 p-3 sm:p-4 rounded-full bg-black/25 hover:bg-black/55 text-white border border-white/35 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer group"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>

          {/* Bottom Info Card & Thumbnails Strip */}
          <div className="w-full max-w-4xl mx-auto z-20 flex flex-col gap-2">
            
            {/* Caption & Details Floating Glass Box */}
            <div className="bg-black/75 backdrop-blur-2xl rounded-2xl border border-white/25 p-3.5 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="font-serif italic text-base sm:text-lg text-white">
                  “{currentLightboxPhoto.caption}”
                </p>
                <p className="text-xs text-white/60 font-sans mt-0.5">
                  Captured by <strong className="text-white/90 font-medium">{currentLightboxPhoto.uploaderName}</strong> · {currentLightboxPhoto.timestamp}
                </p>
              </div>

              {/* Like / Love Action */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLikePhoto(currentLightboxPhoto.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-2 cursor-pointer transition-all active:scale-95 border ${
                    currentLightboxPhoto.isLikedByUser
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${currentLightboxPhoto.isLikedByUser ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  <span>{currentLightboxPhoto.likes} Loves</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {filteredPhotos.length > 1 && (
              <div
                ref={thumbnailStripRef}
                className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar"
              >
                {filteredPhotos.map((thumb, idx) => (
                  <button
                    key={thumb.id}
                    onClick={() => {
                      setLightboxIndex(idx);
                      soundEngine.playNote(493.88, 0.2, 0.08, 'sine');
                    }}
                    className={`relative shrink-0 w-12 h-10 sm:w-14 sm:h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === lightboxIndex
                        ? 'border-[#C85A17] scale-110 shadow-lg ring-2 ring-[#C85A17]/50'
                        : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'
                    }`}
                    title={`Go to photo ${idx + 1}`}
                  >
                    <img
                      src={thumb.url}
                      alt=""
                      className="w-full h-full object-cover"
                      style={getPhotoFilterStyle(thumb.filter)}
                    />
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Projector / Slideshow Fullscreen Mode */}
      {isSlideshowActive && filteredPhotos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-[#082E1D]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 sm:p-10 select-none animate-fade-in">
          
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white/80 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-xl tracking-wider text-[#C85A17] font-semibold">
                Kwadwo & Mary
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
                · Live Wedding Projector Stream
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-white/70">
                Slide {slideshowIndex + 1} of {filteredPhotos.length}
              </span>
              <button
                onClick={() => setIsSlideshowActive(false)}
                className="p-2 rounded-full bg-black/25 hover:bg-black/55 text-white border border-white/30 backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Slide Photo */}
          <div className="relative max-h-[70vh] flex items-center justify-center my-auto">
            <img
              src={filteredPhotos[slideshowIndex].url}
              alt={filteredPhotos[slideshowIndex].caption}
              className="max-h-[68vh] rounded-2xl shadow-2xl object-contain border-2 border-white/15 transition-all duration-700"
              style={getPhotoFilterStyle(filteredPhotos[slideshowIndex].filter)}
            />
          </div>

          {/* Caption banner */}
          <div className="text-center max-w-2xl text-white">
            <p className="font-serif text-2xl sm:text-3xl italic text-[#f4eee4]">
              “{filteredPhotos[slideshowIndex].caption}”
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C85A17] mt-2 font-sans font-semibold">
              Captured by {filteredPhotos[slideshowIndex].uploaderName}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md h-1.5 bg-white/15 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-[#C85A17] to-amber-400 transition-all duration-300"
              style={{ width: `${((slideshowIndex + 1) / filteredPhotos.length) * 100}%` }}
            />
          </div>

        </div>
      )}

    </section>
  );
};

