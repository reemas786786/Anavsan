import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { topSpendData, costBreakdownData, topSpendByUserData } from '../data/dummyData';
import { Account } from '../types';

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
    
    const handleBarClick = (data: any) => {
        const account = accounts.find(acc => acc.id === data.id);
        if (account) {
            onSelectAccount(account);
        }
    };

    const sortedTopSpendByUserData = [...topSpendByUserData].sort((a, b) => b.spend - a.spend);

    const handleUserBarClick = (data: any) => {
        if (data && data.activeLabel) {
            // In a real application, this would navigate to a detailed view for the user.
            console.log(`Drill down to user: ${data.activeLabel}`);
        }
    };

    const totalCost = costBreakdownData.reduce((sum, item) => sum + item.value, 0);
    
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">Data Cloud Overview</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card title="Current Month Cost & Forecast">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Current Spend</p>
                            <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">$22,453.00</p>
                        </div>
                        <div className="bg-background p-4 rounded-3xl">
                            <p className="text-text-secondary text-sm">Forecasted Spend</p>
                            <p className="text-[22px] leading-7 font-bold text-text-primary mt-1">$42,883.00</p>
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
                    <h4 className="text-base font-semibold text-text-strong">Cost Breakdown</h4>
                    <div className="flex justify-around items-center mt-4">
                        {costBreakdownData.map(item => {
                            const percentage = totalCost > 0 ? Math.round((item.value / totalCost) * 100) : 0;
                            const chartData = [{ value: percentage }, { value: 100 - percentage }];
                            return (
                                <div key={item.name} className="flex flex-col items-center">
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
                                            <span className="text-xl font-bold text-text-primary">{percentage}%</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-text-strong">{item.name}</p>
                                    <p className="text-sm text-text-secondary">${item.value.toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <Card title="Top Spend by Account">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topSpendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} onClick={handleBarClick}>
                            <XAxis dataKey="name" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(105, 50, 213, 0.1)', cursor: 'pointer' }}
                                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }}
                                labelStyle={{ color: '#1E1E2D' }}
                            />
                            <Bar dataKey="totalSpend" fill="#6932D5" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Top Spend by User">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                            data={sortedTopSpendByUserData} 
                            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                            onClick={handleUserBarClick}
                        >
                            <XAxis 
                                dataKey="name" 
                                stroke="#5A5A72" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                interval={0}
                            />
                            <YAxis 
                                stroke="#5A5A72" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(105, 50, 213, 0.1)', cursor: 'pointer' }}
                                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }}
                                labelStyle={{ color: '#1E1E2D', fontWeight: 'bold' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                            />
                            <Bar 
                                dataKey="spend" 
                                fill="#6932D5" 
                                radius={[4, 4, 0, 0]} 
                                barSize={30} 
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Overview;