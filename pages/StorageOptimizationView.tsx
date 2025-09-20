import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
    totalStorageMetrics,
    storageGrowthForecast,
    topStorageConsumersData,
    storageGrowthData
} from '../data/dummyData';
import { IconTrendingUp } from '../constants';

const WidgetCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
    <div className={`bg-surface rounded-3xl shadow-sm border border-border-color p-4 break-inside-avoid mb-4 ${className}`}>
        {title && <h3 className="text-base font-semibold text-text-strong mb-4">{title}</h3>}
        {children}
    </div>
);

// KPI Widgets
const TotalStorageKPI: React.FC = () => (
    <WidgetCard title="Total Storage">
        <p className="text-3xl font-bold text-text-primary">{totalStorageMetrics.totalSizeGB.toLocaleString()} GB</p>
        <p className="text-sm text-text-secondary">Total active storage</p>
    </WidgetCard>
);

const StorageCostKPI: React.FC = () => (
    <WidgetCard title="Storage Cost">
        <p className="text-3xl font-bold text-text-primary">${totalStorageMetrics.totalCost.toLocaleString()}</p>
        <p className="text-sm text-text-secondary">Estimated per month</p>
    </WidgetCard>
);

// Table Widget
const TableStorageAnalysisWidget: React.FC = () => (
    <WidgetCard title="Table Storage Analysis">
        <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
            <table className="w-full text-sm">
                <thead className="text-left text-xs text-text-secondary uppercase sticky top-0 bg-surface">
                    <tr>
                        <th className="py-2 px-3 font-medium">Table Name</th>
                        <th className="py-2 px-3 font-medium text-right">Size (GB)</th>
                        <th className="py-2 px-3 font-medium text-right">Rows</th>
                        <th className="py-2 px-3 font-medium">Last Updated</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                    {topStorageConsumersData.map(item => (
                        <tr key={item.name}>
                            <td className="py-2.5 px-3 font-mono text-xs text-text-primary">{item.name}</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-text-primary">{item.size.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right text-text-secondary">{item.rows?.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-text-secondary">{item.lastUpdated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </WidgetCard>
);

// Chart Widget
const StorageGrowthTrendsWidget: React.FC = () => (
    <WidgetCard title="Storage Growth Trends">
        <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={storageGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#9A9AB2" fontSize={12} />
                    <YAxis stroke="#9A9AB2" fontSize={12} unit=" GB" tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }}
                        labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
                        formatter={(value: number) => [`${value.toLocaleString()} GB`]}
                    />
                    <Legend verticalAlign="top" height={36} iconSize={10} />
                    <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6932D5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorTimeTravel" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="Active Storage (GB)" stroke="#6932D5" fillOpacity={1} fill="url(#colorActive)" />
                    <Area type="monotone" dataKey="Time Travel (GB)" stroke="#A78BFA" fillOpacity={1} fill="url(#colorTimeTravel)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </WidgetCard>
);

// Forecast Widget
const GrowthForecastWidget: React.FC = () => (
    <WidgetCard title="Growth Forecast">
        <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '150px' }}>
            <IconTrendingUp className="w-10 h-10 text-primary mb-2" />
            <p className="text-3xl font-bold text-text-primary">
                {storageGrowthForecast.nextMonthSizeGB.toLocaleString()} GB
            </p>
            <p className="text-sm text-text-secondary">projected next month</p>
            <p className="mt-2 text-lg font-semibold text-status-warning">
                +{storageGrowthForecast.growthPercentage}%
            </p>
        </div>
    </WidgetCard>
);

const StorageOptimizationView: React.FC = () => {
    return (
        <div className="columns-1 md:columns-2 gap-4">
            <TotalStorageKPI />
            <StorageCostKPI />
            <GrowthForecastWidget />
            <TableStorageAnalysisWidget />
            <StorageGrowthTrendsWidget />
        </div>
    );
};

export default StorageOptimizationView;