
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { costBreakdownData, overviewMetrics } from '../data/dummyData';
import { Account, User } from '../types';
import { IconDotsVertical } from '../constants';

interface OverviewProps {
    onSelectAccount: (account: Account) => void;
    onSelectUser: (user: User) => void;
    accounts: Account[];
    users: User[];
}

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-4 rounded-3xl border border-border-color shadow-sm ${className}`}>
        {title && <h4 className="text-base font-semibold text-text-strong mb-4">{title}</h4>}
        {children}
    </div>
);

const resourceSummaryData = [
    { title: 'Snowflake account', value: '5' },
    { title: 'Warehouses Monitored', value: '12' },
    { title: 'Executed Queries (Month)', value: '2,847' },
    { title: 'Storage Used (GB, Month)', value: '2,085' },
];

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


const Overview: React.FC<OverviewProps> = ({ onSelectAccount, onSelectUser, accounts, users }) => {
    const [displayMode, setDisplayMode] = useState<'cost' | 'credits'>('cost');
    
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
                    <div style={{ height: 400 }} aria-live="polite">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={sortedTopSpendData}
                                margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
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
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }}
                                    labelStyle={{ color: '#1E1E2D' }}
                                    formatter={(value: number) => [
                                        displayMode === 'cost' ? `$${value.toLocaleString()}`: `${value.toLocaleString()} credits`,
                                        displayMode === 'cost' ? 'Spend' : 'Credits'
                                    ]}
                                />
                                <Bar 
                                    dataKey={displayMode === 'cost' ? 'cost' : 'credits'} 
                                    fill="#6932D5" 
                                    barSize={20}
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

                <Card title="Top Spend by User">
                    <div style={{ height: 400 }} aria-live="polite">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topUsers}
                                margin={{ top: 5, right: 30, left: 100, bottom: 20 }}
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
                                    barSize={15}
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
        </div>
    );
};

export default Overview;
