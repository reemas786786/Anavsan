
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { topSpendData, costBreakdownData } from '../data/dummyData';

const Card: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
    <div className={`bg-surface p-6 rounded-xl border border-border-color shadow-sm ${className}`}>
        {title && <h2 className="text-sm font-semibold text-text-primary mb-4">{title}</h2>}
        {children}
    </div>
);

const CostBreakdownDonut: React.FC<{ percentage: number }> = ({ percentage }) => {
    const data = [{ value: percentage }, { value: 100 - percentage }];
    return (
        <div className="w-16 h-16 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} dataKey="value" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={450} cornerRadius={10} paddingAngle={2}>
                        <Cell fill="#6932D5" />
                        <Cell fill="#E5E5E0" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <span className="absolute text-text-primary font-semibold text-sm">{percentage}%</span>
        </div>
    );
};

const StatCard: React.FC<{ title: string, value: string }> = ({ title, value }) => (
    <div className="bg-surface p-4 rounded-xl border border-border-color shadow-sm">
        <p className="text-sm font-semibold text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
    </div>
);

const resourceSummaryData = [
    { title: 'Accounts', value: '5' },
    { title: 'Warehouses', value: '12' },
    { title: 'Queries', value: '2,847' },
    { title: 'Storage (GB)', value: '2,085' },
];


const Overview: React.FC = () => {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">Data Cloud Overview</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Cards */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Current Month Cost & Forecast</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-background p-4 rounded-lg">
                                <p className="text-text-secondary text-sm">Current Spend</p>
                                <p className="text-3xl font-bold text-text-primary mt-1">$22,453.00</p>
                            </div>
                            <div className="bg-background p-4 rounded-lg">
                                <p className="text-text-secondary text-sm">Forecasted Spend</p>
                                <p className="text-3xl font-bold text-text-primary mt-1">$42,883.00</p>
                            </div>
                        </div>
                    </Card>
                    <Card title="Top Spend by Account">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topSpendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }}
                                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }}
                                    labelStyle={{ color: '#1E1E2D' }}
                                />
                                <Bar dataKey="totalSpend" fill="#6932D5" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Side Cards */}
                <div className="space-y-4">
                    <Card title="Resource Summary">
                       <div className="grid grid-cols-2 gap-4">
                            {resourceSummaryData.map(item => (
                                <StatCard key={item.title} title={item.title} value={item.value} />
                            ))}
                        </div>
                    </Card>
                    <Card title="Cost Breakdown">
                        <div className="space-y-4">
                            {costBreakdownData.map(item => (
                                <div key={item.name} className="flex items-center justify-between bg-background p-3 rounded-lg">
                                    <div>
                                        <p className="text-text-secondary text-sm">{item.name}</p>

                                        <p className="text-xl font-bold text-text-primary">${item.value.toLocaleString()}</p>
                                    </div>
                                    <CostBreakdownDonut percentage={item.percentage} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Overview;