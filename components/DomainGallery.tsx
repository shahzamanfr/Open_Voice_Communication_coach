import React from 'react';
import { ImageDomain } from '../types';
import './DomainGallery.css';

interface DomainGalleryProps {
  domains: ImageDomain[];
  selectedDomain: string;
  activeImageUrl: string;
  onSelectDomain: (slug: string) => void;
  onSelectImage: (slug: string, imageId: string) => void;
  showImageOptions?: boolean;
}

const DomainGallery: React.FC<DomainGalleryProps> = ({
  domains,
  selectedDomain,
  activeImageUrl,
  onSelectDomain,
  onSelectImage,
  showImageOptions = true,
}) => {
  const activeDomain = domains.find((domain) => domain.slug === selectedDomain) ?? domains[0];

  return (
    <section className="space-y-10" aria-labelledby="domain-gallery-heading">
      <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-950 via-black to-gray-950 p-8 shadow-[0_32px_80px_-40px_rgba(15,23,42,0.9)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-600">Domains</p>
            <h2 id="domain-gallery-heading" className="mt-2 text-4xl font-semibold tracking-tight text-white">
              Choose your storytelling mood
            </h2>
            <p className="mt-3 max-w-2xl text-base text-gray-400">
              Select a domain to explore curated visuals that match the communication scenario you want to practice. Each
              category includes atmospheric imagery to inspire your next explanation.
            </p>
          </div>
          <div className="inline-flex items-center gap-4 rounded-full border border-gray-800 bg-gray-900/60 px-6 py-3 text-gray-300">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">Active Focus</span>
            <span className="flex items-center gap-2 text-lg font-semibold text-white">
              <span aria-hidden>{activeDomain?.emoji ?? '🖼️'}</span>
              {activeDomain ? activeDomain.title : 'Custom Image'}
            </span>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {domains.map((domain) => {
            const isSelected = domain.slug === selectedDomain;
            return (
              <button
                key={domain.slug}
                type="button"
                className={`domain-card ${domain.accentClass} ${isSelected ? 'is-active' : ''} flex h-full flex-col gap-3 text-left text-gray-300 transition-transform duration-500`}
                onClick={() => onSelectDomain(domain.slug)}
                aria-pressed={isSelected}
              >
                <span className="domain-card-glow" aria-hidden />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">{domain.emoji} Domain</span>
                <span className="text-2xl font-semibold text-white">{domain.title}</span>
                <p className="text-sm leading-relaxed text-gray-400">{domain.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {showImageOptions && activeDomain && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-label={`${activeDomain.title} image options`}>
          {activeDomain.images.map((image) => {
            const isActive = image.src === activeImageUrl;
            return (
              <button
                key={image.id}
                type="button"
                className={`domain-image-card ${activeDomain.imageAccentClass} ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectImage(activeDomain.slug, image.id)}
                aria-pressed={isActive}
                aria-label={`Use ${image.alt}`}
              >
                <div className="domain-image-media">
                  <img src={image.src} alt={image.alt} className="domain-image" />
                  <span className="domain-image-overlay" aria-hidden />
                </div>
                <div className="domain-image-caption">
                  <span aria-hidden>{activeDomain.emoji}</span>
                  <p className="text-sm font-medium text-gray-200">{image.alt}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DomainGallery;
