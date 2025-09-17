import React, { useState, useMemo, useRef } from 'react';
import { DashboardItem, Widget, Account } from '../types';
import { availableWidgetsData } from '../data/dummyData';
import { IconAdd, IconSearch } from '../constants';
import WidgetSetupModal from '../components/WidgetSetupModal';

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
        }
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [widgetToConfigure, setWidgetToConfigure] = useState<Omit<Widget, 'id' | 'dataSource'> | null>(null);
    
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    
    const widgetCategories = useMemo(() => {
        const categories: Record<string, number> = { All: availableWidgetsData.length };
        const mainCategories = ['Cost', 'Performance']; // Define what we consider a primary category

        availableWidgetsData.forEach(widget => {
            widget.tags?.forEach(tag => {
                if(mainCategories.includes(tag)) {
                    if (!categories[tag]) {
                        categories[tag] = 0;
                    }
                    categories[tag]++;
                }
            });
        });
        return categories;
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDashboard(prev => ({ ...prev, title: e.target.value }));
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDashboard(prev => ({ ...prev, description: e.target.value || '' }));
    };
    
    const handleOpenSetupModal = (widget: Omit<Widget, 'id' | 'dataSource'>) => {
        setWidgetToConfigure(widget);
        setIsSetupModalOpen(true);
    };
    
    const handleConfirmAddWidget = (dataSource: Widget['dataSource']) => {
        if (!widgetToConfigure) return;

        const newWidgetInstance: Widget = {
            ...widgetToConfigure,
            id: `inst-${Date.now()}-${Math.random()}`,
            dataSource,
        };
        setEditedDashboard(prev => ({
            ...prev,
            widgets: [...prev.widgets, newWidgetInstance],
        }));
        setIsSetupModalOpen(false);
        setWidgetToConfigure(null);
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
        if (dragItem.current === null || dragOverItem.current === null) return;
        
        const newWidgets = [...editedDashboard.widgets];
        const draggedItemContent = newWidgets.splice(dragItem.current, 1)[0];
        newWidgets.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        
        setEditedDashboard(prev => ({ ...prev, widgets: newWidgets }));
    };

    const filteredWidgets = useMemo(() => {
        let widgets = [...availableWidgetsData];
        if (searchTerm) {
            widgets = widgets.filter(widget =>
                widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                widget.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (activeCategory !== 'All') {
            widgets = widgets.filter(widget => widget.tags?.includes(activeCategory));
        }
        return widgets;
    }, [searchTerm, activeCategory]);

    const getDataSourceTag = (dataSource: Widget['dataSource']): string => {
        if (dataSource.type === 'overall') return 'Overall';
        const account = accounts.find(acc => acc.id === dataSource.accountId);
        return account ? account.name : 'Unknown Account';
    };

    return (
        <>
            <div className="flex flex-col h-screen bg-background">
                {/* Header */}
                <header className="bg-surface px-4 py-3 border-b border-border-color flex items-center justify-between flex-shrink-0">
                    <div>
                        <input type="text" value={editedDashboard.title} onChange={handleTitleChange} className="text-xl font-bold bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded-md -ml-2 px-2 py-1" placeholder="Dashboard Title" />
                        <input type="text" value={editedDashboard.description} onChange={handleDescriptionChange} className="text-sm text-text-secondary w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded-md -ml-2 px-2" placeholder="Dashboard description (optional)" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSave} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Save Dashboard</button>
                    </div>
                </header>
                
                {/* Main Content */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
                    {/* Left Panel: Dashboard Canvas */}
                    <main className="lg:col-span-2 bg-gray-100 rounded-3xl border border-border-color p-4 overflow-y-auto">
                        {editedDashboard.widgets.length > 0 ? (
                           <div className="grid grid-cols-12 gap-4 auto-rows-[100px]">
                                {editedDashboard.widgets.map((widget, index) => (
                                    <div
                                        key={widget.id}
                                        className="bg-surface rounded-3xl shadow-sm border border-border-light flex flex-col group p-4 relative cursor-move"
                                        style={{ gridColumn: `span ${widget.layout.w}`, gridRow: `span ${widget.layout.h}` }}
                                        draggable
                                        onDragStart={() => (dragItem.current = index)}
                                        onDragEnter={() => (dragOverItem.current = index)}
                                        onDragEnd={handleDragSort}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-semibold text-text-strong">{widget.title}</h4>
                                                <span className="text-xs font-semibold text-text-secondary bg-gray-200 rounded-full px-2 py-0.5">{`[${getDataSourceTag(widget.dataSource)}]`}</span>
                                            </div>
                                            <button onClick={() => handleRemoveWidget(widget.id)} className="p-1 rounded-full text-text-muted hover:bg-gray-200 hover:text-status-error opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Remove widget">
                                                &times;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary border-2 border-dashed border-border-color rounded-lg">
                                <h3 className="text-lg font-semibold">Empty Dashboard</h3>
                                <p>Add widgets from the library on the right to build your dashboard.</p>
                            </div>
                        )}
                    </main>

                    {/* Right Panel: Widget Library */}
                    <aside className="lg:col-span-1 bg-surface rounded-3xl border border-border-color p-4 flex flex-col">
                        <h3 className="text-base font-semibold text-text-strong mb-4">Widget Library</h3>
                        <div className="relative mb-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconSearch className="h-5 w-5 text-text-muted" /></div>
                            <input type="text" placeholder="Search widgets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" />
                        </div>
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <select
                                onChange={(e) => setActiveCategory(e.target.value)}
                                value={activeCategory}
                                className="text-sm border-border-color rounded-full px-3 py-1.5 focus:ring-primary focus:border-primary bg-input-bg"
                                aria-label="Filter widgets by category"
                            >
                                {Object.entries(widgetCategories).map(([category, count]) => (
                                    <option key={category} value={category}>
                                        {category} ({count})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-3">
                            {filteredWidgets.map(widget => (
                                <div key={widget.widgetId} className="bg-background p-3 rounded-3xl border border-border-light flex flex-col">
                                    <img src={widget.imageUrl} alt={`${widget.title} preview`} className="w-full h-24 object-cover rounded-2xl bg-gray-200 mb-3" />
                                    <div className="flex-grow flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-text-strong">{widget.title}</h4>
                                            <p className="text-xs text-text-secondary mt-1">{widget.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleOpenSetupModal(widget)} 
                                            className="p-1.5 rounded-full text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0" 
                                            aria-label={`Add ${widget.title} to layout`}
                                            title={`Add ${widget.title} to layout`}
                                        >
                                            <IconAdd className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
            {widgetToConfigure && (
                <WidgetSetupModal
                    isOpen={isSetupModalOpen}
                    onClose={() => setIsSetupModalOpen(false)}
                    widget={widgetToConfigure}
                    accounts={accounts}
                    onConfirm={handleConfirmAddWidget}
                />
            )}
        </>
    );
};

export default DashboardEditor;