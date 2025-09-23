import React, { useState, useMemo } from 'react';
import { Database, DatabaseTable, User } from '../types';
import { databasesData, databaseTablesData, usersData } from '../data/dummyData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl shadow-sm border border-border-color p-4 break-inside-avoid mb-4 ${className}`}>
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
    const tables = useMemo(() => databaseTablesData.slice(0, 5 + Math.floor(Math.random() * 5)), [database.id]); 
    const topTables = useMemo(() => [...tables].sort((a,b) => b.sizeGB - a.sizeGB).slice(0, 5), [tables]);
    const users = useMemo(() => database.users.map(u => usersData.find(ud => ud.id === u.id)).filter((u): u is User => !!u), [database.users]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">{database.name}</h1>
                <button onClick={onBack} className="text-sm font-semibold text-link hover:underline">
                    &larr; Back to Databases
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <WidgetCard title="Top tables by storage">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topTables} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <XAxis type="number" stroke="#9A9AB2" fontSize={12} unit=" GB"/>
                                <YAxis dataKey="name" type="category" stroke="#9A9AB2" fontSize={12} width={120} tick={{width: 110}} tickFormatter={(val) => val.length > 15 ? `${val.substring(0,15)}...` : val}/>
                                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} GB`, 'Size']}/>
                                <Bar dataKey="sizeGB" fill="#6932D5" barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>
                
                <WidgetCard title="Associated users">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {users.map(user => (
                            <div key={user.id} className="flex items-center gap-3 p-2 bg-surface-nested rounded-xl">
                                <UserAvatar name={user.name} />
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                                    <p className="text-xs text-text-secondary">{user.role}</p>
                                </div>
                            </div>
                        ))}
                         {users.length === 0 && <p className="text-sm text-text-secondary text-center py-4">No users found for this database.</p>}
                    </div>
                </WidgetCard>

                <div className="lg:col-span-2">
                    <WidgetCard title="Table storage analysis">
                         <div className="overflow-auto max-h-96">
                            <table className="w-full text-sm">
                                <thead className="text-left text-xs text-text-secondary uppercase sticky top-0 bg-surface">
                                    <tr>
                                        <th className="py-2 px-3 font-medium">Table Name</th>
                                        <th className="py-2 px-3 font-medium text-right">Size (GB)</th>
                                        <th className="py-2 px-3 font-medium text-right">Rows</th>
                                        <th className="py-2 px-3 font-medium text-right">Growth (30d)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color">
                                    {tables.map(table => (
                                        <tr key={table.id} className="hover:bg-surface-hover">
                                            <td className="py-2.5 px-3 font-mono text-xs text-text-primary">{table.name}</td>
                                            <td className="py-2.5 px-3 text-right font-semibold text-text-primary">{table.sizeGB.toLocaleString()}</td>
                                            <td className="py-2.5 px-3 text-right text-text-secondary">{table.rows.toLocaleString()}</td>
                                            <td className={`py-2.5 px-3 text-right font-semibold ${table.monthlyGrowth >= 0 ? 'text-status-error' : 'text-status-success'}`}>{table.monthlyGrowth >= 0 ? '+' : ''}{table.monthlyGrowth.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </WidgetCard>
                </div>
            </div>
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
                        <thead className="bg-background text-xs text-text-secondary uppercase font-medium">
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
                                <tr key={db.id} className="border-t border-border-color hover:bg-surface-hover">
                                    <td className="px-6 py-4">
                                        <button onClick={() => onSelectDatabase(db.id)} className="font-medium text-link whitespace-nowrap cursor-pointer hover:underline">
                                            {db.name}
                                        </button>
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