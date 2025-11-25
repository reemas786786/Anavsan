
import React, { useMemo } from 'react';
import { PullRequest, PullRequestStatus } from '../types';
import { IconPullRequest, IconCheckCircle, IconSearch } from '../constants';

interface PullRequestsViewProps {
    pullRequests: PullRequest[];
    onSelectPullRequest: (pr: PullRequest) => void;
}

const StatusBadge: React.FC<{ status: PullRequestStatus }> = ({ status }) => {
    const colorClasses: Record<PullRequestStatus, string> = {
        Open: 'bg-status-success-light text-status-success-dark',
        Merged: 'bg-primary/10 text-primary',
        Closed: 'bg-status-error-light text-status-error-dark',
        Draft: 'bg-gray-200 text-gray-800',
    };

     const Icon: React.FC = () => {
        switch(status) {
            case 'Open': return <IconCheckCircle className="h-4 w-4" />;
            case 'Merged': return <IconPullRequest className="h-4 w-4" />;
            default: return <IconPullRequest className="h-4 w-4" />;
        }
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <Icon />
            {status}
        </span>
    );
}

const PullRequestsView: React.FC<PullRequestsViewProps> = ({ pullRequests, onSelectPullRequest }) => {
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const summaryStats = useMemo(() => ({
        total: pullRequests.length,
        open: pullRequests.filter(pr => pr.status === 'Open').length,
        merged: pullRequests.filter(pr => pr.status === 'Merged').length,
        closed: pullRequests.filter(pr => pr.status === 'Closed').length,
    }), [pullRequests]);

    return (
        <div className="p-4 space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Pull Requests</h1>
                <p className="mt-1 text-text-secondary">Review and manage proposed query changes before merging them.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Total: <span className="font-bold text-text-strong">{summaryStats.total}</span>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Open: <span className="font-bold text-status-success-dark">{summaryStats.open}</span>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Merged: <span className="font-bold text-primary">{summaryStats.merged}</span>
                </div>
                 <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Closed: <span className="font-bold text-status-error-dark">{summaryStats.closed}</span>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-border-color">
                <div className="p-4 flex justify-between items-center">
                    <div>{/* Left align placeholder */}</div>
                    <div className="relative">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="search" 
                            placeholder="Search pull requests..." 
                            className="w-full md:w-80 pl-11 pr-4 py-2.5 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Title</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Status</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Author</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Created</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {pullRequests.map(pr => (
                                <tr key={pr.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" onClick={() => onSelectPullRequest(pr)}>
                                    <td className="px-6 py-3 font-medium text-text-primary whitespace-nowrap">
                                        #{pr.id} {pr.title}
                                    </td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={pr.status} />
                                    </td>
                                    <td className="px-6 py-3">{pr.author}</td>
                                    <td className="px-6 py-3">{formatDate(pr.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PullRequestsView;
