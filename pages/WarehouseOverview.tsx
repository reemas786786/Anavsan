import React from 'react';
import { Warehouse } from '../types';
import { IconLayers, IconTrendingUp, IconClock, IconBrain } from '../constants';
import { warehousesData } from '../data/dummyData';

// Simple Stat Card
const StatCard: React.FC<{ title: string; value: string | number; icon: React.FC<{className?: string}>; }> = ({ title, value, icon: Icon }) => (
    <div className="bg-surface-nested p-4 rounded-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
        </div>
    </div>
);


const WarehouseOverview: React.FC<{ warehouses: Warehouse[] }> = ({ warehouses }) => {
    const totalWarehouses = warehouses.length;
    const totalCredits = warehouses.reduce((sum, wh) => sum + wh.credits, 0);
    const topWarehouse = [...warehouses].sort((a, b) => b.credits - a.credits)[0];
    const idleWarehouses = warehouses.filter(wh => wh.status === 'Idle').length;

    const aiInsights = [
        "Consider suspending `IDLE_WH` as it has low utilization.",
        "Schedule `FINANCE_WH` to suspend during weekends to save ~20 credits/week.",
        "The `COMPUTE_WH` is frequently near peak utilization. Consider scaling up to Medium.",
    ];

    return (
        <div className="p-4 space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Warehouses Overview</h1>
                <p className="mt-1 text-text-secondary">A summary of warehouse activity and performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Warehouses" value={totalWarehouses} icon={IconLayers} />
                <StatCard title="Credit Usage (MTD)" value={`${totalCredits.toLocaleString()} cr`} icon={IconTrendingUp} />
                <StatCard title="Top Consumer" value={topWarehouse.name} icon={IconLayers} />
                <StatCard title="Idle Warehouses" value={idleWarehouses} icon={IconClock} />
            </div>

            <div className="bg-surface p-4 rounded-xl">
                <h3 className="text-base font-semibold text-text-strong mb-3 flex items-center gap-2">
                    <IconBrain className="w-5 h-5 text-primary" />
                    AI Insights
                </h3>
                <ul className="space-y-2">
                    {aiInsights.map((insight, i) => (
                        <li key={i} className="text-sm text-text-secondary p-2 bg-surface-nested rounded-lg">{insight}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WarehouseOverview;
