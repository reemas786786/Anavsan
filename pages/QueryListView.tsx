import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData, usersData as allUsersData } from '../data/dummyData';
import { QueryListItem, QueryType, QueryListFilters } from '../types';
import { IconSearch, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare, IconFilter } from '../constants';
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
    { key: 'bytesScanned', label: 'Bytes scanned' },
    { key: 'cost', label: 'Cost (USD)' },
    { key: 'startTime', label: 'Start time' },
    { key: 'actions', label: 'Actions' },
];

interface QueryListViewProps {
    onSelectQuery: (query: QueryListItem) => void;
    onShareQueryClick: (query: QueryListItem) => void;
    onAnalyzeQuery: (query: QueryListItem, source: string) => void;
    onOptimizeQuery: (query: QueryListItem, source: string) => void;
    onSimulateQuery: (query: QueryListItem, source: string) => void;
    filters: QueryListFilters;
    setFilters: React.Dispatch<React.SetStateAction<QueryListFilters>>;
}

const QueryListView: React.FC<QueryListViewProps> = ({ 
    onSelectQuery, 
    onShareQueryClick, 
    onAnalyzeQuery, 
    onOptimizeQuery, 
    onSimulateQuery,
    filters,
    setFilters
}) => {
    
    // Dropdown filters temp state
    const [tempWarehouseFilter, setTempWarehouseFilter] = useState<string[]>(filters.warehouseFilter);
    const [tempQueryTypeFilter, setTempQueryTypeFilter] = useState<string[]>(filters.queryTypeFilter);
    const [tempDurationFilter, setTempDurationFilter] = useState<{ min: number | null, max: number | null }>(filters.durationFilter);
    
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    
    const allUsers = useMemo(() => Array.from(new Set(initialData.map(q => q.user))).sort(), []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) setIsFilterOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isFilterOpen) {
            setTempWarehouseFilter(filters.warehouseFilter);
            setTempQueryTypeFilter(filters.queryTypeFilter);
            setTempDurationFilter(filters.durationFilter);
        }
    }, [isFilterOpen, filters.warehouseFilter, filters.queryTypeFilter, filters.durationFilter]);

    const getDurationInSeconds = (duration: string) => {
        const parts = duration.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    const baseFilteredData = useMemo(() => {
        return initialData.filter(q => {
            if (filters.search && !(q.queryText.toLowerCase().includes(filters.search.toLowerCase()) || q.id.toLowerCase().includes(filters.search.toLowerCase()) || q.user.toLowerCase().includes(filters.search.toLowerCase()))) return false;
            if (filters.statusFilter.length > 0 && !filters.statusFilter.includes(q.status)) return false;
            if (filters.userFilter.length > 0 && !filters.userFilter.includes(q.user)) return false;
            if (filters.warehouseFilter.length > 0 && !filters.warehouseFilter.includes(q.warehouse)) return false;
            if (filters.queryTypeFilter.length > 0 && !filters.queryTypeFilter.some(type => q.type.includes(type as QueryType))) return false;
            
            const durationInSeconds = getDurationInSeconds(q.duration);
            if (filters.durationFilter.min !== null && durationInSeconds < filters.durationFilter.min) return false;
            if (filters.durationFilter.max !== null && durationInSeconds > filters.durationFilter.max) return false;

            if (typeof filters.dateFilter === 'string') {
                if (filters.dateFilter !== 'All') {
                    const queryDate = new Date(q.timestamp);
                    const now = new Date();
                    let days = 0;
                    if (filters.dateFilter === '1d') days = 1;
                    if (filters.dateFilter === '7d') days = 7;
                    if (filters.dateFilter === '30d') days = 30;
                    if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
                }
            } else {
                const queryDate = new Date(q.timestamp);
                const startDate = new Date(filters.dateFilter.start);
                const endDate = new Date(filters.dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (queryDate < startDate || queryDate >= endDate) return false;
            }
            return true;
        });
    }, [filters]);

    const queryStats = useMemo(() => ({
        total: baseFilteredData.length,
        success: baseFilteredData.filter(q => q.status === 'Success').length,
        failed: baseFilteredData.filter(q => q.status === 'Failed').length,
    }), [baseFilteredData]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.dateFilter !== '7d') count++;
        if (filters.userFilter.length > 0) count++;
        if (filters.statusFilter.length > 0) count++;
        if (filters.warehouseFilter.length > 0) count++;
        if (filters.queryTypeFilter.length > 0) count++;
        if (filters.durationFilter.min !== null || filters.durationFilter.max !== null) count++;
        return count;
    }, [filters]);
    
    const sortedData = useMemo(() => [...baseFilteredData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [baseFilteredData]);
    const totalPages = Math.ceil(sortedData.length / filters.itemsPerPage);
    const paginatedData = useMemo(() => sortedData.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage), [sortedData, filters.currentPage, filters.itemsPerPage]);

    const handleFilterChange = <K extends keyof QueryListFilters>(key: K, value: QueryListFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value, currentPage: 1 }));
    };

    const handleApplyFilters = () => {
        setFilters(prev => ({
            ...prev,
            warehouseFilter: tempWarehouseFilter,
            queryTypeFilter: tempQueryTypeFilter,
            durationFilter: tempDurationFilter,
            currentPage: 1,
        }));
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        setTempWarehouseFilter([]);
        setTempQueryTypeFilter([]);
        setTempDurationFilter({ min: null, max: null });
    };

    const visibleColsData = useMemo(() => allColumns.filter(c => filters.visibleColumns.includes(c.key)), [filters.visibleColumns]);

    const renderCellContent = (q: QueryListItem, colKey: string) => {
        switch (colKey) {
            case 'queryId':
                return (
                    <div className="flex items-center gap-3">
                        <span className={`w-1 h-5 rounded-full ${q.status === 'Success' ? 'bg-status-success' : 'bg-status-error'}`}></span>
                        <span className="font-mono text-sm text-text-primary">{q.id.substring(7, 13).toUpperCase()}</span>
                    </div>
                );
            case 'user': return q.user;
            case 'warehouse': return q.warehouse;
            case 'duration': return `${getDurationInSeconds(q.duration)}s`;
            case 'bytesScanned': return formatBytes(q.bytesScanned);
            case 'cost': return <><span className="font-medium text-text-primary">${q.costUSD.toFixed(2)}</span><span className="text-text-secondary"> ({q.costCredits.toFixed(2)})</span></>;
            case 'startTime': return formatTimestamp(q.timestamp);
            case 'actions':
                return (
                    <div className="relative inline-block text-left" ref={openMenuId === q.id ? menuRef : null}>
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === q.id ? null : q.id); }} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                            <IconDotsVertical className="h-5 w-5"/>
                        </button>
                        {openMenuId === q.id && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <button onClick={(e) => { e.stopPropagation(); onSelectQuery(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem" title="Preview query details and metadata"><IconView className="h-4 w-4"/> Query Preview</button>
                                    <button onClick={(e) => { e.stopPropagation(); onAnalyzeQuery(q, 'All queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem" title="Open this query in Analyzer to inspect performance details."><IconSearch className="h-4 w-4"/> Open in Analyzer</button>
                                    <button onClick={(e) => { e.stopPropagation(); onOptimizeQuery(q, 'All queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem" title="Open in Optimizer to get AI-powered optimization suggestions."><IconWand className="h-4 w-4"/> Open in Optimizer</button>
                                    <button onClick={(e) => { e.stopPropagation(); onSimulateQuery(q, 'All queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem" title="Open in Simulator to test cost and performance scenarios."><IconBeaker className="h-4 w-4"/> Open in Simulator</button>
                                    <div className="my-1 border-t border-border-color"></div>
                                    <button onClick={(e) => { e.stopPropagation(); onShareQueryClick(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem"><IconShare className="h-4 w-4"/> Share Query</button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="flex flex-col h-full bg-background space-y-4">
             <div className="flex-shrink-0 pt-2 px-4">
                <h1 className="text-2xl font-bold text-text-primary">All queries</h1>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface'}>Total Queries: <span className="font-bold text-text-strong">{queryStats.total.toLocaleString()}</span></div>
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface'}>Success: <span className="font-bold text-status-success-dark">{queryStats.success.toLocaleString()}</span></div>
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface'}>Failed: <span className="font-bold text-status-error-dark">{queryStats.failed.toLocaleString()}</span></div>
                </div>
            </div>

            <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0 mx-4">
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-shrink-0 border-b border-border-light">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <DateRangeDropdown selectedValue={filters.dateFilter} onChange={(value) => handleFilterChange('dateFilter', value)} />
                        <div className="h-4 w-px bg-border-light"></div>
                        <MultiSelectDropdown label="User" options={allUsers} selectedOptions={filters.userFilter} onChange={(value) => handleFilterChange('userFilter', value)} selectionMode="multiple" />
                        <div className="h-4 w-px bg-border-light"></div>
                        <MultiSelectDropdown label="Status" options={['Success', 'Failed']} selectedOptions={filters.statusFilter} onChange={(value) => handleFilterChange('statusFilter', value)} selectionMode="single" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="search" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Search queries..." className="w-full md:w-64 pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                        </div>
                        <div className="relative" ref={filterRef}>
                            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center justify-center p-2 rounded-md text-text-secondary hover:bg-button-secondary-bg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-colors relative" aria-haspopup="true" aria-expanded={isFilterOpen}>
                                <IconFilter className="h-5 w-5" />
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[10px]">{activeFilterCount}</span>
                                )}
                            </button>
                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-surface rounded-lg shadow-lg z-20 border border-border-color p-4">
                                    <h3 className="text-sm font-semibold text-text-strong mb-4">Additional Filters</h3>
                                    <div className="space-y-4">
                                        <MultiSelectDropdown label="Warehouse" options={warehousesData.map(w => w.name)} selectedOptions={tempWarehouseFilter} onChange={setTempWarehouseFilter} selectionMode="multiple" />
                                        <MultiSelectDropdown label="Query type" options={queryTypes} selectedOptions={tempQueryTypeFilter} onChange={setTempQueryTypeFilter} selectionMode="multiple" />
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">Duration (seconds)</label>
                                            <div className="flex items-center gap-2">
                                                <input type="number" placeholder="Min" value={tempDurationFilter.min ?? ''} onChange={e => setTempDurationFilter(prev => ({...prev, min: e.target.value ? Number(e.target.value) : null}))} className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" />
                                                <span className="text-text-muted">-</span>
                                                <input type="number" placeholder="Max" value={tempDurationFilter.max ?? ''} onChange={e => setTempDurationFilter(prev => ({...prev, max: e.target.value ? Number(e.target.value) : null}))} className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-color">
                                        <button onClick={handleClearFilters} className="text-sm font-semibold text-link hover:underline">Clear</button>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setIsFilterOpen(false)} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                                            <button onClick={handleApplyFilters} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <ColumnSelector columns={allColumns} visibleColumns={filters.visibleColumns} onVisibleColumnsChange={(value) => handleFilterChange('visibleColumns', value)} defaultColumns={['queryId', 'actions']} />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0" role="region" aria-label="Query history table content scrollable region">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg border-b border-border-color">
                            <tr>
                                {visibleColsData.map(col => <th key={col.key} scope="col" className={`px-6 py-4 font-semibold ${col.key === 'actions' ? 'text-right' : 'text-left'}`}>{col.label}</th>)}
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(q => (
                                <tr key={q.id} onClick={() => onSelectQuery(q)} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" data-row-hover>
                                    {visibleColsData.map(col => <td key={col.key} className={`px-6 py-3 whitespace-nowrap`}><div className={`flex ${col.key === 'actions' ? 'justify-end' : 'justify-start'}`}>{renderCellContent(q, col.key)}</div></td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {sortedData.length > 10 && (
                     <div className="flex-shrink-0">
                        <Pagination currentPage={filters.currentPage} totalPages={totalPages} totalItems={sortedData.length} itemsPerPage={filters.itemsPerPage} onPageChange={(p) => handleFilterChange('currentPage', p)} onItemsPerPageChange={(s) => handleFilterChange('itemsPerPage', s)}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryListView;