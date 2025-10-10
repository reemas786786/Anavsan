
import React, { useState, useRef, useEffect } from 'react';
import { Account, TopQuery, Warehouse } from '../types';
import { accountSpend, topQueriesData, accountCostBreakdown, warehousesData, queryListData } from '../data/dummyData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import BudgetStatusWidget from '../components/BudgetStatusWidget';
import { IconDotsVertical, IconEdit, IconDragHandle, IconClose } from '../constants';
import SidePanel from '../components/SidePanel';
import TableView from '../components/TableView';
import InfoTooltip from '../components/InfoTooltip';

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
                if(rect) rect.style.fill = '#5A28BE';
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
                <p className="font-mono text-xs mb-1 max-w-xs break-words">{label}</p>
                <div className="text-sm text-primary flex items-baseline">
                    <span className="font-semibold text-text-secondary mr-2">{displayMode === 'cost' ? 'Cost:' : 'Credits:'}</span>
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

interface AccountOverviewDashboardProps {
    account: Account;
    displayMode: 'cost' | 'credits';
}

type WidgetConfig = {
  id: 'spend' | 'budget' | 'breakdown' | 'queries' | 'warehouses' | 'totalQueries';
};

const kpiWidgetIds: WidgetConfig['id'][] = ['spend', 'budget', 'totalQueries'];

const AccountOverviewDashboard: React.FC<AccountOverviewDashboardProps> = ({ account, displayMode }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [tableViewData, setTableViewData] = useState<{
        title: string;
        data: { name: string; cost: number; credits: number; percentage: number }[];
    } | null>(null);

    const [isEditMode, setIsEditMode] = useState(false);
    
    const initialLayout: WidgetConfig[] = [
      { id: 'spend' }, { id: 'budget' }, { id: 'totalQueries' }, { id: 'breakdown' }, { id: 'queries' }, { id: 'warehouses' },
    ];
    
    const [widgets, setWidgets] = useState<WidgetConfig[]>(initialLayout);
    const [tempWidgets, setTempWidgets] = useState<WidgetConfig[]>(initialLayout);
    
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    
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

    const handleDownloadCSV = (widgetType: string) => {
        let headers: string[] = [];
        let dataRows: (string | number)[][] = [];
        let fileName = '';
        const timestamp = new Date().toISOString();

        switch (widgetType) {
            case 'spend-breakdown':
                fileName = 'spend_breakdown';
                headers = ["Entity", "Cost", "Credits", "Percentage", "Timestamp"];
                dataRows = accountCostBreakdown.map(item => [item.name, item.cost, item.credits, item.percentage, timestamp]);
                break;
            case 'top-warehouses':
                fileName = 'top_warehouses';
                headers = ["Warehouse Name", "Cost", "Credits", "Timestamp"];
                dataRows = warehousesData.map(item => [item.name, item.cost, item.credits, timestamp]);
                break;
        }
        
        if (headers.length > 0) {
            const csvContent = [ headers.join(','), ...dataRows.map(row => row.join(',')) ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setOpenMenu(null);
    };

    const handleOpenSpendBreakdownTable = () => {
        const totalCost = accountCostBreakdown.reduce((sum, item) => sum + item.cost, 0);
        const totalCredits = accountCostBreakdown.reduce((sum, item) => sum + item.credits, 0);
        const data = accountCostBreakdown.map(item => ({
            name: item.name,
            cost: item.cost,
            credits: item.credits,
            percentage: displayMode === 'cost' ? (item.cost/totalCost * 100) : (item.credits/totalCredits * 100),
        }));
        setTableViewData({ title: "Spend breakdown", data });
    };

    const handleEditDashboard = () => {
        setTempWidgets(widgets);
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setTempWidgets(widgets);
    };

    const handleSave = () => {
        setWidgets(tempWidgets);
        setIsEditMode(false);
    };
    
    const handleResetLayout = () => {
        setTempWidgets(initialLayout);
    };

    const handleRemoveWidget = (idToRemove: WidgetConfig['id']) => {
        setTempWidgets(prev => prev.filter(widget => widget.id !== idToRemove));
    };

    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }
    
        const newWidgets = [...tempWidgets];
        const draggedItemContent = newWidgets.splice(dragItem.current, 1)[0];
        newWidgets.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        
        setTempWidgets(newWidgets);
    };

    const SpendForecastCard: React.FC = () => {
        const monthlySpend = displayMode === 'cost' ? accountSpend.cost.monthly : accountSpend.credits.monthly;
        const forecastedSpend = displayMode === 'cost' ? accountSpend.cost.forecasted : accountSpend.credits.forecasted;
        return (
             <Card>
                <div className="flex items-center mb-4">
                    <h4 className="text-base font-semibold text-text-strong">Month-to-date Spend</h4>
                    <InfoTooltip text="The total cost or credits consumed by this account this month, and the projected spend by the end of the month based on current usage patterns." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-surface-nested p-4 rounded-3xl">
                        <p className="text-text-secondary text-sm">Current spend</p>
                        <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                            {displayMode === 'cost' ? (
                                `$${monthlySpend.toLocaleString()}`
                            ) : (
                                <>
                                    <span>{monthlySpend.toLocaleString()}</span>
                                    <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="bg-surface-nested p-4 rounded-3xl">
                        <p className="text-text-secondary text-sm">Forecasted spend</p>
                        <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                           {displayMode === 'cost' ? (
                                `$${forecastedSpend.toLocaleString()}`
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
        );
    };

    const TotalQueriesCard: React.FC = () => {
        return (
            <Card>
                <div className="flex items-center mb-4">
                    <h4 className="text-base font-semibold text-text-strong">Total Queries</h4>
                    <InfoTooltip text="Total number of queries executed in this account for the selected period." />
                </div>
                <div className="bg-surface-nested p-4 rounded-3xl">
                    <p className="text-text-secondary text-sm">Queries executed</p>
                    <div className="text-[22px] leading-7 font-bold text-text-primary mt-1 flex items-baseline">
                        <span>{queryListData.length.toLocaleString()}</span>
                    </div>
                </div>
            </Card>
        );
    };

    const SpendBreakdownCard: React.FC = () => {
         const monthlySpend = displayMode === 'cost' ? accountSpend.cost.monthly : accountSpend.credits.monthly;
        return (
            <Card>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <h4 className="text-base font-semibold text-text-strong">Spend breakdown</h4>
                        <InfoTooltip text="A breakdown of this account's monthly spend by the primary cost categories: compute (Warehouse) and storage." />
                    </div>
                    <div className="relative" ref={openMenu === 'spend-breakdown' ? menuRef : null}>
                        <button onClick={() => handleMenuClick('spend-breakdown')} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none" aria-label="Spend breakdown options" aria-haspopup="true" aria-expanded={openMenu === 'spend-breakdown'}>
                            <IconDotsVertical className="h-5 w-5" />
                        </button>
                        {openMenu === 'spend-breakdown' && (
                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface shadow-lg z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <button onClick={() => { handleOpenSpendBreakdownTable(); setOpenMenu(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Table View</button>
                                    <button onClick={() => handleDownloadCSV('spend-breakdown')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    {accountCostBreakdown.map(item => {
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
                    <span className="text-sm text-text-secondary mr-1">Current spend:</span>
                    <span className="text-sm font-semibold text-text-primary">
                         {displayMode === 'cost' ? (
                            `$${monthlySpend.toLocaleString()}.00`
                         ) : (
                            <>
                                <span>{monthlySpend.toLocaleString()}</span>
                                <span className="text-xs font-medium text-text-secondary ml-1">credits</span>
                            </>
                         )}
                    </span>
                </div>
            </Card>
        );
    };
    
    const TopQueriesCard: React.FC = () => {
        const topQueries = [...topQueriesData].sort((a,b) => b[displayMode] - a[displayMode]).slice(0, 10);
        return (
            <Card>
                <div className="flex items-center mb-4">
                    <h4 className="text-base font-semibold text-text-strong">Top queries in this account</h4>
                    <InfoTooltip text="Lists the most expensive queries in this account based on cost or credits consumed." />
                </div>
                    <div style={{ height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={topQueries} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                            <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72' } }} />
                            <YAxis type="category" dataKey="queryText" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={150} tick={{ fill: '#5A5A72', fontSize: 12, width: 140 }} tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value} />
                            <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} content={<CustomTooltip displayMode={displayMode} />} />
                            <Bar dataKey={displayMode === 'cost' ? 'cost' : 'credits'} fill="#6932D5" barSize={12} shape={<AccessibleBar onBarClick={() => {}} ariaLabelGenerator={(p: any) => `Query: ${p.queryText}`} />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        );
    };

    const TopWarehousesCard: React.FC = () => {
        const topWarehouses = [...warehousesData].sort((a, b) => b[displayMode] - a[displayMode]).slice(0, 10);
        return (
            <Card>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                        <h4 className="text-base font-semibold text-text-strong">Top warehouses in this account</h4>
                        <InfoTooltip text="Lists the most resource-intensive warehouses in this account, ranked by cost or credits." />
                    </div>
                    <div className="relative" ref={openMenu === 'top-warehouses' ? menuRef : null}>
                        <button
                            onClick={() => handleMenuClick('top-warehouses')}
                            className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none"
                            aria-label="Top warehouses options"
                            aria-haspopup="true"
                            aria-expanded={openMenu === 'top-warehouses'}
                        >
                            <IconDotsVertical className="h-5 w-5" />
                        </button>
                        {openMenu === 'top-warehouses' && (
                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg bg-surface shadow-lg z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    <button onClick={() => handleDownloadCSV('top-warehouses')} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Download CSV</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={topWarehouses} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                            <XAxis type="number" stroke="#5A5A72" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E5E0' }} label={{ value: displayMode === 'cost' ? 'Cost ($)' : 'Credits', position: 'insideBottom', dy: 15, style: { fill: '#5A5A72' } }} />
                            <YAxis type="category" dataKey="name" stroke="#5A5A72" tickLine={false} axisLine={false} interval={0} width={150} tick={{ fill: '#5A5A72', fontSize: 12, width: 140 }} tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value} />
                            <Tooltip cursor={{ fill: 'rgba(105, 50, 213, 0.1)' }} content={<CustomTooltip displayMode={displayMode} />} />
                            <Bar dataKey={displayMode === 'cost' ? 'cost' : 'credits'} fill="#6932D5" barSize={12} shape={<AccessibleBar onBarClick={() => {}} ariaLabelGenerator={(p: any) => `Warehouse: ${p.name}`} />} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        );
    };
    
    const widgetComponentMap: Record<WidgetConfig['id'], React.FC<any>> = {
      spend: SpendForecastCard,
      budget: BudgetStatusWidget,
      totalQueries: TotalQueriesCard,
      breakdown: SpendBreakdownCard,
      queries: TopQueriesCard,
      warehouses: TopWarehousesCard,
    };

    const renderWidget = (widget: WidgetConfig, index: number) => {
        const Component = widgetComponentMap[widget.id];
        const isKpi = kpiWidgetIds.includes(widget.id);

        if (!Component) return null;
        
        const content = <Component displayMode={displayMode} account={account} />;

        if (isEditMode) {
            return (
                <div
                    key={`${widget.id}-${index}`}
                    className="relative group outline outline-2 outline-dashed outline-primary/70 outline-offset-[-2px] cursor-move rounded-3xl"
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleDragSort}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/50 backdrop-blur-sm rounded-full p-1">
                        {!isKpi && (
                            <button
                                onClick={() => handleRemoveWidget(widget.id)}
                                className="p-1 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600"
                                aria-label={`Remove ${widget.id} widget`}
                            >
                                <IconClose className="h-4 w-4" />
                            </button>
                        )}
                        <span className="p-1" aria-label="Drag to reorder">
                            <IconDragHandle className="h-5 w-5 text-gray-400" />
                        </span>
                    </div>
                    <div className="opacity-70 pointer-events-none">{content}</div>
                </div>
            );
        }

        return <div key={`${widget.id}-${index}`}>{content}</div>;
    };

    const currentWidgets = isEditMode ? tempWidgets : widgets;

    return (
        <div className="space-y-4 pb-16">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{account.name}</h1>
                    <p className="text-text-secondary mt-1">Account Overview</p>
                </div>
                <div className="flex items-center gap-4">
                     {!isEditMode && (
                        <button onClick={handleEditDashboard} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-primary bg-white rounded-full shadow-sm hover:bg-gray-50">
                            <IconEdit className="h-4 w-4" />
                            Edit Dashboard
                        </button>
                    )}
                </div>
            </div>

            <div className="columns-1 lg:columns-2 gap-4">
                {currentWidgets.map((widget, index) => renderWidget(widget, index))}
            </div>

            {isEditMode && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center z-20">
                    <div>
                        <button 
                            onClick={handleResetLayout} 
                            className="text-sm font-semibold px-4 py-2 rounded-full text-text-secondary border border-border-color hover:bg-gray-50"
                        >
                            Reset to Default Layout
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50 bg-white">Cancel</button>
                        <button onClick={handleSave} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full shadow-sm">Save Changes</button>
                    </div>
                </div>
            )}

            <SidePanel isOpen={!!tableViewData} onClose={() => setTableViewData(null)} title="Table View">
                {tableViewData && <TableView title={tableViewData.title} data={tableViewData.data} />}
            </SidePanel>
        </div>
    );
};

export default AccountOverviewDashboard;
