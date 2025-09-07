import React, { forwardRef } from 'react';
import { NAV_ITEMS_MAIN, NAV_ITEMS_BOTTOM } from '../constants';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isCollapsed: boolean;
  isHidden?: boolean;
  collapseSidebar: () => void;
}

const NavItem: React.FC<{ 
    item: any, 
    activePage: Page, 
    setActivePage: (page: Page) => void, 
    isCollapsed: boolean,
    collapseSidebar: () => void,
}> = ({ item, activePage, setActivePage, isCollapsed, collapseSidebar }) => (
    <li className="mb-1">
        <a
            href="#"
            title={isCollapsed ? item.name : undefined}
            onClick={(e) => {
                e.preventDefault();
                setActivePage(item.name);
                if (!isCollapsed) {
                    collapseSidebar();
                }
            }}
            className={`flex relative items-center py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${isCollapsed ? 'justify-center' : 'px-3'} ${
                activePage === item.name
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
        >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
        </a>
    </li>
);

const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ activePage, setActivePage, isCollapsed, isHidden, collapseSidebar }, ref) => {
  return (
    <nav ref={ref} className={`bg-surface fixed top-12 left-0 h-[calc(100%-3rem)] flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out border-r border-border-color z-20 ${isCollapsed ? 'w-12 px-2 pb-2 pt-4' : 'w-64 p-4 shadow-xl'} ${isHidden ? 'invisible' : 'visible'}`}>
      <div className="flex-grow">
        <ul>
          {NAV_ITEMS_MAIN.map((item) => (
            <NavItem key={item.name} item={item} activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} collapseSidebar={collapseSidebar} />
          ))}
        </ul>
      </div>
      
      <div className="flex-shrink-0">
         <div className={`border-t border-border-color my-4 ${isCollapsed ? 'mx-auto w-8' : 'mx-0'}`}></div>
        <ul>
            {NAV_ITEMS_BOTTOM.map((item) => (
                <NavItem key={item.name} item={item} activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} collapseSidebar={collapseSidebar} />
            ))}
        </ul>
      </div>
    </nav>
  );
});

export default Sidebar;