
import React, { useState, useEffect, useRef } from 'react';
import { IconAdd, IconDotsVertical, IconEdit, IconDelete, IconShare } from '../constants';
import { DashboardItem } from '../types';

interface DashboardCardProps {
    dashboard: DashboardItem;
    onEditClick: () => void;
    onShareClick: () => void;
    onDeleteClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ dashboard, onEditClick, onShareClick, onDeleteClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-surface p-6 rounded-xl border border-border-color shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-text-strong pr-4">{dashboard.title}</h3>
                <div className="relative flex-shrink-0" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`Actions for ${dashboard.title}`}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen}
                    >
                        <IconDotsVertical className="h-5 w-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                                <button onClick={() => { onEditClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                    <IconEdit className="h-4 w-4" /> Edit
                                </button>
                                <button onClick={() => { onShareClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary" role="menuitem">
                                    <IconShare className="h-4 w-4" /> Share
                                </button>
                                <button onClick={() => { onDeleteClick(); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">
                                    <IconDelete className="h-4 w-4" /> Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {dashboard.description && <p className="text-sm text-text-secondary mt-2 flex-grow">{dashboard.description}</p>}
            <p className="text-xs text-text-muted mt-4">{dashboard.createdOn}</p>
        </div>
    );
};

const EmptyState: React.FC = () => (
    <div className="text-center py-20 px-6 bg-surface rounded-xl border border-border-color shadow-sm">
        <h2 className="text-xl font-bold text-text-primary">No Dashboards Found</h2>
        <p className="mt-2 text-text-secondary max-w-md mx-auto">It looks like you haven't created any dashboards yet. Get started by clicking the "Create Dashboard" button.</p>
    </div>
);

interface DashboardsProps {
    dashboards: DashboardItem[];
    onDeleteDashboardClick: (dashboard: DashboardItem) => void;
}

const Dashboards: React.FC<DashboardsProps> = ({ dashboards, onDeleteDashboardClick }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">Dashboards</h1>
        <button
            className="bg-primary text-white font-semibold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm"
        >
            <IconAdd className="h-5 w-5" />
            Create Dashboard
        </button>
      </div>
      <p className="text-text-secondary">Your custom workspace for building and viewing saved dashboards.</p>
      
      {dashboards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboards.map(dashboard => (
                <DashboardCard 
                    key={dashboard.id} 
                    dashboard={dashboard}
                    onEditClick={() => console.log(`Editing ${dashboard.title}`)}
                    onShareClick={() => console.log(`Sharing ${dashboard.title}`)}
                    onDeleteClick={() => onDeleteDashboardClick(dashboard)}
                />
            ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Dashboards;
