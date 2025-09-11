import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BigScreenWidget, Account, User } from '../types';
import { IconClose } from '../constants';
import { costBreakdownData, overviewMetrics } from '../data/dummyData';

interface BigScreenViewProps {
    widget: BigScreenWidget;
    accounts: Account[];
    users: User[];
    onClose: () => void;
    onSelectAccount: (account: Account) => void;
    onSelectUser: (user: User) => void;
}

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


const BigScreenView: React.FC<BigScreenViewProps> = ({ widget, accounts, users, onClose, onSelectAccount, onSelectUser }) => {
    const [displayMode, setDisplayMode] = useState<'cost' | 'credits'>('cost');

    const handleBarClick = (data: any) => {
        const account = accounts.find(acc => acc.id === data.id);
        if (account) {
            onSelectAccount(account);
        }
    };

    const handleUserBarClick = (data: any) => {
        const user = users.find(u => u.id === data.id);
        if (user) {
            onSelectUser(user);
        }
    };

    const renderWidget = () => {
        switch (widget.type) {
            case 'account':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={[...accounts].sort((a, b) => b[displayMode] - a[displayMode])}
                            margin={{ top: 5, right: 30, left: 120, bottom: 30 }}
                            barCategoryGap="10%"
                        >
                            <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 12, fontWeight: 500 } }} />
                            <YAxis type="category" dataKey="name" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={120} tick={{ fill: '#5A5A72', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }} labelStyle={{ color: '#1E1E2D' }} formatter={(value: number) => [ displayMode === 'cost' ? `$${value.toLocaleString()}`: `${value.toLocaleString()} credits`, displayMode === 'cost' ? 'Spend' : 'Credits' ]} />
                            <Bar dataKey={displayMode} fill="#6932D5" barSize={20} shape={ <AccessibleBar onBarClick={handleBarClick} ariaLabelGenerator={(p: any) => `Navigate to Account Overview for ${p.name}`} /> } />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'user':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={[...users].sort((a, b) => b[displayMode] - a[displayMode])}
                            margin={{ top: 5, right: 30, left: 120, bottom: 30 }}
                            barCategoryGap="10%"
                        >
                            <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72', fontSize: 12, fontWeight: 500 } }} />
                            <YAxis type="category" dataKey="name" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={120} tick={{ fill: '#5A5A72', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '12px' }} labelStyle={{ color: '#1E1E2D' }} formatter={(value: number) => [ displayMode === 'cost' ? `$${value.toLocaleString()}`: `${value.toLocaleString()} credits`, displayMode === 'cost' ? 'Spend' : 'Credits' ]} />
                            <Bar dataKey={displayMode} fill="#6932D5" barSize={15} shape={ <AccessibleBar onBarClick={handleUserBarClick} ariaLabelGenerator={(p: any) => `Navigate to User Overview for ${p.name}`} /> } />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'spend_breakdown':
                 const currentSpend = displayMode === 'cost' ? overviewMetrics.cost.current : overviewMetrics.credits.current;
                 return (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="bg-surface p-8 rounded-3xl border border-border-color shadow-lg max-w-3xl w-full">
                            <div className="flex items-center justify-center py-4">
                                <div className="grid grid-cols-2 gap-12">
                                    {costBreakdownData.map(item => {
                                        const chartData = [{ value: item.percentage }, { value: 100 - item.percentage }];
                                        const value = displayMode === 'cost' ? item.cost : item.credits;
                                        const label = item.name.replace(' Costs', '');
                                        const displayValue = displayMode === 'cost' ? `$${value.toLocaleString()}` : `${value.toLocaleString()} credits`;
                                        return (
                                            <div key={item.name} className="flex flex-col items-center text-center">
                                                <div className="relative h-[150px] w-[150px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie data={chartData} dataKey="value" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} cy="50%" cx="50%" stroke="none">
                                                                <Cell fill={item.color} />
                                                                <Cell fill="#E5E5E0" />
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-3xl font-bold text-text-primary">{item.percentage}%</span>
                                                    </div>
                                                </div>
                                                <p className="mt-4 text-base text-text-secondary">
                                                    <span className="font-semibold text-text-strong">{label}</span> — {displayValue}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                             <div className="text-center mt-6 pt-6 border-t border-border-light">
                                <span className="text-base text-text-secondary">Current Spend: </span>
                                <span className="text-base font-semibold text-text-primary">
                                    {displayMode === 'cost' ? `$${currentSpend.toLocaleString()}` : `${currentSpend.toLocaleString()} credits`}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-background z-[100] flex flex-col p-6" role="dialog" aria-modal="true" aria-labelledby="big-screen-title">
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 id="big-screen-title" className="text-xl font-bold text-text-primary">{widget.title}</h2>
                <div className="flex items-center gap-4">
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
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-hover" aria-label="Close full-screen view">
                        <IconClose className="h-6 w-6 text-text-secondary" />
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-hidden bg-surface rounded-3xl border border-border-color">
                {renderWidget()}
            </main>
        </div>
    );
};

export default BigScreenView;
