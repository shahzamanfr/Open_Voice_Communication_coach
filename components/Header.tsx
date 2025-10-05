import React from 'react';
import StarIcon from './icons/StarIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full px-4 lg:px-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between py-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <StarIcon className="w-6 h-6 text-white" />
          <h1 className="text-xl font-medium text-white tracking-tight">
            Communication Coach
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#image-describe"
            className="rounded-full border border-gray-700 bg-gray-900/60 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-800 transition-colors duration-200"
          >
            Try Image Describe
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;