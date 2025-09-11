import React, { useState, useRef, useEffect } from 'react';
import { Account, SQLFile } from '../types';
import QueryWorkspace from './QueryWorkspace';
import AccountOverviewDashboard from './AccountOverviewDashboard';
import { IconChevronDown, IconChevronLeft, IconChevronRight } from '../constants';

interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onBack: () => void;
    onSwitchAccount: (account: Account) => void;
    sqlFiles: SQLFile[];
    onSaveQueryClick: () => void;
}

const accountNavItems = [
    { name: 'Overview', children: [] },
    { name: 'Query Performance', children: ['Query List', 'Slow Queries'] },
    { name: 'Optimization', children: ['Query Analyzer', 'Query Optimizer', 'Query Simulator'] },
    { name: 'Storage & Cost', children: [] },
    { name: 'AI & Insights', children: [] },
    { name: 'Query Workspace', children: [] },
];

const Breadcrumb: React.FC<{ items: { label: string; onClick?: () => void }[] }> = ({ items }) => (
    <nav className="text-sm text-text-secondary">
        {items.map((item, index) => (
            <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {item.onClick ? (
                    <button onClick={item.onClick} className="hover:underline text-link">{item.label}</button>
                ) : (
                    <span className="text-text-primary font-medium">{item.label}</span>
                )}
            </span>
        ))}
    </nav>
);

const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onBack, onSwitchAccount, sqlFiles, onSaveQueryClick }) => {
    const [activeSubPage, setActiveSubPage] = useState('Overview');
    
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Query Performance', 'Optimization']));
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
    const [isAccountSidebarExpanded, setIsAccountSidebarExpanded] = useState(true);
    const switcherRef = useRef<HTMLDivElement>(null);

    const toggleSection = (sectionName: string) => {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionName)) {
                newSet.delete(sectionName);
            } else {
                newSet.add(sectionName);
            }
            return newSet;
        });
    };
    
    const handleNavClick = (pageName: string) => {
        setActiveSubPage(pageName);
    }

    useEffect(() => {
        // When account changes, reset to its overview page
        setActiveSubPage('Overview');
    }, [account]);

    useEffect(() => {
        const parent = accountNavItems.find(item => item.children.includes(activeSubPage) || item.name === activeSubPage);
        if (parent && parent.children.length > 0) {
            setOpenSections(prev => new Set(prev).add(parent.name));
        }
    }, [activeSubPage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsSwitcherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderSubPage = () => {
        switch(activeSubPage) {
            case 'Overview':
                return <AccountOverviewDashboard account={account} />;
            case 'Query Workspace':
                return <QueryWorkspace sqlFiles={sqlFiles} onSaveQueryClick={onSaveQueryClick} />;
            default:
                return (
                    <div className="p-4 bg-surface rounded-lg border border-border-color">
                        <h2 className="text-xl font-semibold text-text-primary">{activeSubPage}</h2>
                        <p className="mt-2 text-text-secondary">Content for {activeSubPage} will be displayed here.</p>
                    </div>
                );
        }
    };
    
    const breadcrumbItems: { label: string; onClick?: () => void }[] = [
        { label: 'Connections', onClick: onBack },
        { label: account.name },
    ];
    if (activeSubPage !== 'Overview') {
       breadcrumbItems.push({ label: activeSubPage });
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="bg-surface w-full py-4 px-6 border-b border-border-color flex-shrink-0">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <aside className={`bg-surface flex-shrink-0 border-r border-border-color flex flex-col transition-all duration-300 ease-in-out ${isAccountSidebarExpanded ? 'w-64' : 'w-16'}`}>
                    {/* Main scrollable content area */}
                    <div className="flex-grow overflow-y-auto">
                        {isAccountSidebarExpanded && (
                            <div className="p-4">
                                <div className="relative" ref={switcherRef}>
                                    <button onClick={() => setIsSwitcherOpen(!isSwitcherOpen)} className="w-full bg-background border border-border-color rounded-full px-4 py-3 flex items-center justify-between text-left hover:border-primary">
                                        <h2 className="font-semibold text-text-primary text-sm truncate">{account.name}</h2>
                                        <IconChevronDown className={`w-5 h-5 text-text-secondary transition-transform flex-shrink-0 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isSwitcherOpen && (
                                        <div className="absolute top-full mt-1 w-full bg-surface rounded-lg shadow-lg border border-border-color z-10 max-h-60 overflow-y-auto">
                                            <ul>
                                                {accounts.map(acc => (
                                                    <li key={acc.id}>
                                                        <button onClick={() => { onSwitchAccount(acc); setIsSwitcherOpen(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover ${account.id === acc.id ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
                                                            {acc.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                
                                <nav className="mt-4">
                                    <ul className="space-y-1">
                                        {accountNavItems.map(item => (
                                            <li key={item.name}>
                                                {item.children.length === 0 ? (
                                                    <button 
                                                        onClick={() => handleNavClick(item.name)}
                                                        className={`w-full text-left px-3 py-2 rounded-full text-sm font-medium transition-colors ${activeSubPage === item.name ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}
                                                    >{item.name}</button>
                                                ) : (
                                                    <div>
                                                        <button onClick={() => toggleSection(item.name)} className="w-full flex justify-between items-center text-left px-3 py-2 rounded-full text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                                                            <span>{item.name}</span>
                                                            <IconChevronDown className={`w-4 h-4 transition-transform ${openSections.has(item.name) ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        {openSections.has(item.name) && (
                                                            <ul className="pl-3 mt-1 space-y-1">
                                                                {item.children.map(child => (
                                                                    <li key={child}>
                                                                        <button 
                                                                            onClick={() => handleNavClick(child)}
                                                                            className={`w-full text-left px-3 py-2 rounded-full text-sm transition-colors ${activeSubPage === child ? 'text-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
                                                                        >{child}</button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Bottom fixed part: Divider and Toggle Button */}
                    <div className="flex-shrink-0 mt-auto p-2">
                        <div className={`border-t border-border-light ${isAccountSidebarExpanded ? 'mx-2' : ''}`}></div>
                        <div className={`flex mt-2 ${isAccountSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                            <button
                                onClick={() => setIsAccountSidebarExpanded(!isAccountSidebarExpanded)}
                                className="p-1.5 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label={isAccountSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                {isAccountSidebarExpanded 
                                    ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> 
                                    : <IconChevronRight className="h-5 w-5 text-text-secondary" />
                                }
                            </button>
                        </div>
                    </div>
                </aside>
                
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="p-4">
                        {renderSubPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountView;
