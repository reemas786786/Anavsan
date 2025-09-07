import React, { useState } from 'react';
import { Account } from '../types';
import QueryWorkspace from './QueryWorkspace';

interface AccountViewProps {
    account: Account;
    onBack: () => void;
}

const subNavItems = [
    'Overview', 'Query Performance', 'Optimization', 'Storage & Cost', 'AI & Insights', 'Query Workspace'
];

const Breadcrumb: React.FC<{ items: { label: string; onClick?: () => void }[] }> = ({ items }) => (
    <nav className="text-sm text-text-secondary mb-4">
        {items.map((item, index) => (
            <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {item.onClick ? (
                    <button onClick={item.onClick} className="hover:underline text-link">{item.label}</button>
                ) : (
                    <span>{item.label}</span>
                )}
            </span>
        ))}
    </nav>
);

const AccountView: React.FC<AccountViewProps> = ({ account, onBack }) => {
    const [activeSubPage, setActiveSubPage] = useState('Query Workspace');
    
    const renderSubPage = () => {
        switch(activeSubPage) {
            case 'Query Workspace':
                return <QueryWorkspace />;
            // Add other cases for different sub-pages
            default:
                return (
                    <div className="p-6 bg-surface rounded-lg border border-border-color">
                        <h2 className="text-xl font-semibold text-text-primary">{activeSubPage}</h2>
                        <p className="mt-2 text-text-secondary">Content for {activeSubPage} will be displayed here.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full">
            {/* Sub-sidebar */}
            <aside className="w-60 bg-surface flex-shrink-0 p-4 border-r border-border-color">
                <div className="mb-6">
                    <p className="text-xs text-text-muted">ACCOUNT</p>
                    <h2 className="font-semibold text-text-primary">{account.name}</h2>
                    {/* Add account switcher dropdown here */}
                </div>
                <ul>
                    {subNavItems.map(item => (
                        <li key={item}>
                            <button 
                                onClick={() => setActiveSubPage(item)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeSubPage === item ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-100'}`}
                            >
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <Breadcrumb items={[
                    { label: 'Connections', onClick: onBack },
                    { label: account.name }
                ]} />
                <h1 className="text-2xl font-bold text-text-primary mb-6">{activeSubPage}</h1>
                {renderSubPage()}
            </div>
        </div>
    );
};

export default AccountView;
