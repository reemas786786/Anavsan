import React, { useState, useRef, useEffect } from 'react';
import { Account } from '../types';
import QueryWorkspace from './QueryWorkspace';
import { IconChevronDown } from '../constants';

interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onBack: () => void;
    onSwitchAccount: (account: Account) => void;
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
    <nav className="text-sm text-text-secondary mb-4">
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

const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onBack, onSwitchAccount }) => {
    const [activeSubPage, setActiveSubPage] = useState('Query Workspace');
    const [activeParent, setActiveParent] = useState('Query Workspace');
    
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Query Performance', 'Optimization']));
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
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
    
    const handleNavClick = (pageName: string, parentName: string) => {
        setActiveSubPage(pageName);
        setActiveParent(parentName);
    }

    useEffect(() => {
        const parent = accountNavItems.find(item => item.children.includes(activeSubPage) || item.name === activeSubPage);
        if (parent) {
            setActiveParent(parent.name);
            if(parent.children.length > 0) {
                setOpenSections(prev => new Set(prev).add(parent.name));
            }
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
            case 'Query Workspace':
                return <QueryWorkspace />;
            default:
                return (
                    <div className="p-6 bg-surface rounded-lg border border-border-color">
                        <h2 className="text-xl font-semibold text-text-primary">{activeSubPage}</h2>
                        <p className="mt-2 text-text-secondary">Content for {activeSubPage} will be displayed here.</p>
                    </div>
                );
        }
    };

    // FIX: Explicitly type `breadcrumbItems` to allow for items with an optional `onClick` property.
    // This prevents a TypeScript error where `onClick` was inferred as a required property.
    const breadcrumbItems: { label: string; onClick?: () => void }[] = [
        { label: 'Connections', onClick: onBack },
        { label: account.name, onClick: () => handleNavClick('Overview', 'Overview') },
    ];
    if (activeParent !== activeSubPage) {
        breadcrumbItems.push({ label: activeParent });
    }
    breadcrumbItems.push({ label: activeSubPage });

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Contextual Sub-sidebar */}
            <aside className="w-64 bg-surface flex-shrink-0 p-4 border-r border-border-color flex flex-col">
                <div className="relative" ref={switcherRef}>
                    <button onClick={() => setIsSwitcherOpen(!isSwitcherOpen)} className="w-full bg-background border border-border-color rounded-lg px-3 py-2 flex items-center justify-between text-left hover:border-primary">
                        <div>
                            <p className="text-xs text-text-muted">ACCOUNT</p>
                            <h2 className="font-semibold text-text-primary text-sm">{account.name}</h2>
                        </div>
                        <IconChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
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
                
                <nav className="mt-4 flex-grow overflow-y-auto -mr-2 pr-2">
                    <ul>
                        {accountNavItems.map(item => (
                            <li key={item.name} className="mb-1">
                                {item.children.length === 0 ? (
                                    <button 
                                        onClick={() => handleNavClick(item.name, item.name)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeSubPage === item.name ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-hover'}`}
                                    >{item.name}</button>
                                ) : (
                                    <div>
                                        <button onClick={() => toggleSection(item.name)} className="w-full flex justify-between items-center text-left px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover">
                                            <span>{item.name}</span>
                                            <IconChevronDown className={`w-4 h-4 transition-transform ${openSections.has(item.name) ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openSections.has(item.name) && (
                                            <ul className="pl-4 mt-1">
                                                {item.children.map(child => (
                                                    <li key={child}>
                                                        <button 
                                                            onClick={() => handleNavClick(child, item.name)}
                                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeSubPage === child ? 'text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}
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
            </aside>
            
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="p-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <h1 className="text-2xl font-bold text-text-primary mb-6">{activeSubPage}</h1>
                    {renderSubPage()}
                </div>
            </main>
        </div>
    );
};

export default AccountView;
