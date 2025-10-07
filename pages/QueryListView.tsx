import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QueryType } from '../types';
import { IconSearch, IconChevronLeft, IconChevronRight, IconChevronDown, IconDotsVertical, IconShare } from '../constants';
import Modal from '../components/Modal';

const MetricCard: React.FC<{ title: string; value: string; valueColor?: string }> = ({ title, value, valueColor = 'text-text-primary' }) => (
    <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
        <h4 className="text-sm font-medium text-text-secondary">{title}</h4>
        <p className={`text-2xl font-bold mt-2 ${valueColor}`}>{value}</p>
    </div>
);

interface QueryListViewProps {
    onShareQuery: (query: QueryListItem) => void;
}

const QueryListView: React.FC<QueryListViewProps> = ({ onShareQuery }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('All');
    const [warehouseFilter, setWarehouseFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilters, setTypeFilters] = useState<Set<QueryType>>(new Set());
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{ key: keyof QueryListItem; direction: 'ascending' | 'descending' }>({ key: 'timestamp', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [previewQuery, setPreviewQuery] = useState<QueryListItem | null>(null);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const typeFilterRef = useRef<HTMLDivElement>(null);

    const totalQueries = initialData.length;
    const successQueries = useMemo(() => initialData.filter(q => q.status === 'Success').length, []);
    const failedQueries = totalQueries - successQueries;
    const queryTypes: QueryType[] = ['SELECT', 'WHERE', 'JOIN', 'Aggregation'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) setIsExportMenuOpen(false);
            if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) setIsTypeFilterOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTypeFilterChange = (type: QueryType) => {
        setTypeFilters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) newSet.delete(type);
            else newSet.add(type);
            return newSet;
        });
    };

    const requestSort = (key: keyof QueryListItem) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = useMemo(() => {
        return initialData.filter(q => {
            if (search && !q.id.toLowerCase().includes(search.toLowerCase())) return false;
            if (statusFilter !== 'All' && q.status !== statusFilter) return false;
            if (warehouseFilter !== 'All' && q.warehouse !== warehouseFilter) return false;
            if (typeFilters.size > 0 && ![...typeFilters].every(type => q.type.includes(type))) return false;
            
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
    }, [search, statusFilter, warehouseFilter, typeFilters, dateFilter]);
    
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const paginatedData = useMemo(() => sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage), [sortedData, currentPage, rowsPerPage]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedRows(new Set(paginatedData.map(q => q.id)));
        else setSelectedRows(new Set());
    };
    
    const handleSelectRow = (id: string) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleExport = (format: 'csv' | 'json') => {
        const dataToExport = JSON.stringify(sortedData, null, 2);
        if (format === 'json') {
             const blob = new Blob([dataToExport], { type: 'application/json' });
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = 'queries.json';
             a.click();
             URL.revokeObjectURL(url);
        } else { // CSV
            const header = Object.keys(sortedData[0]).join(',');
            const rows = sortedData.map(row => Object.values(row).map(val => Array.isArray(val) ? `"${val.join(';')}"` : `"${String(val).replace(/"/g, '""')}"`).join(','));
            const csv = [header, ...rows].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'queries.csv';
            a.click();
            URL.revokeObjectURL(url);
        }
        setIsExportMenuOpen(false);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">All Queries</h1>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                <MetricCard title="Total queries" value={totalQueries.toLocaleString()} />
                <MetricCard title="Success" value={successQueries.toLocaleString()} valueColor="text-status-success" />
                <MetricCard title="Failed" value={failedQueries.toLocaleString()} valueColor="text-status-error" />
            </div>
            
            <div className="bg-surface rounded-3xl flex-1 flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-border-color space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-grow max-w-md">
                            <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input id="search-query-id" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Query ID..." className="w-full pl-10 pr-4 py-2 bg-input-bg border-border-color rounded-full text-sm"/>
                        </div>
                        <div className="relative" ref={exportMenuRef}>
                            <button onClick={() => setIsExportMenuOpen(!isExportMenuOpen)} className="px-4 py-2 text-sm font-semibold text-text-primary bg-background border border-border-color rounded-full flex items-center gap-2">
                                Export <IconChevronDown className="h-4 w-4" />
                            </button>
                            {isExportMenuOpen && (
                                 <div className="origin-top-right absolute right-0 top-full mt-2 w-32 rounded-lg bg-surface border border-border-color z-10">
                                    <div className="py-1" role="menu">
                                        <button onClick={() => handleExport('csv')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">CSV</button>
                                        <button onClick={() => handleExport('json')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">JSON</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1 bg-input-bg p-1 rounded-full">
                            {['All', '1d', '7d', '30d'].map(d => <button key={d} onClick={() => setDateFilter(d)} className={`px-3 py-1 text-sm rounded-full ${dateFilter === d ? 'bg-surface shadow-sm text-text-primary font-semibold' : 'text-text-secondary'}`}>{d}</button>)}
                        </div>

                        <div className="relative">
                             <select id="warehouse-filter" value={warehouseFilter} onChange={e => setWarehouseFilter(e.target.value)} className="w-full bg-input-bg border-border-color rounded-full text-sm px-3 py-2 appearance-none pr-8">
                                <option value="All">All Warehouses</option>
                                {warehousesData.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                            </select>
                             <IconChevronDown className="h-4 w-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        
                        <div className="relative">
                             <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-input-bg border-border-color rounded-full text-sm px-3 py-2 appearance-none pr-8">
                                <option value="All">All Status</option>
                                <option value="Success">Success</option>
                                <option value="Failed">Failed</option>
                            </select>
                            <IconChevronDown className="h-4 w-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        
                        <div className="relative" ref={typeFilterRef}>
                            <button onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)} className="px-3 py-2 bg-input-bg border border-border-color rounded-full text-sm flex items-center gap-2">
                                <span>{typeFilters.size > 0 ? `${typeFilters.size} Type(s)` : 'All Types'}</span>
                                <IconChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isTypeFilterOpen && (
                                <div className="absolute top-full mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border-color z-10 p-2">
                                    <div className="space-y-1">
                                        {queryTypes.map(type => (
                                            <label key={type} className="flex items-center p-2 rounded-md hover:bg-surface-hover cursor-pointer">
                                                <input type="checkbox" checked={typeFilters.has(type)} onChange={() => handleTypeFilterChange(type)} className="h-4 w-4 rounded text-primary border-border-color focus:ring-primary" />
                                                <span className="ml-2 text-sm text-text-primary">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-background text-xs text-text-secondary uppercase font-medium sticky top-0">
                            <tr>
                                <th scope="col" className="p-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedRows.size === paginatedData.length && paginatedData.length > 0} className="h-4 w-4 rounded"/></th>
                                <th scope="col" className="px-3 py-3"><button onClick={() => requestSort('id')} className="group flex items-center">Query ID</button></th>
                                <th scope="col" className="px-3 py-3"><button onClick={() => requestSort('costUSD')} className="group flex items-center">Cost</button></th>
                                <th scope="col" className="px-3 py-3"><button onClick={() => requestSort('duration')} className="group flex items-center">Duration</button></th>
                                <th scope="col" className="px-3 py-3"><button onClick={() => requestSort('warehouse')} className="group flex items-center">Warehouse</button></th>
                                <th scope="col" className="px-3 py-3"><button onClick={() => requestSort('estSavingsUSD')} className="group flex items-center">Est. Savings</button></th>
                                <th scope="col" className="px-3 py-3 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(q => (
                                <tr key={q.id} className={`border-t border-border-color hover:bg-surface-hover ${q.status === 'Success' ? 'border-l-4 border-status-success' : 'border-l-4 border-status-error'}`}>
                                    <td className="p-4"><input type="checkbox" checked={selectedRows.has(q.id)} onChange={() => handleSelectRow(q.id)} className="h-4 w-4 rounded"/></td>
                                    <td className="px-3 py-4 font-mono text-xs text-text-primary"><button onClick={() => setPreviewQuery(q)} className="hover:underline">{q.id.substring(0, 8)}...</button></td>
                                    <td className="px-3 py-4"><span className="font-semibold text-text-primary">${q.costUSD.toFixed(2)}</span><br/>{q.costCredits.toFixed(2)} cr</td>
                                    <td className="px-3 py-4">{q.duration}</td>
                                    <td className="px-3 py-4">{q.warehouse}</td>
                                    <td className="px-3 py-4 font-semibold text-status-success">${q.estSavingsUSD.toFixed(2)} ({q.estSavingsPercent}%)</td>
                                    <td className="px-3 py-4 text-right">
                                        <div className="relative" ref={openMenuId === q.id ? menuRef : null}>
                                            <button onClick={() => setOpenMenuId(q.id)}><IconDotsVertical className="h-5 w-5"/></button>
                                            {openMenuId === q.id && (
                                                 <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface border border-border-color z-10">
                                                    <div className="py-1" role="menu">
                                                        <button onClick={() => {setPreviewQuery(q); setOpenMenuId(null)}} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">Query Preview</button>
                                                        <button onClick={() => { onShareQuery(q); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">Share for Optimization</button>
                                                        <button className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">Open in Analyzer</button>
                                                        <button className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">Open in Optimizer</button>
                                                        <button className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover">Open in Simulator</button>
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
                
                <div className="p-4 flex justify-between items-center text-sm border-t border-border-color">
                    <div>
                         <select value={rowsPerPage} onChange={e => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1)}} className="bg-input-bg border-border-color rounded-full text-sm px-3 py-1.5">
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                         </select>
                         <span className="ml-2">items per page</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>{`1–${paginatedData.length} of ${sortedData.length} items`}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1 rounded-full disabled:opacity-50 hover:bg-surface-hover"><IconChevronLeft className="h-5 w-5"/></button>
                            <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(sortedData.length/rowsPerPage), p+1))} disabled={currentPage * rowsPerPage >= sortedData.length} className="p-1 rounded-full disabled:opacity-50 hover:bg-surface-hover"><IconChevronRight className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>
            </div>

            {previewQuery && (
                <Modal isOpen={!!previewQuery} onClose={() => setPreviewQuery(null)} title="Query preview">
                    <div className="p-6">
                        <div className="text-sm space-y-2 mb-4">
                            <p><strong>Query ID:</strong> <span className="font-mono text-xs">{previewQuery.id}</span></p>
                            <p><strong>Executed by:</strong> {previewQuery.user}</p>
                            <p><strong>Timestamp:</strong> {new Date(previewQuery.timestamp).toLocaleString()}</p>
                        </div>
                        <pre className="bg-input-bg p-4 rounded-lg border border-border-color text-sm text-text-primary overflow-auto max-h-96">
                            <code>{previewQuery.queryText}</code>
                        </pre>
                    </div>
                </Modal>
            )}
        </div>
    )
};

export default QueryListView;