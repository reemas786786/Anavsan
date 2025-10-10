import React, { useState } from 'react';
import { QueryListItem } from '../types';
import { IconBeaker, IconWand, IconSearch } from '../constants';

interface QueryPreviewContentProps {
  query: QueryListItem;
  onAnalyze: (query: QueryListItem) => void;
  onOptimize: (query: QueryListItem) => void;
  onSimulate: (query: QueryListItem) => void;
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const QueryPreviewContent: React.FC<QueryPreviewContentProps> = ({ query, onAnalyze, onOptimize, onSimulate }) => {
    const [activeTab, setActiveTab] = useState('Overview');

    if (!query) return null;

    const details = [
        { label: 'Duration', value: query.duration },
        { label: 'Warehouse', value: query.warehouse },
        { label: 'Bytes Scanned', value: formatBytes(query.bytesScanned) },
        { label: 'Bytes Written', value: formatBytes(query.bytesWritten) },
        { label: 'Start Time', value: new Date(query.timestamp).toLocaleString() },
        { label: 'Severity', value: query.severity },
    ];
    
    return (
        <div className="flex flex-col h-full">
            <div className="px-6 border-b border-border-color">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('Overview')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Overview' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
                        aria-current={activeTab === 'Overview' ? 'page' : undefined}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('Full Query')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'Full Query' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'}`}
                        aria-current={activeTab === 'Full Query' ? 'page' : undefined}
                    >
                        Full Query
                    </button>
                </nav>
            </div>

            <div className="p-6 overflow-y-auto">
                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        {details.map(detail => (
                            <React.Fragment key={detail.label}>
                                <dt className="text-text-secondary">{detail.label}</dt>
                                <dd className="text-text-primary font-medium">{detail.value}</dd>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                {activeTab === 'Full Query' && (
                    <pre className="bg-input-bg p-4 rounded-lg border border-border-color text-xs text-text-primary overflow-auto max-h-[50vh]">
                        <code>{query.queryText}</code>
                    </pre>
                )}
            </div>

            <div className="p-6 bg-background mt-auto flex justify-end items-center gap-3 flex-shrink-0">
                <button onClick={() => onAnalyze(query)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50" title="Open this query in Analyzer to inspect performance details."><IconSearch className="h-4 w-4" /> Analyze</button>
                <button onClick={() => onOptimize(query)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50" title="Open in Optimizer to get AI-powered optimization suggestions."><IconWand className="h-4 w-4" /> Optimize</button>
                <button onClick={() => onSimulate(query)} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50" title="Open in Simulator to test cost and performance scenarios."><IconBeaker className="h-4 w-4" /> Simulate</button>
            </div>
        </div>
    );
};

export default QueryPreviewContent;