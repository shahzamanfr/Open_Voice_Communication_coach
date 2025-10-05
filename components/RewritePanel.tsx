import React from 'react';
import { ExampleRewrite } from '../types';
import MagicIcon from './icons/MagicIcon';

interface RewritePanelProps {
  rewrite?: ExampleRewrite;
}

const RewritePanel: React.FC<RewritePanelProps> = ({ rewrite }) => {
  if (!rewrite) {
    return null;
  }

  return (
    <div className="border-t border-gray-800 pt-8">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-white tracking-tighter">Impact Rewrite</h3>
         <p className="text-gray-500 mt-1">A suggestion to make your language more powerful.</p>
      </div>
      <div className="space-y-6">
        <div>
            <p className="text-sm font-medium text-gray-400">Your Original Sentence:</p>
            <blockquote className="mt-2 p-4 bg-gray-900 border-l-2 border-gray-700 text-gray-400 italic">"{rewrite.original}"</blockquote>
        </div>
         <div>
            <p className="text-sm font-medium text-gray-400">Impactful Rewrite:</p>
            <blockquote className="mt-2 p-4 bg-gray-900 border-l-2 border-gray-300 text-white font-medium">"{rewrite.improved}"</blockquote>
        </div>
         <div>
            <p className="text-sm font-medium text-gray-400">The 'Why':</p>
            <p className="mt-2 text-gray-300">{rewrite.reasoning}</p>
        </div>
      </div>
    </div>
  );
};

export default RewritePanel;