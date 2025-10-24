import React, { useState } from 'react';
import { ImageDomain } from '../types';
import DomainImageGallery from './DomainImageGallery';

interface HomeDomainsProps {
  domains: ImageDomain[];
  selectedDomainSlug?: string;
  onSelectDomain: (slug: string) => void;
  onSelectImage: (slug: string, imageId: string) => void;
  onImageUrlSet?: (imageUrl: string) => void;
}

const HomeDomains: React.FC<HomeDomainsProps> = ({ domains, selectedDomainSlug, onSelectDomain, onSelectImage, onImageUrlSet }) => {
  const [galleryDomain, setGalleryDomain] = useState<ImageDomain | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleDomainClick = (domain: ImageDomain) => {
    setGalleryDomain(domain);
    setSelectedImageId(null);
  };

  const handleImageSelect = (imageId: string) => {
    if (galleryDomain) {
      setSelectedImageId(imageId);
      onSelectImage(galleryDomain.slug, imageId);
      setGalleryDomain(null);
    }
  };

  const handleCloseGallery = () => {
    setGalleryDomain(null);
    setSelectedImageId(null);
  };

  return (
    <>

      {/* Image Domains Section */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Or Choose an Image Domain
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select from curated image collections to practice describing and analyzing visual content
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {domains.map((domain) => {
          const isSelected = domain.slug === selectedDomainSlug;
          return (
            <button
              key={domain.slug}
              type="button"
              onClick={() => handleDomainClick(domain)}
              className={`group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-5 text-left shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none ${isSelected ? 'ring-2 ring-black/20 dark:ring-white/30' : ''}`}
            >
            <div className="flex items-start gap-3">
              <span className="text-xl" aria-hidden>{domain.emoji}</span>
              <div className="flex-1">
                <h3 className="text-black dark:text-white font-semibold tracking-tight">{domain.title}</h3>
                <p className="mt-1 text-xs text-gray-700 dark:text-white/80 leading-relaxed line-clamp-2">{domain.description}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {domain.images.slice(0, 3).map((img) => (
                <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800/70">
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/30 via-transparent to-transparent" aria-hidden />
                </div>
              ))}
            </div>
          </button>
        );
      })}
      </div>

            {/* Domain Image Gallery Modal */}
            {galleryDomain && (
              <DomainImageGallery
                domain={galleryDomain.slug}
                onImageSelect={(imageUrl, imageAlt) => {
                  // Create a unique ID for the selected image
                  const imageId = `selected-${Date.now()}`;
                  // Call the parent's onSelectImage with the slug and imageId
                  onSelectImage(galleryDomain.slug, imageId);
                  console.log('Selected image:', { imageUrl, imageAlt, imageId });
                  // Close the gallery
                  setGalleryDomain(null);
                }}
                onImageUrlSet={onImageUrlSet}
                onClose={handleCloseGallery}
              />
            )}
    </>
  );
};

export default HomeDomains;


