import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScoreHistory } from '../types';

interface ProgressPanelProps {
  history: ScoreHistory[];
}

const ProgressPanel: React.FC<ProgressPanelProps> = ({ history }) => {
  const chartData = history.map((item, index) => ({
    name: `Session ${index + 1}`,
    score: item.score,
    mode: item.mode,
  }));

  const averageScore = history.length > 0 ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1) : 'N/A';
  const lastScore = history.length > 0 ? history[history.length - 1].score : 'N/A';

  return (
    <div className="border-t border-gray-800 pt-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter">Your Progress</h2>
           <p className="text-gray-500 mt-1">Analysis of your last 10 sessions.</p>
        </div>
        <div className="flex space-x-8 text-right">
           <div>
              <div className="text-2xl font-bold text-white">{lastScore}</div>
              <div className="text-sm text-gray-500">Last Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{averageScore}</div>
              <div className="text-sm text-gray-500">Average</div>
            </div>
        </div>
      </div>
      {history.length > 1 ? (
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" tick={{ fill: '#718096', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#718096', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a202c',
                  border: '1px solid #2d3748',
                  borderRadius: '0.5rem',
                  color: '#cbd5e0'
                }}
              />
              <Line type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff', r: 3 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-10 border-2 border-dashed border-gray-800 rounded-lg">
          <p>Complete a few more sessions to see your progress chart!</p>
        </div>
      )}
    </div>
  );
};

export default ProgressPanel;