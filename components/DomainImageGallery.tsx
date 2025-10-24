import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  per_page: number;
  page: number;
}

interface DomainImageGalleryProps {
  domain: string;
  onImageSelect?: (imageUrl: string, imageAlt: string) => void;
  onClose?: () => void;
  onImageUrlSet?: (imageUrl: string) => void;
}

const DOMAIN_QUERIES: Record<string, string> = {
  'professional-scenes': 'business office meeting corporate workplace presentation team boardroom conference handshake collaboration executive professional work',
  'emotions-expression': 'portrait emotion expression face human feeling reaction mood smile laugh serious contemplative person people',
  'nature-environment': 'nature landscape forest mountain ocean wildlife outdoor environment sunset sunrise trees water natural scenic',
  'technology-innovation': 'technology innovation tech digital computer robot ai future lab data cyber modern science engineering',
  'places-architecture': 'architecture building city landmark place urban design structure bridge tower monument construction architectural',
  'art-creativity': 'art creative artist studio painting design craft imagination sculpture gallery workshop artistic',
  'human-stories': 'family people relationship community life story human connection friends children elderly social personal',
  'dream-fantasy': 'fantasy dream surreal magical neon aurora mystical ethereal cosmic space universe abstract artistic'
};

// Cache for storing fetched images per domain
const imageCache = new Map<string, PexelsPhoto[]>();
const usedImages = new Map<string, Set<number>>();

const DomainImageGallery: React.FC<DomainImageGalleryProps> = ({
  domain,
  onImageSelect,
  onClose,
  onImageUrlSet
}) => {
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get search query for domain
  const searchQuery = useMemo(() => {
    return DOMAIN_QUERIES[domain] || domain;
  }, [domain]);

  // Fetch images from Pexels API
  const fetchImages = useCallback(async (page: number = 1) => {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY || 'Ms4Vpz8j7cHnwMcyXsIgQzeCpY047YCNU5aJY3HlVPJOO4hNRwXexpgq';
    
    console.log('Environment check:', {
      'import.meta.env.VITE_PEXELS_API_KEY': import.meta.env.VITE_PEXELS_API_KEY,
      'apiKey being used': apiKey,
      'NODE_ENV': import.meta.env.MODE
    });
    
    if (!apiKey || apiKey === 'your_pexels_api_key_here') {
      console.warn('PEXELS_API_KEY not found. Using fallback images.');
      setError('API key not configured. Using fallback images.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = searchQuery.split(' ')[0]; // Use first keyword for search
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=80&page=${page}`,
        {
          headers: {
            'Authorization': apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();
      
      // Cache the results
      const cacheKey = `${domain}-${page}`;
      imageCache.set(cacheKey, data.photos);
      
      // Get available images (not used yet)
      const usedSet = usedImages.get(domain) || new Set();
      const availableImages = data.photos.filter(photo => !usedSet.has(photo.id));
      
      // If we have enough available images, use them
      if (availableImages.length >= 25) {
        const selectedImages = availableImages.slice(0, 25);
        setImages(selectedImages);
        
        // Mark these images as used
        selectedImages.forEach(photo => usedSet.add(photo.id));
        usedImages.set(domain, usedSet);
      } else {
        // Not enough new images, use cached images
        const cachedImages = imageCache.get(`${domain}-1`) || [];
        const randomSelection = [...cachedImages]
          .sort(() => Math.random() - 0.5)
          .slice(0, 25);
        setImages(randomSelection);
      }
      
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to fetch images. Using fallback.');
      
      // Fallback to hardcoded images
      setImages(generateFallbackImages(domain));
    } finally {
      setLoading(false);
    }
  }, [domain, searchQuery]);

  // Generate fallback images when API fails
  const generateFallbackImages = (domainSlug: string): PexelsPhoto[] => {
    const fallbackImages: PexelsPhoto[] = [];
    
    // Create 25 fallback images with domain-specific content
    for (let i = 0; i < 25; i++) {
      fallbackImages.push({
        id: i + 1,
        width: 1600,
        height: 1200,
        url: `https://picsum.photos/1600/1200?random=${domainSlug}-${i}-${Date.now()}`,
        photographer: 'Fallback',
        photographer_url: '',
        photographer_id: 0,
        avg_color: '#000000',
        src: {
          original: `https://picsum.photos/1600/1200?random=${domainSlug}-${i}-${Date.now()}`,
          large2x: `https://picsum.photos/1600/1200?random=${domainSlug}-${i}-${Date.now()}`,
          large: `https://picsum.photos/1600/1200?random=${domainSlug}-${i}-${Date.now()}`,
          medium: `https://picsum.photos/800/600?random=${domainSlug}-${i}-${Date.now()}`,
          small: `https://picsum.photos/400/300?random=${domainSlug}-${i}-${Date.now()}`,
          portrait: `https://picsum.photos/400/600?random=${domainSlug}-${i}-${Date.now()}`,
          landscape: `https://picsum.photos/800/400?random=${domainSlug}-${i}-${Date.now()}`,
          tiny: `https://picsum.photos/200/150?random=${domainSlug}-${i}-${Date.now()}`
        },
        liked: false,
        alt: `Domain-specific ${domainSlug.replace('-', ' ')} image ${i + 1}`
      });
    }
    
    return fallbackImages;
  };

  // Load images when domain changes
  useEffect(() => {
    fetchImages(1);
  }, [domain, fetchImages]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchImages(currentPage + 1);
      setCurrentPage(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchImages, currentPage]);

  // Handle image selection
  const handleImageClick = (image: PexelsPhoto) => {
    if (onImageSelect) {
      onImageSelect(image.src.large, image.alt);
    }
    if (onImageUrlSet) {
      onImageUrlSet(image.src.large);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchImages(currentPage + 1);
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/90 backdrop-blur-sm p-4 transition-colors">
      <div className="relative w-full max-w-6xl max-h-[90vh] rounded-3xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white tracking-tighter">
              {domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Images
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {images.length} images • Click to select
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-black dark:bg-gray-800 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close gallery"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-500/30 rounded-lg text-yellow-700 dark:text-yellow-200 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
              <span className="ml-3 text-black dark:text-white">Loading images...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105"
                >
                  <img
                    src={image.src.medium}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/40 group-hover:bg-black/5 dark:group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <p className="text-black dark:text-white text-sm text-center px-2">{image.alt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Attribution */}
          <div className="mt-6 text-center text-gray-600 dark:text-gray-500 text-sm">
            Images via Pexels • Free to use under Pexels License
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainImageGallery;