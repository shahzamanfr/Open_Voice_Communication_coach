import React, { useState } from 'react';
import { Feedback, LoadingState } from '../types';
import PlayIcon from './icons/PlayIcon';
import ShareIcon from './icons/ShareIcon';
import TrophyIcon from './icons/TrophyIcon';
import MoreIcon from './icons/MoreIcon';

interface FeedbackPanelProps {
  feedback: Feedback | null;
  loadingState: LoadingState;
  imageUrl: string;
}

const FeedbackItem: React.FC<{ title: string; content: string; }> = ({ title, content }) => (
  <div className="grid grid-cols-3 gap-4 border-t border-gray-800 py-6">
    <h4 className="col-span-1 text-sm text-gray-400 font-medium">{title}</h4>
    <p className="col-span-2 text-gray-300 whitespace-pre-wrap">{content}</p>
  </div>
);

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, loadingState, imageUrl }) => {
  const [showActions, setShowActions] = useState(false);

  const playSpokenResponse = () => {
    if (feedback?.spokenResponse) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(feedback.spokenResponse);
      speechSynthesis.speak(utterance);
    }
    setShowActions(false);
  };
  
  const shareFeedback = () => {
    if (feedback) {
      const summary = `I just got coached on my communication skills! Score: ${feedback.score}/100. My personalized tip: "${feedback.personalizedTip}"`;
      navigator.clipboard.writeText(summary)
        .then(() => alert('Feedback summary copied to clipboard!'))
        .catch(err => console.error('Failed to copy text: ', err));
    }
    setShowActions(false);
  };

  const challengeFriend = () => {
    if (feedback && imageUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('image', encodeURIComponent(imageUrl));
      url.searchParams.set('score', feedback.score.toString());
      const challengeUrl = url.toString();
      
      navigator.clipboard.writeText(`I scored ${feedback.score} describing this image. Think you can beat me? \n\n${challengeUrl}`)
        .then(() => alert('Challenge link copied to clipboard! Send it to a friend.'))
        .catch(err => console.error('Failed to copy text: ', err));
    }
    setShowActions(false);
  };

  const renderContent = () => {
    if (loadingState === LoadingState.GeneratingCaption || loadingState === LoadingState.GeneratingFeedback) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
          <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-500 font-medium">Your coach is thinking...</p>
        </div>
      );
    }

    if (!feedback) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center min-h-[300px] border-2 border-dashed border-gray-800 rounded-lg">
          <p className="text-gray-600 font-medium max-w-xs">Your feedback will appear here once you submit an explanation.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-gray-800 pb-6">
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tighter">Your Feedback</h3>
            <p className="text-gray-500 mt-1">An analysis of your explanation.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-5xl font-bold text-white tracking-tighter">{feedback.score}<span className="text-3xl text-gray-600">/100</span></div>
             <div className="relative">
              <button onClick={() => setShowActions(!showActions)} className="p-2 border border-gray-700 rounded-full hover:bg-gray-800" aria-label="More actions">
                <MoreIcon className="w-5 h-5 text-gray-400" />
              </button>
              {showActions && (
                 <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
                   <button onClick={playSpokenResponse} className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                     <PlayIcon className="w-4 h-4 mr-2" /> Play Audio
                   </button>
                   <button onClick={shareFeedback} className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                     <ShareIcon className="w-4 h-4 mr-2" /> Share
                   </button>
                   <button onClick={challengeFriend} className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                     <TrophyIcon className="w-4 h-4 mr-2" /> Challenge
                   </button>
                 </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <FeedbackItem title="What You Did Well" content={feedback.whatYouDidWell} />
          <FeedbackItem title="Areas for Improvement" content={feedback.areasForImprovement} />
          <FeedbackItem title="Personalized Tip" content={feedback.personalizedTip} />
        </div>
      </div>
    );
  };
  
  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default FeedbackPanel;