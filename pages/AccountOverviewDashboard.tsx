

// FIX: Corrected import statement for React hooks.
import React, { useState, useRef, useEffect } from 'react';
import { Account, TopQuery, Warehouse } from '../types';
import { accountSpend, topQueriesData, accountCostBreakdown, warehousesData } from '../data/dummyData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import BudgetStatusWidget from '../components/BudgetStatusWidget';
import { IconDotsVertical } from '../constants';
import SidePanel from '../components/SidePanel';
import TableView from '../components/TableView';
import InfoTooltip from '../components/InfoTooltip';

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-4 rounded-3xl border border-border-color shadow-sm ${className}`}>
        {title && <h4 className="text-base font-semibold text-text-strong mb-4">{title}</h4>}
        {children}
    </div>
);

const AccessibleBar = (props: any) => {
    const { x, y, width, height, fill, payload, onBarClick, ariaLabelGenerator } = props;
    if (!payload || width <= 0) return null;
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBarClick(payload);
        }
    };
    return (
        <g
            tabIndex={0}
            onClick={() => onBarClick(payload)}
            onKeyDown={handleKeyDown}
            aria-label={ariaLabelGenerator(payload)}
            role="button"
            style={{ cursor: 'pointer', outline: 'none' }}
            onFocus={(e) => {
                const rect = e.currentTarget.querySelector('rect');
                if(rect) rect.style.fill = '#5A28BE';
            }}
            onBlur={(e) => {
                const rect = e.currentTarget.querySelector('rect');
                if(rect) rect.style.fill = fill;
            }}
        >
            <rect x={x} y={y} width={width} height={height} fill={fill} />
        </g>
    );
};

const CustomTooltip = ({ active, payload, label, displayMode }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        return (
            <div className="bg-surface p-2 rounded-lg border border-border-color shadow-sm">
                <p className="font-mono text-xs mb-1 max-w-xs break-words">{label}</p>
                <div className="text-sm text-primary flex items-baseline">
                    <span className="font-semibold text-text-secondary mr-2">{displayMode === 'cost' ? 'Cost:' : 'Credits:'}</span>
                    {displayMode === 'cost' ? (
                        <span className="font-semibold text-text-primary">{`$${value.toLocaleString()}`}</span>
                    ) : (
                        <>
                            <span className="font-semibold text-text-primary">{value.toLocaleString()}</span>
                            <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                        </>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

interface AccountOverviewDashboardProps {
    account: Account;
}

const AccountOverviewDashboard: React.FC<AccountOverviewDashboardProps> = ({ account }) => {
    const [displayMode, setDisplayMode] = useState<'cost' | 'credits'>('cost');
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

    const handleDownloadCSV = (widgetType: string) => {
        let headers: string[] = [];
        let dataRows: (string | number)[][] = [];
        let fileName = '';
        const timestamp = new Date().toISOString();

        switch (widgetType) {
            case 'spend-breakdown':
                fileName = 'Spend_Breakdown';
                headers = ["Entity", "Cost", "Credits", "Percentage", "Timestamp"];
                dataRows = accountCostBreakdown.map(item => [item.name, item.cost, item.credits, item.percentage, timestamp]);
                break;
            case 'top-warehouses':
                fileName = 'Top_Warehouses';
                headers = ["Warehouse Name", "Cost", "Credits", "Timestamp"];
                dataRows = warehousesData.map(item => [item.name, item.cost, item.credits, timestamp]);
                break;
        }
        
        if (headers.length > 0) {
            const csvContent = [ headers.join(','), ...dataRows.map(row => row.join(',')) ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setOpenMenu(null);
    };

    const handleOpenSpendBreakdownTable = () => {
        const totalCost = accountCostBreakdown.reduce((sum, item) => sum + item.cost, 0);
        const totalCredits = accountCostBreakdown.reduce((sum, item) => sum + item.credits, 0);
        const data = accountCostBreakdown.map(item => ({
            name: item.name,
            cost: item.cost,
            credits: item.credits,
            percentage: displayMode === 'cost' ? (item.cost/totalCost * 100) : (item.credits/totalCredits * 100),
        }));
        setTableViewData({ title: "Spend Breakdown", data });
    };

    const monthlySpend = displayMode === 'cost' ? accountSpend.cost.monthly : accountSpend.credits.monthly;
    const forecastedSpend = displayMode === 'cost' ? accountSpend.cost.forecasted : accountSpend.credits.forecasted;
    const topQueries = [...topQueriesData].sort((a,b) => b[displayMode] - a[displayMode]).slice(0, 10);
    const topWarehouses = [...warehousesData].sort((a, b) => b[displayMode] - a[displayMode]).slice(0, 10);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">Account Overview</h1>
                <div className="bg-gray-200 rounded-full p-1 flex items-center" aria-label="Switch between Cost and Credits view">
                    <button onClick={() => setDisplayMode('cost')} aria-pressed={displayMode === 'cost'} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${ displayMode === 'cost' ? 'bg-white shadow text-text-primary' : 'text-text-secondary' }`}>Cost</button>
                    <button onClick={() => setDisplayMode('credits')} aria-pressed={displayMode === 'credits'} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${ displayMode === 'credits' ? 'bg-white shadow text-text-primary' : 'text-text-secondary' }`}>Credits</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <div className="flex items-center mb-4">
                        <h4 className="text-base font-semibold text-text-strong">Current Month Spend & Forecast</h4>
                        <InfoTooltip text="The total cost or credits consumed by this account this month, and the projected spend by the end of the month based on current usage patterns." />
                    </div>
                    <div className="space-y-2">
                        <div className="bg-background p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Current Spend</p>
                            <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                                {displayMode === 'cost' ? (
                                    `$${monthlySpend.toLocaleString()}`
                                ) : (
                                    <>
                                        <span>{monthlySpend.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-background p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Forecasted Spend</p>
                            <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                               {displayMode === 'cost' ? (
                                    `$${forecastedSpend.toLocaleString()}`
                                ) : (
                                    <>
                                        <span>{forecastedSpend.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <BudgetStatusWidget displayMode={displayMode} />

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Spend Breakdown</h4>
                            <InfoTooltip text="A breakdown of this account's monthly spend by the primary cost categories: compute (Warehouse) and storage." />
                        </div>
                        <div className="relative" ref={openMenu === 'spend-breakdown' ? menuRef : null}>
                            <button onClick={() => handleMenuClick('spend-breakdown')} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none" aria-label="Spend breakdown options" aria-haspopup="true" aria-expanded={openMenu === 'spend-breakdown'}>
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                            {openMenu === 'spend-breakdown' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => { handleOpenSpendBreakdownTable(); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>
                                        <button onClick={() => handleDownloadCSV('spend-breakdown')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        {accountCostBreakdown.map(item => {
                            const chartData = [{ value: item.percentage }, { value: 100 - item.percentage }];
                            const value = displayMode === 'cost' ? item.cost : item.credits;

                            return (
                                <div key={item.name} className="flex items-center justify-between gap-4">
                                    <div className="bg-background p-4 rounded-3xl flex-grow">
                                        <p className="text-text-secondary text-sm">{item.name}</p>
                                        <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                                            {displayMode === 'cost' ? (
                                                `$${value.toLocaleString()}`
                                            ) : (
                                                <>
                                                    <span>{value.toLocaleString()}</span>
                                                    <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 px-4">
                                        <div className="relative h-[80px] w-[80px]">
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
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                     <div className="text-center mt-4 pt-4 border-t border-border-light flex items-baseline justify-center">
                        <span className="text-sm text-text-secondary mr-1">Total Monthly Spend:</span>
                        <span className="text-sm font-semibold text-text-primary">
                             {displayMode === 'cost' ? (
                                `$${monthlySpend.toLocaleString()}.00`
                             ) : (
                                <>
                                    <span>{monthlySpend.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                                </>
                             )}
                        </span>
                    </div>
                </Card>
                
                <Card>
                    <div className="flex items-center mb-4">
                        <h4 className="text-base font-semibold text-text-strong">Top Queries in This Account</h4>
                        <InfoTooltip text="Lists the most expensive queries in this account based on cost or credits consumed." />
                    </div>
                        <div style={{ height: 360 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topQueries} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                                <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72' } }} />
                                <YAxis type="category" dataKey="queryText" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={150} tick={{ fill: '#5A5A72', fontSize: 12, width: 140 }} tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value} />
                                <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} content={<CustomTooltip displayMode={displayMode} />} />
                                <Bar dataKey={displayMode === 'cost' ? 'cost' : 'credits'} fill="#6932D5" barSize={12} shape={<AccessibleBar onBarClick={() => {}} ariaLabelGenerator={(p: any) => `Query: ${p.queryText}`} />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Top Warehouses in This Account</h4>
                            <InfoTooltip text="Lists the most resource-intensive warehouses in this account, ranked by cost or credits." />
                        </div>
                        <div className="relative" ref={openMenu === 'top-warehouses' ? menuRef : null}>
                            <button
                                onClick={() => handleMenuClick('top-warehouses')}
                                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                aria-label="Top warehouses options"
                                aria-haspopup="true"
                                aria-expanded={openMenu === 'top-warehouses'}
                            >
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                            {openMenu === 'top-warehouses' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => handleDownloadCSV('top-warehouses')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ height: 360 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topWarehouses} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                                <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72' } }} />
                                <YAxis type="category" dataKey="name" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={150} tick={{ fill: '#5A5A72', fontSize: 12, width: 140 }} tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value} />
                                <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} content={<CustomTooltip displayMode={displayMode} />} />
                                <Bar dataKey={displayMode === 'cost' ? 'cost' : 'credits'} fill="#6932D5" barSize={12} shape={<AccessibleBar onBarClick={() => {}} ariaLabelGenerator={(p: any) => `Warehouse: ${p.name}`} />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <SidePanel isOpen={!!tableViewData} onClose={() => setTableViewData(null)} title="Table View">
                {tableViewData && <TableView title={tableViewData.title} data={tableViewData.data} />}
            </SidePanel>
        </div>
    );
};

export default AccountOverviewDashboard;