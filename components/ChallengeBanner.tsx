import React from 'react';
import TrophyIcon from './icons/TrophyIcon';

interface ChallengeBannerProps {
  scoreToBeat: number;
}

const ChallengeBanner: React.FC<ChallengeBannerProps> = ({ scoreToBeat }) => {
  return (
    <div className="border border-gray-800 bg-gray-900/50 p-4 rounded-lg mb-4 flex items-center">
      <TrophyIcon className="w-6 h-6 mr-4 text-amber-400 flex-shrink-0" />
      <div>
        <p className="font-bold text-white">Challenge Accepted!</p>
        <p className="text-gray-400 text-sm">Your friend scored {scoreToBeat}. Can you beat them? Give it your best shot!</p>
      </div>
    </div>
  );
};

export default ChallengeBanner;