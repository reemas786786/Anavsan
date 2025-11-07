


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

const QueryListView: React.FC<QueryListViewProps> = ({
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = <K extends keyof QueryListFilters>(key: K, value: QueryListFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value, currentPage: 1 }));
    };

    const filteredAndSortedData = useMemo(() => {
        // This would typically be a server-side operation, but we'll filter client-side for this example.
        let data = [...initialData];

        // Filtering logic here...

        if (sortConfig) {
            data.sort((a, b) => {
                const key = sortConfig.key as keyof QueryListItem;
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return data;
    }, [initialData, filters, sortConfig]);

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
            </div>
            
            <div className="bg-surface rounded-xl flex flex-col flex-grow min-h-0">
                <div className="p-2 mb-2 flex-shrink-0 flex items-center gap-x-2 border-b border-border-color">
                    {/* Filter components would go here */}
                    <div className="relative flex-grow">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" placeholder="Search queries..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                    <ColumnSelector columns={allColumns} visibleColumns={filters.visibleColumns} onVisibleColumnsChange={(cols) => handleFilterChange('visibleColumns', cols)} defaultColumns={['queryId', 'actions']} />
                </div>
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                {allColumns.filter(c => filters.visibleColumns.includes(c.key)).map(col => (
                                    <th key={col.key} scope="col" className="px-6 py-4 font-semibold text-left">
                                        <button onClick={() => requestSort(col.key)} className="group flex items-center">{col.label} <SortIcon columnKey={col.key} /></button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary bg-surface">
                            {paginatedData.map(query => (
                                <tr key={query.id} onClick={() => onSelectQuery(query)} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover cursor-pointer">
                                    {filters.visibleColumns.includes('queryId') && <td className="px-6 py-3"><QueryIdCell query={query} onSelectQuery={onSelectQuery} /></td>}
                                    {filters.visibleColumns.includes('user') && <td className="px-6 py-3 text-text-primary">{query.user}</td>}
                                    {filters.visibleColumns.includes('warehouse') && <td className="px-6 py-3">{query.warehouse}</td>}
                                    {filters.visibleColumns.includes('duration') && <td className="px-6 py-3">{query.duration}</td>}
                                    {filters.visibleColumns.includes('bytesScanned') && <td className="px-6 py-3">{formatBytes(query.bytesScanned)}</td>}
                                    {filters.visibleColumns.includes('cost') && <td className="px-6 py-3">${query.costUSD.toFixed(2)}</td>}
                                    {filters.visibleColumns.includes('startTime') && <td className="px-6 py-3">{formatTimestamp(query.timestamp)}</td>}
                                    {filters.visibleColumns.includes('actions') && (
                                        <td className="px-6 py-3 text-right">
                                            <div className="relative inline-block text-left" ref={openMenuId === query.id ? menuRef : null}>
                                                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === query.id ? null : query.id); }} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                    <IconDotsVertical className="h-5 w-5"/>
                                                </button>
                                                {openMenuId === query.id && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                        <div className="py-1" role="menu">
                                                            <button onClick={() => { onAnalyzeQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Analyze</button>
                                                            <button onClick={() => { onOptimizeQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Optimize</button>
                                                            <button onClick={() => { onSimulateQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Simulate</button>
                                                            <div className="my-1 border-t border-border-color"></div>
                                                            <button onClick={() => { onShareQueryClick(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconShare className="h-4 w-4"/> Assign / Share</button>
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

export default QueryListView;