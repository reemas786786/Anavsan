
import React from 'react';
import { Recommendation } from '../types';

interface AIActionsProps {
  recommendations: Recommendation[];
}

const ImpactBadge: React.FC<{ impact: 'High' | 'Medium' | 'Low' }> = ({ impact }) => {
    const colorClasses = {
        High: 'bg-red-500/20 text-red-300',
        Medium: 'bg-yellow-500/20 text-yellow-300',
        Low: 'bg-blue-500/20 text-blue-300',
    }
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded ${colorClasses[impact]}`}>{impact} Impact</span>
};

const AIActions: React.FC<AIActionsProps> = ({ recommendations }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700/50 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
      </div>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-slate-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                <ImpactBadge impact={rec.impact} />
            </div>
            <p className="text-sm text-slate-400 mb-3">{rec.description}</p>
            <button className="text-xs font-semibold text-violet-400 hover:text-violet-300">
              View &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIActions;
