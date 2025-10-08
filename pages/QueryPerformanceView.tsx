import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SimilarQuery } from '../types';
import { similarQueriesData } from '../data/dummyData';
import { IconSearch, IconDotsVertical, IconEdit, IconDelete } from '../constants';

const PatternTag: React.FC<{ pattern?: string }> = ({ pattern }) => {
    if (!pattern) return null;
    
    let colorClasses = "bg-gray-100 text-gray-800";
    if (pattern === 'Join-heavy') colorClasses = "bg-blue-100 text-blue-800";
    if (pattern === 'Aggregation-heavy') colorClasses = "bg-purple-100 text-purple-800";
    if (pattern === 'Scan-heavy') colorClasses = "bg-yellow-100 text-yellow-800";
    
    return (
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colorClasses}`}>
            {pattern}
        </span>
    );
};

const SortIndicator: React.FC<{ direction: 'ascending' | 'descending' | null }> = ({ direction }) => {
    if (!direction) return <span className="w-4 h-4 inline-block"></span>;
    const path = direction === 'ascending' 
        ? "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" 
        : "M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L9 13.586V3a1 1 0 112 0v10.586l1.293-1.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z";
    return (
        <svg className="w-4 h-4 inline-block ml-1 text-text-secondary group-hover:text-text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d={path}></path>
        </svg>
    );
};

export const SimilarQueryPatternsView: React.FC = () => {
    const [viewingDetailsOf, setViewingDetailsOf] = useState<string | null>(null);

    const groupedData = useMemo(() => {
        const groups: { [key: string]: { queries: SimilarQuery[]; totalCredits: number; totalCost: number } } = {};
        similarQueriesData.forEach(q => {
            if (q.pattern) {
                if (!groups[q.pattern]) {
                    groups[q.pattern] = { queries: [], totalCredits: 0, totalCost: 0 };
                }
                groups[q.pattern].queries.push(q);
                groups[q.pattern].totalCredits += q.credits;
                groups[q.pattern].totalCost += q.cost;
            }
        });
        return Object.entries(groups).map(([pattern, data]) => ({
            pattern,
            count: data.queries.length,
            totalCredits: data.totalCredits,
            totalCost: data.totalCost,
        })).sort((a, b) => b.totalCredits - a.totalCredits);
    }, []);

    if (viewingDetailsOf) {
        const queriesForPattern = similarQueriesData.filter(q => q.pattern === viewingDetailsOf);
        return (
            <div className="space-y-4">
                <div className="bg-surface p-4 rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-semibold text-text-strong">Queries for pattern:</h2>
                            <PatternTag pattern={viewingDetailsOf} />
                        </div>
                        <button onClick={() => setViewingDetailsOf(null)} className="text-sm font-semibold text-link hover:underline">
                            &larr; Back to Patterns
                        </button>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="bg-table-header-bg text-xs text-text-secondary uppercase font-medium">
                               <tr>
                                    <th scope="col" className="px-6 py-3">Query</th>
                                    <th scope="col" className="px-6 py-3">Similarity</th>
                                    <th scope="col" className="px-6 py-3">Execution Time (ms)</th>
                                    <th scope="col" className="px-6 py-3">Warehouse</th>
                                    <th scope="col" className="px-6 py-3">Cost ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queriesForPattern.map(query => (
                                    <tr key={query.id} className="border-t border-border-color hover:bg-surface-hover">
                                        <td className="px-6 py-4 font-mono text-xs text-text-primary whitespace-nowrap max-w-sm truncate">{query.name}</td>
                                        <td className="px-6 py-4 font-medium text-text-primary">{query.similarity}%</td>
                                        <td className="px-6 py-4">{query.executionTime.toLocaleString()}</td>
                                        <td className="px-6 py-4">{query.warehouse}</td>
                                        <td className="px-6 py-4">${query.cost.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-surface p-4 rounded-3xl">
                <h2 className="text-base font-semibold text-text-strong mb-4">Similar query patterns</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-secondary uppercase font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">Pattern</th>
                                <th scope="col" className="px-6 py-3">Query Count</th>
                                <th scope="col" className="px-6 py-3">Total Credits</th>
                                <th scope="col" className="px-6 py-3">Total Cost ($)</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedData.map(group => (
                                <tr key={group.pattern} className="border-t border-border-color hover:bg-surface-hover">
                                    <td className="px-6 py-4"><PatternTag pattern={group.pattern} /></td>
                                    <td className="px-6 py-4 font-medium text-text-primary">{group.count}</td>
                                    <td className="px-6 py-4">{group.totalCredits.toFixed(2)}</td>
                                    <td className="px-6 py-4">${group.totalCost.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setViewingDetailsOf(group.pattern)}
                                            className="text-sm font-semibold text-link hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const QueryPerformanceView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof SimilarQuery; direction: 'ascending' | 'descending' } | null>({ key: 'similarity', direction: 'descending' });
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortedAndFilteredData = useMemo(() => {
        let sortedData = [...similarQueriesData];
        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        if (searchTerm) {
            return sortedData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return sortedData;
    }, [sortConfig, searchTerm]);

    const requestSort = (key: keyof SimilarQuery) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof SimilarQuery) => {
        if (!sortConfig || sortConfig.key !== key) return <SortIndicator direction={null} />;
        return <SortIndicator direction={sortConfig.direction} />;
    };

    return (
        <div className="space-y-4">
            <div className="bg-surface p-4 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-text-strong">Similar queries</h2>
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter queries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-secondary uppercase font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('name')} className="group flex items-center">Query {getSortIndicator('name')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('similarity')} className="group flex items-center">Similarity {getSortIndicator('similarity')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('executionTime')} className="group flex items-center">Execution Time (ms) {getSortIndicator('executionTime')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('warehouse')} className="group flex items-center">Warehouse {getSortIndicator('warehouse')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('cost')} className="group flex items-center">Cost ($) {getSortIndicator('cost')}</button></th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredData.map(query => (
                                <tr key={query.id} className="border-t border-border-color hover:bg-surface-hover cursor-pointer" onClick={() => alert(`Navigating to details for query ${query.id}`)}>
                                    <td className="px-6 py-4 font-mono text-xs text-text-primary whitespace-nowrap max-w-sm truncate">
                                        {query.name}
                                        <div className="mt-1"><PatternTag pattern={query.pattern} /></div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-text-primary">{query.similarity}%</td>
                                    <td className="px-6 py-4">{query.executionTime.toLocaleString()}</td>
                                    <td className="px-6 py-4">{query.warehouse}</td>
                                    <td className="px-6 py-4">${query.cost.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === query.id ? menuRef : null}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === query.id ? null : query.id); }}
                                                title="Actions"
                                                className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === query.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu">
                                                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Edit'); }} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconEdit className="h-4 w-4" /> Edit
                                                        </a>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Delete'); }} className="flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                                            <IconDelete className="h-4 w-4" /> Delete
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QueryPerformanceView;