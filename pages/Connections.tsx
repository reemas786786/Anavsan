import React from 'react';
import { Account, ConnectionStatus } from '../types';

const IconSearch: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
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
}

const Connections: React.FC<ConnectionsProps> = ({ accounts, onSelectAccount, onAddAccountClick }) => {
    if (accounts.length === 0) {
        return <EmptyConnections onAdd={onAddAccountClick} />;
    }
  
    const activeAccounts = accounts.filter(a => a.status === 'Connected' || a.status === 'Syncing').length;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">Connections</h1>
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Accounts" value={accounts.length.toString()} />
                <MetricCard title="Active Accounts" value={activeAccounts.toString()} />
                <MetricCard title="Last Sync Status" value="Healthy" />
                <MetricCard title="Total Queries Synced" value="1.2M" />
            </div>

            {/* Actions and Table */}
            <div className="bg-surface p-6 rounded-xl border border-border-color shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-text-muted" />
                        </div>
                        <input type="text" placeholder="Filter accounts..." className="w-full pl-10 pr-4 py-2 border border-border-color rounded-lg text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                    </div>
                    <button onClick={onAddAccountClick} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm">
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
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map(account => (
                                <tr key={account.id} onClick={() => onSelectAccount(account)} className="border-t border-border-color hover:bg-surface-hover cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-link whitespace-nowrap">{account.name}</td>
                                    <td className="px-6 py-4">{account.identifier}</td>
                                    <td className="px-6 py-4">{account.role}</td>
                                    <td className="px-6 py-4"><StatusBadge status={account.status} /></td>
                                    <td className="px-6 py-4">{account.lastSynced}</td>
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
        <button onClick={onAdd} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Connect Account
        </button>
    </div>
);

export default Connections;