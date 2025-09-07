import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subValue?: string;
    trend?: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, trend, className }) => {
    const trendColor = trend?.startsWith('+') ? 'text-status-error' : trend?.startsWith('-') ? 'text-status-success' : 'text-text-secondary';
    
    return (
        <div className={`bg-surface p-4 rounded-xl border border-border-color shadow-sm ${className}`}>
            <p className="text-sm font-semibold text-text-secondary">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                {subValue && <p className="text-sm font-medium text-text-secondary">{subValue}</p>}
            </div>
            {trend && <p className={`text-sm font-medium mt-1 ${trendColor}`}>{trend}</p>}
        </div>
    );
};

export default StatCard;
