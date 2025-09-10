
import React, { useState, useMemo } from 'react';
import { DashboardItem, Widget, WidgetType } from '../types';
import { availableWidgetsData } from '../data/dummyData';
import { IconAdd, IconClose, IconSearch, IconDragHandle } from '../constants';

// Helper component for widget placeholders
const WidgetPlaceholder: React.FC<{ type: WidgetType }> = ({ type }) => {
    return (
        <div className="h-full bg-background rounded-lg flex items-center justify-center border-2 border-dashed border-border-color">
            <p className="text-text-muted text-sm font-medium">{type} Preview</p>
        </div>
    );
};

interface DashboardEditorProps {
    dashboard: DashboardItem | null; // null for new dashboard
    onSave: (dashboard: DashboardItem) => void;
    onCancel: () => void;
}

const DashboardEditor: React.FC<DashboardEditorProps> = ({ dashboard, onSave, onCancel }) => {
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDashboard(prev => ({ ...prev, title: e.target.value }));
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDashboard(prev => ({ ...prev, description: e.target.value || '' }));
    };

    const handleAddWidget = (widgetToAdd: Omit<Widget, 'id'>) => {
        const newWidgetInstance: Widget = {
            ...widgetToAdd,
            id: `inst-${Date.now()}-${Math.random()}`,
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
    
    const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
        const newWidgets = [...editedDashboard.widgets];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newWidgets.length) return;

        [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]]; // Swap
        
        setEditedDashboard(prev => ({ ...prev, widgets: newWidgets }));
    };
    
    const handleSave = () => {
        onSave(editedDashboard);
    };

    const filteredWidgets = useMemo(() => {
        return availableWidgetsData.filter(widget =>
            widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            widget.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="bg-surface px-6 py-3 border-b border-border-color flex items-center justify-between flex-shrink-0">
                <div>
                    <input
                        type="text"
                        value={editedDashboard.title}
                        onChange={handleTitleChange}
                        className="text-xl font-bold bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded-md -ml-2 px-2 py-1"
                        placeholder="Dashboard Title"
                    />
                     <input
                        type="text"
                        value={editedDashboard.description}
                        onChange={handleDescriptionChange}
                        className="text-sm text-text-secondary w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded-md -ml-2 px-2"
                        placeholder="Dashboard description (optional)"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">
                        Save Dashboard
                    </button>
                </div>
            </header>
            
            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
                {/* Left Panel: Dashboard Canvas */}
                <main className="lg:col-span-2 bg-surface rounded-xl border border-border-color p-4 overflow-y-auto">
                    {editedDashboard.widgets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {editedDashboard.widgets.map((widget, index) => (
                                <div key={widget.id} className="bg-white rounded-lg shadow-sm border border-border-light flex flex-col h-64 group">
                                    <div className="p-2 border-b border-border-light flex items-center justify-between bg-background rounded-t-lg">
                                        <div className="flex items-center gap-2">
                                            <button className="cursor-grab text-text-muted hover:text-text-primary"><IconDragHandle className="h-4 w-4" /></button>
                                            <h4 className="text-sm font-semibold text-text-strong">{widget.title}</h4>
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => handleMoveWidget(index, 'up')} disabled={index === 0} className="p-1 rounded-full text-text-muted hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move widget up">↑</button>
                                            <button onClick={() => handleMoveWidget(index, 'down')} disabled={index === editedDashboard.widgets.length - 1} className="p-1 rounded-full text-text-muted hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move widget down">↓</button>
                                            <button onClick={() => handleRemoveWidget(widget.id)} className="ml-1 p-1 rounded-full text-text-muted hover:bg-gray-200 hover:text-status-error" aria-label="Remove widget"><IconClose className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-2">
                                        <WidgetPlaceholder type={widget.type} />
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
                <aside className="lg:col-span-1 bg-surface rounded-xl border border-border-color p-4 flex flex-col">
                    <h3 className="text-base font-semibold text-text-strong mb-4">Widget Library</h3>
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-text-muted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search widgets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto -mr-2 pr-2 space-y-3">
                        {filteredWidgets.map(widget => (
                            <div key={widget.widgetId} className="bg-background p-3 rounded-lg flex items-start justify-between">
                                <div>
                                    <h4 className="font-semibold text-sm text-text-strong">{widget.title}</h4>
                                    <p className="text-xs text-text-secondary mt-1">{widget.description}</p>
                                </div>
                                <button onClick={() => handleAddWidget(widget)} className="ml-2 mt-1 p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex-shrink-0" aria-label={`Add ${widget.title} widget`}>
                                    <IconAdd className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardEditor;
