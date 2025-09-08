import React, { useEffect, useRef } from 'react';
import { NAV_ITEMS_TOP, NAV_ITEMS_BOTTOM } from '../constants';
import { Page, NavItem as NavItemType } from '../types';
import { IconClose } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{ 
    item: NavItemType, 
    isActive: boolean,
    onClick: () => void,
}> = ({ item, isActive, onClick }) => (
    <li>
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`group relative flex items-center rounded-md text-sm px-3 py-2 transition-colors duration-200
                ${isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-strong font-medium hover:bg-input-bg'}
                focus:outline-none focus:ring-2 focus:ring-primary
            `}
            aria-current={isActive ? 'page' : undefined}
        >
            <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-text-strong'}`} />
            <span className="ml-3">{item.name}</span>
        </a>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, onClose }) => {
    const sidebarRef = useRef<HTMLElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            closeButtonRef.current?.focus();
            const focusableElements = sidebarRef.current?.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTabKeyPress = (e: KeyboardEvent) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            };
            sidebarRef.current?.addEventListener('keydown', handleTabKeyPress);
            return () => sidebarRef.current?.removeEventListener('keydown', handleTabKeyPress);
        }
    }, [isOpen]);

    return (
        <div 
            className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-title"
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose} 
            />

            {/* Panel */}
            <aside 
                ref={sidebarRef}
                className={`relative flex flex-col h-full bg-surface w-full max-w-xs md:w-72 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-hidden`}
            >
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border-light">
                    <h2 id="sidebar-title" className="text-lg font-semibold text-text-primary">Menu</h2>
                    <button 
                        ref={closeButtonRef}
                        onClick={onClose} 
                        className="p-2 rounded-full text-text-secondary hover:bg-input-bg hover:text-text-primary"
                        aria-label="Close navigation menu"
                    >
                        <IconClose className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        <ul className="space-y-1">
                            {NAV_ITEMS_TOP.map((item) => (
                                <NavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={() => setActivePage(item.name)}
                                />
                            ))}
                        </ul>
                        <div className="border-t border-border-light my-4"></div>
                        <ul className="space-y-1">
                            {NAV_ITEMS_BOTTOM.map((item) => (
                                <NavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={() => setActivePage(item.name)}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;