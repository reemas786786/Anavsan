import React, { useState, useMemo } from 'react';
import { Database, DatabaseTable, User } from '../types';
import { databasesData, databaseTablesData, usersData } from '../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IconChevronLeft } from '../constants';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl p-4 break-inside-avoid mb-4 ${className}`}>
        {title && <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>}
        {children}
    </div>
);

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0" title={name}>
            {initials}
        </div>
    );
};


const DatabaseDetailView: React.FC<{ database: Database, onBack: () => void }> = ({ database, onBack }) => {
    const users = useMemo(() => database.users.map(u => usersData.find(ud => ud.id === u.id)).filter((u): u is User => !!u), [database.users]);

    const tablesWithUsers = useMemo(() => {
        const tables = databaseTablesData.slice(0, 10 + Math.floor(Math.random() * 10));
        if (users.length === 0) {
            return tables.map(table => ({...table, user: null}));
        }
        return tables.map(table => ({
            ...table,
            user: users[Math.floor(Math.random() * users.length)]
        }));
    }, [database.id, users]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors"
                    aria-label="Back to databases list"
                >
                    <IconChevronLeft className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-text-primary">{database.name}</h1>
            </div>
            
            <WidgetCard title="Table storage analysis">
                 <div className="overflow-auto max-h-[calc(100vh-300px)]">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-text-primary sticky top-0 bg-table-header-bg">
                            <tr>
                                <th className="py-2 px-3 font-medium">User</th>
                                <th className="py-2 px-3 font-medium">Table Name</th>
                                <th className="py-2 px-3 font-medium text-right">Size (GB)</th>
                                <th className="py-2 px-3 font-medium text-right">Rows</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {tablesWithUsers.map(table => (
                                <tr key={table.id} className="hover:bg-surface-hover">
                                     <td className="py-2.5 px-3">
                                        {table.user ? (
                                            <div className="flex items-center gap-2">
                                                <UserAvatar name={table.user.name} />
                                                <span className="text-xs text-text-primary whitespace-nowrap">{table.user.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-text-muted">N/A</span>
                                        )}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-xs text-text-primary">{table.name}</td>
                                    <td className="py-2.5 px-3 text-right font-semibold text-text-primary">{table.sizeGB.toLocaleString()}</td>
                                    <td className="py-2.5 px-3 text-right text-text-secondary">{table.rows.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </WidgetCard>
        </div>
    );
}

const DatabaseListView: React.FC<{ onSelectDatabase: (databaseId: string) => void }> = ({ onSelectDatabase }) => {
    const totalStorage = useMemo(() => databasesData.reduce((sum, db) => sum + db.sizeGB, 0), []);
    
    return (
         <div className="space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">Databases</h1>
            <WidgetCard>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-primary font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">Database Name</th>
                                <th scope="col" className="px-6 py-3">Size (GB)</th>
                                <th scope="col" className="px-6 py-3">% of Total</th>
                                <th scope="col" className="px-6 py-3">Cost ($)</th>
                                <th scope="col" className="px-6 py-3"># Tables</th>
                                <th scope="col" className="px-6 py-3"># Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            {databasesData.map(db => (
                                <tr key={db.id} className="border-t border-border-color hover:bg-surface-hover cursor-pointer" onClick={() => onSelectDatabase(db.id)}>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-link whitespace-nowrap">
                                            {db.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{db.sizeGB.toLocaleString()}</td>
                                    <td className="px-6 py-4">{totalStorage > 0 ? ((db.sizeGB / totalStorage) * 100).toFixed(1) : 0}%</td>
                                    <td className="px-6 py-4">${db.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4">{db.tableCount}</td>
                                    <td className="px-6 py-4">{db.userCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </WidgetCard>
        </div>
    );
};

interface DatabasesViewProps {
    selectedDatabaseId: string | null;
    onSelectDatabase: (databaseId: string) => void;
    onBackToList: () => void;
}

const DatabasesView: React.FC<DatabasesViewProps> = ({ selectedDatabaseId, onSelectDatabase, onBackToList }) => {
    const selectedDatabase = useMemo(() => {
        if (!selectedDatabaseId) return null;
        return databasesData.find(db => db.id === selectedDatabaseId) || null;
    }, [selectedDatabaseId]);

    if (selectedDatabase) {
        return <DatabaseDetailView database={selectedDatabase} onBack={onBackToList} />;
    }

    return <DatabaseListView onSelectDatabase={onSelectDatabase} />;
};

export default DatabasesView;