import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AssignedQuery, AssignmentStatus, AssignmentPriority } from '../types';
import { IconDotsVertical, IconArrowUp, IconArrowDown } from '../constants';

const PriorityBadge: React.FC<{ priority: AssignmentPriority }> = ({ priority }) => {
    const colorClasses = {
        Low: 'bg-status-info-light text-status-info-dark',
        Medium: 'bg-status-warning-light text-status-warning-dark',
        High: 'bg-status-error-light text-status-error-dark',
    };
    return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[priority]}`}>{priority}</span>;
};

const StatusBadge: React.FC<{ status: AssignmentStatus }> = ({ status }) => {
    const colorClasses: Record<AssignmentStatus, string> = {
        'Pending': 'bg-gray-200 text-gray-800',
        'In Progress': 'bg-status-paused-light text-status-paused-dark',
        'Optimized': 'bg-status-success-light text-status-success-dark',
        'Needs Info': 'bg-yellow-100 text-yellow-800',
    };
     return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

interface AssignedQueriesProps {
    assignedQueries: AssignedQuery[];
    onUpdateStatus: (id: string, status: AssignmentStatus) => void;
}

const AssignedQueries: React.FC<AssignedQueriesProps> = ({ assignedQueries, onUpdateStatus }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AssignedQuery; direction: 'ascending' | 'descending' } | null>({ key: 'priority', direction: 'descending' });

    const sortedQueries = useMemo(() => {
        let sortableItems = [...assignedQueries];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (sortConfig.key === 'priority') {
                    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    const valA = priorityOrder[a.priority];
                    const valB = priorityOrder[b.priority];
                    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                }
                
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [assignedQueries, sortConfig]);

    const requestSort = (key: keyof AssignedQuery) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

     const SortIcon: React.FC<{ columnKey: keyof AssignedQuery }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Assigned Queries for Optimization</h1>
                <p className="mt-1 text-text-secondary">Track queries that have been assigned to you or by you for optimization.</p>
            </div>

            <div className="bg-surface p-4 rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-primary font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('queryText')} className="group flex items-center">Query<SortIcon columnKey="queryText" /></button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('assignedBy')} className="group flex items-center">Assigned By<SortIcon columnKey="assignedBy" /></button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('priority')} className="group flex items-center">Priority<SortIcon columnKey="priority" /></button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('cost')} className="group flex items-center">Cost / Credits<SortIcon columnKey="cost" /></button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('status')} className="group flex items-center">Status<SortIcon columnKey="status" /></button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedQueries.map(query => (
                                <tr key={query.id} className="border-t border-border-color hover:bg-surface-hover">
                                    <td className="px-6 py-4 font-mono text-xs text-text-primary whitespace-nowrap max-w-sm">
                                        <p className="truncate" title={query.queryText}>{query.queryText}</p>
                                        {query.message && <p className="text-text-secondary italic text-xs mt-1 truncate" title={query.message}>"{query.message}"</p>}
                                    </td>
                                    <td className="px-6 py-4">{query.assignedBy}</td>
                                    <td className="px-6 py-4"><PriorityBadge priority={query.priority} /></td>
                                    <td className="px-6 py-4">${query.cost.toFixed(2)} / {query.credits.toFixed(2)} cr</td>
                                    <td className="px-6 py-4"><StatusBadge status={query.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === query.id ? menuRef : null}>
                                            <button onClick={() => setOpenMenuId(openMenuId === query.id ? null : query.id)} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === query.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface border border-border-color z-10">
                                                    <div className="py-1" role="menu">
                                                        <button onClick={() => { onUpdateStatus(query.id, 'Optimized'); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Mark as Optimized</button>
                                                        <button onClick={() => { onUpdateStatus(query.id, 'Needs Info'); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Needs More Info</button>
                                                        <button className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Open in Analyzer</button>
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

export default AssignedQueries;