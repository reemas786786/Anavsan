import React, { useState, useRef, useEffect } from 'react';
import { Account, OptimizationOpportunity, TopQuery, Warehouse } from '../types';
import { accountSpend, topQueriesData, optimizationOpportunitiesData, warehousesData, accountCostBreakdown } from '../data/dummyData';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import BudgetStatusWidget from '../components/BudgetStatusWidget';
import { IconDotsVertical } from '../constants';
import SidePanel from '../components/SidePanel';
import TableView from '../components/TableView';

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-4 rounded-3xl border border-border-color shadow-sm ${className}`}>
        {title && <h4 className="text-base font-semibold text-text-strong mb-4">{title}</h4>}
        {children}
    </div>
);

const AlertCard: React.FC<{ title: string, count: number, description: string }> = ({ title, count, description }) => (
     <div className="bg-status-warning-light p-4 rounded-3xl border border-status-warning-dark/50">
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
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [tableViewData, setTableViewData] = useState<{
        title: string;
        data: { name: string; cost: number; credits: number; percentage: number }[];
    } | null>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuClick = (menuId: string) => {
        setOpenMenu(prev => (prev === menuId ? null : menuId));
    };

    const handleOpenSpendBreakdownTable = () => {
        const totalCredits = accountCostBreakdown.reduce((sum, item) => sum + item.value, 0);
        
        const data = accountCostBreakdown.map(item => ({
            name: item.name.replace(' Costs', ''),
            cost: 0, // No cost data on this page
            credits: item.value,
            percentage: totalCredits > 0 ? (item.value / totalCredits) * 100 : 0,
        }));

        setTableViewData({
            title: "Spend Breakdown",
            data: data,
        });
    };
    
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
                                <div key={opp.id} className="bg-background p-3 rounded-3xl flex justify-between items-center">
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
                    <Card>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-base font-semibold text-text-strong">Spend Breakdown</h4>
                            <div className="relative" ref={openMenu === 'spend-breakdown' ? menuRef : null}>
                                <button
                                    onClick={() => handleMenuClick('spend-breakdown')}
                                    className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                    aria-label="Spend breakdown options"
                                    aria-haspopup="true"
                                    aria-expanded={openMenu === 'spend-breakdown'}
                                >
                                    <IconDotsVertical className="h-5 w-5" />
                                </button>
                                {openMenu === 'spend-breakdown' && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            <button onClick={() => { handleOpenSpendBreakdownTable(); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>
                                            <button onClick={() => setOpenMenu(null)} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-center py-4">
                            <div className="grid grid-cols-2 gap-8">
                                {accountCostBreakdown.map(item => {
                                    const chartData = [{ value: item.percentage }, { value: 100 - item.percentage }];
                                    const label = item.name.replace(' Costs', '');
                                    const displayValue = `${item.value.toLocaleString()} credits`;
                                    return (
                                        <div key={item.name} className="flex flex-col items-center text-center">
                                            <div className="relative h-[100px] w-[100px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={chartData}
                                                            dataKey="value"
                                                            innerRadius="70%"
                                                            outerRadius="100%"
                                                            startAngle={90}
                                                            endAngle={-270}
                                                            cy="50%"
                                                            cx="50%"
                                                            stroke="none"
                                                        >
                                                            <Cell fill={item.color} />
                                                            <Cell fill="#E5E5E0" />
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-text-primary">{item.percentage}%</span>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-text-secondary">
                                                <span className="font-semibold text-text-strong">{label}</span> — {displayValue}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="text-center mt-4 pt-4 border-t border-border-light">
                            <span className="text-sm text-text-secondary">Current Spend: </span>
                            <span className="text-sm font-semibold text-text-primary">{accountSpend.monthly.toLocaleString()} credits</span>
                        </div>
                    </Card>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard title="Warehouses" value={warehousesData.length.toString()} subValue="in this account" />
                        <StatCard title="Storage Used" value="2.1 TB" trend="+1.5% last 30d" />
                        <StatCard title="Idle Warehouses" value={idleWarehouses.toString()} />
                        <StatCard title="Suspended" value={suspendedWarehouses.toString()} />
                    </div>
                </div>
            </div>

            <SidePanel
                isOpen={!!tableViewData}
                onClose={() => setTableViewData(null)}
                title="Table View"
            >
                {tableViewData && (
                    <TableView
                        title={tableViewData.title}
                        data={tableViewData.data}
                    />
                )}
            </SidePanel>
        </div>
    );
};

export default AccountOverviewDashboard;