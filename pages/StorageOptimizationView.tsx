import React from 'react';
import {
    topStorageConsumersData,
    unusedTablesData,
    duplicateDataPatternsData,
    storageOptimizationOpportunitiesData
} from '../data/dummyData';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl shadow-sm border border-border-color p-6 break-inside-avoid mb-4 ${className}`}>
        {title && <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>}
        {children}
    </div>
);

const TopStorageConsumingTablesWidget: React.FC = () => (
    <WidgetCard title="Top Storage Consuming Tables">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-xs text-text-secondary uppercase">
                    <tr>
                        <th className="pb-2 font-medium">Table Name</th>
                        <th className="pb-2 font-medium text-right">Size (GB)</th>
                        <th className="pb-2 font-medium text-right">Monthly Growth %</th>
                    </tr>
                </thead>
                <tbody>
                    {topStorageConsumersData.slice(0, 7).map(item => (
                        <tr key={item.name} className="border-t border-border-color">
                            <td className="py-2.5 font-mono text-xs text-text-primary">{item.name}</td>
                            <td className="py-2.5 text-right font-semibold text-text-primary">{item.size.toLocaleString()}</td>
                            <td className={`py-2.5 text-right font-semibold ${item.monthlyGrowth > 10 ? 'text-status-warning' : 'text-text-secondary'}`}>
                                {item.monthlyGrowth.toFixed(1)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </WidgetCard>
);

const UnusedDataWidget: React.FC = () => (
    <WidgetCard title="Orphaned / Unused Data">
         <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-left text-xs text-text-secondary uppercase">
                    <tr>
                        <th className="pb-2 font-medium">Table Name</th>
                        <th className="pb-2 font-medium">Last Queried</th>
                        <th className="pb-2 font-medium text-right">Potential Savings</th>
                    </tr>
                </thead>
                <tbody>
                    {unusedTablesData.map(table => (
                        <tr key={table.name} className="border-t border-border-color">
                            <td className="py-2.5">
                                <p className="font-mono text-xs font-semibold text-text-primary">{table.name}</p>
                                <p className="text-xs text-text-secondary">{table.size}</p>
                            </td>
                            <td className="py-2.5 text-text-secondary">{table.lastAccessed}</td>
                            <td className="py-2.5 text-right font-bold text-status-success-dark">${table.potentialSavings}/mo</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </WidgetCard>
);

const DuplicateDataPatternsWidget: React.FC = () => (
    <WidgetCard title="Duplicate Data Patterns">
        <div className="space-y-4">
            {duplicateDataPatternsData.map(pattern => (
                <div key={pattern.id} className="bg-surface-nested p-4 rounded-3xl border border-border-light">
                    <p className="text-sm text-text-secondary">Detected duplicate set:</p>
                    <div className="mt-1 space-y-0.5">
                        {pattern.datasets.map(ds => (
                            <p key={ds} className="font-mono text-xs font-semibold text-text-primary">{ds}</p>
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-border-color flex justify-between items-baseline">
                        <span className="text-sm text-text-secondary">Total Size: {pattern.size}</span>
                        <span className="text-sm font-bold text-status-success-dark">Save ~${pattern.potentialSavings}/mo</span>
                    </div>
                </div>
            ))}
             {duplicateDataPatternsData.length === 0 && (
                <p className="text-sm text-text-secondary text-center py-4">No duplicate patterns detected.</p>
            )}
        </div>
    </WidgetCard>
);


const StorageOpportunitiesWidget: React.FC = () => (
    <WidgetCard title="Compression & Partitioning Opportunities">
        <div className="space-y-4">
            {storageOptimizationOpportunitiesData.map(opp => (
                <div key={opp.id} className="bg-surface-nested p-4 rounded-3xl border border-border-light">
                     <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${opp.type === 'Compression' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{opp.type}</span>
                        <p className="font-mono text-xs font-semibold text-text-primary">{opp.tableName}</p>
                    </div>
                    <p className="text-sm text-text-secondary">{opp.recommendation}</p>
                    <p className="text-sm font-bold text-status-success-dark mt-2">Potential Savings: ~${opp.potentialSavings}/mo</p>
                </div>
            ))}
            {storageOptimizationOpportunitiesData.length === 0 && (
                <p className="text-sm text-text-secondary text-center py-4">No specific opportunities found.</p>
            )}
        </div>
    </WidgetCard>
);


const StorageOptimizationView: React.FC = () => {
    return (
        <div className="columns-1 lg:columns-2 gap-4">
            <TopStorageConsumingTablesWidget />
            <UnusedDataWidget />
            <DuplicateDataPatternsWidget />
            <StorageOpportunitiesWidget />
        </div>
    );
};

export default StorageOptimizationView;