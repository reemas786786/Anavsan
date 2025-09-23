import React, { useState, useMemo, useRef } from 'react';
import { DashboardItem, Widget, Account, WidgetType } from '../types';
import { availableWidgetsData } from '../data/dummyData';
import { IconAdd, IconSearch, IconClose, IconChevronDown } from '../constants';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const dummyLineData = [
    { name: 'Jan', value: Math.random() * 100 },
    { name: 'Feb', value: Math.random() * 100 },
    { name: 'Mar', value: Math.random() * 100 },
    { name: 'Apr', value: Math.random() * 100 },
];

const dummyBarData = [
    { name: 'WH1', value: Math.random() * 500 },
    { name: 'WH2', value: Math.random() * 500 },
    { name: 'WH3', value: Math.random() * 500 },
    { name: 'WH4', value: Math.random() * 500 },
];

const DummyLineChart: React.FC = () => (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dummyLineData} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
            <XAxis dataKey="name" fontSize={10} stroke="#9A9AB2" axisLine={false} tickLine={false} />
            <YAxis fontSize={10} stroke="#9A9AB2" axisLine={false} tickLine={false} />
            <Tooltip
                contentStyle={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E5E0' }} 
            />
            <Line type="monotone" dataKey="value" stroke="#6932D5" strokeWidth={2} dot={false} />
        </LineChart>
    </ResponsiveContainer>
);

const DummyStatCard: React.FC = () => (
    <div className="p-2 h-full flex flex-col justify-center items-center">
        <div className="text-2xl font-bold text-text-primary">$12.3k</div>
        <div className="text-[10px] text-text-secondary mt-1">Current Spend</div>
    </div>
);

const DummyBarChart: React.FC = () => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dummyBarData} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
            <XAxis dataKey="name" fontSize={10} stroke="#9A9AB2" axisLine={false} tickLine={false} />
            <YAxis fontSize={10} stroke="#9A9AB2" axisLine={false} tickLine={false} />
            <Tooltip
                contentStyle={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E5E0' }} 
            />
            <Bar dataKey="value" fill="#6932D5" />
        </BarChart>
    </ResponsiveContainer>
);

const DummyDonutChart: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center p-2">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={[{value: 70}, {value: 30}]} dataKey="value" innerRadius="60%" outerRadius="80%" stroke="none">
                     <Cell fill="#6932D5" />
                     <Cell fill="#E0E7FF" />
                </Pie>
                 <Tooltip contentStyle={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #E5E5E0' }} />
            </PieChart>
        </ResponsiveContainer>
    </div>
);


const dummyTableData = [
    { event: 'daily', time: 'Nov 16, 7:08 AM', details: '15s', status: 'passing' },
    { event: 'daily', time: 'Nov 16, 7:07 AM', details: '12s', status: 'passing' },
    { event: 'daily', time: 'Nov 15, 7:08 AM', details: '18s', status: 'failed' },
];

const DummyTable: React.FC = () => (
    <div className="text-[10px] text-text-secondary w-full h-full p-2">
        <table className="w-full">
            <thead>
                <tr className="border-b border-border-light text-left">
                    <th className="font-medium p-1">EVENT</th>
                    <th className="font-medium p-1">TIME</th>
                    <th className="font-medium p-1">DETAILS</th>
                </tr>
            </thead>
            <tbody>
                {dummyTableData.map((row, i) => (
                    <tr key={i} className="border-b border-border-light">
                        <td className="p-1">{row.event}</td>
                        <td className="p-1">{row.time}</td>
                        <td className={`p-1 font-semibold ${row.status === 'passing' ? 'text-status-success-dark' : 'text-status-error-dark'}`}>{row.details}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const WidgetRenderer: React.FC<{type: WidgetType}> = ({ type }) => {
    switch(type) {
        case 'LineChart':
            return <DummyLineChart />;
        case 'Table':
            return <DummyTable />;
        case 'StatCard':
            return <DummyStatCard />;
        case 'BarChart':
            return <DummyBarChart />;
        case 'DonutChart':
            return <DummyDonutChart />;
        default:
            return <div className="text-xs text-text-muted">Preview not available</div>;
    }
}

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`${
        enabled ? 'bg-primary' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
);


interface DashboardEditorProps {
    dashboard: DashboardItem | null; // null for new dashboard
    accounts: Account[];
    onSave: (dashboard: DashboardItem) => void;
    onCancel: () => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ dashboard, accounts, onSave, onCancel }) => {
    const [editedDashboard, setEditedDashboard] = useState<DashboardItem>(
        dashboard || {
            id: `temp-${Date.now()}`,
            title: 'Untitled Dashboard',
            description: '',
            createdOn: '',
            widgets: [],
            dataSourceContext: { type: 'overall' },
        }
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [isEditMode, setIsEditMode] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [isAggregated, setIsAggregated] = useState(true);
    const [selectedAccountForNewWidgets, setSelectedAccountForNewWidgets] = useState(accounts.length > 0 ? accounts[0].id : '');
    
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDashboard(prev => ({ ...prev, title: e.target.value }));
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDashboard(prev => ({ ...prev, description: e.target.value || '' }));
    };

    const handleAddWidget = (widgetTemplate: Omit<Widget, 'id' | 'dataSource'>) => {
        const newWidgetInstance: Widget = {
            ...widgetTemplate,
            id: `inst-${Date.now()}-${Math.random()}`,
            dataSource: isAggregated 
                ? { type: 'overall' }
                : { type: 'account', accountId: selectedAccountForNewWidgets },
        };
        setEditedDashboard(prev => ({
            ...prev,
            widgets: [...prev.widgets, newWidgetInstance],
        }));
    };
    
    const handleRemoveWidget = (widgetId: string) => {
        setEditedDashboard(prev => ({
            ...prev,
            widgets: prev.widgets.filter(w => w.id !== widgetId),
        }));
    };
    
    const handleSave = () => {
        onSave(editedDashboard);
    };
    
    const handleDragSort = () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            dragItem.current = null;
            dragOverItem.current = null;
            return;
        }
        
        const newWidgets = [...editedDashboard.widgets];
        const draggedItemContent = newWidgets.splice(dragItem.current, 1)[0];
        newWidgets.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        
        setEditedDashboard(prev => ({ ...prev, widgets: newWidgets }));
    };

    const widgetTagsWithCounts = useMemo(() => {
        const counts: Record<string, number> = { All: availableWidgetsData.length };
        const allTags = Array.from(new Set(availableWidgetsData.flatMap(w => w.tags || [])));
        
        availableWidgetsData.forEach(widget => {
            widget.tags?.forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });

        allTags.sort();
        return [{ tag: 'All', count: availableWidgetsData.length }, ...allTags.map(tag => ({ tag, count: counts[tag] }))];
    }, []);

    const filteredWidgets = useMemo(() => {
        return availableWidgetsData.filter(widget => {
            const matchesSearch = widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                widget.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === 'All' || widget.tags?.includes(activeFilter);
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, activeFilter]);

    return (
        <div className="flex flex-col bg-background">
            {/* Header */}
            <header className="bg-surface px-6 py-3 border-b border-border-color flex items-center justify-between flex-shrink-0">
                <div>
                    <input type="text" value={editedDashboard.title} onChange={handleTitleChange} className="text-xl font-bold bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded-md -ml-2 px-2 py-1" placeholder="Dashboard Title" />
                    <input type="text" value={editedDashboard.description} onChange={handleDescriptionChange} className="text-sm text-text-secondary w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded-md -ml-2 px-2" placeholder="Dashboard description (optional)" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isEditMode ? 'text-text-primary' : 'text-text-muted'}`}>Edit</span>
                        <ToggleSwitch enabled={isEditMode} onChange={setIsEditMode} />
                    </div>
                    <div className="h-6 w-px bg-border-color"></div>
                    <button onClick={onCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full shadow-sm">Save Dashboard</button>
                </div>
            </header>
            
            {/* Main Content */}
            <div className={`flex-1 grid grid-cols-1 ${isEditMode ? 'lg:grid-cols-12' : ''} gap-4 p-4`}>
                {/* Left Panel: Widget Library */}
                {isEditMode && (
                    <aside className="lg:col-span-4 xl:col-span-3 bg-surface rounded-3xl border border-border-color p-4 flex flex-col self-start sticky top-4 max-h-[calc(100vh-80px)]">
                        <h3 className="text-lg font-semibold text-text-strong mb-4 px-2">Select views</h3>
                        
                        <div className="flex flex-col space-y-4 px-2 flex-shrink-0">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="aggregate-toggle" className="text-sm font-medium text-text-strong pr-4">Enable aggregated metrics</label>
                                    <ToggleSwitch enabled={isAggregated} onChange={setIsAggregated} />
                                </div>
                                {!isAggregated && accounts.length > 0 && (
                                    <div className="relative">
                                        <select 
                                            id="account-select" 
                                            value={selectedAccountForNewWidgets} 
                                            onChange={e => setSelectedAccountForNewWidgets(e.target.value)}
                                            className="w-full appearance-none border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary bg-background"
                                        >
                                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                                            <IconChevronDown className="h-5 w-5" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconSearch className="h-5 w-5 text-text-muted" /></div>
                                <input type="text" placeholder="Search views..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border-0 rounded-full text-sm focus:ring-2 focus:ring-primary bg-background placeholder-text-secondary" />
                            </div>

                            <div>
                                <label htmlFor="category-filter" className="text-xs font-semibold text-text-secondary uppercase mb-2 block px-1">Category</label>
                                <div className="relative">
                                    <select 
                                        id="category-filter"
                                        value={activeFilter}
                                        onChange={e => setActiveFilter(e.target.value)}
                                        className="w-full appearance-none border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary bg-background"
                                    >
                                        {widgetTagsWithCounts.map(({tag, count}) => (
                                            <option key={tag} value={tag}>{tag} ({count})</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                                        <IconChevronDown className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2 pt-2 mt-4">
                             <div className="grid grid-cols-1 gap-4">
                                {filteredWidgets.map(widget => (
                                    <div key={widget.widgetId} className="bg-background p-4 rounded-2xl border border-border-light flex flex-col gap-3">
                                        <div className="w-full h-24 object-cover rounded-lg bg-white border border-border-color overflow-hidden relative">
                                            <div className="transform scale-[0.6] origin-top-left w-[166.66%] h-[166.66%]">
                                                <WidgetRenderer type={widget.type} />
                                            </div>
                                            <div className="absolute inset-0 bg-transparent"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-text-strong">{widget.title}</h4>
                                            <p className="text-xs text-text-secondary mt-1">{widget.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleAddWidget(widget)} 
                                            className="mt-auto flex items-center justify-center gap-2 w-full px-3 py-1.5 text-sm font-semibold border border-border-color rounded-lg hover:bg-surface-hover hover:border-primary/50 transition-colors"
                                            aria-label={`Add ${widget.title} to layout`}
                                        >
                                            <IconAdd className="w-4 h-4" /> Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* Right Panel: Dashboard Canvas */}
                <main className={`${isEditMode ? 'lg:col-span-8 xl:col-span-9' : 'col-span-1'} bg-background rounded-3xl border border-border-color p-4`}>
                    <h3 className="text-lg font-semibold text-text-strong mb-4 px-2">Layout</h3>
                    {editedDashboard.widgets.length > 0 ? (
                       <div className="columns-1 md:columns-2 gap-4">
                            {editedDashboard.widgets.map((widget, index) => {
                                const dataSourceText = widget.dataSource.type === 'overall' 
                                    ? 'Overall' 
                                    : accounts.find(a => a.id === (widget.dataSource as any).accountId)?.name || 'Account';
                                return (
                                <div
                                    key={widget.id}
                                    className={`bg-surface rounded-3xl shadow-sm border border-border-light flex flex-col group p-4 relative break-inside-avoid mb-4 ${isEditMode ? 'cursor-move' : ''}`}
                                    draggable={isEditMode}
                                    onDragStart={isEditMode ? () => (dragItem.current = index) : undefined}
                                    onDragEnter={isEditMode ? () => (dragOverItem.current = index) : undefined}
                                    onDragEnd={isEditMode ? handleDragSort : undefined}
                                    onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
                                >
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-base font-semibold text-text-strong pr-6">{widget.title}</h4>
                                        {isEditMode && (
                                            <button onClick={() => handleRemoveWidget(widget.id)} className="absolute top-3 right-3 p-1 rounded-full text-text-muted hover:bg-gray-200 hover:text-status-error opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Remove widget">
                                                <IconClose className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1">{widget.description}</p>
                                    <div className="flex-grow min-h-[200px] mt-4 rounded-2xl relative">
                                        <WidgetRenderer type={widget.type} />
                                        <div className="absolute bottom-0 left-0 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium z-10">
                                            {dataSourceText}
                                        </div>
                                    </div>
                                </div>
                            )})}
                       </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary border-2 border-dashed border-border-color rounded-2xl">
                            <h3 className="text-lg font-semibold">Drag or Add views here</h3>
                            <p className="max-w-xs">Your dashboard is currently empty. Choose a view from the left panel to get started.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardEditor;