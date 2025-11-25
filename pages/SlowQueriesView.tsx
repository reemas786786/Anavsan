
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QuerySeverity, SlowQueryFilters } from '../types';
import { IconSearch, IconDotsVertical, IconBeaker, IconWand, IconExclamationTriangle } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';

const severityLevels: QuerySeverity[] = ['Low', 'Medium', 'High'];

const SeverityBadge: React.FC<{ severity: QuerySeverity }> = ({ severity }) => {
    const colorClasses: Record<QuerySeverity, string> = {
        Low: 'bg-[#E7F4E8] text-[#056D05]',
        Medium: 'bg-[#FEF3C7] text-[#92400E]',
        High: 'bg-[#FEE2E2] text-[#991B1B]',
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${colorClasses[severity]}`}>
            {severity}
        </span>
    );
};


interface SlowQueriesViewProps {
    onAnalyzeQuery: (query: QueryListItem, source: string) => void;
    onOptimizeQuery: (query: QueryListItem, source: string) => void;
    onSimulateQuery: (query: QueryListItem, source: string) => void;
    onPreviewQuery: (query: QueryListItem) => void;
    filters: SlowQueryFilters;
    setFilters: React.Dispatch<React.SetStateAction<SlowQueryFilters>>;
}

const SlowQueriesView: React.FC<SlowQueriesViewProps> = ({ 
    onAnalyzeQuery, 
    onOptimizeQuery, 
    onSimulateQuery,
    onPreviewQuery,
    filters,
    setFilters
}) => {
    
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpenMenuId(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDurationInSeconds = (duration: string) => {
        const parts = duration.split(':').map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + sizes[i];
    };

    const filteredData = useMemo(() => {
        return initialData.filter(q => {
            if (filters.search && !(q.id.toLowerCase().includes(filters.search.toLowerCase()))) return false;
            if (filters.warehouseFilter.length > 0 && !filters.warehouseFilter.includes(q.warehouse)) return false;
            if (filters.severityFilter.length > 0 && !filters.severityFilter.includes(q.severity)) return false;

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
                endDate.setDate(endDate.getDate() + 1);
                if (queryDate < startDate || queryDate >= endDate) return false;
            }
            return true;
        });
    }, [filters]);

    const queryStats = useMemo(() => {
        const total = initialData.length;
        const failed = initialData.filter(q => q.status === 'Failed').length;
        return {
            total,
            success: total - failed,
            failed,
        }
    }, [initialData]);

    const sortedData = useMemo(() => [...filteredData].sort((a, b) => getDurationInSeconds(b.duration) - getDurationInSeconds(a.duration)), [filteredData]);

    const handleFilterChange = <K extends keyof SlowQueryFilters>(key: K, value: SlowQueryFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-background space-y-4 p-4">
             <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-primary">Slow queries</h1>
                <p className="mt-1 text-text-secondary">Identify and analyze queries that are running longer than expected.</p>
                 <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface'}>Total Queries: <span className="font-bold text-text-strong">{queryStats.total.toLocaleString()}</span></div>
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface'}>Success: <span className="font-bold text-status-success-dark">{queryStats.success.toLocaleString()}</span></div>
                    <div className={'px-4 py-2 rounded-full text-sm font-medium bg-surface'}>Failed: <span className="font-bold text-status-error-dark">{queryStats.failed.toLocaleString()}</span></div>
                </div>
            </div>

            <div className="flex flex-col flex-grow min-h-0">
                {/* Filter Bar */}
                <div className="p-2 mb-4 flex-shrink-0 bg-surface rounded-full shadow-sm flex items-center gap-x-4">
                    <DateRangeDropdown selectedValue={filters.dateFilter} onChange={(value) => handleFilterChange('dateFilter', value)} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Warehouse" options={warehousesData.map(w => w.name)} selectedOptions={filters.warehouseFilter} onChange={(value) => handleFilterChange('warehouseFilter', value)} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown 
                        label="Severity" 
                        options={severityLevels} 
                        selectedOptions={filters.severityFilter} 
                        onChange={(value) => handleFilterChange('severityFilter', value)} 
                    />
                    <div className="relative flex-grow">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Search input text..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>

                {/* Cards List */}
                <div className="overflow-y-auto flex-grow min-h-0 pr-2">
                     <div className="space-y-2">
                        {sortedData.map(q => (
                            <div key={q.id} className="bg-surface p-3 rounded-xl grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,auto] items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPreviewQuery(q)}>
                                <div>
                                    <div className="text-xs text-text-secondary">Query ID</div>
                                    <div className="text-sm font-semibold text-text-primary">{q.id.substring(7, 13).toUpperCase()}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary">Severity</div>
                                    <div className="text-sm font-semibold text-text-primary mt-1"><SeverityBadge severity={q.severity} /></div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary">Duration</div>
                                    <div className="text-sm font-semibold text-text-primary">{getDurationInSeconds(q.duration)}s</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary">Bytes Scanned</div>
                                    <div className="text-sm font-semibold text-text-primary">{formatBytes(q.bytesScanned)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary">Bytes Written</div>
                                    <div className="text-sm font-semibold text-text-primary">{formatBytes(q.bytesWritten)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-secondary">Start Date</div>
                                    <div className="text-sm font-semibold text-text-primary">{new Date(q.timestamp).toISOString().split('T')[0]}</div>
                                </div>
                                <div className="relative" ref={openMenuId === q.id ? menuRef : null}>
                                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === q.id ? null : q.id); }} title="Actions" className="p-2 -m-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                        <IconDotsVertical className="h-5 w-5"/>
                                    </button>
                                     {openMenuId === q.id && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                            <div className="py-1" role="menu">
                                                <button onClick={() => { onPreviewQuery(q); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Query Preview</button>
                                                <button onClick={() => { onAnalyzeQuery(q, 'Slow queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Analyze</button>
                                                <button onClick={() => { onOptimizeQuery(q, 'Slow queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Optimize</button>
                                                <button onClick={() => { onSimulateQuery(q, 'Slow queries'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Simulate</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlowQueriesView;
