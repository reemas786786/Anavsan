
import React from 'react';
import { Query, QueryStatus } from '../types';

interface RecentQueriesProps {
  queries: Query[];
}

const StatusBadge: React.FC<{ status: QueryStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center';
  const colorClasses = {
    Success: 'bg-green-500/20 text-green-300',
    Failed: 'bg-red-500/20 text-red-300',
    Running: 'bg-blue-500/20 text-blue-300',
  };
  return <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>;
};


const RecentQueries: React.FC<RecentQueriesProps> = ({ queries }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700/50 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {queries.map((query) => (
          <div key={query.id} className="flex items-center justify-between text-sm">
            <div className="flex-1 truncate pr-4">
                <p className="text-white truncate font-mono text-xs">{query.sql}</p>
                <p className="text-slate-400 text-xs">{query.user} - {query.timestamp}</p>
            </div>
            <div className="flex items-center space-x-4 w-1/3 justify-end">
                <span className="text-slate-400">{query.duration}</span>
                <span className="text-slate-400 w-12 text-right">{query.cost}</span>
                <div className="w-20 text-center">
                    <StatusBadge status={query.status} />
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentQueries;
