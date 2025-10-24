import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface ImagePanelProps {
  imageUrl: string;
  onNewImage: () => void;
  isLoading: boolean;
  domainTitle?: string;
  domainEmoji?: string;
  domainDescription?: string;
}

const ImagePanel = React.forwardRef<HTMLImageElement, ImagePanelProps>(
  ({ imageUrl, onNewImage, isLoading, domainTitle, domainEmoji, domainDescription }, ref) => {
    const showDomainDetails = Boolean(domainTitle);

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold text-black dark:text-white tracking-tighter">Image to Describe</h2>
              {showDomainDetails && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/70 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-base" aria-hidden>{domainEmoji}</span>
                  <span className="text-black dark:text-gray-100">{domainTitle}</span>
                </span>
              )}
            </div>
            {domainDescription && (
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-500">
                {domainDescription}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onNewImage}
            disabled={isLoading}
            className="self-start rounded-full border border-gray-300 dark:border-gray-700 p-2 text-black dark:text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Get new image"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
          {imageUrl ? (
            <img
              ref={ref}
              src={imageUrl}
              alt="Describe this"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imageUrl);
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-500">Loading image...</div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950/10 dark:from-gray-950/40 via-transparent to-transparent" aria-hidden />
        </div>
      </div>
    );
  }
);

ImagePanel.displayName = 'ImagePanel';

export default ImagePanel;
