import React, { useState, useMemo } from 'react';
import { AssignedQuery } from '../types';
import { IconClipboardCopy, IconCheck } from '../constants';

const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-text-secondary uppercase tracking-wider">{label}</p>
        <div className="text-lg font-semibold text-text-primary mt-1">{value}</div>
    </div>
);

const AssignedQueryModalContent: React.FC<{
    assignedQuery: AssignedQuery;
    onGoToQueryDetails: () => void;
}> = ({ assignedQuery, onGoToQueryDetails }) => {
    const [isCopied, setIsCopied] = useState(false);

    const highlightedCode = useMemo(() => {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AS', 'ON', 'WITH', 'INSERT', 'INTO', 'VALUES', 'DATE', 'SUM', 'COUNT', 'DISTINCT', 'NOT', 'IN'];
        const functions = ['DATE_TRUNC', 'MIN', 'MAX', 'AVG'];

        let html = assignedQuery.queryText;
        html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi'), '<span class="text-primary font-bold">$1</span>');
        html = html.replace(new RegExp(`\\b(${functions.join('|')})\\b`, 'gi'), '<span class="text-teal-500">$1</span>');
        html = html.replace(/('[\s\S]*?')/g, '<span class="text-green-600">$1</span>');
        html = html.replace(/(--.*)/g, '<span class="text-text-muted italic">$1</span>');
        return html;
    }, [assignedQuery.queryText]);

    const handleCopy = () => {
        navigator.clipboard.writeText(assignedQuery.queryText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const formattedTimestamp = new Date(assignedQuery.assignedOn).toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-grow overflow-y-auto">
                {/* Title Block */}
                <div className="pb-4 border-b border-border-color">
                    <h3 className="text-lg font-bold text-text-strong">Assigned Query for Review</h3>
                    <p className="text-sm text-text-secondary mt-1">Assigned by {assignedQuery.assignedBy}</p>
                </div>

                {/* KPM Card */}
                <div>
                    <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Key Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4 bg-surface-nested p-4 rounded-xl">
                        <DetailItem label="Cost" value={`${assignedQuery.credits.toFixed(3)} credits`} />
                        <DetailItem label="Duration" value="00:02:30" />
                        <DetailItem label="Rows Returned" value="15.2M" />
                    </div>
                </div>

                {/* Contextual Details */}
                <div className="space-y-4 text-sm">
                    <div>
                        <label className="font-semibold text-text-secondary">Assigned on</label>
                        <p className="text-text-primary mt-1">{formattedTimestamp}</p>
                    </div>
                    <div>
                        <label className="font-semibold text-text-secondary">Warehouse</label>
                        <button onClick={onGoToQueryDetails} className="block text-link hover:underline mt-1">{assignedQuery.warehouse}</button>
                    </div>
                    <div>
                        <label className="font-semibold text-text-secondary">Query ID</label>
                        <button onClick={onGoToQueryDetails} className="block text-link hover:underline mt-1 font-mono">{assignedQuery.queryId.substring(7, 13).toUpperCase()}</button>
                    </div>
                </div>
                
                {/* Admin's Note */}
                {assignedQuery.message && (
                    <div>
                        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Admin's Note</h4>
                        <blockquote className="text-sm text-text-primary bg-surface-nested p-3 rounded-lg border-l-4 border-primary italic">
                            {assignedQuery.message}
                        </blockquote>
                    </div>
                )}

                {/* SQL Query Block */}
                <div>
                    <label className="block text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">SQL Query</label>
                    <div className="bg-surface-nested rounded-lg border border-border-color">
                        <div className="flex justify-between items-center px-4 py-1 bg-surface rounded-t-lg border-b border-border-color">
                            <span className="text-xs font-semibold text-text-muted">sql</span>
                            <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary">
                                {isCopied ? <IconCheck className="w-4 h-4 text-status-success"/> : <IconClipboardCopy className="w-4 h-4" />}
                                {isCopied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <pre className="text-xs overflow-auto max-h-48 whitespace-pre-wrap p-4">
                            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                        </pre>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-background mt-auto flex justify-end items-center flex-shrink-0 border-t border-border-color">
                <button onClick={onGoToQueryDetails} className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary-hover transition-colors shadow-sm">
                    Go to Query Details
                </button>
            </div>
        </div>
    );
};

export default AssignedQueryModalContent;
