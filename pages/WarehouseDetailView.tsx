import React from 'react';
import { Warehouse } from '../types';
import { IconChevronLeft, IconTrendingUp, IconClock, IconLayers, IconBrain } from '../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const spendTrendsData = [
  { date: 'Oct 1', cost: 12 }, { date: 'Oct 2', cost: 15 }, { date: 'Oct 3', cost: 11 },
  { date: 'Oct 4', cost: 18 }, { date: 'Oct 5', cost: 20 }, { date: 'Oct 6', cost: 17 },
  { date: 'Oct 7', cost: 22 },
];

const InfoCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-surface-nested p-4 rounded-xl">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
    </div>
);

const StatusBadge: React.FC<{ status: Warehouse['status'] }> = ({ status }) => {
    const colorClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-status-success-light text-status-success-dark',
        Active: 'bg-status-success-light text-status-success-dark',
        Suspended: 'bg-gray-200 text-gray-800',
        Idle: 'bg-status-info-light text-status-info-dark',
    };
    const dotClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-status-success animate-pulse',
        Active: 'bg-status-success',
        Suspended: 'bg-gray-400',
        Idle: 'bg-status-info',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};


const WarehouseDetailView: React.FC<{ warehouse: Warehouse; onBack: () => void; }> = ({ warehouse, onBack }) => {
    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                     <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors flex-shrink-0">
                        <IconChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">{warehouse.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span>{warehouse.size}</span>
                            <span>&bull;</span>
                            <StatusBadge status={warehouse.status} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Masonry */}
            <div className="columns-1 md:columns-2 gap-4">
                <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
                    <h3 className="text-base font-semibold text-text-strong mb-3">Usage Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <InfoCard title="Avg. Concurrency" value="1.2" />
                        <InfoCard title="Total Queries" value={warehouse.queriesExecuted.toLocaleString()} />
                        <InfoCard title="Credits (MTD)" value={warehouse.credits.toLocaleString()} />
                    </div>
                </div>

                <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
                    <h3 className="text-base font-semibold text-text-strong mb-3">Performance</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span>Avg. Execution Time:</span> <span className="font-semibold text-text-primary">12.3s</span></div>
                        <div className="flex justify-between"><span>Queued Queries:</span> <span className="font-semibold text-text-primary">2</span></div>
                        <div className="flex justify-between"><span>Spillage Events:</span> <span className="font-semibold text-text-primary">0</span></div>
                    </div>
                </div>

                <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
                    <h3 className="text-base font-semibold text-text-strong mb-3">Cost Breakdown (Daily)</h3>
                     <div style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendTrendsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="date" stroke="#9A9AB2" fontSize={12} />
                                <YAxis stroke="#9A9AB2" fontSize={12} unit="$" />
                                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }} formatter={(value: number) => [`$${value}`, 'Cost']} />
                                <defs>
                                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6932D5" stopOpacity={0.7}/>
                                        <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="cost" stroke="#6932D5" strokeWidth={2} fillOpacity={1} fill="url(#costGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
                    <h3 className="text-base font-semibold text-text-strong mb-3">Optimization Insights</h3>
                     <ul className="space-y-2 text-sm text-text-secondary">
                        <li className="flex items-start gap-2"><IconBrain className="w-4 h-4 text-primary flex-shrink-0 mt-1" /><span>Consider using a multi-cluster setup to handle concurrency spikes.</span></li>
                        <li className="flex items-start gap-2"><IconBrain className="w-4 h-4 text-primary flex-shrink-0 mt-1" /><span>Enable query acceleration for large-scale analytical queries.</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WarehouseDetailView;