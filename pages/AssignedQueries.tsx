import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AssignedQuery, AssignmentStatus, AssignmentPriority, User } from '../types';
import { IconDotsVertical, IconArrowUp, IconArrowDown, IconSearch } from '../constants';
import Pagination from '../components/Pagination';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

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
    currentUser: User | null;
    onPreviewQuery: (query: AssignedQuery) => void;
}

const AssignedQueries: React.FC<AssignedQueriesProps> = ({ assignedQueries, onUpdateStatus, currentUser, onPreviewQuery }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AssignedQuery; direction: 'ascending' | 'descending' } | null>({ key: 'priority', direction: 'descending' });
    
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const filterOptions = useMemo(() => ({
        priorities: ['Low', 'Medium', 'High'] as AssignmentPriority[],
        statuses: ['Pending', 'In Progress', 'Optimized', 'Needs Info'] as AssignmentStatus[],
        assignees: [...new Set(assignedQueries.map(q => q.assignedTo))],
    }), [assignedQueries]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [search, dateFilter, priorityFilter, statusFilter, assigneeFilter, itemsPerPage]);

    const filteredAndSortedQueries = useMemo(() => {
        let filtered = assignedQueries.filter(q => {
            if (search && !(
                q.queryId.toLowerCase().includes(search.toLowerCase()) ||
                q.message.toLowerCase().includes(search.toLowerCase())
            )) return false;

            if (priorityFilter.length > 0 && !priorityFilter.includes(q.priority)) return false;
            if (statusFilter.length > 0 && !statusFilter.includes(q.status)) return false;
            if (assigneeFilter.length > 0 && !assigneeFilter.includes(q.assignedTo)) return false;

            if (typeof dateFilter === 'string') {
                if (dateFilter !== 'All') {
                    const queryDate = new Date(q.assignedOn);
                    const now = new Date();
                    let days = 0;
                    if (dateFilter === '7d') days = 7;
                    if (dateFilter === '1d') days = 1;
                    if (dateFilter === '30d') days = 30;
                    if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
                }
            } else {
                const queryDate = new Date(q.assignedOn);
                const startDate = new Date(dateFilter.start);
                const endDate = new Date(dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (queryDate < startDate || queryDate >= endDate) return false;
            }

            return true;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
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
        return filtered;
    }, [assignedQueries, sortConfig, search, dateFilter, priorityFilter, statusFilter, assigneeFilter]);

    const totalPages = Math.ceil(filteredAndSortedQueries.length / itemsPerPage);
    const paginatedData = useMemo(() => filteredAndSortedQueries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedQueries, currentPage, itemsPerPage]);


    const requestSort = (key: keyof AssignedQuery) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

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
                <h1 className="text-2xl font-bold text-text-primary">Assigned Queries</h1>
                <p className="mt-1 text-text-secondary">Track queries that have been assigned to you or by you for optimization.</p>
            </div>

            <div className="bg-surface rounded-xl flex flex-col min-h-0">
                <div className="p-2 mb-2 flex-shrink-0 flex items-center gap-x-4 border-b border-border-color">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Priority" options={filterOptions.priorities} selectedOptions={priorityFilter} onChange={setPriorityFilter} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Status" options={filterOptions.statuses} selectedOptions={statusFilter} onChange={setStatusFilter} />
                    {currentUser?.role === 'Admin' && (
                        <>
                            <div className="h-4 w-px bg-border-color"></div>
                            <MultiSelectDropdown label="Assignee" options={filterOptions.assignees} selectedOptions={assigneeFilter} onChange={setAssigneeFilter} />
                        </>
                    )}
                    <div className="relative flex-grow ml-auto">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search query or message..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-primary font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('queryId')} className="group flex items-center">Query ID<SortIcon columnKey="queryId" /></button></th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('credits')} className="group flex items-center">Credits<SortIcon columnKey="credits" /></button></th>
                                {currentUser?.role === 'Admin' ? (
                                    <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('assignedTo')} className="group flex items-center">Assigned To<SortIcon columnKey="assignedTo" /></button></th>
                                ) : (
                                    <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('assignedBy')} className="group flex items-center">Assigned By<SortIcon columnKey="assignedBy" /></button></th>
                                )}
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('priority')} className="group flex items-center">Priority<SortIcon columnKey="priority" /></button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('status')} className="group flex items-center">Status<SortIcon columnKey="status" /></button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('assignedOn')} className="group flex items-center">Assigned Date<SortIcon columnKey="assignedOn" /></button></th>
                                {currentUser?.role !== 'Admin' && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(query => (
                                <tr key={query.id} className="border-t border-border-color hover:bg-surface-hover">
                                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                                        <button onClick={() => onPreviewQuery(query)} className="text-link hover:underline font-sans">
                                            {query.queryId.substring(7, 13).toUpperCase()}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-xs italic max-w-xs truncate" title={query.message}>"{query.message}"</td>
                                    <td className="px-6 py-4 font-semibold text-text-primary">{query.credits.toFixed(2)}</td>
                                    {currentUser?.role === 'Admin' ? (
                                        <td className="px-6 py-4">{query.assignedTo}</td>
                                    ) : (
                                        <td className="px-6 py-4">{query.assignedBy}</td>
                                    )}

                                    <td className="px-6 py-4"><PriorityBadge priority={query.priority} /></td>
                                    <td className="px-6 py-4"><StatusBadge status={query.status} /></td>
                                    <td className="px-6 py-4">{new Date(query.assignedOn).toLocaleDateString()}</td>
                                    {currentUser?.role !== 'Admin' && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block text-left" ref={openMenuId === query.id ? menuRef : null}>
                                                <button onClick={() => setOpenMenuId(openMenuId === query.id ? null : query.id)} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                    <IconDotsVertical className="h-5 w-5" />
                                                </button>
                                                {openMenuId === query.id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface border border-border-color z-10">
                                                        <div className="py-1" role="menu">
                                                            <button onClick={() => { onPreviewQuery(query); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Query Preview</button>
                                                            <button onClick={() => { onUpdateStatus(query.id, 'Optimized'); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Mark as Optimized</button>
                                                            {currentUser?.role !== 'Admin' && (
                                                                <button onClick={() => { onUpdateStatus(query.id, 'Needs Info'); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Needs More Info</button>
                                                            )}
                                                            <button className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Open in Analyzer</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredAndSortedQueries.length > itemsPerPage && (
                    <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredAndSortedQueries.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignedQueries;
