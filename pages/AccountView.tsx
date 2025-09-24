
import React, { useState, useRef, useEffect } from 'react';
import { Account, SQLFile, BigScreenWidget, QueryListItem } from '../types';
import QueryWorkspace from './QueryWorkspace';
import AccountOverviewDashboard from './AccountOverviewDashboard';
import QueryPerformanceView, { SimilarQueryPatternsView } from './QueryPerformanceView';
import { 
    IconChevronDown, 
    IconChevronLeft, 
    IconChevronRight,
    IconActivity,
    IconTrendingUp,
    IconWand,
    IconBrain,
    IconList,
    IconClock,
    IconSearch,
    IconAIAgent,
    IconBeaker,
    IconDatabase,
    IconCode,
    IconSummary,
} from '../constants';
import QueryListView from './QueryListView';
import StorageSummaryView from './StorageSummaryView';
import DatabasesView from './DatabasesView';


interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onBack: () => void;
    onSwitchAccount: (account: Account) => void;
    sqlFiles: SQLFile[];
    onSaveQueryClick: () => void;
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    activePage: string;
    onPageChange: (page: string) => void;
    onShareQueryClick: (query: QueryListItem) => void;
    displayMode: 'cost' | 'credits';
}

const accountNavItems = [
    { name: 'Account Overview', icon: IconActivity, children: [] },
    { 
        name: 'Query Performance', 
        icon: IconTrendingUp, 
        children: [
            { name: 'Query List', icon: IconList },
            { name: 'Slow Queries', icon: IconClock },
            { name: 'Similar Query Patterns', icon: IconSearch }
        ] 
    },
    { 
        name: 'Optimization',
        icon: IconWand,
        children: [
            { name: 'Query Analyzer', icon: IconSearch },
            { name: 'Query Optimizer', icon: IconAIAgent },
            { name: 'Query Simulator', icon: IconBeaker }
        ] 
    },
    { 
        name: 'Storage & Cost', 
        icon: IconDatabase, 
        children: [
            { name: 'Storage Summary', icon: IconSummary },
            { name: 'Databases', icon: IconList },
        ] 
    },
    { name: 'AI & Insights', icon: IconBrain, children: [] },
    { name: 'Query Workspace', icon: IconCode, children: [] },
];

const CompactAccountNavItem: React.FC<{
    item: { name: string; icon: React.FC<{ className?: string }> };
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`group relative flex justify-center items-center h-10 w-10 rounded-lg transition-colors
                ${
                    isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }
                focus:outline-none focus:ring-2 focus:ring-primary
            `}
            aria-label={item.name}
            title={item.name}
        >
            <item.icon className="h-5 w-5" />
            <span className="absolute left-full ml-3 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
                {item.name}
            </span>
        </button>
    </li>
);

const AccountAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};


const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onBack, onSwitchAccount, sqlFiles, onSaveQueryClick, onSetBigScreenWidget, activePage, onPageChange, onShareQueryClick, displayMode }) => {
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const accountSwitcherRef = useRef<HTMLDivElement>(null);
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
        'Query Performance': true,
        'Optimization': false,
        'Storage & Cost': true,
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

    const isDatabaseDetailView = activePage === 'Databases' && !!selectedDatabaseId;
    
    const renderContent = () => {
        if (activePage.includes("Similar Query Patterns")) {
            return <SimilarQueryPatternsView />;
        }

        switch (activePage) {
            case 'Account Overview':
                return <AccountOverviewDashboard account={account} displayMode={displayMode} />;
            case 'Query Workspace':
                return <QueryWorkspace sqlFiles={sqlFiles} onSaveQueryClick={onSaveQueryClick} />;
            case 'Query List':
            case 'Slow Queries':
                 return <QueryListView onShareQuery={onShareQueryClick} />;
            case 'Storage Summary':
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
        return 'Account Overview';
    };

    const activeParent = getActiveParent();

    return (
        <div className="flex h-full bg-background">
            {/* Contextual Sidebar */}
            {!isDatabaseDetailView && (
                <aside className={`bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                    <div ref={accountSwitcherRef} className="relative p-2">
                        {isSidebarExpanded ? (
                            <button
                                onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}
                                className="w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface-hover transition-colors"
                                aria-haspopup="true"
                                aria-expanded={isAccountSwitcherOpen}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <AccountAvatar name={account.name} />
                                    <span className="text-sm font-semibold text-text-primary truncate">{account.name}</span>
                                </div>
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
                                    {accounts.map(acc => (
                                        <li key={acc.id}>
                                            <button
                                                onClick={() => { onSwitchAccount(acc); setIsAccountSwitcherOpen(false); }}
                                                className="w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-surface-hover text-text-secondary hover:text-text-primary"
                                            >
                                                <AccountAvatar name={acc.name} />
                                                <span className="truncate">{acc.name}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <nav className="flex-grow overflow-y-auto p-2">
                        <ul className="space-y-1">
                            {accountNavItems.map(item => {
                                if (!isSidebarExpanded) {
                                    return (
                                        <CompactAccountNavItem
                                            key={item.name}
                                            item={item}
                                            isActive={activeParent === item.name && item.children.length === 0}
                                            onClick={() => {
                                                if (item.children.length > 0) {
                                                    setIsSidebarExpanded(true);
                                                    setOpenSubMenus(prev => ({ ...prev, [item.name]: true }));
                                                } else {
                                                    onPageChange(item.name);
                                                }
                                            }}
                                        />
                                    );
                                }

                                const isActive = activeParent === item.name;
                                const hasChildren = item.children.length > 0;
                                const isSubMenuOpen = openSubMenus[item.name];

                                return (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => hasChildren ? handleSubMenuToggle(item.name) : onPageChange(item.name)}
                                            className={`w-full flex items-center justify-between text-left p-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
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
                                                            className={`w-full text-left flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${activePage === child.name ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                                                        >
                                                            <child.icon className={`h-4 w-4 shrink-0 ${activePage === child.name ? 'text-primary' : ''}`} />
                                                            <span>{child.name}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="p-2 mt-auto">
                        <div className={`flex ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
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
            <main className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AccountView;
