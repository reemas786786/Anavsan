import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QueryType } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconChevronDown, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare } from '../constants';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);
    const itemsPerPageOptions = [10, 20, 50, 100];

    return (
        <div className="flex justify-between items-center text-sm text-text-secondary px-4 py-2 border-t border-border-light bg-surface rounded-b-xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span>Items per page:</span>
                    <div className="relative">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="appearance-none bg-surface-nested rounded px-2 py-1 pr-7 font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            aria-label="Items per page"
                        >
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="border-l border-border-color h-6"></div>
                <span>
                    {startItem}–{endItem} of {totalItems} items
                </span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={currentPage}
                            onChange={(e) => onPageChange(Number(e.target.value))}
                            className="appearance-none bg-surface-nested rounded px-2 py-1 pr-7 font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            aria-label="Go to page"
                        >
                            {pageOptions.map(page => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                         <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span>of {totalPages} pages</span>
                </div>
                <div className="border-l border-border-color h-6"></div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Previous page"
                    >
                        <IconChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Next page"
                    >
                        <IconChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface QueryListViewProps {
    onSelectQuery: (query: QueryListItem) => void;
    onShareQueryClick: (query: QueryListItem) => void;
}

const queryTypes: QueryType[] = ['SELECT', 'WHERE', 'JOIN', 'Aggregation', 'INSERT', 'UPDATE', 'DELETE'];

const QueryListView: React.FC<QueryListViewProps> = ({ onSelectQuery, onShareQueryClick }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('7d');
    const [warehouseFilter, setWarehouseFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [queryTypeFilter, setQueryTypeFilter] = useState('All');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const totalQueries = initialData.length;
    const successCount = useMemo(() => initialData.filter(q => q.status === 'Success').length, []);
    const failedCount = totalQueries - successCount;

    const filteredData = useMemo(() => {
        return initialData.filter(q => {
            if (search && !q.queryText.toLowerCase().includes(search.toLowerCase()) && !q.id.toLowerCase().includes(search.toLowerCase())) return false;
            if (statusFilter !== 'All' && q.status !== statusFilter) return false;
            if (warehouseFilter !== 'All' && q.warehouse !== warehouseFilter) return false;
            if (queryTypeFilter !== 'All' && !q.type.includes(queryTypeFilter as QueryType)) return false;
            
            if (dateFilter !== 'All') {
                const queryDate = new Date(q.timestamp);
                const now = new Date();
                let days = 0;
                if (dateFilter === '1d') days = 1;
                if (dateFilter === '7d') days = 7;
                if (dateFilter === '30d') days = 30;
                if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
            }
            return true;
        });
    }, [search, statusFilter, warehouseFilter, dateFilter, queryTypeFilter]);
    
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [filteredData]);
    
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = useMemo(() => sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sortedData, currentPage, itemsPerPage]);

    const handleItemsPerPageChange = (newSize: number) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };
    
    const getDurationInSeconds = (duration: string) => {
        const parts = duration.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">All Queries</h1>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-text-secondary">Total Queries</p>
                    <p className="text-3xl font-bold text-text-strong mt-1">{totalQueries.toLocaleString()}</p>
                </div>
                <div className="bg-surface p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-text-secondary">Success</p>
                    <p className="text-3xl font-bold text-status-success mt-1">{successCount.toLocaleString()}</p>
                </div>
                <div className="bg-surface p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-text-secondary">Failed</p>
                    <p className="text-3xl font-bold text-status-error mt-1">{failedCount.toLocaleString()}</p>
                </div>
            </div>
            
            <div className="bg-surface rounded-xl shadow-sm">
                {/* Filter Bar */}
                <div className="p-3 flex flex-wrap items-center gap-3 border-b border-border-light">
                    <div className="relative bg-background rounded-lg px-3 py-2 flex items-center gap-2">
                        <label htmlFor="date-filter-select" className="text-sm text-text-secondary">Time Range:</label>
                        <select id="date-filter-select" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="appearance-none bg-transparent text-sm font-semibold text-text-primary focus:outline-none pr-5 cursor-pointer">
                            <option value="7d">7d</option>
                            <option value="1d">24h</option>
                            <option value="30d">30d</option>
                            <option value="All">All Time</option>
                        </select>
                        <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative bg-background rounded-lg px-3 py-2 flex items-center gap-2">
                        <label htmlFor="warehouse-filter-select" className="text-sm text-text-secondary">Warehouse:</label>
                         <select id="warehouse-filter-select" value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)} className="appearance-none bg-transparent text-sm font-semibold text-text-primary focus:outline-none pr-5 cursor-pointer">
                            <option value="All">All</option>
                            {warehousesData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                        </select>
                        <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative bg-background rounded-lg px-3 py-2 flex items-center gap-2">
                         <label htmlFor="status-filter-select" className="text-sm text-text-secondary">Status:</label>
                        <select id="status-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none bg-transparent text-sm font-semibold text-text-primary focus:outline-none pr-5 cursor-pointer">
                            <option value="All">All</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                        </select>
                        <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    
                    <div className="relative bg-background rounded-lg px-3 py-2 flex items-center gap-2">
                        <label htmlFor="query-type-filter-select" className="text-sm text-text-secondary">Query Type:</label>
                        <select id="query-type-filter-select" value={queryTypeFilter} onChange={e => setQueryTypeFilter(e.target.value)} className="appearance-none bg-transparent text-sm font-semibold text-text-primary focus:outline-none pr-5 cursor-pointer">
                            <option value="All">All</option>
                            {queryTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative ml-auto w-full max-w-xs">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search queries..." className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-text-secondary uppercase">
                            <tr className="border-b border-border-light">
                                <th scope="col" className="px-6 py-4 text-left font-medium tracking-wider">Query ID</th>
                                <th scope="col" className="px-6 py-4 text-left font-medium tracking-wider">Duration</th>
                                <th scope="col" className="px-6 py-4 text-left font-medium tracking-wider">Cost (Credits)</th>
                                <th scope="col" className="px-6 py-4 text-right font-medium tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(q => (
                                <tr key={q.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover">
                                    <td onClick={() => onSelectQuery(q)} className="px-6 py-3 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-1 h-5 rounded-full ${q.status === 'Success' ? 'bg-status-success' : 'bg-status-error'}`}></span>
                                            <span className="font-mono text-sm text-text-primary">Q{q.id.substring(7, 13).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td onClick={() => onSelectQuery(q)} className="px-6 py-3 font-medium text-text-primary cursor-pointer">{getDurationInSeconds(q.duration)}s</td>
                                    <td onClick={() => onSelectQuery(q)} className="px-6 py-3 cursor-pointer">
                                        <span className="font-medium text-text-primary">${q.costUSD.toFixed(2)}</span>
                                        <span className="text-text-secondary"> ({q.costCredits.toFixed(2)})</span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === q.id ? menuRef : null}>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === q.id ? null : q.id); }} 
                                                title="Actions" 
                                                className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5"/>
                                            </button>
                                            {openMenuId === q.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg bg-surface shadow-lg z-10 border border-border-color">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button onClick={(e) => { e.stopPropagation(); onSelectQuery(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconView className="h-4 w-4"/> Query Preview
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); alert('Open in Analyzer clicked'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconBeaker className="h-4 w-4"/> Open in Analyzer
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); alert('Open in Optimizer clicked'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconWand className="h-4 w-4"/> Open in Optimizer
                                                        </button>
                                                         <button onClick={(e) => { e.stopPropagation(); alert('Open in Simulator clicked'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconBeaker className="h-4 w-4"/> Open in Simulator
                                                        </button>
                                                        <div className="my-1 border-t border-border-color"></div>
                                                        <button onClick={(e) => { e.stopPropagation(); onShareQueryClick(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                            <IconShare className="h-4 w-4"/> Share Query
                                                        </button>
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
                
                {sortedData.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default QueryListView;