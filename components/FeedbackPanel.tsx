import React from 'react';
import { Feedback, LoadingState } from '../types';

interface FeedbackPanelProps {
  feedback: Feedback | null;
  loadingState: LoadingState;
  imageUrl: string;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, loadingState, imageUrl }) => {
  if (loadingState === LoadingState.GeneratingCaption || loadingState === LoadingState.GeneratingFeedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-gray-500 dark:border-t-gray-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-black dark:text-white font-medium text-lg mb-2">
            {loadingState === LoadingState.GeneratingCaption ? 'Analyzing your image...' : 'Your coach is thinking...'}
          </p>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 font-medium max-w-xs">Your feedback will appear here once you submit an explanation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h3 className="text-3xl font-bold text-black dark:text-white tracking-tighter">Your Feedback</h3>
          <p className="text-gray-600 dark:text-gray-500">An analysis of your explanation.</p>
        </div>
        <div className="text-5xl font-bold text-black dark:text-white tracking-tighter">
          {feedback.score || feedback.overall_score}
          <span className="text-3xl text-gray-500 dark:text-gray-600">/100</span>
        </div>
      </div>

      {/* What You Did Well */}
      {feedback.whatYouDidWell && (
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <h4 className="text-sm text-gray-700 dark:text-gray-400 font-medium mb-2">What You Did Well</h4>
          <p className="text-gray-700 dark:text-gray-300">{feedback.whatYouDidWell}</p>
        </div>
      )}

      {/* Areas for Improvement */}
      {feedback.areasForImprovement && (
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <h4 className="text-sm text-gray-700 dark:text-gray-400 font-medium mb-2">Areas for Improvement</h4>
          <p className="text-gray-700 dark:text-gray-300">{feedback.areasForImprovement}</p>
        </div>
      )}

      {/* Personalized Tip */}
      {feedback.personalizedTip && (
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <h4 className="text-sm text-gray-700 dark:text-gray-400 font-medium mb-2">Personalized Tip</h4>
          <p className="text-gray-700 dark:text-gray-300">{feedback.personalizedTip}</p>
        </div>
      )}

    </div>
  );
};

export default FeedbackPanel;