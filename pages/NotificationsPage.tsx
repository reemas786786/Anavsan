import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Notification, ActivityLog, User, NotificationType, NotificationSeverity, ActivityLogStatus } from '../types';
import { IconBell, IconFileText, IconDelete, IconBolt, IconClock, IconExclamationTriangle, IconList, IconChevronDown, IconChevronLeft, IconChevronRight, IconSearch, IconArrowUp, IconArrowDown } from '../constants';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import Pagination from '../components/Pagination';

// --- HELPER COMPONENTS ---

const getSuggestionForNotification = (notification: Notification): { text: string } => {
    switch (notification.type) {
        case 'performance':
            if (notification.title.includes('degraded')) {
                return { text: 'Analyze slow queries' };
            }
            if (notification.title.includes('queueing')) {
                return { text: 'Review warehouse load' };
            }
            return { text: 'View performance dashboard' };
        case 'latency':
            return { text: 'Investigate database load' };
        case 'storage':
            if (notification.title.includes('capacity')) {
                return { text: 'Review storage usage' };
            }
            return { text: 'View storage cost breakdown' };
        case 'query':
            return { text: 'Optimize slow query' };
        case 'load':
            if (notification.title.includes('high load')) {
                return { text: 'Check warehouse utilization' };
            }
            return { text: 'Scale up warehouse' };
        default:
            return { text: 'View details' };
    }
};

const typeToColorMap: Record<NotificationType, { bg: string; text: string }> = {
    performance: { bg: 'bg-status-warning-light', text: 'text-status-warning' },
    latency: { bg: 'bg-status-warning-light', text: 'text-status-warning' },
    storage: { bg: 'bg-status-info-light', text: 'text-status-info' },
    query: { bg: 'bg-status-info-light', text: 'text-status-info' },
    load: { bg: 'bg-status-error-light', text: 'text-status-error' },
};

const NotificationIcon: React.FC<{ type: NotificationType, className?: string }> = ({ type, className }) => {
    switch(type) {
        case 'performance': return <IconBell className={className} />;
        case 'latency': return <IconExclamationTriangle className={className} />;
        case 'storage': return <IconList className={className} />;
        case 'query': return <IconClock className={className} />;
        case 'load': return <IconBolt className={className} />;
        default: return <IconBell className={className} />;
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

// --- TAB VIEWS ---

interface AlertsViewProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onClearNotification: (id: string) => void;
}

const AlertsView: React.FC<AlertsViewProps> = ({ notifications, onMarkAllAsRead, onClearNotification }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [sourceFilter, setSourceFilter] = useState<string[]>([]);
    const [severityFilter, setSeverityFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Notification; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending' });

    const filterOptions = useMemo(() => {
        const types = [...new Set(notifications.map(n => n.type))];
        const sources = [...new Set(notifications.map(n => n.source))];
        const severities = ['Info', 'Warning', 'Critical'];
        return { types, sources, severities };
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
            if (typeFilter.length > 0 && !typeFilter.includes(n.type)) return false;
            if (sourceFilter.length > 0 && !sourceFilter.includes(n.source)) return false;
            if (severityFilter.length > 0 && !severityFilter.includes(n.severity)) return false;
            // Date filter logic here...
            return true;
        });
    }, [notifications, search, typeFilter, sourceFilter, severityFilter, dateFilter]);
    
    const sortedNotifications = useMemo(() => {
        let sortableItems = [...filteredNotifications];
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
    }, [filteredNotifications, sortConfig]);

    const paginatedNotifications = sortedNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);

    const requestSort = (key: keyof Notification) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof Notification }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="w-4 h-4 ml-1" />;
    };
    
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-text-strong">Alerts</h2>
                <p className="mt-1 text-text-secondary">Monitor critical alerts and performance notifications from all your sources.</p>
            </div>
            <div className="bg-surface rounded-xl flex flex-col min-h-0">
                <div className="p-2 flex-shrink-0 flex items-center gap-x-2 border-b border-border-color">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Alert Type" options={filterOptions.types} selectedOptions={typeFilter} onChange={setTypeFilter} selectionMode="single" />
                    <MultiSelectDropdown label="Source" options={filterOptions.sources} selectedOptions={sourceFilter} onChange={setSourceFilter} selectionMode="single" />
                    <MultiSelectDropdown label="Severity" options={filterOptions.severities} selectedOptions={severityFilter} onChange={setSeverityFilter} selectionMode="single" />
                    <div className="relative flex-grow ml-auto">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alerts..." className="w-full pl-10 pr-4 py-2 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" />
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('type')} className="group flex items-center">Alert Type <SortIcon columnKey="type" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('title')} className="group flex items-center">Message <SortIcon columnKey="title" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('source')} className="group flex items-center">Source <SortIcon columnKey="source" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('severity')} className="group flex items-center">Severity <SortIcon columnKey="severity" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('timestamp')} className="group flex items-center">Timestamp <SortIcon columnKey="timestamp" /></button></th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary bg-surface">
                             {paginatedNotifications.map(n => (
                                <tr key={n.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            <NotificationIcon type={n.type} className={`w-5 h-5 ${typeToColorMap[n.type].text}`} />
                                            <span className="capitalize">{n.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className={`${!n.isRead ? 'font-semibold text-text-primary' : ''}`}>{n.title}</div>
                                        <div className="mt-1">
                                            <button className="text-xs font-semibold text-link hover:underline">
                                                {getSuggestionForNotification(n).text}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{n.source}</td>
                                    <td className="px-6 py-3"><SeverityBadge severity={n.severity} /></td>
                                    <td className="px-6 py-3">{new Date(n.timestamp).toLocaleString()}</td>
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
                <h2 className="text-2xl font-bold text-text-strong">Activity Log</h2>
                <p className="mt-1 text-text-secondary">A chronological feed of all user and system actions within your organization.</p>
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
    const [activeTab, setActiveTab] = useState<'Alerts' | 'Activity Logs'>('Alerts');
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
        { name: 'Activity Logs', icon: IconFileText },
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
                    {activeTab === 'Activity Logs' && <ActivityLogsView activityLogs={props.activityLogs} users={props.users} />}
                </div>
            </main>
        </div>
    );
};

export default NotificationsPage;