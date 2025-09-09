
import React, { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS_TOP, NAV_ITEMS_BOTTOM } from '../constants';
import { Page, NavItem as NavItemType, NavSubItem } from '../types';
import { IconChevronRight } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page, subPage?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeSettingsSubPage?: string;
  showCompact: boolean;
}

const SubMenuItem: React.FC<{
    item: NavItemType;
    subItem: NavSubItem;
    isActive: boolean;
    onClick: (page: Page, subPage?: string) => void;
    activeSettingsSubPage?: string;
}> = ({ item, subItem, isActive, onClick, activeSettingsSubPage }) => {
    
    const isSubItemActive = isActive && subItem.name === activeSettingsSubPage;

    return (
        <li className="relative">
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(item.name, subItem.name);
                }}
                className={`flex justify-between items-center relative w-full text-left rounded-md pl-8 pr-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:bg-input-bg focus:text-text-primary ${
                    isSubItemActive
                        ? 'text-primary'
                        : 'text-text-secondary hover:bg-input-bg hover:text-text-primary'
                }`}
                role="menuitem"
            >
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-primary transition-opacity ${isSubItemActive ? 'opacity-100' : 'opacity-0'}`} />
                <span>{subItem.name}</span>
            </a>
        </li>
    );
};

const NavItem: React.FC<{ 
    item: NavItemType, 
    isActive: boolean,
    onClick: (page: Page, subPage?: string) => void,
    activeSettingsSubPage?: string,
}> = ({ item, isActive, onClick, activeSettingsSubPage }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const itemRef = useRef<HTMLLIElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    let timer: number;

    const hasSubItems = item.subItems && item.subItems.length > 0;

    const handleSubItemClick = (page: Page, subPage?: string) => {
        onClick(page, subPage);
        setIsSubMenuOpen(false);
    };

    const showSubMenu = () => {
        if (!hasSubItems) return;
        clearTimeout(timer);
        setIsSubMenuOpen(true);
    };
    const hideSubMenu = () => {
        if (!hasSubItems) return;
        timer = window.setTimeout(() => {
            setIsSubMenuOpen(false);
        }, 150);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsSubMenuOpen(false);
                triggerRef.current?.focus();
            }
        };
        if (isSubMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            const firstItem = itemRef.current?.querySelector<HTMLElement>('[role="menu"] > ul > li > [role="menuitem"]');
            firstItem?.focus();
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSubMenuOpen]);

    const handleSubMenuKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const items = Array.from(itemRef.current?.querySelectorAll<HTMLElement>('[role="menu"] > ul > li > [role="menuitem"]') || []);
            const activeIndex = items.findIndex(item => item === document.activeElement);
            let nextIndex = activeIndex;
            if (e.key === 'ArrowDown') {
                nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
            } else { // ArrowUp
                nextIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
            }
            items[nextIndex]?.focus();
        }
    };
    
    return (
        <li ref={itemRef} onMouseLeave={hideSubMenu} className="relative">
            <button
                ref={triggerRef}
                onMouseEnter={showSubMenu}
                onFocus={showSubMenu}
                onClick={(e) => {
                    e.preventDefault();
                    if (!hasSubItems) onClick(item.name);
                }}
                className={`w-full group relative flex items-center justify-between rounded-md text-sm px-4 py-2 transition-colors duration-200
                    ${isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-text-strong font-medium hover:bg-input-bg'}
                `}
                aria-haspopup={hasSubItems}
                aria-expanded={isSubMenuOpen}
            >
                <div className="flex items-center">
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-text-strong'}`} />
                    <span className="ml-3">{item.name}</span>
                </div>
                {hasSubItems && <IconChevronRight className={`h-4 w-4 text-text-muted transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`} />}
            </button>

            {hasSubItems && (
                <div 
                    className={`absolute left-full top-0 w-60 bg-surface rounded-lg shadow-lg border border-border-color p-2 z-31 transition-all duration-200 ease-in-out ${isSubMenuOpen ? 'opacity-100 translate-x-0 visible' : 'opacity-0 -translate-x-4 invisible'}`}
                    onMouseEnter={showSubMenu}
                    onMouseLeave={hideSubMenu}
                    aria-hidden={!isSubMenuOpen}
                >
                    <ul role="menu" onKeyDown={handleSubMenuKeyDown}>
                        {item.subItems?.map(subItem => (
                            <SubMenuItem
                                key={subItem.name}
                                item={item}
                                subItem={subItem}
                                isActive={isActive}
                                onClick={handleSubItemClick}
                                activeSettingsSubPage={activeSettingsSubPage}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
};


const CompactNavItem: React.FC<{ 
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
            className={`group relative flex justify-center items-center h-10 w-10 rounded-lg transition-colors
                ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-input-bg hover:text-text-primary'}
                focus:outline-none focus:ring-2 focus:ring-primary
            `}
            aria-label={item.name}
        >
            <item.icon className="h-5 w-5" />
            <span className="absolute left-full ml-3 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
                {item.name}
            </span>
        </a>
    </li>
);


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, onClose, activeSettingsSubPage, showCompact }) => {
    const sidebarRef = useRef<HTMLElement>(null);

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
            sidebarRef.current?.focus();
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

    const handleItemClick = (page: Page, subPage?: string) => {
        setActivePage(page, subPage);
        onClose();
    }

    return (
        <>
            {/* --- FULL OVERLAY (Mobile & Desktop expanded) --- */}
            <div 
                className={`fixed top-12 inset-x-0 bottom-0 z-30 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
                id="sidebar-menu"
            >
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={onClose} 
                />

                {/* Panel */}
                <aside 
                    ref={sidebarRef}
                    tabIndex={-1}
                    className={`relative flex flex-col h-full bg-surface w-full max-w-xs md:w-64 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} focus:outline-none`}
                >
                    <div className="flex-1">
                        <div className="py-4">
                            <ul className="space-y-1">
                                {NAV_ITEMS_TOP.map((item) => (
                                    <NavItem 
                                        key={item.name} 
                                        item={item} 
                                        isActive={activePage === item.name}
                                        onClick={handleItemClick}
                                        activeSettingsSubPage={activeSettingsSubPage}
                                    />
                                ))}
                            </ul>
                            <div className="border-t border-border-light my-4 mx-4"></div>
                            <ul className="space-y-1">
                                {NAV_ITEMS_BOTTOM.map((item) => (
                                    <NavItem 
                                        key={item.name} 
                                        item={item} 
                                        isActive={activePage === item.name}
                                        onClick={handleItemClick}
                                        activeSettingsSubPage={activeSettingsSubPage}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>

            {/* --- COMPACT SIDEBAR (Desktop only) --- */}
            {showCompact && (
                <aside className="hidden md:flex flex-col w-12 bg-surface border-r border-border-color items-center py-4">
                    <nav className="flex flex-col items-center h-full">
                        <ul className="list-none space-y-2">
                            {NAV_ITEMS_TOP.map((item) => (
                                <CompactNavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={() => setActivePage(item.name)}
                                />
                            ))}
                        </ul>
                        <ul className="list-none mt-auto space-y-2">
                            {NAV_ITEMS_BOTTOM.map((item) => (
                                <CompactNavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={() => setActivePage(item.name)}
                                />
                            ))}
                        </ul>
                    </nav>
                </aside>
            )}
        </>
    );
};

export default Sidebar;
