import React from 'react';
import LightbulbIcon from './icons/LightbulbIcon';

interface StrategyTipProps {
  strategy: string;
  onDismiss: () => void;
}

const StrategyTip: React.FC<StrategyTipProps> = ({ strategy, onDismiss }) => {
  return (
    <div className="border border-gray-800 bg-gray-900/50 p-4 rounded-lg my-4 flex items-start animate-fade-in">
      <LightbulbIcon className="w-6 h-6 mr-4 text-purple-400 flex-shrink-0 mt-1" />
      <div className="flex-grow">
        <p className="font-bold text-white">Your Strategy</p>
        <p className="text-gray-400 italic">"{strategy}"</p>
      </div>
      <button 
        onClick={onDismiss} 
        className="ml-4 p-1 rounded-full text-gray-500 hover:bg-gray-800 hover:text-gray-300"
        aria-label="Dismiss strategy"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Add fade-in animation to tailwind config if possible, or use a style tag.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;
document.head.appendChild(style);


export default StrategyTip;