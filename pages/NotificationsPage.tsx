

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Notification, ActivityLog, User, NotificationType, NotificationSeverity, ActivityLogStatus, Account, Warehouse, QueryListItem } from '../types';
import { queryListData, warehousesData } from '../data/dummyData';
import { IconBell, IconFileText, IconDelete, IconBolt, IconClock, IconExclamationTriangle, IconList, IconChevronDown, IconChevronLeft, IconChevronRight, IconSearch, IconArrowUp, IconArrowDown, IconInfo, IconWand } from '../constants';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import Pagination from '../components/Pagination';
import SidePanel from '../components/SidePanel';

// --- HELPER COMPONENTS ---

const typeToColorMap: Record<NotificationType, { bg: string; text: string }> = {
    performance: { bg: 'bg-status-warning-light', text: 'text-status-warning' },
    latency: { bg: 'bg-status-warning-light', text: 'text-status-warning' },
    storage: { bg: 'bg-status-info-light', text: 'text-status-info' },
    query: { bg: 'bg-status-info-light', text: 'text-status-info' },
    load: { bg: 'bg-status-error-light', text: 'text-status-error' },
    TABLE_SCAN: { bg: 'bg-status-warning-light', text: 'text-status-warning-dark' },
    JOIN_INEFFICIENCY: { bg: 'bg-status-warning-light', text: 'text-status-warning-dark' },
    WAREHOUSE_IDLE: { bg: 'bg-status-info-light', text: 'text-status-info-dark' },
    COST_SPIKE: { bg: 'bg-status-error-light', text: 'text-status-error-dark' },
};

const NotificationIcon: React.FC<{ type: NotificationType, className?: string }> = ({ type, className }) => {
    switch(type) {
        case 'performance':
        case 'TABLE_SCAN':
        case 'JOIN_INEFFICIENCY':
        case 'WAREHOUSE_IDLE':
            return <IconBell className={className} />;
        case 'latency':
            return <IconExclamationTriangle className={className} />;
        case 'storage':
            return <IconList className={className} />;
        case 'query':
            return <IconClock className={className} />;
        case 'load':
        case 'COST_SPIKE':
            return <IconBolt className={className} />;
        default:
            return <IconBell className={className} />;
    }
};

const SeverityBadge: React.FC<{ severity: NotificationSeverity }> = ({ severity }) => {
    const colorClasses: Record<NotificationSeverity, string> = {
        Info: 'bg-status-info-light text-status-info-dark',
        Warning: 'bg-status-warning-light text-status-warning-dark',
        Critical: 'bg-status-error-light text-status-error-dark',
    };
    return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[severity]}`}>{severity}</span>;
};

const ActivityStatusBadge: React.FC<{ status: ActivityLogStatus }> = ({ status }) => {
    const colorClasses: Record<ActivityLogStatus, string> = {
        Success: 'bg-status-success-light text-status-success-dark',
        Failed: 'bg-status-error-light text-status-error-dark',
        'In Progress': 'bg-status-paused-light text-status-paused-dark',
    };
    const dotClasses: Record<ActivityLogStatus, string> = {
        Success: 'bg-status-success',
        Failed: 'bg-status-error',
        'In Progress': 'bg-status-paused',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

// --- INSIGHT DETAIL PANEL ---

interface InsightDetailPanelProps {
    insight: Notification;
    accounts: Account[];
    onClose: () => void;
    onNavigateToWarehouse: (account: Account, warehouse: Warehouse) => void;
    onNavigateToQuery: (account: Account, query: QueryListItem) => void;
    onMarkAsRead: (id: string) => void;
}

const InsightDetailPanel: React.FC<InsightDetailPanelProps> = ({ insight, accounts, onClose, onNavigateToWarehouse, onNavigateToQuery, onMarkAsRead }) => {
    
    useEffect(() => {
        if (!insight.isRead) {
            onMarkAsRead(insight.id);
        }
    }, [insight, onMarkAsRead]);

    const warehouse = useMemo(() => warehousesData.find(w => w.name === insight.warehouseName), [insight.warehouseName]);
    const query = useMemo(() => queryListData.find(q => q.id === insight.queryId), [insight.queryId]);
    // For now, assume all notifications belong to the first account for navigation purposes.
    const account = accounts.length > 0 ? accounts[0] : null;

    const handleWarehouseClick = () => {
        if (warehouse && account) {
            onNavigateToWarehouse(account, warehouse);
            onClose();
        }
    };
    
    const handleQueryClick = () => {
        if (query && account) {
            onNavigateToQuery(account, query);
            onClose();
        }
    };

    const formattedTimestamp = new Date(insight.timestamp).toLocaleString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 space-y-4 flex-grow">
                <div className="pb-4 border-b border-border-color">
                    <h3 className="text-lg font-bold text-text-strong">{insight.insightTopic.replace(/_/g, ' ')} Detected</h3>
                    <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                        <span>{formattedTimestamp}</span>
                        <SeverityBadge severity={insight.severity} />
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    {warehouse && (
                        <div>
                            <label className="font-semibold text-text-secondary">Warehouse</label>
                            <button onClick={handleWarehouseClick} className="block text-link hover:underline mt-1">{insight.warehouseName}</button>
                        </div>
                    )}
                    {query && (
                         <div>
                            <label className="font-semibold text-text-secondary">Query ID</label>
                            <button onClick={handleQueryClick} className="block text-link hover:underline mt-1 font-mono">{insight.queryId?.substring(7, 13).toUpperCase()}</button>
                        </div>
                    )}
                    <div>
                        <label className="font-semibold text-text-secondary">Message</label>
                        <p className="text-text-primary mt-1">{insight.message}</p>
                    </div>
                     <div>
                        <label className="font-semibold text-text-secondary">Suggestion</label>
                        <p className="text-text-primary mt-1">{insight.suggestions}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-background flex justify-end items-center gap-3 flex-shrink-0">
                <button onClick={() => onMarkAsRead(insight.id)} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Mark as Read</button>
            </div>
        </div>
    );
};


// --- TAB VIEWS ---

interface AlertsViewProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onClearNotification: (id: string) => void;
    // Props for side panel navigation
    accounts: Account[];
    onNavigateToWarehouse: (account: Account, warehouse: Warehouse) => void;
    onNavigateToQuery: (account: Account, query: QueryListItem) => void;
    onMarkNotificationAsRead: (id: string) => void;
}

const AlertsView: React.FC<AlertsViewProps> = (props) => {
    const { notifications } = props;
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [readStatusFilter, setReadStatusFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedInsight, setSelectedInsight] = useState<Notification | null>(null);

    const filterOptions = useMemo(() => {
        // FIX: Explicitly typed the 't' parameter as a string to resolve an inference issue.
        const types = [...new Set(notifications.map(n => n.insightTopic))].map((t: string) => t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()));
        return { types };
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            if (readStatusFilter.length > 0) {
                if (readStatusFilter[0] === 'Read' && !n.isRead) return false;
                if (readStatusFilter[0] === 'Unread' && n.isRead) return false;
            }

            if (search && !(
                n.message.toLowerCase().includes(search.toLowerCase()) || 
                n.warehouseName.toLowerCase().includes(search.toLowerCase()) || 
                n.queryId?.toLowerCase().includes(search.toLowerCase())
            )) return false;
            
            if (typeFilter.length > 0 && !typeFilter.includes(n.insightTopic.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()))) return false;
            
            if (typeof dateFilter === 'string') {
                if (dateFilter !== 'All') {
                    const queryDate = new Date(n.timestamp);
                    const now = new Date();
                    let days = 0;
                    if (dateFilter === '7d') days = 7;
                    if (dateFilter === '1d') days = 1;
                    if (dateFilter === '30d') days = 30;
                    if (days > 0 && now.getTime() - queryDate.getTime() > days * 24 * 60 * 60 * 1000) return false;
                }
            } else {
                const queryDate = new Date(n.timestamp);
                const startDate = new Date(dateFilter.start);
                const endDate = new Date(dateFilter.end);
                endDate.setDate(endDate.getDate() + 1);
                if (queryDate < startDate || queryDate >= endDate) return false;
            }
            return true;
        });
    }, [notifications, search, typeFilter, dateFilter, readStatusFilter]);
    
    const sortedNotifications = useMemo(() => {
        return [...filteredNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [filteredNotifications]);

    const paginatedNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);
    
    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Alerts</h1>
                    <p className="mt-1 text-text-secondary">Review and take action on AI-generated insights and performance alerts.</p>
                </div>
            </div>
            <div className="bg-surface rounded-xl flex flex-col min-h-0">
                <div className="p-4 flex-shrink-0 flex items-center gap-x-4 border-b border-border-color">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                    <MultiSelectDropdown label="Insight Type" options={filterOptions.types} selectedOptions={typeFilter} onChange={setTypeFilter} selectionMode="single" />
                    <MultiSelectDropdown label="Status" options={['Unread', 'Read']} selectedOptions={readStatusFilter} onChange={setReadStatusFilter} selectionMode="single" />
                    <div className="relative flex-grow ml-auto">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages or warehouse/query..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                    <button onClick={props.onMarkAllAsRead} className="ml-4 text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-link whitespace-nowrap">
                        Mark all as read
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Insight Type</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Message</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left">Timestamp</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary bg-surface">
                             {paginatedNotifications.map(n => (
                                <tr key={n.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                            <span className={`capitalize font-medium ${!n.isRead ? 'text-text-primary' : ''}`}>{n.insightTopic.replace(/_/g, ' ').toLowerCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className={`${!n.isRead ? 'text-text-primary' : ''}`}>{n.message}</div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">{formatTimestamp(n.timestamp)}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button onClick={() => setSelectedInsight(n)} className="p-2 -m-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10" title="View Details">
                                            <IconInfo className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {sortedNotifications.length > itemsPerPage && (
                    <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedNotifications.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>
            {selectedInsight && (
                <SidePanel isOpen={!!selectedInsight} onClose={() => setSelectedInsight(null)} title="Insight Details">
                    <InsightDetailPanel 
                        insight={selectedInsight}
                        onClose={() => setSelectedInsight(null)}
                        accounts={props.accounts}
                        onNavigateToWarehouse={props.onNavigateToWarehouse}
                        onNavigateToQuery={props.onNavigateToQuery}
                        onMarkAsRead={props.onMarkNotificationAsRead}
                    />
                </SidePanel>
            )}
        </div>
    );
};

interface ActivityLogsViewProps {
    activityLogs: ActivityLog[];
    users: User[];
}

const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({ activityLogs, users }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [userFilter, setUserFilter] = useState<string[]>([]);
    const [actionFilter, setActionFilter] = useState<string[]>([]);
    const [moduleFilter, setModuleFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ActivityLog; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending' });

    const filterOptions = useMemo(() => {
        const userNames = [...new Set(activityLogs.map(log => log.user))];
        const actionTypes = [...new Set(activityLogs.map(log => log.action))];
        const modules = [...new Set(activityLogs.map(log => log.module).filter(Boolean))] as string[];
        const statuses = [...new Set(activityLogs.map(log => log.status).filter(Boolean))] as string[];
        return { userNames, actionTypes, modules, statuses };
    }, [activityLogs]);

    const filteredLogs = useMemo(() => {
        return activityLogs.filter(log => {
            const searchText = `${log.user} ${log.action} ${log.details || ''} ${log.module || ''} ${log.status || ''}`.toLowerCase();
            if (search && !searchText.includes(search.toLowerCase())) return false;
            if (userFilter.length > 0 && !userFilter.includes(log.user)) return false;
            if (actionFilter.length > 0 && !actionFilter.includes(log.action)) return false;
            if (moduleFilter.length > 0 && log.module && !moduleFilter.includes(log.module)) return false;
            if (statusFilter.length > 0 && log.status && !statusFilter.includes(log.status)) return false;
            // Date filter logic would go here
            return true;
        });
    }, [activityLogs, search, userFilter, actionFilter, dateFilter, moduleFilter, statusFilter]);

    const sortedLogs = useMemo(() => {
        let sortableItems = [...filteredLogs];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredLogs, sortConfig]);

    const paginatedLogs = sortedLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

    const requestSort = (key: keyof ActivityLog) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof ActivityLog }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Activity Log</h1>
                <p className="mt-1 text-text-secondary">Track user and system actions across your Anavsan workspace.</p>
            </div>
            <div className="bg-surface rounded-xl flex flex-col min-h-0">
                <div className="p-2 flex-shrink-0 flex items-center gap-x-2 border-b border-border-color">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="User" options={filterOptions.userNames} selectedOptions={userFilter} onChange={setUserFilter} selectionMode="single" />
                    <MultiSelectDropdown label="Action" options={filterOptions.actionTypes} selectedOptions={actionFilter} onChange={setActionFilter} selectionMode="single" />
                    <MultiSelectDropdown label="Module" options={filterOptions.modules} selectedOptions={moduleFilter} onChange={setModuleFilter} selectionMode="single" />
                    <MultiSelectDropdown label="Status" options={filterOptions.statuses} selectedOptions={statusFilter} onChange={setStatusFilter} selectionMode="single" />
                    <div className="relative flex-grow ml-auto">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('user')} className="group flex items-center">User <SortIcon columnKey="user" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('action')} className="group flex items-center">Action <SortIcon columnKey="action" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('module')} className="group flex items-center">Module <SortIcon columnKey="module" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('status')} className="group flex items-center">Status <SortIcon columnKey="status" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('timestamp')} className="group flex items-center">Timestamp <SortIcon columnKey="timestamp" /></button></th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary bg-surface">
                            {paginatedLogs.map(log => (
                                <tr key={log.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover">
                                    <td className="px-6 py-3 font-medium text-text-primary">
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-3 text-text-primary">
                                        {log.action} {log.details && <span>{log.details}</span>}
                                    </td>
                                    <td className="px-6 py-3">{log.module || 'N/A'}</td>
                                    <td className="px-6 py-3">{log.status ? <ActivityStatusBadge status={log.status} /> : 'N/A'}</td>
                                    <td className="px-6 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedLogs.length > itemsPerPage && (
                    <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedLogs.length}
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


// --- MAIN COMPONENT ---

interface NotificationsPageProps {
    notifications: Notification[];
    activityLogs: ActivityLog[];
    onMarkAllAsRead: () => void;
    onClearNotification: (id: string) => void;
    users: User[];
    onBackToOverview: () => void;
    accounts: Account[];
    onNavigateToWarehouse: (account: Account, warehouse: Warehouse) => void;
    onNavigateToQuery: (account: Account, query: QueryListItem) => void;
    onMarkNotificationAsRead: (id: string) => void;
}

const MobileNav: React.FC<{ activeTab: string; onTabChange: (tab: any) => void; navItems: any[]; }> = ({ activeTab, onTabChange, navItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={navRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg bg-surface-nested border border-border-color">
                <span className="font-semibold text-text-primary">{activeTab}</span>
                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-surface rounded-lg shadow-lg mt-1 z-20 border border-border-color">
                    <ul className="py-1">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <button onClick={() => { onTabChange(item.name); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-medium ${activeTab === item.name ? 'text-primary bg-primary/10' : 'text-text-strong'}`}>
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


const NotificationsPage: React.FC<NotificationsPageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<'Alerts' | 'Activity Log'>('Alerts');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isFlyoutOpen, setIsFlyoutOpen] = useState<string | null>(null);
    const flyoutTimeoutRef = useRef<number | null>(null);

    const handleFlyoutEnter = (name: string) => {
        if(flyoutTimeoutRef.current) clearTimeout(flyoutTimeoutRef.current);
        setIsFlyoutOpen(name);
    }
    const handleFlyoutLeave = () => {
        flyoutTimeoutRef.current = window.setTimeout(() => setIsFlyoutOpen(null), 200);
    }

    const navItems = [
        { name: 'Alerts', icon: IconBell },
        { name: 'Activity Log', icon: IconFileText },
    ];

    return (
        <div className="flex h-full bg-background">
            <aside className={`hidden md:flex bg-surface flex-shrink-0 flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <nav className={`flex-grow p-4 ${isSidebarExpanded ? 'overflow-y-auto' : ''}`}>
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <li 
                                key={item.name}
                                onMouseEnter={() => !isSidebarExpanded && handleFlyoutEnter(item.name)}
                                onMouseLeave={() => !isSidebarExpanded && handleFlyoutLeave()}
                                className="relative"
                            >
                                <button
                                    onClick={() => setActiveTab(item.name as any)}
                                    title={!isSidebarExpanded ? item.name : ''}
                                    className={`w-full flex items-center text-left px-3 py-2 rounded-full text-sm transition-colors group relative ${
                                        activeTab === item.name ? 'bg-[#F0EAFB] text-primary font-semibold' : 'text-text-strong font-medium hover:bg-surface-hover'
                                    } ${isSidebarExpanded ? '' : 'justify-center'}`}
                                >
                                    <item.icon className={`h-5 w-5 shrink-0 ${activeTab === item.name ? 'text-primary' : 'text-text-strong'}`} />
                                    {isSidebarExpanded && <span className="ml-3">{item.name}</span>}
                                </button>
                                 {!isSidebarExpanded && isFlyoutOpen === item.name && (
                                    <div 
                                        className="absolute left-full ml-2 top-0 w-auto min-w-max bg-surface rounded-lg shadow-lg p-2 z-30 border border-border-color"
                                        onMouseEnter={() => handleFlyoutEnter(item.name)}
                                        onMouseLeave={handleFlyoutLeave}
                                    >
                                        <div className="px-2 py-1 text-sm font-semibold text-text-strong whitespace-nowrap">
                                            {item.name}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-2 mt-auto">
                    <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                    <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                        <button
                            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            className="p-1.5 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isSidebarExpanded ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> : <IconChevronRight className="h-5 w-5 text-text-secondary" />}
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <div className="md:hidden p-4 border-b border-border-color bg-surface sticky top-0 z-10">
                    <MobileNav activeTab={activeTab} onTabChange={setActiveTab} navItems={navItems} />
                </div>
                <div className="p-4 md:p-6">
                    {activeTab === 'Alerts' && <AlertsView {...props} />}
                    {activeTab === 'Activity Log' && <ActivityLogsView activityLogs={props.activityLogs} users={props.users} />}
                </div>
            </main>
        </div>
    );
};

export default NotificationsPage;