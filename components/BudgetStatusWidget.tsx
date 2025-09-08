import React from 'react';
import { IconExclamationTriangle } from '../constants';

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-surface p-6 rounded-xl border border-border-color shadow-sm ${className}`}>
        {children}
    </div>
);

const BudgetStatusWidget: React.FC = () => {
    const allocated = 50000;
    const consumed = 32450;
    const remaining = allocated - consumed;
    const consumedPercentage = (consumed / allocated) * 100;
    const remainingPercentage = 100 - consumedPercentage;

    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    let progressBarColor = 'bg-status-success';
    let textColor = 'text-status-success-dark';
    let alertIcon = null;

    if (consumedPercentage > 95) {
        status = 'error';
        progressBarColor = 'bg-status-error';
        textColor = 'text-status-error-dark';
    } else if (consumedPercentage > 75) {
        status = 'warning';
        progressBarColor = 'bg-status-warning';
        textColor = 'text-status-warning-dark';
    }
    
    if (status === 'warning' || status === 'error') {
        alertIcon = <IconExclamationTriangle className={`w-4 h-4 ml-2 ${textColor}`} />;
    }
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card>
            <div className="flex items-center mb-6">
                <h4 className="text-base font-semibold text-text-strong">Monthly Budget Status</h4>
                {alertIcon}
            </div>
            <div className="flex flex-col space-y-4">
                <div className="text-center">
                    <p className={`text-4xl font-bold ${textColor}`}>{remainingPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-text-secondary">Remaining</p>
                </div>

                <div>
                    <div 
                        className="w-full bg-border-color rounded-full h-2.5"
                        role="progressbar"
                        aria-valuenow={consumedPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Budget consumed: ${consumedPercentage.toFixed(1)}%`}
                    >
                        <div 
                            className={`${progressBarColor} h-2.5 rounded-full`} 
                            style={{ width: `${consumedPercentage}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                    <div className="text-left">
                        <p className="text-text-secondary">Consumed</p>
                        <p className="font-semibold text-text-primary">{formatCurrency(consumed)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-text-secondary">Remaining</p>
                        <p className="font-semibold text-text-primary">{formatCurrency(remaining)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-text-secondary">Allocated</p>
                        <p className="font-semibold text-text-primary">{formatCurrency(allocated)}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BudgetStatusWidget;