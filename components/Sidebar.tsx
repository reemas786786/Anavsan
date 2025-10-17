

import React, { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS_TOP, NAV_ITEMS_BOTTOM } from '../constants';
import { Page, NavItem as NavItemType, NavSubItem } from '../types';
import { IconChevronRight } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page, subPage?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeSubPage?: string;
  showCompact: boolean;
}

const SubMenuItem: React.FC<{
    item: NavItemType;
    subItem: NavSubItem;
    isActive: boolean;
    onClick: (page: Page, subPage?: string) => void;
    activeSubPage?: string;
}> = ({ item, subItem, isActive, onClick, activeSubPage }) => {
    
    const isSubItemActive = isActive && subItem.name === activeSubPage;

    return (
        <li className="relative">
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(item.name, subItem.name);
                }}
                className={`flex justify-between items-center relative w-full text-left rounded-md pl-8 pr-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:bg-surface-hover focus:text-text-primary ${
                    isSubItemActive
                        ? 'text-primary'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
                role="menuitem"
            >
                <span>{subItem.name}</span>
            </a>
        </li>
    );
};

const NavItem: React.FC<{ 
    item: NavItemType, 
    isActive: boolean,
    onClick: (page: Page, subPage?: string) => void,
    activeSubPage?: string,
}> = ({ item, isActive, onClick, activeSubPage }) => {
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
            const itemToFocus = items[nextIndex];
            if (itemToFocus instanceof HTMLElement) {
                itemToFocus.focus();
            }
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
                        ? 'bg-[#F0EAFB] text-primary font-semibold'
                        : 'text-text-strong font-medium hover:bg-surface-hover'}
                `}
                aria-haspopup={hasSubItems}
                aria-expanded={isSubMenuOpen}
            >
                <div className="flex items-center">
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-text-strong'}`} />
                    <span className="ml-3">{item.name}</span>
                </div>
                {hasSubItems && <IconChevronRight className={`h-4 w-4 text-text-muted transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`} />}
            </button>

            {hasSubItems && (
                <div 
                    className={`absolute left-full top-0 w-60 bg-surface rounded-lg shadow-lg p-2 z-31 transition-all duration-200 ease-in-out ${isSubMenuOpen ? 'opacity-100 translate-x-0 visible' : 'opacity-0 -translate-x-4 invisible'}`}
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
                                activeSubPage={activeSubPage}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
};

const CompactSubMenuItem: React.FC<{
    text: string;
    onClick: () => void;
    isActive: boolean;
    isHeader?: boolean;
}> = ({ text, onClick, isActive, isHeader = false }) => (
    <li>
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`flex items-center w-full text-left rounded-md px-3 py-1.5 text-sm transition-colors focus:outline-none focus:bg-surface-hover ${
                isActive
                    ? 'text-primary font-medium'
                    : isHeader
                    ? 'text-text-strong font-semibold'
                    : 'text-text-secondary font-medium hover:bg-surface-hover hover:text-text-primary'
            }`}
            role="menuitem"
        >
            <span>{text}</span>
        </a>
    </li>
);

const CompactNavItem: React.FC<{
    item: NavItemType,
    isActive: boolean,
    onClick: (page: Page, subPage?: string) => void,
    activeSubPage?: string,
}> = ({ item, isActive, onClick, activeSubPage }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [flyoutPosition, setFlyoutPosition] = useState<'top' | 'bottom'>('top');
    const itemRef = useRef<HTMLLIElement>(null);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    let timer: number;

    const handleItemClick = (page: Page, subPage?: string) => {
        onClick(page, subPage);
        setIsSubMenuOpen(false);
    };

    const showSubMenu = () => {
        clearTimeout(timer);
        if (hasSubItems) {
            if (itemRef.current) {
                const rect = itemRef.current.getBoundingClientRect();
                const estimatedHeight = 16 + 28 + ((item.subItems?.length || 0) * 28);
                if (rect.top + estimatedHeight > window.innerHeight) {
                    setFlyoutPosition('bottom');
                } else {
                    setFlyoutPosition('top');
                }
            }
            setIsSubMenuOpen(true);
        }
    };

    const hideSubMenu = () => {
        timer = window.setTimeout(() => {
            setIsSubMenuOpen(false);
        }, 150);
    };

    const handleMouseEnterContainer = () => {
        clearTimeout(timer);
        if (hasSubItems) {
            showSubMenu();
        }
    };

    return (
        <li ref={itemRef} onMouseLeave={hideSubMenu} onMouseEnter={handleMouseEnterContainer} className="relative">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    if (!hasSubItems) {
                        onClick(item.name);
                    } else {
                        isSubMenuOpen ? hideSubMenu() : showSubMenu();
                    }
                }}
                className={`group relative flex justify-center items-center h-10 w-10 rounded-lg transition-colors
                    ${isActive ? 'bg-[#F0EAFB] text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}
                    focus:outline-none focus:ring-2 focus:ring-primary
                `}
                aria-label={item.name}
                aria-haspopup={hasSubItems}
                aria-expanded={isSubMenuOpen}
            >
                <item.icon className="h-5 w-5" />
                {!hasSubItems && (
                    <div className="absolute left-full ml-2 w-auto min-w-max bg-surface rounded-lg shadow-lg p-2 z-50 transition-all duration-100 scale-0 origin-left group-hover:scale-100">
                        <div className="px-2 py-1 text-sm font-semibold text-text-strong whitespace-nowrap">
                            {item.name}
                        </div>
                    </div>
                )}
            </button>

            {hasSubItems && isSubMenuOpen && (
                <div
                    className={`absolute left-full ml-2 w-60 bg-surface rounded-lg shadow-lg p-2 z-31 ${flyoutPosition === 'top' ? 'top-0' : 'bottom-0'}`}
                    aria-hidden={!isSubMenuOpen}
                    onMouseEnter={handleMouseEnterContainer}
                    onMouseLeave={hideSubMenu}
                >
                    <ul role="menu">
                        <CompactSubMenuItem
                            text={item.name}
                            onClick={() => {
                                const defaultSubPage = item.subItems?.[0]?.name;
                                handleItemClick(item.name, defaultSubPage);
                            }}
                            isActive={false}
                            isHeader={true}
                        />
                        {item.subItems?.map(subItem => (
                            <CompactSubMenuItem
                                key={subItem.name}
                                text={subItem.name}
                                onClick={() => handleItemClick(item.name, subItem.name)}
                                isActive={isActive && subItem.name === activeSubPage}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, onClose, activeSubPage, showCompact }) => {
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
        if (page !== 'Dashboards') {
            onClose();
        }
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
                    <nav className="flex flex-col h-full py-4">
                        <ul className="space-y-2">
                            {NAV_ITEMS_TOP.map((item) => (
                                <NavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={handleItemClick}
                                    activeSubPage={activeSubPage}
                                />
                            ))}
                        </ul>
                        <div className="mt-auto">
                             <div className="my-2 mx-4"></div>
                             <ul className="space-y-2">
                                {NAV_ITEMS_BOTTOM.map((item) => (
                                    <NavItem 
                                        key={item.name} 
                                        item={item} 
                                        isActive={activePage === item.name}
                                        onClick={handleItemClick}
                                        activeSubPage={activeSubPage}
                                    />
                                ))}
                            </ul>
                        </div>
                    </nav>
                </aside>
            </div>

            {/* --- COMPACT SIDEBAR (Desktop only) --- */}
            {showCompact && (
                <aside className="hidden md:flex flex-col w-12 bg-surface items-center py-4">
                    <nav className="flex flex-col items-center h-full">
                        <ul className="list-none space-y-2">
                            {NAV_ITEMS_TOP.map((item) => (
                                <CompactNavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={handleItemClick}
                                    activeSubPage={activeSubPage}
                                />
                            ))}
                        </ul>
                        <ul className="list-none mt-auto space-y-2">
                            {NAV_ITEMS_BOTTOM.map((item) => (
                                <CompactNavItem 
                                    key={item.name} 
                                    item={item} 
                                    isActive={activePage === item.name}
                                    onClick={handleItemClick}
                                    activeSubPage={activeSubPage}
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