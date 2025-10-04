
import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
<<<<<<< HEAD
import { costBreakdownData, overviewMetrics, resourceSummaryData as initialResourceSummaryData, ytdOverviewMetrics } from '../data/dummyData';
=======
import { costBreakdownData, overviewMetrics, resourceSummaryData as initialResourceSummaryData } from '../data/dummyData';
>>>>>>> eb9bc86 (deploy script added)
import { Account, User, BigScreenWidget } from '../types';
import { IconDotsVertical } from '../constants';
import SidePanel from '../components/SidePanel';
import TableView from '../components/TableView';
import InfoTooltip from '../components/InfoTooltip';

interface OverviewProps {
    onSelectAccount: (account: Account) => void;
    onSelectUser: (user: User) => void;
    accounts: Account[];
    users: User[];
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    displayMode: 'cost' | 'credits';
}

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-4 rounded-3xl break-inside-avoid mb-4 ${className}`}>
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
                if(rect) rect.style.fill = '#5A28BE'; // primary-hover color
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
            <div className="bg-surface p-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-text-strong mb-1">{label}</p>
                <div className="text-sm text-primary flex items-baseline">
                    <span className="font-semibold text-text-secondary mr-2">{displayMode === 'cost' ? 'Spend:' : 'Credits:'}</span>
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


const Overview: React.FC<OverviewProps> = ({ onSelectAccount, onSelectUser, accounts, users, onSetBigScreenWidget, displayMode }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const [tableViewData, setTableViewData] = useState<{
        title: string;
        data: { name: string; cost: number; credits: number; percentage: number }[];
    } | null>(null);
    
    const resourceSummaryData = [
        { title: 'Snowflake accounts', value: accounts.length.toString() },
        ...initialResourceSummaryData,
    ];

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

    const downloadCSV = (content: string, fileName: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName.replace(/\s+/g, '_')}_${date}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadCSV = (widgetType: string) => {
        let headers: string[] = [];
        let dataRows: (string | number)[][] = [];
        let fileName = '';
        const timestamp = new Date().toISOString();

        switch (widgetType) {
            case 'cost-forecast':
                fileName = 'current_month_spend_and_forecast';
                headers = ['Metric', 'Cost', 'Credits', 'Timestamp'];
                dataRows = [
                    ['Current Spend', overviewMetrics.cost.current, overviewMetrics.credits.current, timestamp],
                    ['Forecasted Spend', overviewMetrics.cost.forecasted, overviewMetrics.credits.forecasted, timestamp]
                ];
                break;
<<<<<<< HEAD
            case 'ytd-spend':
                fileName = 'year_to_date_spend_and_forecast';
                headers = ['Metric', 'Cost', 'Credits', 'Timestamp'];
                dataRows = [
                    ['Current YTD Spend', ytdOverviewMetrics.cost.current, ytdOverviewMetrics.credits.current, timestamp],
                    ['Forecasted YTD Spend', ytdOverviewMetrics.cost.forecasted, ytdOverviewMetrics.credits.forecasted, timestamp]
                ];
                break;
=======
>>>>>>> eb9bc86 (deploy script added)
            case 'resource-summary':
                fileName = 'resource_summary';
                headers = ['Metric', 'Value', 'Timestamp'];
                dataRows = resourceSummaryData.map(item => [`"${item.title}"`, `"${item.value}"`, timestamp]);
                break;
            case 'spend-breakdown':
                fileName = 'spend_breakdown';
                headers = ['Entity', 'Cost', 'Credits', 'Timestamp'];
                dataRows = costBreakdownData.map(item => [item.name, item.cost, item.credits, timestamp]);
                break;
            case 'top-spend-account':
                fileName = 'top_spend_by_account';
                headers = ['Entity', 'Cost', 'Credits', 'Timestamp'];
                dataRows = accounts.map(item => [`"${item.name}"`, item.cost, item.credits, timestamp]);
                break;
            case 'top-spend-user':
                fileName = 'top_spend_by_user';
                headers = ['Entity', 'Cost', 'Credits', 'Timestamp'];
                dataRows = users.map(item => [`"${item.name}"`, item.cost, item.credits, timestamp]);
                break;
        }
        
        if (headers.length > 0) {
            const csvContent = [
                headers.join(','),
                ...dataRows.map(row => row.join(','))
            ].join('\n');
            downloadCSV(csvContent, fileName);
        }
        setOpenMenu(null);
    };

    
    const handleOpenSpendBreakdownTable = () => {
        const totalCost = costBreakdownData.reduce((sum, item) => sum + item.cost, 0);
        const totalCredits = costBreakdownData.reduce((sum, item) => sum + item.credits, 0);

        const data = costBreakdownData.map(item => ({
            name: item.name,
            cost: item.cost,
            credits: item.credits,
            percentage: (displayMode === 'cost' ? item.cost / totalCost : item.credits / totalCredits) * 100,
        }));

        setTableViewData({
            title: "Spend breakdown",
            data: data,
        });
    };

    const handleOpenTopAccountTable = () => {
        const totalCost = accounts.reduce((sum, item) => sum + item.cost, 0);
        const totalCredits = accounts.reduce((sum, item) => sum + item.credits, 0);

        const data = accounts.map(item => ({
            name: item.name,
            cost: item.cost,
            credits: item.credits,
            percentage: totalCost > 0 || totalCredits > 0 ? (displayMode === 'cost' ? (item.cost / totalCost) * 100 : (item.credits / totalCredits) * 100) : 0,
        }));

        setTableViewData({
            title: "Top spend by account",
            data: data,
        });
    };

    const handleOpenTopUserTable = () => {
        const totalCost = users.reduce((sum, item) => sum + item.cost, 0);
        const totalCredits = users.reduce((sum, item) => sum + item.credits, 0);

        const data = users.map(item => ({
            name: item.name,
            cost: item.cost,
            credits: item.credits,
            percentage: totalCost > 0 || totalCredits > 0 ? (displayMode === 'cost' ? (item.cost / totalCost) * 100 : (item.credits / totalCredits) * 100) : 0,
        }));

        setTableViewData({
            title: "Top spend by user",
            data: data,
        });
    };

    const handleBarClick = (data: any) => {
        const account = accounts.find(acc => acc.id === data.id);
        if (account) {
            onSelectAccount(account);
        }
    };

    const sortedTopSpendData = [...accounts].sort((a, b) => {
        const key = displayMode === 'cost' ? 'cost' : 'credits';
        return b[key] - a[key];
    }).slice(0, 10);

    const topUsers = [...users].sort((a, b) => {
        const key = displayMode === 'cost' ? 'cost' : 'credits';
        return b[key] - a[key];
    }).slice(0, 10);

    const handleUserBarClick = (data: any) => {
        const user = users.find(u => u.id === data.id);
        if (user) {
            onSelectUser(user);
        }
    };
    
    const currentSpend = displayMode === 'cost' ? overviewMetrics.cost.current : overviewMetrics.credits.current;
    const forecastedSpend = displayMode === 'cost' ? overviewMetrics.cost.forecasted : overviewMetrics.credits.forecasted;
<<<<<<< HEAD
    const ytdCurrentSpend = displayMode === 'cost' ? ytdOverviewMetrics.cost.current : ytdOverviewMetrics.credits.current;
    const ytdForecastedSpend = displayMode === 'cost' ? ytdOverviewMetrics.cost.forecasted : ytdOverviewMetrics.credits.forecasted;
=======
>>>>>>> eb9bc86 (deploy script added)
    const barHeight = 12;
    const userBarHeight = 12;


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">Data Cloud Overview</h1>
            </div>


            <div className="columns-1 lg:columns-2 gap-4">
                <Card>
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Month-to-date Spend</h4>
                            <InfoTooltip text="The total cost or credits consumed this month, and the projected spend by the end of the month based on current usage patterns." />
                        </div>
                        <div className="relative" ref={openMenu === 'cost-forecast' ? menuRef : null}>
                            <button
                                onClick={() => handleMenuClick('cost-forecast')}
                                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                aria-label="Cost and forecast options"
                                aria-haspopup="true"
                                aria-expanded={openMenu === 'cost-forecast'}
                            >
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                             {openMenu === 'cost-forecast' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface shadow-lg z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => handleDownloadCSV('cost-forecast')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface-nested p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Current spend</p>
                            <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                                {displayMode === 'cost' ? (
                                    `$${currentSpend.toLocaleString()}.00`
                                ) : (
                                    <>
                                        <span>{currentSpend.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-surface-nested p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Forecasted spend</p>
                            <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                                {displayMode === 'cost' ? (
                                    `$${forecastedSpend.toLocaleString()}.00`
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
<<<<<<< HEAD
                
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Year-to-date Spend</h4>
                            <InfoTooltip text="The total cost or credits consumed this year, and the projected spend by the end of the year based on current usage patterns." />
                        </div>
                        <div className="relative" ref={openMenu === 'ytd-spend' ? menuRef : null}>
                            <button
                                onClick={() => handleMenuClick('ytd-spend')}
                                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                aria-label="Year-to-date spend options"
                                aria-haspopup="true"
                                aria-expanded={openMenu === 'ytd-spend'}
                            >
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                                {openMenu === 'ytd-spend' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface shadow-lg z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => handleDownloadCSV('ytd-spend')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface-nested p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Current spend</p>
                            <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                                {displayMode === 'cost' ? (
                                    `$${ytdCurrentSpend.toLocaleString()}.00`
                                ) : (
                                    <>
                                        <span>{ytdCurrentSpend.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="bg-surface-nested p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Forecasted spend</p>
                            <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                                {displayMode === 'cost' ? (
                                    `$${ytdForecastedSpend.toLocaleString()}.00`
                                ) : (
                                    <>
                                        <span>{ytdForecastedSpend.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
=======
>>>>>>> eb9bc86 (deploy script added)

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Resource summary</h4>
                            <InfoTooltip text="A high-level summary of monitored resources and activities within the current month." />
                        </div>
                        <div className="relative" ref={openMenu === 'resource-summary' ? menuRef : null}>
                            <button
                                onClick={() => handleMenuClick('resource-summary')}
                                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                aria-label="Resource summary options"
                                aria-haspopup="true"
                                aria-expanded={openMenu === 'resource-summary'}
                            >
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                             {openMenu === 'resource-summary' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface shadow-lg z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => handleDownloadCSV('resource-summary')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resourceSummaryData.map(item => (
                             <div key={item.title} className="bg-surface-nested p-4 rounded-3xl">
                                <p className="text-text-secondary text-sm">{item.title}</p>
                                <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Spend breakdown</h4>
                            <InfoTooltip text="A breakdown of monthly spend by the primary cost categories: compute (Warehouse) and storage." />
                        </div>
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
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => { onSetBigScreenWidget({ type: 'spend_breakdown', title: 'Spend breakdown' }); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">View in Big Screen</button>
                                        <button onClick={() => { handleOpenSpendBreakdownTable(); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>
                                        <button onClick={() => handleDownloadCSV('spend-breakdown')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="space-y-4">
                        {costBreakdownData.map(item => {
                            const chartData = [{ value: item.percentage }, { value: 100 - item.percentage }];
                            const value = displayMode === 'cost' ? item.cost : item.credits;

                            return (
                                <div key={item.name} className="flex items-center justify-between gap-4">
                                    <div className="bg-surface-nested p-4 rounded-3xl flex-grow">
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
                    <div className="text-center mt-4 pt-4 flex items-baseline justify-center">
                        <span className="text-sm text-text-secondary mr-1">Current Spend:</span>
                        <span className="text-sm font-semibold text-text-primary">
                             {displayMode === 'cost' ? (
                                `$${currentSpend.toLocaleString()}.00`
                             ) : (
                                <>
                                    <span>{currentSpend.toLocaleString()}</span>
                                    <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                                </>
                             )}
                        </span>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Top spend by account</h4>
                            <InfoTooltip text="Displays the top 10 accounts ranked by their total cost or credit consumption for the current period." />
                        </div>
                        <div className="relative" ref={openMenu === 'top-spend-account' ? menuRef : null}>
                            <button
                                onClick={() => handleMenuClick('top-spend-account')}
                                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                aria-label="Top spend by account options"
                                aria-haspopup="true"
                                aria-expanded={openMenu === 'top-spend-account'}
                            >
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                             {openMenu === 'top-spend-account' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => { onSetBigScreenWidget({ type: 'account', title: 'Top spend by account' }); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">View in Big Screen</button>
                                        <button onClick={() => { handleOpenTopAccountTable(); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>
                                        <button onClick={() => handleDownloadCSV('top-spend-account')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ height: 360 }} aria-live="polite">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={sortedTopSpendData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                                barCategoryGap="10%"
                            >
                                <XAxis
                                    type="number"
                                    stroke="#5A5A72"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E5E5E0' }}
                                    label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 12, fontWeight: 500 } }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="#5A5A72"
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    width={100}
                                    tick={{ fill: '#5A5A72', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }}
                                    content={<CustomTooltip displayMode={displayMode} />}
                                />
                                <Bar 
                                    dataKey={displayMode === 'cost' ? 'cost' : 'credits'} 
                                    fill="#6932D5" 
                                    barSize={barHeight}
                                    shape={
                                        <AccessibleBar 
                                            onBarClick={handleBarClick} 
                                            ariaLabelGenerator={(p: any) => `Navigate to Account Overview for ${p.name}`}
                                        />
                                    } 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <h4 className="text-base font-semibold text-text-strong">Top spend by user</h4>
                            <InfoTooltip text="Displays the top 10 users ranked by their total cost or credit consumption for the current period." />
                        </div>
                         <div className="relative" ref={openMenu === 'top-spend-user' ? menuRef : null}>
                            <button
                                onClick={() => handleMenuClick('top-spend-user')}
                                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                                aria-label="Top spend by user options"
                                aria-haspopup="true"
                                aria-expanded={openMenu === 'top-spend-user'}
                            >
                                <IconDotsVertical className="h-5 w-5" />
                            </button>
                             {openMenu === 'top-spend-user' && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <button onClick={() => { onSetBigScreenWidget({ type: 'user', title: 'Top spend by user' }); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">View in Big Screen</button>
                                        <button onClick={() => { handleOpenTopUserTable(); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>
                                        <button onClick={() => handleDownloadCSV('top-spend-user')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ height: 360 }} aria-live="polite">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topUsers}
                                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                                barCategoryGap="20%"
                            >
                                <XAxis
                                    type="number"
                                    stroke="#5A5A72"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E5E5E0' }}
                                    label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 12, fontWeight: 500 } }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="#5A5A72"
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    width={100}
                                    tick={{ fill: '#5A5A72', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(105, 50, 213, 0.1)', cursor: 'pointer' }}
                                    content={<CustomTooltip displayMode={displayMode} />}
                                />
                                <Bar
                                    dataKey={displayMode === 'cost' ? 'cost' : 'credits'}
                                    fill="#6932D5"
                                    barSize={userBarHeight}
                                    shape={
                                        <AccessibleBar 
                                            onBarClick={handleUserBarClick}
                                            ariaLabelGenerator={(p: any) => `Navigate to User Overview for ${p.name}`}
                                        />
                                    }
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
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

export default Overview;
