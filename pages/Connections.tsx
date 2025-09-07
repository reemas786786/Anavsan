import React, { useState, useEffect, useRef } from 'react';
import { Account, ConnectionStatus } from '../types';
import { IconDotsVertical } from '../constants';

const IconSearch: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

const IconEye: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconPencil: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

const IconTrash: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);


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
            <h1 className="text-2xl font-bold text-text-primary">Connections</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Accounts" value={accounts.length.toString()} />
                <MetricCard title="Active Accounts" value={activeAccounts.toString()} />
                <MetricCard title="Last Sync Status" value="Healthy" />
                <MetricCard title="Total Queries Synced" value="1.2M" />
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border-color shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-text-muted" />
                        </div>
                        <input type="text" placeholder="Filter accounts..." className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" />
                    </div>
                    <button onClick={onAddAccountClick} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
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
                                                        <IconEye className="h-4 w-4"/> View
                                                    </a>
                                                    <a href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                                        <IconPencil className="h-4 w-4"/> Edit
                                                    </a>
                                                    <a href="#" onClick={(e) => { e.preventDefault(); onDeleteAccount(account.id); setOpenMenuId(null); }} className="flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                                        <IconTrash className="h-4 w-4"/> Delete
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
    <div className="bg-surface p-4 rounded-xl border border-border-color shadow-sm">
        <p className="text-sm font-semibold text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
    </div>
);

const EmptyConnections: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="w-full text-center max-w-lg mx-auto mt-16">
        <h2 className="text-xl font-bold text-text-primary mb-2">You haven’t connected any Snowflake accounts yet.</h2>
        <p className="text-text-secondary mb-6">Let’s add one to get started. Connect your Snowflake account to start optimizing performance and costs.</p>
        <button onClick={onAdd} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Connect Account
        </button>
    </div>
);

export default Connections;