import React, { useState, useEffect, useRef } from 'react';
import { Account, ConnectionStatus } from '../types';
import { IconDotsVertical, IconSearch, IconView, IconEdit, IconDelete, IconAdd } from '../constants';

const StatusBadge: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
    const colorClasses: Record<ConnectionStatus, string> = {
        Syncing: 'bg-status-info-light text-status-info-dark',
        Error: 'bg-status-error-light text-status-error-dark',
        Disconnected: 'bg-gray-200 text-gray-800',
        Connected: 'bg-status-success-light text-status-success-dark',
    };
    const dotClasses: Record<ConnectionStatus, string> = {
        Syncing: 'bg-status-info',
        Error: 'bg-status-error',
        Disconnected: 'bg-gray-400',
        Connected: 'bg-status-success',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

interface ConnectionsProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  onAddAccountClick: () => void;
  onDeleteAccount: (accountId: string) => void;
}

const Connections: React.FC<ConnectionsProps> = ({ accounts, onSelectAccount, onAddAccountClick, onDeleteAccount }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (accounts.length === 0) {
        return <EmptyConnections onAdd={onAddAccountClick} />;
    }
  
    const activeAccounts = accounts.filter(a => a.status === 'Connected' || a.status === 'Syncing').length;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">Accounts</h1>
            
            <div className="columns-1 md:columns-2 gap-4">
                <MetricCard title="Total accounts" value={accounts.length.toString()} />
                <MetricCard title="Active accounts" value={activeAccounts.toString()} />
                <MetricCard title="Last sync status" value="Healthy" />
                <MetricCard title="Total queries synced" value="1.2M" />
            </div>

            <div className="bg-surface p-4 rounded-3xl border border-border-color shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-text-muted" />
                        </div>
                        <input type="text" placeholder="Filter accounts..." className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" />
                    </div>
                    <button onClick={onAddAccountClick} className="bg-primary text-white font-semibold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm">
                        <IconAdd className="h-5 w-5" />
                        Add Account
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-background text-xs text-text-secondary uppercase font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">Account Name</th>
                                <th scope="col" className="px-6 py-3">Identifier</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Last Synced</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map(account => (
                                <tr key={account.id} className="border-t border-border-color hover:bg-surface-hover">
                                    <td onClick={() => onSelectAccount(account)} className="px-6 py-4 font-medium text-link whitespace-nowrap cursor-pointer">{account.name}</td>
                                    <td className="px-6 py-4">{account.identifier}</td>
                                    <td className="px-6 py-4">{account.role}</td>
                                    <td className="px-6 py-4"><StatusBadge status={account.status} /></td>
                                    <td className="px-6 py-4">{account.lastSynced}</td>
                                    <td className="px-6 py-4 text-right">
                                      <div className="relative inline-block text-left" ref={openMenuId === account.id ? menuRef : null}>
                                        <button onClick={() => setOpenMenuId(openMenuId === account.id ? null : account.id)} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                          <IconDotsVertical className="h-5 w-5"/>
                                        </button>
                                        {openMenuId === account.id && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectAccount(account); setOpenMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                        <IconView className="h-4 w-4"/> View
                                                    </a>
                                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                        <IconEdit className="h-4 w-4"/> Edit
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); onDeleteAccount(account.id); setOpenMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                                        <IconDelete className="h-4 w-4"/> Delete
                                                    </a>
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
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ title: string, value: string }> = ({ title, value }) => (
    <div className="bg-surface p-4 rounded-3xl border border-border-color shadow-sm break-inside-avoid mb-4">
        <h4 className="text-base font-semibold text-text-strong">{title}</h4>
        <p className="text-[22px] leading-7 font-bold text-text-primary mt-6">{value}</p>
    </div>
);

const EmptyConnections: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="w-full text-center max-w-lg mx-auto mt-16">
        <h2 className="text-xl font-bold text-text-primary mb-2">You haven’t connected any Snowflake accounts yet.</h2>
        <p className="text-text-secondary mb-6">Let’s add one to get started. Connect your Snowflake account to start optimizing performance and costs.</p>
        <button onClick={onAdd} className="bg-primary text-white font-semibold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm mx-auto">
            <IconAdd className="h-5 w-5" />
            Connect Account
        </button>
    </div>
);

export default Connections;