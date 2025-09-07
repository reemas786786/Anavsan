
import React from 'react';
import { NAV_ITEMS, IconCalendar, IconCog, IconSupport, IconSparkles } from '../constants';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const AnavsanLogo: React.FC = () => (
    <div className="flex items-center gap-2 px-4 mb-8">
        <div className="bg-violet-600 p-2 rounded-lg">
            <IconSparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Anavsan</h1>
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const secondaryNavItems = [
    { name: 'Settings', icon: IconCog },
    { name: 'Support', icon: IconSupport },
  ] as const;

  return (
    <nav className="w-64 bg-slate-800 flex-shrink-0 flex flex-col p-4 border-r border-slate-700/50">
      <AnavsanLogo />
      <div className="flex-grow">
        <h2 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</h2>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.name} className="mb-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.name);
                }}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activePage === item.name
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex-shrink-0">
        <button
          onClick={() => setActivePage('Book a Demo')}
          className="w-full flex items-center justify-center bg-violet-600 text-white px-4 py-3 text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors duration-200 mb-4"
        >
          <IconCalendar className="w-5 h-5 mr-2"/>
          Book a Demo
        </button>
        <ul>
          {secondaryNavItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.name);
                }}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activePage === item.name
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
