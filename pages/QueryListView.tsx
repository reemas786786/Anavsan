import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QueryType } from '../types';
import { IconSearch, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare, IconAdjustments } from '../constants';
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
    { key: 'cost', label: 'Cost (credits)' },
    { key: 'startTime', label: 'Start time' },
    { key: 'actions', label: 'Actions' },
];

const highlightedColumns: string[] = [];

const QueryListView: React.FC<{
    onSelectQuery: (query: QueryListItem) => void;
    onShareQueryClick: (query: QueryListItem) => void;
}> = ({ onSelectQuery, onShareQueryClick }) => {
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const baseFilteredData = useMemo(() => {
        return initialData.filter(q => {
            const searchText = search.toLowerCase();
            if (search && !q.queryText.toLowerCase().includes(searchText) && !q.id.toLowerCase().includes(searchText) && !q.user.toLowerCase().includes(searchText)) return false;
            if (statusFilter.length > 0 && !statusFilter.includes(q.status)) return false;
            if (warehouseFilter.length > 0 && !warehouseFilter.includes(q.warehouse)) return false;
            if (queryTypeFilter.length > 0 && !queryTypeFilter.some(type => q.type.includes(type as QueryType))) return false;
            
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
            } else {
                const queryDate = new Date(q.timestamp);
                const startDate = new Date(dateFilter.start);
                const endDate = new Date(dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (queryDate < startDate || queryDate >= endDate) return false;
            }
            return true;
        });
    }, [search, statusFilter, warehouseFilter, dateFilter, queryTypeFilter]);

    const queryStats = useMemo(() => {
        const total = baseFilteredData.length;
        const success = baseFilteredData.filter(q => q.status === 'Success').length;
        const failed = total - success;
        return { total, success, failed };
    }, [baseFilteredData]);
    
    const sortedData = useMemo(() => {
        return [...baseFilteredData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [baseFilteredData]);
    
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

    const visibleColsData = useMemo(() => allColumns.filter(c => visibleColumns.includes(c.key)), [visibleColumns]);

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
            case 'cost':
                return (
                    <>
                        <span className="font-medium text-text-primary">${q.costUSD.toFixed(2)}</span>
                        <span className="text-text-secondary"> ({q.costCredits.toFixed(2)})</span>
                    </>
                );
            case 'startTime': return formatTimestamp(q.timestamp);
            case 'actions':
                return (
                    <div className="relative inline-block text-left" ref={openMenuId === q.id ? menuRef : null}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === q.id ? null : q.id); }} 
                            title="Actions" 
                            className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                        >
                            <IconDotsVertical className="h-5 w-5"/>
                        </button>
                        {openMenuId === q.id && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
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
                                    <div className="my-1 border-t border-border-color"></div>
                                    <button onClick={(e) => { e.stopPropagation(); onShareQueryClick(q); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                        <IconShare className="h-4 w-4"/> Share Query
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="flex flex-col h-full bg-background p-4 space-y-4">
             <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary mb-2">All queries</h1>
                <div className="flex items-center gap-2">
                    <div
                        className="px-4 py-2 rounded-full text-sm font-medium border bg-surface border-border-color"
                    >
                        Total Queries: <span className="font-bold text-text-strong">{queryStats.total.toLocaleString()}</span>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full text-sm font-medium border bg-surface border-border-color"
                    >
                        Success: <span className="font-bold text-status-success-dark">{queryStats.success.toLocaleString()}</span>
                    </div>
                    <div
                        className="px-4 py-2 rounded-full text-sm font-medium border bg-surface border-border-color"
                    >
                        Failed: <span className="font-bold text-status-error-dark">{queryStats.failed.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-xl shadow-sm flex flex-col flex-grow border border-border-color min-h-0">
                {/* Filter Bar */}
                <div className="p-3 border-b border-border-light flex-shrink-0">
                    <div className="flex items-center gap-4 bg-surface rounded-xl p-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary whitespace-nowrap">Time range:</span>
                            <DateRangeDropdown
                                selectedValue={dateFilter}
                                onChange={setDateFilter}
                            />
                        </div>
                        <div className="h-6 border-l border-border-light"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">Warehouse:</span>
                            <MultiSelectDropdown
                                options={warehousesData.map(w => w.name)}
                                selectedOptions={warehouseFilter}
                                onChange={setWarehouseFilter}
                            />
                        </div>
                        <div className="h-6 border-l border-border-light"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">Status:</span>
                            <MultiSelectDropdown
                                options={['Success', 'Failed']}
                                selectedOptions={statusFilter}
                                onChange={setStatusFilter}
                            />
                        </div>
                        <div className="h-6 border-l border-border-light"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">Query type:</span>
                            <MultiSelectDropdown
                                options={queryTypes}
                                selectedOptions={queryTypeFilter}
                                onChange={setQueryTypeFilter}
                            />
                        </div>

                        <div className="relative ml-auto w-full max-w-xs flex items-center gap-2">
                            <div className="relative flex-grow">
                                <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search input text" className="w-full pl-10 pr-4 py-2 bg-[#f4f4f4] border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary" />
                            </div>
                            <ColumnSelector
                                columns={allColumns}
                                visibleColumns={visibleColumns}
                                onVisibleColumnsChange={setVisibleColumns}
                                defaultColumns={['queryId', 'actions']}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Body Scroll Container */}
                <div className="overflow-y-auto flex-grow min-h-0" role="region" aria-label="Query history table content scrollable region">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg border-b border-border-color">
                            <tr>
                                {visibleColsData.map(col => (
                                    <th 
                                        key={col.key} 
                                        scope="col" 
                                        className={`px-6 py-4 font-semibold ${col.key === 'actions' ? 'text-right' : 'text-left'}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(q => (
                                <tr key={q.id} onClick={() => onSelectQuery(q)} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" data-row-hover>
                                    {visibleColsData.map(col => (
                                        <td 
                                            key={col.key}
                                            className={`px-6 py-3 transition-colors duration-150 whitespace-nowrap ${highlightedColumns.includes(col.key) ? 'bg-surface-hover' : ''}`}
                                        >
                                            <div className={`flex ${col.key === 'actions' ? 'justify-end' : 'justify-start'}`}>
                                                {renderCellContent(q, col.key)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
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