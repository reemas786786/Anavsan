import React, { useState, useMemo } from 'react';
import { Database, DatabaseTable, User, Schema } from '../types';
import { databasesData } from '../data/dummyData';
import { IconChevronLeft } from '../constants';
import TableDetailView from './TableDetailView';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl p-4 break-inside-avoid mb-4 ${className}`}>
        {title && <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>}
        {children}
    </div>
);

const DatabaseListView: React.FC<{ onSelectDatabase: (db: Database) => void }> = ({ onSelectDatabase }) => {
    const totalStorage = useMemo(() => databasesData.reduce((sum, db) => sum + db.sizeGB, 0), []);
    
    return (
        <div className="space-y-4">
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
                                <tr key={db.id} className="border-t border-border-color hover:bg-surface-hover cursor-pointer" onClick={() => onSelectDatabase(db)}>
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

const SchemaListView: React.FC<{ database: Database, onSelectSchema: (schema: Schema) => void, onBack: () => void }> = ({ database, onSelectSchema, onBack }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" aria-label="Back to databases">
                <IconChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-text-primary">Schemas in {database.name}</h2>
        </div>
        <WidgetCard>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-xs text-text-primary bg-table-header-bg">
                        <tr>
                            <th className="py-2 px-3 font-medium">Schema Name</th>
                            <th className="py-2 px-3 font-medium">Table Count</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {database.schemas.map(schema => (
                            <tr key={schema.id} className="hover:bg-surface-hover cursor-pointer" onClick={() => onSelectSchema(schema)}>
                                <td className="py-2.5 px-3 font-medium text-link whitespace-nowrap">{schema.name}</td>
                                <td className="py-2.5 px-3">{schema.tableCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </WidgetCard>
    </div>
);

const TableListView: React.FC<{ schema: Schema, onSelectTable: (table: DatabaseTable) => void, onBack: () => void }> = ({ schema, onSelectTable, onBack }) => (
    <div className="space-y-4">
         <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" aria-label="Back to schemas">
                <IconChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-text-primary">Tables in {schema.name}</h2>
        </div>
        <WidgetCard>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-xs text-text-primary bg-table-header-bg">
                        <tr>
                            <th className="py-2 px-3 font-medium">Table Name</th>
                            <th className="py-2 px-3 font-medium text-right">Size (GB)</th>
                            <th className="py-2 px-3 font-medium text-right">Rows</th>
                            <th className="py-2 px-3 font-medium text-right">Monthly Growth (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {schema.tables.map(table => (
                            <tr key={table.id} className="hover:bg-surface-hover cursor-pointer" onClick={() => onSelectTable(table)}>
                                <td className="py-2.5 px-3 font-medium text-link whitespace-nowrap">{table.name}</td>
                                <td className="py-2.5 px-3 text-right font-semibold text-text-primary">{table.sizeGB.toLocaleString()}</td>
                                <td className="py-2.5 px-3 text-right text-text-secondary">{table.rows.toLocaleString()}</td>
                                <td className={`py-2.5 px-3 text-right ${table.monthlyGrowth > 0 ? 'text-status-error-dark' : 'text-status-success-dark'}`}>{table.monthlyGrowth}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </WidgetCard>
    </div>
);


interface DatabasesViewProps {
    selectedDatabase: Database | null;
    setSelectedDatabase: (db: Database | null) => void;
    selectedSchema: Schema | null;
    setSelectedSchema: (schema: Schema | null) => void;
    selectedTable: DatabaseTable | null;
    setSelectedTable: (table: DatabaseTable | null) => void;
}

const DatabasesView: React.FC<DatabasesViewProps> = ({ 
    selectedDatabase, setSelectedDatabase,
    selectedSchema, setSelectedSchema,
    selectedTable, setSelectedTable
}) => {
    
    const viewContent = () => {
        if (selectedTable && selectedSchema && selectedDatabase) {
            return <TableDetailView table={selectedTable} onBack={() => setSelectedTable(null)} />;
        }
        if (selectedSchema && selectedDatabase) {
            return <TableListView schema={selectedSchema} onSelectTable={setSelectedTable} onBack={() => setSelectedSchema(null)} />;
        }
        if (selectedDatabase) {
            return <SchemaListView database={selectedDatabase} onSelectSchema={setSelectedSchema} onBack={() => setSelectedDatabase(null)} />;
        }
        return <DatabaseListView onSelectDatabase={setSelectedDatabase} />;
    };

    return (
        <div className="pt-4 px-4 space-y-4">
            {!selectedDatabase && (
                 <div>
                    <h1 className="text-2xl font-bold text-text-primary">Databases</h1>
                    <p className="mt-1 text-text-secondary">Explore storage and cost metrics for all databases in this account.</p>
                </div>
            )}
            {viewContent()}
        </div>
    );
};

export default DatabasesView;
