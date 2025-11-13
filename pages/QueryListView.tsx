

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData, usersData as allUsersData } from '../data/dummyData';
import { QueryListItem, QueryType, QueryListFilters } from '../types';
import { IconSearch, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare, IconAdjustments, IconArrowUp, IconArrowDown, IconClipboardCopy, IconCheck, IconClose } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';
import Pagination from '../components/Pagination';
import ColumnSelector from '../components/ColumnSelector';

const queryTypes: QueryType[] = ['SELECT', 'WHERE', 'JOIN', 'Aggregation', 'INSERT', 'UPDATE', 'DELETE'];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).replace(',', '');
};

const allColumns = [
    { key: 'queryId', label: 'Query ID' },
    { key: 'user', label: 'User' },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'duration', label: 'Duration' },
    { key: 'bytesScanned', label: 'Bytes Scanned' },
    { key: 'cost', label: 'Cost' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'actions', label: 'Actions' },
];

const QueryIdCell: React.FC<{ query: QueryListItem; onSelectQuery: (query: QueryListItem) => void; }> = ({ query, onSelectQuery }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(query.id);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onSelectQuery(query); }} className="text-link hover:underline font-mono text-xs">
                {query.id.substring(7, 13).toUpperCase()}
            </button>
            <button onClick={handleCopy} className="text-text-muted hover:text-text-primary">
                {isCopied ? <IconCheck className="h-4 w-4 text-status-success" /> : <IconClipboardCopy className="h-4 w-4" />}
            </button>
        </div>
    );
};

interface QueryListViewProps {
    onShareQueryClick: (query: QueryListItem) => void;
    onSelectQuery: (query: QueryListItem) => void;
    onAnalyzeQuery: (query: QueryListItem) => void;
    onOptimizeQuery: (query: QueryListItem) => void;
    onSimulateQuery: (query: QueryListItem) => void;
    filters: QueryListFilters;
    setFilters: React.Dispatch<React.SetStateAction<QueryListFilters>>;
}

const FilterPopover: React.FC<{
    filters: QueryListFilters;
    setFilters: React.Dispatch<React.SetStateAction<QueryListFilters>>;
    onClose: () => void;
}> = ({ filters, setFilters, onClose }) => {
    const [tempFilters, setTempFilters] = useState(filters);
    const popoverRef = useRef<HTMLDivElement>(null);
    
    const warehouses = useMemo(() => warehousesData.map(w => w.name), []);
    const qTypes = useMemo(() => queryTypes, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleApply = () => {
        setFilters(tempFilters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters: QueryListFilters = {
            ...filters,
            warehouseFilter: [],
            queryTypeFilter: [],
        };
        setTempFilters(resetFilters);
    };

    return (
        <div ref={popoverRef} className="absolute top-full mt-2 left-0 w-80 bg-surface rounded-lg shadow-lg border border-border-color z-20 flex flex-col">
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
                <MultiSelectDropdown label="Warehouse" options={warehouses} selectedOptions={tempFilters.warehouseFilter} onChange={(val) => setTempFilters(p => ({...p, warehouseFilter: val}))} selectionMode="single" layout="stacked" />
                <MultiSelectDropdown label="Query Type" options={qTypes} selectedOptions={tempFilters.queryTypeFilter} onChange={(val) => setTempFilters(p => ({...p, queryTypeFilter: val}))} selectionMode="multiple" layout="stacked" />
            </div>
            <div className="p-4 flex justify-between items-center flex-shrink-0 border-t border-border-color bg-surface-nested rounded-b-lg">
                <button onClick={handleReset} className="text-sm font-semibold text-text-secondary hover:text-text-primary">Reset</button>
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-surface-hover">Cancel</button>
                    <button onClick={handleApply} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Apply Filters</button>
                </div>
            </div>
        </div>
    );
};

export const QueryListView: React.FC<QueryListViewProps> = ({
    onShareQueryClick,
    onSelectQuery,
    onAnalyzeQuery,
    onOptimizeQuery,
    onSimulateQuery,
    filters,
    setFilters,
}) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending' });
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
    const filterButtonRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
             if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
                setIsFilterPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = <K extends keyof QueryListFilters>(key: K, value: QueryListFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value, currentPage: 1 }));
    };

    const queryStats = useMemo(() => {
        const total = initialData.length;
        const failed = initialData.filter(q => q.status === 'Failed').length;
        return {
            total,
            success: total - failed,
            failed,
        }
    }, []);
    
    const additionalFilterCount = useMemo(() => {
        let count = 0;
        if (filters.warehouseFilter.length > 0) count++;
        if (filters.queryTypeFilter.length > 0) count++;
        return count;
    }, [filters.warehouseFilter, filters.queryTypeFilter]);

    const filteredAndSortedData = useMemo(() => {
        let data = [...initialData].filter(q => {
            if (filters.search && !(
                q.queryText.toLowerCase().includes(filters.search.toLowerCase()) ||
                q.id.toLowerCase().includes(filters.search.toLowerCase())
            )) return false;

            if (filters.userFilter.length > 0 && !filters.userFilter.includes(q.user)) return false;
            
            if (filters.statusFilter.length > 0 && !filters.statusFilter.includes(q.status)) return false;
            
            if (filters.warehouseFilter.length > 0 && !filters.warehouseFilter.includes(q.warehouse)) return false;

            if (filters.queryTypeFilter.length > 0 && !filters.queryTypeFilter.some(t => q.type.includes(t as QueryType))) return false;

            if (typeof filters.dateFilter === 'object') {
                const queryDate = new Date(q.timestamp);
                const startDate = new Date(filters.dateFilter.start);
                const endDate = new Date(filters.dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (queryDate < startDate || queryDate >= endDate) return false;
            } else if (filters.dateFilter && filters.dateFilter !== 'All') {
                const queryDate = new Date(q.timestamp);
                const now = new Date();
                let days = 0;
                if (filters.dateFilter === '7d') days = 7;
                if (filters.dateFilter === '1d') days = 1;
                if (filters.dateFilter === '30d') days = 30;
                if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
            }

            return true;
        });

        if (sortConfig) {
            data.sort((a, b) => {
                const key = sortConfig.key;
                let valA, valB;

                if (key === 'cost') {
                    valA = a.costUSD;
                    valB = b.costUSD;
                } else {
                    valA = a[key as keyof QueryListItem];
                    valB = b[key as keyof QueryListItem];
                }

                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return data;
    }, [filters, sortConfig]);

    const paginatedData = useMemo(() => {
        return filteredAndSortedData.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage);
    }, [filteredAndSortedData, filters.currentPage, filters.itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedData.length / filters.itemsPerPage);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: string }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="w-4 h-4 ml-1" />;
    };
    
    return (
        <div className="flex flex-col h-full bg-background space-y-4 p-4">
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">All Queries</h1>
                <p className="mt-1 text-text-secondary">View and analyze all queries executed in this account.</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface shadow-sm'}>Total Queries: <span className="font-bold text-text-strong">{queryStats.total.toLocaleString()}</span></div>
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface shadow-sm'}>Success: <span className="font-bold text-status-success-dark">{queryStats.success.toLocaleString()}</span></div>
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface shadow-sm'}>Failed: <span className="font-bold text-status-error-dark">{queryStats.failed.toLocaleString()}</span></div>
                </div>
            </div>
            
            <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
                <div className="p-4 flex-shrink-0 flex items-center justify-between gap-x-4 border-b border-border-color">
                     <div className="flex items-center gap-x-2">
                        <DateRangeDropdown selectedValue={filters.dateFilter} onChange={(value) => handleFilterChange('dateFilter', value)} />
                        <div className="h-4 w-px bg-border-color"></div>
                        <MultiSelectDropdown label="User" options={[...new Set(initialData.map(q => q.user))]} selectedOptions={filters.userFilter} onChange={(value) => handleFilterChange('userFilter', value)} selectionMode="single" />
                        <div className="h-4 w-px bg-border-color"></div>
                        <MultiSelectDropdown label="Status" options={['Success', 'Failed']} selectedOptions={filters.statusFilter} onChange={(value) => handleFilterChange('statusFilter', value)} selectionMode="single" />

                        <div ref={filterButtonRef} className="relative">
                            <button
                                onClick={() => setIsFilterPopoverOpen(prev => !prev)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-sm font-medium text-text-primary"
                                title="Additional Filters"
                            >
                                <IconAdjustments className="h-5 w-5 text-text-secondary" />
                                <span>Filter</span>
                                {additionalFilterCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">{additionalFilterCount}</span>
                                )}
                            </button>
                            {isFilterPopoverOpen && <FilterPopover filters={filters} setFilters={setFilters} onClose={() => setIsFilterPopoverOpen(false)} />}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <ColumnSelector columns={allColumns} visibleColumns={filters.visibleColumns} onVisibleColumnsChange={(v) => handleFilterChange('visibleColumns', v)} defaultColumns={['queryId', 'actions']} />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IconSearch className="h-5 w-5 text-text-muted" />
                            </div>
                            <input
                                type="search"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search query text or ID..."
                                className="w-full md:w-80 pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                {filters.visibleColumns.map(colKey => (
                                    <th key={colKey} scope="col" className={`px-6 py-4 font-semibold text-left ${colKey === 'actions' ? 'text-right' : ''}`}>
                                        {colKey !== 'actions' ? (
                                             <button onClick={() => requestSort(colKey)} className="group flex items-center">
                                                {allColumns.find(c => c.key === colKey)?.label} <SortIcon columnKey={colKey} />
                                            </button>
                                        ) : (
                                            allColumns.find(c => c.key === colKey)?.label
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(query => (
                                <tr key={query.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested" data-row-hover>
                                    {filters.visibleColumns.map(colKey => (
                                        <td key={colKey} className={`px-6 py-3 ${colKey === 'actions' ? 'text-right' : ''}`}>
                                            {colKey === 'queryId' && <QueryIdCell query={query} onSelectQuery={onSelectQuery} />}
                                            {colKey === 'user' && <span className="font-medium text-text-primary">{query.user}</span>}
                                            {colKey === 'warehouse' && query.warehouse}
                                            {colKey === 'duration' && query.duration}
                                            {colKey === 'bytesScanned' && formatBytes(query.bytesScanned)}
                                            {colKey === 'cost' && <span className="font-semibold text-text-primary">${query.costUSD.toFixed(2)}</span>}
                                            {colKey === 'startTime' && formatTimestamp(query.timestamp)}
                                            {colKey === 'actions' && (
                                                 <div className="relative inline-block text-left" ref={openMenuId === query.id ? menuRef : null}>
                                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === query.id ? null : query.id); }} title="Actions" className="p-2 -m-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                        <IconDotsVertical className="h-5 w-5"/>
                                                    </button>
                                                    {openMenuId === query.id && (
                                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                            <div className="py-1" role="menu">
                                                                <button onClick={() => { onSelectQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconView className="h-4 w-4"/> View Details</button>
                                                                <button onClick={() => { onAnalyzeQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Analyze</button>
                                                                <button onClick={() => { onOptimizeQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Optimize</button>
                                                                <button onClick={() => { onSimulateQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Simulate</button>
                                                                <div className="my-1 border-t border-border-color"></div>
                                                                <button onClick={() => { onShareQueryClick(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconShare className="h-4 w-4"/> Assign Query</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* FIX: `itemsPerPage` is a property of `filters`, not a standalone variable. */}
                 {filteredAndSortedData.length > filters.itemsPerPage && (
                     <div className="flex-shrink-0">
                        <Pagination
                            currentPage={filters.currentPage}
                            totalPages={totalPages}
                            totalItems={filteredAndSortedData.length}
                            itemsPerPage={filters.itemsPerPage}
                            onPageChange={(p) => handleFilterChange('currentPage', p)}
                            onItemsPerPageChange={(size) => handleFilterChange('itemsPerPage', size)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
