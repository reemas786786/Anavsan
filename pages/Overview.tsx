import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { topSpendData, costBreakdownData, topSpendByUserData, overviewMetrics } from '../data/dummyData';
import { Account } from '../types';
import { IconDotsVertical } from '../constants';

interface OverviewProps {
    onSelectAccount: (account: Account) => void;
    accounts: Account[];
}

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-4 rounded-3xl border border-border-color shadow-sm ${className}`}>
        {title && <h4 className="text-base font-semibold text-text-strong mb-4">{title}</h4>}
        {children}
    </div>
);

const resourceSummaryData = [
    { title: 'Snowflake account', value: '5' },
    { title: 'Warehouses', value: '12' },
    { title: 'Queries', value: '2,847' },
    { title: 'Storage (GB)', value: '2,085' },
];


const Overview: React.FC<OverviewProps> = ({ onSelectAccount, accounts }) => {
    const [displayMode, setDisplayMode] = useState<'cost' | 'credits'>('cost');
    const [showAllAccounts, setShowAllAccounts] = useState(false);
    const [showAllUsers, setShowAllUsers] = useState(false);
    
    const handleBarClick = (data: any) => {
        const account = accounts.find(acc => acc.id === data.id);
        if (account) {
            onSelectAccount(account);
        }
    };

    const sortedTopSpendData = [...topSpendData].sort((a, b) => {
        const key = displayMode === 'cost' ? 'cost' : 'credits';
        return b[key] - a[key];
    });

    const sortedTopSpendByUserData = [...topSpendByUserData].sort((a, b) => {
        const key = displayMode === 'cost' ? 'cost' : 'credits';
        return b[key] - a[key];
    });

    const handleUserBarClick = (data: any) => {
        if (data && data.activeLabel) {
            // In a real application, this would navigate to a detailed view for the user.
            console.log(`Drill down to user: ${data.activeLabel}`);
        }
    };
    
    const currentSpend = displayMode === 'cost' ? overviewMetrics.cost.current : overviewMetrics.credits.current;
    const forecastedSpend = displayMode === 'cost' ? overviewMetrics.cost.forecasted : overviewMetrics.credits.forecasted;

    // --- Custom Components for Condensed Charts ---
    const CustomShapeBar = (props: any) => {
        const { fill, x, y, width, height, index, isExpanded } = props;
        const isCondensed = !isExpanded && index >= 10;
    
        const barHeight = isCondensed ? height * 0.5 : height * 0.8; 
        const yPos = y + (height - barHeight) / 2;
    
        return <rect x={x} y={yPos} width={width} height={barHeight} fill={fill} />;
    };

    const CustomYAxisTick = (props: any) => {
        const { x, y, payload, index, isExpanded } = props;
        const isCondensed = !isExpanded && index >= 10;
        const fontSize = isCondensed ? 10 : 12;

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={4} textAnchor="end" fill="#5A5A72" fontSize={fontSize}>
                    {payload.value}
                </text>
            </g>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">Data Cloud Overview</h1>
                <div className="bg-gray-200 rounded-full p-1 flex items-center" aria-label="Switch between Cost and Credits view">
                    <button
                        onClick={() => setDisplayMode('cost')}
                        aria-pressed={displayMode === 'cost'}
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                            displayMode === 'cost' ? 'bg-white shadow text-text-primary' : 'text-text-secondary'
                        }`}
                    >
                        Cost
                    </button>
                    <button
                        onClick={() => setDisplayMode('credits')}
                        aria-pressed={displayMode === 'credits'}
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                            displayMode === 'credits' ? 'bg-white shadow text-text-primary' : 'text-text-secondary'
                        }`}
                    >
                        Credits
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="Current Month Cost & Forecast">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Current Spend</p>
                            <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">
                                {displayMode === 'cost' ? `$${currentSpend.toLocaleString()}` : `${currentSpend.toLocaleString()} credits`}
                            </p>
                        </div>
                        <div className="bg-background p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Forecasted Spend</p>
                            <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">
                                {displayMode === 'cost' ? `$${forecastedSpend.toLocaleString()}` : `${forecastedSpend.toLocaleString()} credits`}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card title="Resource Summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resourceSummaryData.map(item => (
                             <div key={item.title} className="bg-background p-4 rounded-3xl">
                                <p className="text-text-secondary text-sm">{item.title}</p>
                                <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-base font-semibold text-text-strong">Spend Breakdown</h4>
                        <button className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none" aria-label="Cost breakdown options">
                            <IconDotsVertical className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center justify-center py-4">
                        <div className="grid grid-cols-2 gap-8">
                            {costBreakdownData.map(item => {
                                const chartData = [{ value: item.percentage }, { value: 100 - item.percentage }];
                                const value = displayMode === 'cost' ? item.cost : item.credits;
                                const label = item.name.replace(' Costs', '');
                                const displayValue = displayMode === 'cost'
                                    ? `$${value.toLocaleString()}`
                                    : `${value.toLocaleString()} credits`;
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
                        <span className="text-sm font-semibold text-text-primary">
                             {displayMode === 'cost'
                                ? `$${currentSpend.toLocaleString()}`
                                : `${currentSpend.toLocaleString()} credits`}
                        </span>
                    </div>
                </Card>

                <Card title="Top Spend by Account">
                    <div style={{ height: 400, overflowY: 'auto' }} aria-live="polite">
                        <ResponsiveContainer width="100%" height={sortedTopSpendData.length * 35 + 40}>
                            <BarChart
                                layout="vertical"
                                data={sortedTopSpendData}
                                margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
                                // FIX: Explicitly typing `data` as `any` to resolve issue with Recharts type definitions where `activePayload` is not recognized.
                                onClick={(data: any) => data?.activePayload?.[0] && handleBarClick(data.activePayload[0].payload)}
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
                                    tick={<CustomYAxisTick isExpanded={showAllAccounts} />}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }}
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }}
                                    labelStyle={{ color: '#1E1E2D' }}
                                    formatter={(value: number) => [
                                        displayMode === 'cost' ? `$${value.toLocaleString()}`: `${value.toLocaleString()} credits`,
                                        displayMode === 'cost' ? 'Spend' : 'Credits'
                                    ]}
                                />
                                <Bar dataKey={displayMode === 'cost' ? 'cost' : 'credits'} fill="#6932D5" shape={<CustomShapeBar isExpanded={showAllAccounts} />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {sortedTopSpendData.length > 10 && (
                        <div className="text-center mt-2 border-t border-border-light pt-2">
                            <button
                                onClick={() => setShowAllAccounts(!showAllAccounts)}
                                className="text-sm font-semibold text-link hover:underline focus:outline-none"
                                aria-expanded={showAllAccounts}
                            >
                                {showAllAccounts ? 'Show Less' : `Show ${sortedTopSpendData.length - 10} More`}
                            </button>
                        </div>
                    )}
                </Card>

                <Card title="Top Spend by User">
                    <div style={{ height: 400, overflowY: 'auto' }} aria-live="polite">
                        <ResponsiveContainer width="100%" height={sortedTopSpendByUserData.length * 35 + 40}>
                            <BarChart
                                layout="vertical"
                                data={sortedTopSpendByUserData}
                                margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
                                onClick={handleUserBarClick}
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
                                    tick={<CustomYAxisTick isExpanded={showAllUsers} />}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(105, 50, 213, 0.1)', cursor: 'pointer' }}
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }}
                                    labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
                                    formatter={(value: number) => [
                                        displayMode === 'cost' ? `$${value.toLocaleString()}` : `${value.toLocaleString()} credits`,
                                        displayMode === 'cost' ? 'Spend' : 'Credits'
                                    ]}
                                />
                                <Bar
                                    dataKey={displayMode === 'cost' ? 'cost' : 'credits'}
                                    fill="#6932D5"
                                    shape={<CustomShapeBar isExpanded={showAllUsers} />}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     {sortedTopSpendByUserData.length > 10 && (
                        <div className="text-center mt-2 border-t border-border-light pt-2">
                            <button
                                onClick={() => setShowAllUsers(!showAllUsers)}
                                className="text-sm font-semibold text-link hover:underline focus:outline-none"
                                aria-expanded={showAllUsers}
                            >
                                {showAllUsers ? 'Show Less' : `Show ${sortedTopSpendByUserData.length - 10} More`}
                            </button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Overview;