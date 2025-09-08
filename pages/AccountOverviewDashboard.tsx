import React from 'react';
import { Account, OptimizationOpportunity, TopQuery, Warehouse } from '../types';
import { accountSpend, topQueriesData, optimizationOpportunitiesData, warehousesData, accountCostBreakdown } from '../data/dummyData';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import BudgetStatusWidget from '../components/BudgetStatusWidget';

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-6 rounded-xl border border-border-color shadow-sm ${className}`}>
        {title && <h2 className="text-sm font-semibold text-text-primary mb-4">{title}</h2>}
        {children}
    </div>
);

const AlertCard: React.FC<{ title: string, count: number, description: string }> = ({ title, count, description }) => (
     <div className="bg-status-warning-light p-4 rounded-xl border border-status-warning-dark/50">
        <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-status-warning-dark">{title}</p>
            <span className="text-sm font-bold text-status-warning-dark bg-white/50 px-2 py-0.5 rounded-full">{count}</span>
        </div>
        <p className="text-lg font-bold text-status-warning-dark mt-2">{description}</p>
    </div>
);

const WarehouseUtilizationBar: React.FC<{ avg: number, peak: number }> = ({ avg, peak }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${avg}%` }}></div>
        <div className="absolute top-0 h-full border-r-2 border-gray-600" style={{ left: `${peak}%` }}></div>
    </div>
);


interface AccountOverviewDashboardProps {
    account: Account;
}

const AccountOverviewDashboard: React.FC<AccountOverviewDashboardProps> = ({ account }) => {
    const idleWarehouses = warehousesData.filter(w => w.status === 'Idle').length;
    const suspendedWarehouses = warehousesData.filter(w => w.status === 'Suspended').length;

    return (
        <div className="space-y-4">
            {/* Top Row: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Monthly Spend" value={`${accountSpend.monthly.toLocaleString()} credits`} trend="+5.2% vs last month" />
                <StatCard title="Forecasted Spend" value={`${accountSpend.forecasted.toLocaleString()} credits`} />
                <StatCard title="Year-to-Date Spend" value={`${accountSpend.ytd.toLocaleString()} credits`} />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    {/* Actionable Insights */}
                    <Card title="Query Optimization Opportunities">
                        <div className="space-y-3">
                            {optimizationOpportunitiesData.map((opp: OptimizationOpportunity) => (
                                <div key={opp.id} className="bg-background p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-mono text-xs text-text-secondary truncate max-w-md">{opp.queryText}</p>
                                        <p className="text-sm text-text-primary font-medium">{opp.recommendation}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-lg font-bold text-status-success">{opp.potentialSavings.toFixed(1)}</p>
                                        <p className="text-xs text-status-success-dark">credits saved</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Top Queries in This Account (by Credits)">
                        <table className="w-full text-sm text-left">
                           <thead className="text-xs text-text-secondary uppercase">
                                <tr>
                                    <th className="py-2">Query</th>
                                    <th className="py-2">Credits</th>
                                    <th className="py-2">User</th>
                                    <th className="py-2">Duration</th>
                                </tr>
                           </thead>
                           <tbody>
                            {topQueriesData.map((q: TopQuery) => (
                                <tr key={q.id} className="border-t border-border-color">
                                    <td className="py-2 font-mono text-xs truncate max-w-xs">{q.queryText}</td>
                                    <td className="py-2 font-medium text-text-primary">{q.credits.toFixed(1)}</td>
                                    <td className="py-2">{q.user}</td>
                                    <td className="py-2">{q.duration}</td>
                                </tr>
                            ))}
                           </tbody>
                        </table>
                    </Card>
                    
                    <Card title="Warehouse Utilization">
                        <table className="w-full text-sm text-left">
                           <thead className="text-xs text-text-secondary uppercase">
                                <tr>
                                    <th className="py-2 w-1/4">Warehouse</th>
                                    <th className="py-2 w-1/2">Avg / Peak Utilization</th>
                                    <th className="py-2 w-1/4 text-right">Status</th>
                                </tr>
                           </thead>
                           <tbody>
                            {warehousesData.map((w: Warehouse) => (
                                <tr key={w.id} className="border-t border-border-color">
                                    <td className="py-2 font-medium text-text-primary">{w.name}</td>
                                    <td className="py-2"><WarehouseUtilizationBar avg={w.avgUtilization} peak={w.peakUtilization} /></td>
                                    <td className="py-2 text-right">{w.status}</td>
                                </tr>
                            ))}
                           </tbody>
                        </table>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-4">
                    <AlertCard title="Active Anomalies" count={1} description="Unusual spike in ETL_WH" />
                    <BudgetStatusWidget />
                    <Card title="Account Cost Breakdown">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={accountCostBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                    {accountCostBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <ul className="text-sm space-y-2 mt-4">
                            {accountCostBreakdown.map(item => (
                                <li key={item.name} className="flex justify-between items-center">
                                    <span className="flex items-center"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: item.color}}></span>{item.name}</span>
                                    <span className="font-semibold">{item.value.toLocaleString()} credits</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Warehouses" value={warehousesData.length.toString()} subValue="in this account" />
                        <StatCard title="Storage Used" value="2.1 TB" trend="+1.5% last 30d" />
                        <StatCard title="Idle Warehouses" value={idleWarehouses.toString()} />
                        <StatCard title="Suspended" value={suspendedWarehouses.toString()} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountOverviewDashboard;