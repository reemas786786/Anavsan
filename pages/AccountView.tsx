import React, { useState, useRef, useEffect } from 'react';
import { Account, SQLFile, BigScreenWidget, QueryListItem, PullRequest, User, QueryListFilters, SlowQueryFilters } from '../types';
import AccountOverviewDashboard from './AccountOverviewDashboard';
import { SimilarQueryPatternsView } from './QueryPerformanceView';
import { 
    IconChevronDown, 
    IconChevronLeft, 
    IconChevronRight,
    IconActivity,
    IconTrendingUp,
    IconAdjustments,
    IconBrain,
    IconList,
    IconClock,
    IconSearch,
    IconAIAgent,
    IconBeaker,
    IconDatabase,
    IconCode,
    IconSummary,
    IconCheck,
    IconPullRequest,
    IconGitBranch,
} from '../constants';
import QueryListView from './QueryListView';
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


interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onSwitchAccount: (account: Account) => void;
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
    displayMode: 'cost' | 'credits';
    users: User[];
    navigationSource: string | null;
}

const accountNavItems = [
    { name: 'Account overview', icon: IconActivity, children: [] },
    { 
        name: 'Query performance', 
        icon: IconTrendingUp, 
        children: [
            { name: 'All queries', icon: IconList },
            { name: 'Slow queries', icon: IconClock },
            { name: 'Similar query patterns', icon: IconSearch }
        ] 
    },
    { 
        name: 'Optimization',
        icon: IconAdjustments,
        children: [
            { name: 'Query analyzer', icon: IconSearch },
            { name: 'Query optimizer', icon: IconAIAgent },
            { name: 'Query simulator', icon: IconBeaker }
        ] 
    },
    { 
        name: 'Storage and Cost', 
        icon: IconDatabase, 
        children: [
            { name: 'Storage summary', icon: IconSummary },
            { name: 'Databases', icon: IconList },
        ] 
    },
    { 
        name: 'Query Workspace', 
        icon: IconCode, 
        children: [
            { name: 'My Branches', icon: IconGitBranch },
            { name: 'Pull Requests', icon: IconPullRequest },
            { name: 'Query Versions', icon: IconClock }
        ] 
    },
    { name: 'AI and insights', icon: IconBrain, children: [] },
];

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

const CollapsedNavItem: React.FC<{
    item: { name: string; icon: React.FC<{ className?: string }>; children: { name: string; icon: React.FC<{ className?: string }> }[] };
    isActiveParent: boolean;
    activePage: string;
    onClick: (page: string) => void;
}> = ({ item, isActiveParent, activePage, onClick }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [flyoutPosition, setFlyoutPosition] = useState<'top' | 'bottom'>('top');
    const itemRef = useRef<HTMLLIElement>(null);
    const hasSubItems = item.children && item.children.length > 0;
    let timer: number;

    const handleItemClick = (page: string) => {
        onClick(page);
        setIsSubMenuOpen(false);
    };

    const showSubMenu = () => {
        clearTimeout(timer);
        if (hasSubItems) {
            if (itemRef.current) {
                const rect = itemRef.current.getBoundingClientRect();
                const estimatedHeight = 16 + 34 + (item.children.length * 34); 
                if (rect.top + estimatedHeight > window.innerHeight) {
                    setFlyoutPosition('bottom');
                } else {
                    setFlyoutPosition('top');
                }
            }
            setIsSubMenuOpen(true);
        }
    };

    const hideSubMenu = () => {
        timer = window.setTimeout(() => {
            setIsSubMenuOpen(false);
        }, 150);
    };

    const handleMouseEnterContainer = () => {
        clearTimeout(timer);
        if (hasSubItems) {
            showSubMenu();
        }
    };

    return (
        <li ref={itemRef} onMouseLeave={hideSubMenu} onMouseEnter={handleMouseEnterContainer} className="relative">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    if (!hasSubItems) {
                        onClick(item.name);
                    } else {
                        // Click parent icon in collapsed view opens first child
                        handleItemClick(item.children[0].name);
                    }
                }}
                className={`group relative flex justify-center items-center h-10 w-10 rounded-lg transition-colors
                    ${isActiveParent ? 'bg-[#F0EAFB] text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}
                    focus:outline-none focus:ring-2 focus:ring-primary
                `}
                aria-label={item.name}
                aria-haspopup={hasSubItems}
                aria-expanded={isSubMenuOpen}
            >
                <item.icon className="h-5 w-5" />
                {!hasSubItems && (
                    <span className="absolute left-full ml-3 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
                        {item.name}
                    </span>
                )}
            </button>

            {hasSubItems && isSubMenuOpen && (
                <div
                    className={`absolute left-full ml-2 w-60 bg-surface rounded-lg shadow-lg p-2 z-31 ${flyoutPosition === 'top' ? 'top-0' : 'bottom-0'}`}
                    aria-hidden={!isSubMenuOpen}
                    onMouseEnter={handleMouseEnterContainer}
                    onMouseLeave={hideSubMenu}
                >
                    <ul role="menu">
                        {/* Header Item */}
                        <li>
                            <button onClick={() => handleItemClick(item.children[0].name)} className="w-full text-left rounded-md px-3 py-1.5 text-sm text-text-strong font-semibold hover:bg-surface-hover focus:outline-none focus:bg-surface-hover">
                                {item.name}
                            </button>
                        </li>
                        {/* Sub Items */}
                        {item.children.map(child => (
                            <li key={child.name}>
                                <button
                                    onClick={() => handleItemClick(child.name)}
                                    className={`w-full text-left rounded-md px-3 py-1.5 text-sm transition-colors focus:outline-none focus:bg-surface-hover ${
                                        activePage === child.name
                                            ? 'text-primary font-medium'
                                            : 'text-text-secondary font-medium hover:bg-surface-hover hover:text-text-primary'
                                    }`}
                                >
                                    {child.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
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


const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onSwitchAccount, sqlFiles, onSaveQueryClick, onSetBigScreenWidget, activePage, onPageChange, onShareQueryClick, onPreviewQuery, selectedQuery, setSelectedQuery, analyzingQuery, onAnalyzeQuery, onOptimizeQuery, onSimulateQuery, pullRequests, selectedPullRequest, setSelectedPullRequest, displayMode, users, navigationSource }) => {
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const accountSwitcherRef = useRef<HTMLDivElement>(null);
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
        'Query performance': true,
        'Optimization': true,
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
                return <AccountOverviewDashboard account={account} displayMode={displayMode} />;
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
    
    const getActiveParent = () => {
        for (const item of accountNavItems) {
            if (item.name === activePage) return item.name;
            if (item.children.some(child => child.name === activePage)) {
                return item.name;
            }
        }
        return 'Account overview';
    };

    const activeParent = getActiveParent();
    const isListView = ['All queries', 'Slow queries', 'Similar query patterns', 'Query analyzer', 'Query optimizer'].includes(activePage);

    return (
        <div className="flex h-full bg-background">
            {/* Contextual Sidebar */}
            {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && (
                <aside className={`hidden lg:flex bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                    <div ref={accountSwitcherRef} className="relative p-2">
                        {isSidebarExpanded ? (
                            <button
                                onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}
                                className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface-hover transition-colors bg-[#f4f4f4]"
                                aria-haspopup="true"
                                aria-expanded={isAccountSwitcherOpen}
                            >
                                <span className="text-sm font-semibold text-text-primary truncate">{account.name}</span>
                                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isAccountSwitcherOpen ? 'rotate-180' : ''}`} />
                            </button>
                        ) : (
                            <div className="flex justify-center group relative">
                                <button
                                    onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}
                                    className="p-1 rounded-full hover:bg-surface-hover transition-colors"
                                    aria-label={`Switch account from ${account.name}`}
                                    aria-haspopup="true"
                                    aria-expanded={isAccountSwitcherOpen}
                                >
                                    <AccountAvatar name={account.name} />
                                </button>
                                <span className="absolute left-full ml-3 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
                                    {account.name}
                                </span>
                            </div>
                        )}
                        {isAccountSwitcherOpen && (
                            <div className={`absolute z-20 mt-2 rounded-lg bg-surface shadow-lg p-2 ${
                                isSidebarExpanded ? 'w-full' : 'left-full top-0 ml-2 w-64'
                            }`}>
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

                    <div className={`border-t border-border-light my-2 ${isSidebarExpanded ? 'mx-4' : 'mx-2'}`}></div>

                    <nav className={`flex-grow p-2 ${isSidebarExpanded ? 'overflow-y-auto' : ''}`}>
                        <ul className="space-y-1 flex flex-col items-center">
                            {!isSidebarExpanded ? (
                                accountNavItems.map(item => (
                                    <CollapsedNavItem
                                        key={item.name}
                                        item={item}
                                        isActiveParent={activeParent === item.name}
                                        activePage={activePage}
                                        onClick={onPageChange}
                                    />
                                ))
                            ) : (
                                accountNavItems.map(item => {
                                    const isActive = activeParent === item.name;
                                    const hasChildren = item.children.length > 0;
                                    const isSubMenuOpen = openSubMenus[item.name];
                                    
                                    return (
                                        <li key={item.name} className="w-full">
                                            <button
                                                onClick={() => hasChildren ? handleSubMenuToggle(item.name) : onPageChange(item.name)}
                                                className={`w-full flex items-center justify-between text-left p-2 rounded-full text-sm transition-colors mx-1 ${
                                                    activePage === item.name
                                                      ? 'bg-[#F0EAFB] text-primary font-semibold' // Directly active item
                                                      : isActive
                                                      ? 'text-primary font-semibold hover:bg-surface-hover hover:text-text-primary' // Parent of active item
                                                      : 'text-text-strong font-medium hover:bg-surface-hover'
                                                }`}
                                                aria-current={activePage === item.name ? "page" : undefined}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-text-strong'}`} />
                                                    <span>{item.name}</span>
                                                </div>
                                                {hasChildren && <IconChevronDown className={`h-4 w-4 transition-transform ${isSubMenuOpen ? 'rotate-180' : ''}`} />}
                                            </button>
                                            {hasChildren && isSubMenuOpen && (
                                                <ul className="pl-5 mt-1 space-y-1">
                                                    {item.children.map(child => (
                                                        <li key={child.name}>
                                                            <button
                                                                onClick={() => onPageChange(child.name)}
                                                                className={`w-full text-left flex items-center gap-2 p-2 rounded-full text-sm transition-colors mx-1 ${activePage === child.name ? 'bg-[#F0EAFB] text-primary font-semibold' : 'text-text-secondary font-medium hover:bg-surface-hover hover:text-text-primary'}`}
                                                                aria-current={activePage === child.name ? "page" : undefined}
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
                                })
                            )}
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
                    {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && (
                        <div className="lg:hidden p-4 border-b border-border-color bg-surface sticky top-0 z-10">
                            <MobileNav activePage={activePage} onPageChange={onPageChange} accountNavItems={accountNavItems} />
                        </div>
                    )}
                    <div className={isDatabaseDetailView || selectedQuery || selectedPullRequest || isListView ? "h-full" : "p-4 h-full"}>
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountView;