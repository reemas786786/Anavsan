import React from 'react';
import { NAV_ITEMS_MAIN, NAV_ITEMS_BOTTOM } from '../constants';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isCollapsed: boolean;
}

const NavItem: React.FC<{ item: any, activePage: Page, setActivePage: (page: Page) => void, isCollapsed: boolean }> = ({ item, activePage, setActivePage, isCollapsed }) => (
    <li className="mb-1">
        <a
            href="#"
            title={isCollapsed ? item.name : undefined}
            onClick={(e) => {
                e.preventDefault();
                setActivePage(item.name);
            }}
            className={`flex relative items-center py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${isCollapsed ? 'justify-center px-3' : 'px-3'} ${
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

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isCollapsed }) => {
  return (
    <nav className={`bg-surface fixed top-16 left-0 h-[calc(100%-4rem)] flex-shrink-0 flex flex-col p-4 transition-all duration-300 ease-in-out border-r border-border-color z-20 ${isCollapsed ? 'w-12' : 'w-64 shadow-xl'}`}>
      <div className="flex-grow">
        <ul>
          {NAV_ITEMS_MAIN.map((item) => (
            <NavItem key={item.name} item={item} activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
          ))}
        </ul>
      </div>
      
      <div className="flex-shrink-0">
         <div className={`border-t border-border-color my-4 ${isCollapsed ? 'mx-2' : 'mx-0'}`}></div>
        <ul>
            {NAV_ITEMS_BOTTOM.map((item) => (
                <NavItem key={item.name} item={item} activePage={activePage} setActivePage={setActivePage} isCollapsed={isCollapsed} />
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;