import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QueryType } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconChevronDown, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';
import Pagination from '../components/Pagination';
import ColumnSelector from '../components/ColumnSelector';

interface QueryListViewProps {
    onSelectQuery: (query: QueryListItem) => void;
    onShareQueryClick: (query: QueryListItem) => void;
}

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
    return new Date(isoString).toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const allColumns = [
    { key: 'queryId', label: 'Query ID' },
    { key: 'user', label: 'User' },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'duration', label: 'Duration' },
    { key: 'bytesScanned', label: 'Bytes Scanned' },
    { key: 'cost', label: 'Cost (Credits)' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'actions', label: 'Actions' },
];

const defaultColumns = ['queryId', 'actions'];

const QueryListView: React.FC<QueryListViewProps> = ({ onSelectQuery, onShareQueryClick }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string, end: string }>('7d');
    const [warehouseFilter, setWarehouseFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [queryTypeFilter, setQueryTypeFilter] = useState<string[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); 
    
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        'queryId', 'user', 'warehouse', 'duration', 'bytesScanned', 'cost', 'startTime', 'actions'
    ]);

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
            if (statusFilter.length > 0 && !statusFilter.includes(q.status)) return false;
            if (warehouseFilter.length > 0 && !warehouseFilter.includes(q.warehouse)) return false;
            if (queryTypeFilter.length > 0 && !queryTypeFilter.some(type => q.type.includes(type))) return false;
            
            if (typeof dateFilter === 'string') {
                if (dateFilter !== 'All') {
                    const queryDate = new Date(q.timestamp);
                    const now = new Date();
                    let days = 0;
                    if (dateFilter === '1d') days = 1;
                    if (dateFilter === '7d') days = 7;
                    if (dateFilter === '30d') days = 30;
                    if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
                }
            } else { // Custom date range object
                const queryDate = new Date(q.timestamp);
                const startDate = new Date(dateFilter.start);
                
                const endDate = new Date(dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                
                if (queryDate < startDate || queryDate >= endDate) return false;
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
        <div className="flex flex-col h-full bg-background p-4 space-y-4">
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">All Queries</h1>
            </div>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
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
            
            <div className="bg-surface rounded-xl shadow-sm flex flex-col flex-grow overflow-hidden">
                {/* Filter Bar */}
                <div className="p-3 flex flex-wrap items-center gap-3 border-b border-border-light flex-shrink-0">
                    <DateRangeDropdown
                        label="Time Range"
                        selectedValue={dateFilter}
                        onChange={setDateFilter}
                    />

                    <MultiSelectDropdown
                        label="Warehouse"
                        options={warehousesData.map(w => w.name)}
                        selectedOptions={warehouseFilter}
                        onChange={setWarehouseFilter}
                    />

                    <MultiSelectDropdown
                        label="Status"
                        options={['Success', 'Failed']}
                        selectedOptions={statusFilter}
                        onChange={setStatusFilter}
                    />
                    
                    <MultiSelectDropdown
                        label="Query Type"
                        options={queryTypes}
                        selectedOptions={queryTypeFilter}
                        onChange={setQueryTypeFilter}
                    />

                    <div className="relative ml-auto w-full max-w-xs flex items-center gap-2">
                        <div className="relative flex-grow">
                             <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search queries..." className="w-full pl-10 pr-4 py-2 bg-background border border-border-color rounded-lg text-sm focus:ring-1 focus:ring-primary" />
                        </div>
                        <ColumnSelector
                            columns={allColumns}
                            visibleColumns={visibleColumns}
                            onVisibleColumnsChange={setVisibleColumns}
                            defaultColumns={defaultColumns}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-grow overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-text-primary sticky top-0 z-10">
                                <tr className="border-b border-border-light bg-table-header-bg">
                                    {allColumns.filter(c => visibleColumns.includes(c.key)).map(col => (
                                        <th key={col.key} scope="col" className={`px-6 py-4 font-medium tracking-wider ${col.key === 'actions' ? 'text-right' : 'text-left'}`}>{col.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                {paginatedData.map(q => (
                                    <tr key={q.id} onClick={() => onSelectQuery(q)} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover cursor-pointer">
                                        {visibleColumns.includes('queryId') && (
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-1 h-5 rounded-full ${q.status === 'Success' ? 'bg-status-success' : 'bg-status-error'}`}></span>
                                                    <span className="font-mono text-sm text-text-primary">Q{q.id.substring(7, 13).toUpperCase()}</span>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.includes('user') && <td className="px-6 py-3 text-text-primary">{q.user}</td>}
                                        {visibleColumns.includes('warehouse') && <td className="px-6 py-3 text-text-primary">{q.warehouse}</td>}
                                        {visibleColumns.includes('duration') && <td className="px-6 py-3 font-medium text-text-primary">{getDurationInSeconds(q.duration)}s</td>}
                                        {visibleColumns.includes('bytesScanned') && <td className="px-6 py-3 font-medium text-text-primary">{formatBytes(q.bytesScanned)}</td>}
                                        {visibleColumns.includes('cost') && (
                                            <td className="px-6 py-3">
                                                <span className="font-medium text-text-primary">${q.costUSD.toFixed(2)}</span>
                                                <span className="text-text-secondary"> ({q.costCredits.toFixed(2)})</span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('startTime') && <td className="px-6 py-3 text-text-primary">{formatTimestamp(q.timestamp)}</td>}
                                        {visibleColumns.includes('actions') && (
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
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {sortedData.length > 0 && (
                     <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedData.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryListView;