import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Account, SQLFile, BigScreenWidget, QueryListItem, PullRequest, User, QueryListFilters, SlowQueryFilters, BreadcrumbItem, Warehouse } from '../types';
import AccountOverviewDashboard from './AccountOverviewDashboard';
import { SimilarQueryPatternsView } from './QueryPerformanceView';
import { accountNavItems } from '../constants';
import Breadcrumb from '../components/Breadcrumb';
import { 
    IconChevronDown, 
    IconChevronLeft, 
    IconChevronRight,
    IconCheck,
} from '../constants';
// FIX: Changed to a named import as QueryListView does not have a default export.
import { QueryListView } from './QueryListView';
import StorageSummaryView from './StorageSummaryView';
import DatabasesView from './DatabasesView';
import QueryDetailView from './QueryDetailView';
import PullRequestsView from './PullRequestsView';
import PullRequestDetailView from './PullRequestDetailView';
import MyBranchesView from './Dashboard'; // Re-using Dashboard.tsx for MyBranchesView
import QueryVersionsView from './QueryWorkspace'; // Re-using QueryWorkspace.tsx for QueryVersionsView
import QueryAnalyzerView from './QueryAnalyzerView';
import QueryOptimizerView from './QueryOptimizerView';
import QuerySimulatorView from './QuerySimulatorView';
import SlowQueriesView from './SlowQueriesView';
import WarehouseOverview from './WarehouseOverview';
import AllWarehouses from './AllWarehouses';
import WarehouseDetailView from './WarehouseDetailView';
import { warehousesData } from '../data/dummyData';


interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onSwitchAccount: (account: Account) => void;
    onBackToAccounts: () => void;
    sqlFiles: SQLFile[];
    onSaveQueryClick: (tag: string) => void;
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    activePage: string;
    onPageChange: (page: string) => void;
    onShareQueryClick: (query: QueryListItem) => void;
    onPreviewQuery: (query: QueryListItem) => void;
    selectedQuery: QueryListItem | null;
    setSelectedQuery: (query: QueryListItem | null) => void;
    analyzingQuery: QueryListItem | null;
    onAnalyzeQuery: (query: QueryListItem | null, source: string) => void;
    onOptimizeQuery: (query: QueryListItem | null, source: string) => void;
    onSimulateQuery: (query: QueryListItem | null, source: string) => void;
    pullRequests: PullRequest[];
    selectedPullRequest: PullRequest | null;
    setSelectedPullRequest: (pr: PullRequest | null) => void;
    users: User[];
    navigationSource: string | null;
}

const ChevronUpIcon = ({ className }: { className?: string }) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;


const MobileNav: React.FC<{
    activePage: string;
    onPageChange: (page: string) => void;
    accountNavItems: any[];
}> = ({ activePage, onPageChange, accountNavItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={navRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg bg-surface-nested border border-border-color">
                <span className="font-semibold text-text-primary">{activePage}</span>
                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-surface rounded-lg shadow-lg mt-1 z-20 border border-border-color">
                    <ul className="py-1">
                        {accountNavItems.map(item => (
                            <React.Fragment key={item.name}>
                                {item.children.length === 0 ? (
                                    <li>
                                        <button onClick={() => { onPageChange(item.name); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-medium ${activePage === item.name ? 'text-primary bg-primary/10' : 'text-text-strong'}`}>
                                            {item.name}
                                        </button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-text-muted">{item.name}</li>
                                        {item.children.map((child: any) => (
                                            <li key={child.name}>
                                                <button onClick={() => { onPageChange(child.name); setIsOpen(false); }} className={`w-full text-left pl-6 pr-4 py-2 text-sm ${activePage === child.name ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
                                                    {child.name}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const AccountAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};

const ContextualNavItem: React.FC<{
    item: typeof accountNavItems[0];
    isSidebarExpanded: boolean;
    activePage: string;
    onPageChange: (page: string) => void;
    openSubMenus: Record<string, boolean>;
    handleSubMenuToggle: (itemName: string) => void;
}> = ({ item, isSidebarExpanded, activePage, onPageChange, openSubMenus, handleSubMenuToggle }) => {
    const [openFlyout, setOpenFlyout] = useState(false);
    const flyoutTimeoutIdRef = useRef<number | null>(null);

    const handleFlyoutEnter = () => {
        if (flyoutTimeoutIdRef.current) clearTimeout(flyoutTimeoutIdRef.current);
        setOpenFlyout(true);
    };

    const handleFlyoutLeave = () => {
        flyoutTimeoutIdRef.current = window.setTimeout(() => setOpenFlyout(null), 200);
    };

    const hasChildren = item.children.length > 0;
    const isSubMenuOpen = openSubMenus[item.name];
    const isSomeChildActive = hasChildren && item.children.some(c => c.name === activePage);

    if (isSidebarExpanded) {
        // --- EXPANDED VIEW LOGIC ---
        if (!hasChildren) {
            return (
                <li>
                    <button
                        onClick={() => onPageChange(item.name)}
                        className={`w-full flex items-center gap-3 text-left p-2 rounded-lg text-sm transition-colors ${
                            activePage === item.name
                            ? 'bg-[#EFE9FE] text-primary font-semibold'
                            : 'text-text-strong font-medium hover:bg-surface-hover'
                        }`}
                    >
                        <item.icon className={`h-5 w-5 shrink-0`} />
                        <span>{item.name}</span>
                    </button>
                </li>
            );
        }

        return (
            <li>
                <button
                    onClick={() => handleSubMenuToggle(item.name)}
                    className={`w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface-hover`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 shrink-0 ${isSomeChildActive ? 'text-primary' : 'text-text-strong'}`} />
                        <span className={`text-sm font-bold text-text-strong`}>{item.name}</span>
                    </div>
                    {isSubMenuOpen ? <ChevronUpIcon className="h-4 w-4 text-text-secondary" /> : <ChevronDownIcon className="h-4 w-4 text-text-secondary" />}
                </button>
                {isSubMenuOpen && (
                    <ul className="pl-5 mt-1 space-y-0.5">
                        {item.children.map(child => (
                            <li key={child.name}>
                                <button
                                    onClick={() => onPageChange(child.name)}
                                    className={`w-full text-left flex items-center gap-3 py-1.5 px-3 rounded-lg text-sm transition-colors ${
                                        activePage === child.name 
                                        ? 'text-primary font-medium' 
                                        : 'text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    <child.icon className="h-4 w-4 shrink-0" />
                                    <span>{child.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    } else {
        // --- COMPACT VIEW LOGIC ---
        const isActive = activePage === item.name || isSomeChildActive;
        return (
            <li
                onMouseEnter={handleFlyoutEnter}
                onMouseLeave={handleFlyoutLeave}
                className="relative"
            >
                <button
                    onClick={() => onPageChange(hasChildren ? item.children[0].name : item.name)}
                    className={`w-full group relative flex items-center justify-center p-2 rounded-lg text-sm transition-colors ${
                        isActive
                        ? 'bg-[#EFE9FE] text-primary'
                        : 'text-text-strong hover:bg-surface-hover'
                    }`}
                >
                    <item.icon className="h-5 w-5 shrink-0" />
                </button>

                {openFlyout && (
                     <div 
                        className="absolute left-full ml-2 top-0 w-60 bg-surface rounded-lg shadow-lg p-2 z-30 border border-border-color"
                        onMouseEnter={handleFlyoutEnter}
                        onMouseLeave={handleFlyoutLeave}
                    >
                        <div className="px-3 py-2 text-sm font-semibold text-text-strong">{item.name}</div>
                        {hasChildren ? (
                             <ul className="space-y-0.5">
                                {item.children.map(child => (
                                    <li key={child.name}>
                                        <button
                                            onClick={() => onPageChange(child.name)}
                                            className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-colors ${
                                                activePage === child.name 
                                                ? 'text-primary font-medium' 
                                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                            }`}
                                        >
                                            <span>{child.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )}
            </li>
        );
    }
};


const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onSwitchAccount, onBackToAccounts, sqlFiles, onSaveQueryClick, onSetBigScreenWidget, activePage, onPageChange, onShareQueryClick, onPreviewQuery, selectedQuery, setSelectedQuery, analyzingQuery, onAnalyzeQuery, onOptimizeQuery, onSimulateQuery, pullRequests, selectedPullRequest, setSelectedPullRequest, users, navigationSource }) => {
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const accountSwitcherRef = useRef<HTMLDivElement>(null);
    const [accountSwitcherTimeoutId, setAccountSwitcherTimeoutId] = useState<number | null>(null);
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
        'Query performance': true,
        'Optimization': true,
        'Warehouses': true,
        'Storage and Cost': true,
        'Query Workspace': true,
    });
    
    // State for All Queries filters
    const [allQueriesFilters, setAllQueriesFilters] = useState<QueryListFilters>({
        search: '',
        dateFilter: '7d',
        userFilter: [],
        statusFilter: [],
        warehouseFilter: [],
        queryTypeFilter: [],
        durationFilter: { min: null, max: null },
        currentPage: 1,
        itemsPerPage: 10,
        visibleColumns: ['queryId', 'user', 'warehouse', 'duration', 'bytesScanned', 'cost', 'startTime', 'actions'],
    });

    // State for Slow Queries filters
    const [slowQueriesFilters, setSlowQueriesFilters] = useState<SlowQueryFilters>({
        search: '',
        dateFilter: '7d',
        warehouseFilter: [],
        severityFilter: ['Medium', 'High'],
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountSwitcherRef.current && !accountSwitcherRef.current.contains(event.target as Node)) {
                setIsAccountSwitcherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAccountSwitcherEnter = () => {
        if (accountSwitcherTimeoutId) clearTimeout(accountSwitcherTimeoutId);
        setIsAccountSwitcherOpen(true);
    };
    const handleAccountSwitcherLeave = () => {
        const timeoutId = window.setTimeout(() => setIsAccountSwitcherOpen(false), 200);
        setAccountSwitcherTimeoutId(timeoutId);
    };

    const handleSubMenuToggle = (itemName: string) => {
        setOpenSubMenus(prev => ({ ...prev, [itemName]: !prev[itemName] }));
    };

    const handleSelectDatabaseFromSummary = (databaseId: string) => {
        onPageChange('Databases');
        if (databaseId === '__view_all__') {
            setSelectedDatabaseId(null);
        } else {
            setSelectedDatabaseId(databaseId);
        }
    };

    const handleBackToDbList = () => {
        setSelectedDatabaseId(null);
    };

    const handleBackFromTool = () => {
        onPageChange(navigationSource || 'All queries');
        onAnalyzeQuery(null, ''); // This clears the analyzingQuery state and source
    };

    const isDatabaseDetailView = activePage === 'Databases' && !!selectedDatabaseId;
    
    const renderContent = () => {
        if (selectedWarehouse) {
            return <WarehouseDetailView warehouse={selectedWarehouse} onBack={() => setSelectedWarehouse(null)} />;
        }
        if (selectedPullRequest) {
            return <PullRequestDetailView pullRequest={selectedPullRequest} onBack={() => setSelectedPullRequest(null)} users={users} />;
        }
        if (selectedQuery) {
            return <QueryDetailView 
                query={selectedQuery} 
                onBack={() => setSelectedQuery(null)} 
                onAnalyzeQuery={onAnalyzeQuery}
                onOptimizeQuery={onOptimizeQuery}
                onSimulateQuery={onSimulateQuery}
                sourcePage={activePage}
            />;
        }

        if (activePage.includes("Similar query patterns")) {
            return <SimilarQueryPatternsView />;
        }

        switch (activePage) {
            case 'Account overview':
                return <AccountOverviewDashboard account={account} />;
            case 'Warehouse Overview':
                return <WarehouseOverview warehouses={warehousesData} />;
            case 'All Warehouses':
                return <AllWarehouses warehouses={warehousesData} onSelectWarehouse={setSelectedWarehouse} />;
            case 'My Branches':
                return <MyBranchesView />;
            case 'Query Versions':
                return <QueryVersionsView sqlFiles={sqlFiles} />;
            case 'Query analyzer':
                return <QueryAnalyzerView
                    query={analyzingQuery}
                    onBack={handleBackFromTool}
                    onSaveClick={onSaveQueryClick}
                    onBrowseQueries={() => onPageChange('All queries')}
                    onOptimizeQuery={(q) => onOptimizeQuery(q, 'Query analyzer')}
                />;
            case 'Query optimizer':
                return <QueryOptimizerView
                    query={analyzingQuery}
                    onBack={handleBackFromTool}
                    onSaveClick={onSaveQueryClick}
                    onSimulateQuery={(q) => onSimulateQuery(q, 'Query optimizer')}
                />;
            case 'Query simulator':
                 return <QuerySimulatorView
                    query={analyzingQuery}
                    onBack={handleBackFromTool}
                    onSaveClick={onSaveQueryClick}
                />;
            case 'Pull Requests':
                return <PullRequestsView pullRequests={pullRequests} onSelectPullRequest={setSelectedPullRequest} />;
            case 'All queries':
                 return <QueryListView 
                    onShareQueryClick={onShareQueryClick} 
                    onSelectQuery={setSelectedQuery} 
                    onAnalyzeQuery={(q) => onAnalyzeQuery(q, 'All queries')}
                    onOptimizeQuery={(q) => onOptimizeQuery(q, 'All queries')}
                    onSimulateQuery={(q) => onSimulateQuery(q, 'All queries')}
                    filters={allQueriesFilters}
                    setFilters={setAllQueriesFilters}
                 />;
            case 'Slow queries':
                return <SlowQueriesView 
                    onAnalyzeQuery={(q) => onAnalyzeQuery(q, 'Slow queries')}
                    onOptimizeQuery={(q) => onOptimizeQuery(q, 'Slow queries')}
                    onSimulateQuery={(q) => onSimulateQuery(q, 'Slow queries')}
                    onPreviewQuery={onPreviewQuery}
                    filters={slowQueriesFilters}
                    setFilters={setSlowQueriesFilters}
                />;
            case 'Storage summary':
                return <StorageSummaryView onSelectDatabase={handleSelectDatabaseFromSummary} onSetBigScreenWidget={onSetBigScreenWidget} />;
            case 'Databases':
                return <DatabasesView selectedDatabaseId={selectedDatabaseId} onSelectDatabase={setSelectedDatabaseId} onBackToList={handleBackToDbList} />;
            default:
                return <div className="p-4"><h1 className="text-xl font-bold">{activePage}</h1><p>Content for this page is under construction.</p></div>;
        }
    };
    
    const isListView = ['All queries', 'Slow queries', 'Similar query patterns', 'Query analyzer', 'Query optimizer', 'Query simulator', 'All Warehouses'].includes(activePage);

    return (
        <div className="flex h-full bg-background">
            {/* Contextual Sidebar */}
            {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && !selectedWarehouse && (
                <aside className={`bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-12'}`}>
                    <div className={`p-2 flex-shrink-0 transition-all ${isSidebarExpanded ? '' : 'flex justify-center'}`}>
                        {/* Account Switcher */}
                        <div 
                            ref={accountSwitcherRef}
                            className="relative w-full"
                            onMouseEnter={handleAccountSwitcherEnter}
                            onMouseLeave={handleAccountSwitcherLeave}
                        >
                            <button
                                className={`w-full flex items-center transition-colors group relative ${
                                    isSidebarExpanded 
                                    ? 'text-left p-2 rounded-lg bg-background hover:bg-surface-hover border border-border-light justify-between' 
                                    : 'h-10 w-10 rounded-full bg-surface-nested hover:bg-surface-hover justify-center'
                                }`}
                                aria-haspopup="true"
                                aria-expanded={isAccountSwitcherOpen}
                                title={isSidebarExpanded ? "Switch Account" : account.name}
                            >
                                {isSidebarExpanded ? (
                                    <>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-sm font-bold text-text-primary truncate">{account.name}</span>
                                        </div>
                                        <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isAccountSwitcherOpen ? 'rotate-180' : ''}`} />
                                    </>
                                ) : (
                                    <AccountAvatar name={account.name} />
                                )}
                            </button>
                            {isAccountSwitcherOpen && (
                                <div className={`absolute z-20 mt-2 rounded-lg bg-surface shadow-lg p-2 border border-border-color ${isSidebarExpanded ? 'w-full' : 'w-64 left-full ml-2 -top-2'}`}>
                                    <div className="text-xs font-semibold text-text-muted px-2 py-1 mb-1">Switch Account</div>
                                    <ul className="max-h-60 overflow-y-auto">
                                        {accounts.map(acc => {
                                            const isActive = acc.id === account.id;
                                            return (
                                                <li key={acc.id}>
                                                    <button
                                                        onClick={() => { onSwitchAccount(acc); setIsAccountSwitcherOpen(false); }}
                                                        className={`w-full text-left flex items-center justify-between gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${
                                                            isActive
                                                                ? 'bg-primary/10 text-primary font-semibold'
                                                                : 'hover:bg-surface-hover text-text-secondary hover:text-text-primary'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <AccountAvatar name={acc.name} />
                                                            <span className="truncate">{acc.name}</span>
                                                        </div>
                                                        {isActive && <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className={`flex-grow px-2 ${isSidebarExpanded ? 'overflow-y-auto' : ''}`}>
                        <ul className="space-y-1">
                            {accountNavItems.map(item => (
                                <ContextualNavItem
                                    key={item.name}
                                    item={item}
                                    isSidebarExpanded={isSidebarExpanded}
                                    activePage={activePage}
                                    onPageChange={onPageChange}
                                    openSubMenus={openSubMenus}
                                    handleSubMenuToggle={handleSubMenuToggle}
                                />
                             ))}
                        </ul>
                    </nav>

                    <div className="p-2 mt-auto flex-shrink-0">
                        <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                        <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                            <button
                                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                                className="p-2 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                {isSidebarExpanded 
                                    ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> 
                                    : <IconChevronRight className="h-5 w-5 text-text-secondary" />
                                }
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main className={`flex-1 flex flex-col overflow-hidden bg-background`}>
                <div className={`flex-1 ${isListView ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
                    {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && !selectedWarehouse && (
                        <div className="lg:hidden p-4 pb-0">
                            <MobileNav activePage={activePage} onPageChange={onPageChange} accountNavItems={accountNavItems} />
                        </div>
                    )}
                    <div className={`h-full ${isDatabaseDetailView || selectedQuery || selectedPullRequest || selectedWarehouse || isListView ? "" : "p-4"}`}>
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountView;