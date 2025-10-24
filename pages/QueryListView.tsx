import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData, usersData as allUsersData } from '../data/dummyData';
import { QueryListItem, QueryType, QueryListFilters } from '../types';
import { IconSearch, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare, IconAdjustments, IconArrowUp, IconArrowDown, IconClipboardCopy, IconCheck } from '../constants';
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

const QueryIdCell: React.FC<{ query: QueryListItem; onSelectQuery: (query: QueryListItem) => void }> = ({ query, onSelectQuery }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsTooltipVisible(false);
            if (isCopied) setIsCopied(false);
        }, 300);
    };
    
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(query.id);
        setIsCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setIsCopied(false);
            setIsTooltipVisible(false);
        }, 2000);
    };
    

    return (
        <td 
            className="px-6 py-3 font-mono text-xs text-link whitespace-nowrap relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button onClick={() => onSelectQuery(query)} className="hover:underline focus:outline-none">
                {query.id.substring(7, 13).toUpperCase()}
            </button>
            {isTooltipVisible && (
                <div 
                    className="absolute z-10 bottom-full mb-2 left-0 w-auto p-2 bg-surface text-text-primary rounded-md shadow-lg border border-border-light"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex items-center justify-between">
                       <span className="font-mono text-sm">{query.id}</span>
                       <button onClick={handleCopy} className="p-1.5 rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary ml-2" aria-label={isCopied ? "Copied" : "Copy Query ID"}>
                           {isCopied ? <IconCheck className="h-4 w-4 text-status-success" /> : <IconClipboardCopy className="h-4 w-4" />}
                       </button>
                   </div>
                </div>
            )}
        </td>
    );
};

interface QueryListViewProps {
    onShareQueryClick: (query: QueryListItem) => void;
    onSelectQuery: (query: QueryListItem) => void;
    onAnalyzeQuery: (query: QueryListItem, source: string) => void;
    onOptimizeQuery: (query: QueryListItem, source: string) => void;
    onSimulateQuery: (query: QueryListItem, source: string) => void;
    filters: QueryListFilters;
    setFilters: React.Dispatch<React.SetStateAction<QueryListFilters>>;
}

export const QueryListView: React.FC<QueryListViewProps> = ({ 
    onShareQueryClick, 
    onSelectQuery,
    onAnalyzeQuery,
    onOptimizeQuery,
    onSimulateQuery,
    filters,
    setFilters 
}) => {
    
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof QueryListItem; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending' });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredData = useMemo(() => {
        return initialData.filter(q => {
            if (filters.search && !(q.id.toLowerCase().includes(filters.search.toLowerCase()) || q.queryText.toLowerCase().includes(filters.search.toLowerCase()))) return false;
            if (filters.userFilter.length > 0 && !filters.userFilter.includes(q.user)) return false;
            if (filters.statusFilter.length > 0 && !filters.statusFilter.includes(q.status)) return false;
            if (filters.warehouseFilter.length > 0 && !filters.warehouseFilter.includes(q.warehouse)) return false;
            if (filters.queryTypeFilter.length > 0 && !filters.queryTypeFilter.some(t => q.type.includes(t as QueryType))) return false;

            const durationInSeconds = q.duration.split(':').map(Number).reduce((acc, time) => acc * 60 + time, 0);
            if(filters.durationFilter.min !== null && durationInSeconds < filters.durationFilter.min) return false;
            if(filters.durationFilter.max !== null && durationInSeconds > filters.durationFilter.max) return false;

            if (typeof filters.dateFilter === 'string') {
                if (filters.dateFilter !== 'All') {
                    const queryDate = new Date(q.timestamp);
                    const now = new Date();
                    let days = 0;
                    if (filters.dateFilter === '7d') days = 7;
                    if (filters.dateFilter === '1d') days = 1;
                    if (filters.dateFilter === '30d') days = 30;
                    if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
                }
            } else {
                const queryDate = new Date(q.timestamp);
                const startDate = new Date(filters.dateFilter.start);
                const endDate = new Date(filters.dateFilter.end);
                endDate.setDate(endDate.getDate() + 1); // include end date
                if (queryDate < startDate || queryDate >= endDate) return false;
            }
            return true;
        });
    }, [filters]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key] || 0;
                const bVal = b[sortConfig.key] || 0;
                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);
    
    useEffect(() => {
        handleFilterChange('currentPage', 1);
    }, [filters.search, filters.dateFilter, filters.userFilter, filters.statusFilter, filters.warehouseFilter, filters.queryTypeFilter, filters.itemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / filters.itemsPerPage);
    const paginatedData = sortedData.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage);

    const handleFilterChange = <K extends keyof QueryListFilters>(key: K, value: QueryListFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const requestSort = (key: keyof QueryListItem) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof QueryListItem }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    const columnComponents: Record<string, React.ReactNode> = {
        queryId: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('id')} className="group flex items-center">Query ID <SortIcon columnKey="id" /></button></th>,
        user: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('user')} className="group flex items-center">User <SortIcon columnKey="user" /></button></th>,
        warehouse: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('warehouse')} className="group flex items-center">Warehouse <SortIcon columnKey="warehouse" /></button></th>,
        duration: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('duration')} className="group flex items-center">Duration <SortIcon columnKey="duration" /></button></th>,
        bytesScanned: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('bytesScanned')} className="group flex items-center">Bytes Scanned <SortIcon columnKey="bytesScanned" /></button></th>,
        cost: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('costUSD')} className="group flex items-center">Cost <SortIcon columnKey="costUSD" /></button></th>,
        startTime: <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('timestamp')} className="group flex items-center">Start Time <SortIcon columnKey="timestamp" /></button></th>,
        actions: <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>,
    };
    
    return (
        <div className="flex flex-col h-full bg-background space-y-4 p-4">
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">All queries</h1>
                <p className="mt-1 text-text-secondary">Browse, filter, and analyze all queries executed in this account.</p>
            </div>
            
            <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
                {/* Filter Bar */}
                <div className="p-2 mb-2 flex-shrink-0 bg-surface rounded-t-xl flex items-center gap-x-2 border-b border-border-color">
                    <DateRangeDropdown selectedValue={filters.dateFilter} onChange={(value) => handleFilterChange('dateFilter', value)} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="User" options={allUsersData.map(u => u.name)} selectedOptions={filters.userFilter} onChange={(value) => handleFilterChange('userFilter', value)} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Status" options={['Success', 'Failed']} selectedOptions={filters.statusFilter} onChange={(value) => handleFilterChange('statusFilter', value)} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Warehouse" options={warehousesData.map(w => w.name)} selectedOptions={filters.warehouseFilter} onChange={(value) => handleFilterChange('warehouseFilter', value)} />
                    <div className="relative flex-grow">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Search queries..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                     <ColumnSelector columns={allColumns} visibleColumns={filters.visibleColumns} onVisibleColumnsChange={(v) => handleFilterChange('visibleColumns', v)} defaultColumns={['queryId', 'actions']} />
                </div>
                
                {/* Table */}
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                {filters.visibleColumns.map(colKey => columnComponents[colKey])}
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(q => (
                                <tr key={q.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested" data-row-hover>
                                    {filters.visibleColumns.includes('queryId') && <QueryIdCell query={q} onSelectQuery={onSelectQuery} />}
                                    {filters.visibleColumns.includes('user') && <td className="px-6 py-3">{q.user}</td>}
                                    {filters.visibleColumns.includes('warehouse') && <td className="px-6 py-3">{q.warehouse}</td>}
                                    {filters.visibleColumns.includes('duration') && <td className="px-6 py-3">{q.duration}</td>}
                                    {filters.visibleColumns.includes('bytesScanned') && <td className="px-6 py-3">{formatBytes(q.bytesScanned)}</td>}
                                    {filters.visibleColumns.includes('cost') && <td className="px-6 py-3">${q.costUSD.toFixed(2)}</td>}
                                    {filters.visibleColumns.includes('startTime') && <td className="px-6 py-3">{formatTimestamp(q.timestamp)}</td>}
                                    {filters.visibleColumns.includes('actions') && (
                                        <td className="px-6 py-3 text-right">
                                            <div className="relative inline-block text-left" ref={openMenuId === q.id ? menuRef : null}>
                                                <button onClick={() => setOpenMenuId(openMenuId === q.id ? null : q.id)} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                    <IconDotsVertical className="h-5 w-5"/>
                                                </button>
                                                {openMenuId === q.id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                        <div className="py-1" role="menu">
                                                            <button onClick={() => { onSelectQuery(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconView className="h-4 w-4"/> View Details</button>
                                                            <button onClick={() => { onAnalyzeQuery(q, 'All queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Analyze</button>
                                                            <button onClick={() => { onOptimizeQuery(q, 'All queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Optimize</button>
                                                            <button onClick={() => { onSimulateQuery(q, 'All queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Simulate</button>
                                                            <button onClick={() => { onShareQueryClick(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconShare className="h-4 w-4"/> Share</button>
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
                
                {/* Pagination */}
                <div className="flex-shrink-0">
                    <Pagination
                        currentPage={filters.currentPage}
                        totalPages={totalPages}
                        totalItems={sortedData.length}
                        itemsPerPage={filters.itemsPerPage}
                        onPageChange={(p) => handleFilterChange('currentPage', p)}
                        onItemsPerPageChange={(size) => handleFilterChange('itemsPerPage', size)}
                    />
                </div>
            </div>
        </div>
    );
}