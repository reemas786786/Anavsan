import React from 'react';
import { DatabaseTable } from '../types';
import { IconChevronLeft } from '../constants';

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className = '' }) => (
    <div className={className}>
        <p className="text-sm text-text-secondary">{label}</p>
        <div className="text-base font-semibold text-text-primary mt-1">{value || 'N/A'}</div>
    </div>
);

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => (
    <div className="bg-surface p-6 rounded-2xl border border-border-color">
        <h3 className="text-lg font-bold text-text-strong mb-4">{title}</h3>
        {children}
    </div>
);

interface TableDetailViewProps {
    table: DatabaseTable;
    onBack: () => void;
}

const TableDetailView: React.FC<TableDetailViewProps> = ({ table, onBack }) => {
    return (
        <div className="space-y-4">
             <div className="flex items-center gap-2">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors"
                    aria-label="Back to tables list"
                >
                    <IconChevronLeft className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{table.name}</h1>
                    <p className="text-sm text-text-secondary">Table Details</p>
                </div>
            </div>

            <Card title="Table Overview">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                    <DetailItem label="Table Name" value={table.name} />
                    <DetailItem label="Owner/Creator" value={table.owner} />
                    <DetailItem label="Creation Date" value={table.creationDate} />
                    <DetailItem label="Last Modified" value={table.lastModified} />
                    <DetailItem label="Last Accessed" value={table.lastAccessed} />
                    <DetailItem label="Table Type" value={table.tableType} />
                    <DetailItem label="Total Size" value={`${table.sizeGB.toLocaleString()} GB`} />
                    <DetailItem label="Row Count" value={table.rows.toLocaleString()} />
                    <DetailItem label="Clustering Key" value={table.clusteringKey ? <code className="text-sm bg-surface-nested p-1 rounded">{table.clusteringKey}</code> : 'N/A'} />
                    <DetailItem label="Time Travel" value={`${table.timeTravelRetentionDays} days`} />
                    <DetailItem label="Fail-safe" value={`${table.failSafePeriodDays} days`} />
                </div>
                <div className="mt-6 pt-4 border-t border-border-light">
                     <DetailItem label="Full Qualified Name" value={<code className="text-sm bg-surface-nested p-1 rounded">{table.fullyQualifiedName}</code>} />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card title="Storage Breakdown">
                    <p className="text-sm text-text-secondary">A chart showing active vs. time-travel vs. fail-safe storage will be here.</p>
                </Card>
                 <Card title="Cost Trend">
                    <p className="text-sm text-text-secondary">A chart showing the storage cost trend for this table will be here.</p>
                </Card>
            </div>

            <Card title="Schema">
                <p className="text-sm text-text-secondary">A table displaying the column names and data types for this table will be here.</p>
            </Card>

            <Card title="Optimization Recommendations">
                <p className="text-sm text-text-secondary">AI-powered recommendations, such as clustering key suggestions or compression opportunities, will be displayed here.</p>
            </Card>
        </div>
    );
};

export default TableDetailView;
